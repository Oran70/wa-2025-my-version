const { Op } = require('sequelize');
const db = require('../models');
const logger = require('../utils/logger');
const Appointment = db.Appointment;
class TeacherService {

    // Validate teacher credentials for login
    async validateTeacherCredentials(email, password) {
        try {
            const user = await db.User.findOne({
                where: { email, is_active: true },
                include: [
                    {
                        model: db.Role,
                        as: 'roles',
                        attributes: ['name']
                    }
                ]
            });

            if (!user || !user.password) {
                return null;
            }
            // console.log(user.toJSON()); // Uncomment this for very detailed user info

            const isValidPassword = await user.validatePassword(password);
            if (!isValidPassword) {
                return null;
            }

            // Check if user has teacher role
            const userRoles = user.roles.map(role => role.name);

            const isTeacher = userRoles.some(roleName =>
                ['Teacher', 'Mentor', 'Admin', 'Administrator'].includes(roleName)
            );

            if (!isTeacher) {
                return null;
            }

            return {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                abbreviation: user.abbreviation,
                roles: userRoles
            };
        } catch (error) {
            logger.error(`Error validating teacher credentials: ${error.message}`, { error });
            throw error;
        }
    }

    // Get teacher's classes
    async getTeacherClasses(teacherId) {
        try {
            const teacherClasses = await db.TeacherClass.findAll({
                where: { user_id: teacherId },
                include: [
                    {
                        model: db.Class,
                        as: 'class',
                        include: [
                            { model: db.Level, as: 'level' }
                        ]
                    }
                ]
            });

            return teacherClasses.map(tc => ({
                class_id: tc.class.class_id,
                class_name: tc.class.class_name,
                level_name: tc.class.level.name,
                school_year: tc.school_year, // From TeacherClass table
                is_primary_mentor: tc.is_primary_mentor, // Corrected field name
                teacher_class_id: tc.teacher_class_id
            }));
        } catch (error) {
            logger.error(`Error getting teacher classes: ${error.message}`, { error });
            throw error;
        }
    }

    // Get students for a teacher (all classes they teach)
    async getTeacherStudents(teacherId) {
        try {
            // Get classes that this teacher teaches
            const teacherClasses = await db.TeacherClass.findAll({
                where: { user_id: teacherId },
                attributes: ['class_id', 'is_primary_mentor']
            });

            const classIds = teacherClasses.map(tc => tc.class_id);

            if (classIds.length === 0) {
                return [];
            }

            // Find students in these classes
            const students = await db.Student.findAll({
                where: {
                    class_id: { [Op.in]: classIds }
                },
                include: [
                    {
                        model: db.Class,
                        as: 'class',
                        include: [{ model: db.Level, as: 'level' }]
                    }
                ],
                order: [
                    ['class_id', 'ASC'],
                    ['name', 'ASC']
                ]
            });

            return students.map(student => {
                const isMentoredByTeacher = teacherClasses.some(tc =>
                    tc.class_id === student.class_id && tc.is_primary_mentor
                );

                return {
                    student_id: student.student_id,
                    name: student.name,
                    student_number: student.student_number,
                    class_id: student.class_id,
                    class_name: student.class.class_name,
                    level_name: student.class.level.name,
                    school_year: student.class.school_year,
                    is_mentored_by_me: isMentoredByTeacher,
                    parent_access_code: student.parent_access_code // Available in Student model
                };
            });
        } catch (error) {
            logger.error(`Error getting teacher students: ${error.message}`, { error });
            throw error;
        }
    }

    // Get students for a specific class (if teacher teaches multiple classes)
    async getStudentsByClass(teacherId, classId) {
        try {
            // Verify teacher teaches this class
            const teacherClass = await db.TeacherClass.findOne({
                where: {
                    user_id: teacherId,
                    class_id: classId
                }
            });

            if (!teacherClass) {
                return {
                    success: false,
                    message: 'You do not have permission to access this class'
                };
            }

            const students = await db.Student.findAll({
                where: {
                    class_id: classId
                },
                include: [
                    {
                        model: db.Class,
                        as: 'class',
                        include: [{ model: db.Level, as: 'level' }]
                    }
                ],
                order: [['name', 'ASC']]
            });

            return {
                success: true,
                students: students.map(student => ({
                    student_id: student.student_id,
                    name: student.name,
                    student_number: student.student_number,
                    class_name: student.class.class_name,
                    level_name: student.class.level.name,
                    school_year: student.class.school_year,
                    is_mentored_by_me: teacherClass.is_primary_mentor,
                    parent_access_code: student.parent_access_code
                }))
            };
        } catch (error) {
            logger.error(`Error getting students by class: ${error.message}`, { error });
            throw error;
        }
    }

    // Create availability slots
    async createAvailability(teacherId, availabilityData) {
        const {
            date,
            startTime,
            endTime,
            slotDuration,
            breakDuration = 0,
            notes = null,
        } = availabilityData;

        const transaction = await db.sequelize.transaction();

        try {
            const createdSlots = [];
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) {
                throw new Error(`Invalid date provided: ${date}`);
            }
            // Generate time slots for the single date only
            const timeSlots = this._generateTimeSlots(
                dateObj,
                startTime,
                endTime,
                slotDuration,
                breakDuration
            );

            for (const slot of timeSlots) {
                // Check if slot already exists
                const existingSlot = await db.Availability.findOne({
                    where: {
                        user_id: teacherId,
                        date: slot.date,
                        start_time: slot.start_time,
                        end_time: slot.end_time
                    },
                    transaction
                });

                if (!existingSlot) {
                    const newSlot = await db.Availability.create({
                        user_id: teacherId,
                        date: slot.date,
                        start_time: slot.start_time,
                        end_time: slot.end_time,
                        slot_duration: slotDuration,
                        is_visible: true,
                        notes: notes
                    }, { transaction });

                    createdSlots.push({
                        availability_id: newSlot.availability_id,
                        date: newSlot.date,
                        start_time: newSlot.start_time,
                        end_time: newSlot.end_time,
                        slot_duration: newSlot.slot_duration
                    });
                }
            }

            await transaction.commit();

            return {
                success: true,
                message: `Created ${createdSlots.length} availability slots for ${date}`,
                slots: createdSlots
            };
        } catch (error) {
            await transaction.rollback();
            logger.error(`Error creating availability: ${error.message}`, { error });
            throw error;
        }
    }

    // Get teacher availability
    async getTeacherAvailability(teacherId, startDate = null, endDate = null, includeBooked = false) {
        try {
            const whereClause = {
                user_id: teacherId
            };

            // We need to check if slots are booked by looking at appointments
            if (startDate) {
                whereClause.date = { [Op.gte]: new Date(startDate) };
            }

            if (endDate) {
                whereClause.date = {
                    ...whereClause.date,
                    [Op.lte]: new Date(endDate)
                };
            }

            const availabilitySlots = await db.Availability.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.Appointment,
                        as: 'appointments',
                        required: false, // LEFT JOIN
                        where: {
                            status: 'Scheduled'
                        }
                    }
                ],
                order: [['date', 'ASC'], ['start_time', 'ASC']]
            });

            return availabilitySlots
                .filter(slot => {
                    const isBooked = slot.appointments && slot.appointments.length > 0;
                    return includeBooked || !isBooked;
                })
                .map(slot => ({
                    availability_id: slot.availability_id,
                    date: slot.date,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    slot_duration: slot.slot_duration,
                    notes: slot.notes,
                    is_visible: slot.is_visible,
                    is_booked: slot.appointments && slot.appointments.length > 0
                }));
        } catch (error) {
            logger.error(`Error getting teacher availability: ${error.message}`, { error });
            throw error;
        }
    }

    // Delete specific availability slots by date and time
    async deleteAvailability(teacherId, date, startTime, endTime = null) {
        const transaction = await db.sequelize.transaction();

        try {
            // Build where clause for finding slots to delete
            const whereClause = {
                user_id: teacherId,
                date: date,
                start_time: startTime
            };

            // Add end_time if provided for more specific deletion
            if (endTime) {
                whereClause.end_time = endTime;
            }

            // First, find the slots that match the criteria
            const slotsToDelete = await db.Availability.findAll({
                where: whereClause,
                attributes: ['availability_id', 'date', 'start_time', 'end_time'],
                transaction
            });

            if (slotsToDelete.length === 0) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'No availability slots found for the specified date and time'
                };
            }

            const slotIds = slotsToDelete.map(slot => slot.availability_id);

            // Check if any of these slots have scheduled appointments
            const slotsWithAppointments = await db.Appointment.findAll({
                where: {
                    teacher_id: teacherId,
                    date: date,
                    start_time: startTime,
                    status: 'Scheduled'
                },
                transaction
            });

            if (slotsWithAppointments.length > 0) {
                await transaction.rollback();
                return {
                    success: false,
                    message: `Cannot delete availability slots that have scheduled appointments. Found ${slotsWithAppointments.length} scheduled appointment(s).`
                };
            }

            // Delete the availability slots
            const deletedCount = await db.Availability.destroy({
                where: whereClause,
                transaction
            });
            await transaction.commit();

            return {
                success: true,
                message: `Deleted ${deletedCount} availability slots`,
                deletedCount: deletedCount,
                deletedSlots: slotsToDelete.map(slot => ({
                    date: slot.date,
                    start_time: slot.start_time,
                    end_time: slot.end_time
                }))
            };
        } catch (error) {
            await transaction.rollback();
            logger.error(`Error deleting availability slots: ${error.message}`, { error });
            throw error;
        }
    }

    // Get teacher appointments
    async getTeacherAppointments(teacherId, status = null, startDate = null, endDate = null) {
        try {
            const whereClause = {
                teacher_id: teacherId
            };

            if (status) {
                whereClause.status = status;
            }

            if (startDate) {
                whereClause.date = { [Op.gte]: new Date(startDate) };
            }

            if (endDate) {
                whereClause.date = {
                    ...whereClause.date,
                    [Op.lte]: new Date(endDate)
                };
            }

            const appointments = await db.Appointment.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.Student,
                        as: 'student',
                        include: [
                            {
                                model: db.Class,
                                as: 'class',
                                include: [{ model: db.Level, as: 'level' }]
                            }
                        ]
                    },
                    {
                        model: db.Availability,
                        as: 'availability',
                        required: false
                    }
                ],
                order: [['date', 'ASC'], ['start_time', 'ASC']]
            });

            return appointments.map(appt => ({
                appointment_id: appt.appointment_id,
                availability_id: appt.availability_id,
                date: appt.date,
                start_time: appt.start_time,
                end_time: appt.end_time,
                status: appt.status,
                student: {
                    student_id: appt.student.student_id,
                    name: appt.student.name,
                    student_number: appt.student.student_number,
                    class_name: appt.student.class.class_name,
                    level_name: appt.student.class.level.name
                },
                parent: {
                    name: appt.parent_name,
                    email: appt.parent_email,
                    phone: appt.parent_phone
                },
                cancellation_reason: appt.cancellation_reason,
                cancellation_datetime: appt.cancellation_datetime,
                cancelled_by: appt.cancelled_by,
                created_at: appt.created_at
            }));
        } catch (error) {
            logger.error(`Error getting teacher appointments: ${error.message}`, { error });
            throw error;
        }
    }

    // Cancel appointment by teacher
    async cancelAppointmentByTeacher(teacherId, appointmentId, cancellationReason = null) {
        const transaction = await db.sequelize.transaction();

        try {
            // Find the appointment
            const appointment = await db.Appointment.findOne({
                where: {
                    appointment_id: appointmentId,
                    teacher_id: teacherId,
                    status: 'Scheduled'
                },
                include: [
                    { model: db.Student, as: 'student' }
                ],
                transaction
            });

            if (!appointment) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'No active appointment found with this ID'
                };
            }

            // Update the appointment status using the model's cancel method
            await appointment.update({
                status: 'Cancelled',
                cancelled_by: 'Teacher',
                cancellation_reason: cancellationReason,
                cancellation_datetime: new Date()
            }, { transaction });

            // The appointment being cancelled means the slot is available again
            // No need to update availability table

            // Log the cancellation
            await db.Log.create({
                user_id: teacherId,
                action: 'CANCEL_APPOINTMENT',
                entity_type: 'appointment',
                entity_id: appointmentId,
                details: JSON.stringify({
                    cancellationReason,
                    studentId: appointment.student_id,
                    studentName: appointment.student.name,
                    originalDate: appointment.date,
                    originalTime: appointment.start_time
                })
            }, { transaction });

            await transaction.commit();

            return {
                success: true,
                message: 'Appointment cancelled successfully',
                appointment: {
                    appointment_id: appointmentId,
                    student_name: appointment.student.name,
                    date: appointment.date,
                    time: appointment.start_time
                }
            };
        } catch (error) {
            await transaction.rollback();
            logger.error(`Error cancelling appointment: ${error.message}`, { error });
            throw error;
        }
    }

    // Get teacher dashboard data
    async getTeacherDashboard(teacherId) {
        try {
            // Get all appointments for this specific teacher
            const appointments = await db.Appointment.findAll({
                where: {
                    teacher_id: teacherId  // e.g., '8deed4bf-e75a-4018-ba0e-d54a15784c2d'
                },
                include: [
                    {
                        model: db.Student,
                        as: 'student',
                        attributes: ['student_id', 'name', 'student_number'],
                        include: [{
                            model: db.Class,
                            as: 'class',
                            attributes: ['class_name', 'level_id']
                        }]
                    }
                ],
                order: [
                    ['date', 'DESC'],
                    ['start_time', 'ASC']
                ]
            });

            // Transform appointments data
            const formattedAppointments = appointments.map(appt => ({
                appointment_id: appt.appointment_id,
                availability_id: appt.availability_id,
                teacher_id: appt.teacher_id,
                student_id: appt.student_id,
                student_name: appt.student?.name || 'Unknown Student',
                student_number: appt.student?.student_number || '',
                student_class: appt.student?.class?.class_name || 'No Class',
                parent_name: appt.parent_name,
                parent_email: appt.parent_email,
                parent_phone: appt.parent_phone,
                date: appt.date,
                start_time: appt.start_time,
                end_time: appt.end_time,
                status: appt.status,
                cancellation_datetime: appt.cancellation_datetime,
                cancelled_by: appt.cancelled_by,
                cancellation_reason: appt.cancellation_reason,
                created_at: appt.created_at,
                updated_at: appt.updated_at
            }));

            // Simple statistics
            const stats = {
                total_appointments: appointments.length,
                scheduled: appointments.filter(a => a.status === 'Scheduled').length,
                cancelled: appointments.filter(a => a.status === 'Cancelled').length,
                completed: appointments.filter(a => a.status === 'Completed').length
            };

            return {
                teacher_id: teacherId,
                appointments: formattedAppointments,
                statistics: stats
            };

        } catch (error) {
            logger.error(`Error getting teacher dashboard for teacher ${teacherId}: ${error.message}`, { error });
            throw error;
        }
    }

    // Helper method: Generate time slots
    _generateTimeSlots(date, startTime, endTime, slotDuration, breakDuration) {
        const slots = [];
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        let currentTime = new Date(date);
        currentTime.setHours(startHours, startMinutes, 0, 0);

        const endDateTime = new Date(date);
        endDateTime.setHours(endHours, endMinutes, 0, 0);

        while (currentTime < endDateTime) {
            const slotEndTime = new Date(currentTime);
            slotEndTime.setMinutes(slotEndTime.getMinutes() + slotDuration);

            if (slotEndTime > endDateTime) {
                break;
            }

            const formattedDate = date.toISOString().split('T')[0];
            const dbStartTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}:00`;
            const dbEndTime = `${String(slotEndTime.getHours()).padStart(2, '0')}:${String(slotEndTime.getMinutes()).padStart(2, '0')}:00`;

            slots.push({
                date: formattedDate,
                start_time: dbStartTime,
                end_time: dbEndTime
            });

            // Move to next slot (add slot duration + break)
            currentTime.setMinutes(currentTime.getMinutes() + slotDuration + breakDuration);
        }

        return slots;
    }
    // TODO: Remove if not needed
    // Helper method: Get total students count for teacher
    async _getTotalStudentsCount(teacherId) {
        try {
            const teacherClasses = await db.TeacherClass.findAll({
                where: { user_id: teacherId },
                attributes: ['class_id']
            });

            const classIds = teacherClasses.map(tc => tc.class_id);

            if (classIds.length === 0) {
                return 0;
            }

            return await db.Student.count({
                where: {
                    class_id: { [Op.in]: classIds },
                    is_active: true
                }
            });
        } catch (error) {
            logger.error(`Error getting total students count: ${error.message}`, { error });
            return 0;
        }
    }
}

module.exports = new TeacherService();
