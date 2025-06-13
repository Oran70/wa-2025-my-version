const { Op } = require('sequelize');
const db = require('../models');
const logger = require('../utils/logger');
const Student = db.Student;


class ParentService {
    // Validate access code and return student/teacher info
    async validateAccessCode(accessCode) {
        try {
            // Find student with the given access code
            const student = await Student.findOne({
                where: {parent_access_code: accessCode},
                include: [
                    {
                        model: db.Class,
                        as: 'class',
                        include: [{model: db.Level, as: 'level'}]
                    }
                ]
            });

            if (!student) {
                return {valid: false, message: 'Invalid access code'};
            }

            // Get available teachers for this student's class using proper associations
            const availableTeachers = await db.User.findAll({
                include: [
                    {
                        model: db.Role,
                        as: 'roles',
                        where: {
                            name: {[Op.in]: ['TeacherSubject','TeamLeader', 'Dean', 'Mentor']}
                        },
                        through: {attributes: []} // Don't include junction table data
                    },
                    {
                        model: db.Class,
                        as: 'classes',
                        where: {
                            class_id: student.class_id
                        },
                        through: {
                            model: db.TeacherClass,
                            where: {
                                school_year: student.class.school_year
                            },
                            attributes: ['is_primary_mentor']
                        },
                        required: false
                    }
                ],
                where: {is_active: true},
                attributes: ['user_id', 'name', 'email', 'abbreviation']
            });

            const teachersWithMentorInfo = availableTeachers.map(teacher => {
                const teacherClass = teacher.classes && teacher.classes.length > 0
                    ? teacher.classes[0].TeacherClass || teacher.classes[0].dataValues.TeacherClass
                    : null;

                return {
                    teacher_id: teacher.user_id,
                    teacher_name: teacher.name,
                    abbreviation: teacher.abbreviation,
                    email: teacher.email,
                    is_primary_mentor: teacherClass?.is_primary_mentor || false,
                    role: teacherClass?.is_primary_mentor ? 'Primary Mentor' : 'Subject Teacher'
                };
            });

            // Sort teachers - primary mentors first
            teachersWithMentorInfo.sort((a, b) => {
                if (a.is_primary_mentor && !b.is_primary_mentor) return -1;
                if (!a.is_primary_mentor && b.is_primary_mentor) return 1;
                return a.teacher_name.localeCompare(b.teacher_name);
            });

            return {
                valid: true,
                message: 'Access code validated successfully',
                student_info: {
                    student_id: student.student_id,
                    student_name: student.name,
                    student_number: student.student_number,
                    class_name: student.class?.class_name,
                    level_name: student.class?.level?.name,
                    school_year: student.class?.school_year
                },
                available_teachers: teachersWithMentorInfo
            };

        } catch (error) {
            logger.error(`Error validating access code: ${ error.message }`, {error});
            throw error;
        }
    }

    // Get teacher availability
    async getTeacherAvailability(teacherId, startDate = null, endDate = null) {
        try {
            const start = startDate || new Date().toISOString().split('T')[0];
            const end = endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            // Get available slots that aren't already booked
            const availabilitySlots = await db.Availability.findAll({
                where: {
                    user_id: teacherId,
                    date: {[Op.between]: [start, end]},
                    is_visible: true
                },
                include: [
                    {
                        model: db.Appointment,
                        as: 'appointments',
                        required: false,
                        where: {status: {[Op.ne]: 'Cancelled'}}
                    }
                ],
                order: [['date', 'ASC'], ['start_time', 'ASC']]
            });

            // Filter out slots that have appointments
            const freeSlots = availabilitySlots.filter(slot =>
                !slot.appointments || slot.appointments.length === 0
            );

            return freeSlots.map(slot => ({
                availability_id: slot.availability_id,
                date: slot.date,
                start_time: slot.start_time,
                end_time: slot.end_time,
                slot_duration: slot.slot_duration,
                notes: slot.notes
            }));
        } catch (error) {
            logger.error(`Error getting teacher availability: ${ error.message }`, {error});
            throw error;
        }
    }

    // Create appointment from form
    async createAppointmentFromForm(appointmentData) {
        const {
            accessCode,
            teacherId,
            availabilityId,
            parentName,
            parentEmail,
            parentPhone,
        } = appointmentData;

        const transaction = await db.sequelize.transaction();

        try {
            // Find student with access code
            const student = await Student.findOne({
                where: {parent_access_code: accessCode},
                transaction
            });

            if (!student) {
                await transaction.rollback();
                return {success: false, message: 'Invalid access code'};
            }

            // Check availability slot
            const availabilitySlot = await db.Availability.findOne({
                where: {
                    availability_id: availabilityId,
                    user_id: teacherId,
                    is_visible: true
                },
                include: [
                    {
                        model: db.Appointment,
                        as: 'appointments',
                        required: false,
                        where: {status: {[Op.ne]: 'Cancelled'}}
                    }
                ],
                transaction
            });

            if (!availabilitySlot || (availabilitySlot.appointments && availabilitySlot.appointments.length > 0)) {
                await transaction.rollback();
                return {success: false, message: 'Selected time slot is no longer available'};
            }

            // Create appointment with parent info stored directly
            const appointment = await db.Appointment.create({
                availability_id: availabilityId,
                teacher_id: teacherId,
                student_id: student.student_id,
                parent_name: parentName,
                parent_email: parentEmail,
                parent_phone: parentPhone,
                date: availabilitySlot.date,
                start_time: availabilitySlot.start_time,
                end_time: availabilitySlot.end_time,
                status: 'Scheduled',
            }, {transaction});

            // Log appointment creation (no user_id since no parent user)
            await db.Log.create({
                action: 'CREATE_APPOINTMENT',
                entity_type: 'appointment',
                entity_id: appointment.appointment_id,
                details: {
                    student_name: student.name,
                    parent_name: parentName,
                    parent_email: parentEmail,
                    parent_access_code: accessCode,
                    teacher_id: teacherId
                }
            }, {transaction});

            // Get teacher info for confirmation
            const teacher = await db.User.findByPk(teacherId, {
                attributes: ['name', 'abbreviation', 'email'],
                transaction
            });

            await transaction.commit();

            return {
                success: true,
                message: 'Appointment created successfully',
                appointment_id: appointment.appointment_id,
                confirmation_details: {
                    appointment_id: appointment.appointment_id,
                    student_name: student.name,
                    student_number: student.student_number,
                    teacher_name: teacher.name,
                    teacher_abbreviation: teacher.abbreviation,
                    parent_name: parentName,
                    parent_email: parentEmail,
                    parent_phone: parentPhone,
                    date: appointment.date,
                    start_time: appointment.start_time,
                    end_time: appointment.end_time,
                    status: appointment.status
                }
            };
        } catch (error) {
            await transaction.rollback();
            logger.error(`Error creating appointment: ${ error.message }`, {error});
            throw error;
        }
    }

    // Get appointment confirmation details
    async getAppointmentConfirmation(appointmentId) {
        try {
            const appointment = await db.Appointment.findByPk(appointmentId, {
                include: [
                    {
                        model: db.Student,
                        include: [
                            {
                                model: db.Class,
                                as: 'class',
                                include: [{model: db.Level, as: 'level'}]
                            }
                        ]
                    },
                    {
                        model: db.User,
                        where: {user_id: db.Sequelize.col('Appointment.teacher_id')},
                        attributes: ['name', 'abbreviation', 'email']
                    }
                ]
            });

            if (!appointment) {
                return null;
            }

            return {
                appointment_details: {
                    appointment_id: appointment.appointment_id,
                    student: {
                        name: appointment.Student.name,
                        student_number: appointment.Student.student_number,
                        class: appointment.Student.class?.class_name,
                        level: appointment.Student.class?.level?.name
                    },
                    teacher: {
                        name: appointment.User.name,
                        abbreviation: appointment.User.abbreviation,
                        email: appointment.User.email
                    },
                    schedule: {
                        date: appointment.date,
                        start_time: appointment.start_time,
                        end_time: appointment.end_time,
                    },
                    parent: {
                        name: appointment.parent_name,
                        email: appointment.parent_email,
                        phone: appointment.parent_phone
                    },
                    status: appointment.status,
                    created_at: appointment.created_at
                }
            };
        } catch (error) {
            logger.error(`Error getting appointment confirmation: ${ error.message }`, {error});
            throw error;
        }
    }

    // cancel appointment by parent
    async cancelAppointmentByParent(accessCode, appointmentId, cancellationReason = null) {
        const transaction = await db.sequelize.transaction();

        try {
            // Find student with access code
            const student = await Student.findOne({
                where: {parent_access_code: accessCode},
                transaction
            });

            if (!student) {
                await transaction.rollback();
                return {success: false, message: 'Invalid access code'};
            }

            // Find appointment for this student
            const appointment = await db.Appointment.findOne({
                where: {
                    appointment_id: appointmentId,
                    student_id: student.student_id,
                    status: 'Scheduled'
                },
                transaction
            });

            if (!appointment) {
                await transaction.rollback();
                return {
                    success: false,
                    message: 'No active appointment found with this ID for your student'
                };
            }

            // Cancel the appointment
            await appointment.update({
                status: 'Cancelled',
                cancelled_by: 'Parent',
                cancellation_reason: cancellationReason || 'Cancelled by parent',
                cancellation_datetime: new Date()
            }, {transaction});

            // Log cancellation
            await db.Log.create({
                action: 'CANCEL_APPOINTMENT',
                entity_type: 'appointment',
                entity_id: appointmentId,
                details: {
                    cancellation_reason: cancellationReason,
                    parent_name: appointment.parent_name,
                    parent_email: appointment.parent_email,
                    parent_access_code: accessCode,
                    original_date: appointment.date,
                    original_time: appointment.start_time
                }
            }, {transaction});

            await transaction.commit();

            return {
                success: true,
                message: 'Appointment cancelled successfully'
            };

        } catch (error) {
            await transaction.rollback();
            logger.error(`Error cancelling appointment: ${ error.message }`, {error});
            throw error;
        }
    }

    // Get parent dashboard data
    async getParentDashboard(accessCode) {
        try {
            console.log('Service: Looking for student with access code:', accessCode);

            // Find student with access code
            const student = await Student.findOne({
                where: {parent_access_code: accessCode},
                include: [
                    {
                        model: db.Class,
                        as: 'class',
                        include: [{model: db.Level, as: 'level'}]
                    }
                ]
            });

            console.log('Service: Student found:', student ? student.student_id : 'null');

            if (!student) {
                return {
                    success: false,
                    message: 'Invalid access code or student not found'
                };
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get upcoming appointments
            const upcomingAppointments = await db.Appointment.findAll({
                where: {
                    student_id: student.student_id,
                    date: {[Op.gte]: today},
                    status: 'Scheduled'
                },
                include: [
                    {
                        model: db.User,
                        as: 'teacher',
                        attributes: ['name', 'abbreviation']
                    }
                ],
                order: [['date', 'ASC'], ['start_time', 'ASC']]
            });

            // Get past appointments
            const pastAppointments = await db.Appointment.findAll({
                where: {
                    student_id: student.student_id,
                    [Op.or]: [
                        {date: {[Op.lt]: today}},
                        {status: 'Cancelled'}
                    ]
                },
                include: [
                    {
                        model: db.User,
                        as: 'teacher',
                        attributes: ['name', 'abbreviation']
                    }
                ],
                order: [['date', 'DESC'], ['start_time', 'DESC']],
                limit: 10
            });

            console.log('Service: Found', upcomingAppointments.length, 'upcoming and', pastAppointments.length, 'past appointments');

            return {
                success: true, // ADD THIS LINE
                student_info: {
                    student_id: student.student_id,
                    student_name: student.name,
                    student_number: student.student_number,
                    class_name: student.class?.class_name,
                    level_name: student.class?.level?.name,
                    school_year: student.class?.school_year
                },
                upcoming_appointments: upcomingAppointments.map(appt => ({
                    appointment_id: appt.appointment_id,
                    teacher_name: appt.teacher?.name,
                    teacher_abbreviation: appt.teacher?.abbreviation,
                    parent_name: appt.parent_name,
                    parent_email: appt.parent_email,
                    parent_phone: appt.parent_phone,
                    date: appt.date,
                    start_time: appt.start_time,
                    end_time: appt.end_time,
                    status: appt.status
                })),
                past_appointments: pastAppointments.map(appt => ({
                    appointment_id: appt.appointment_id,
                    teacher_name: appt.teacher?.name,
                    teacher_abbreviation: appt.teacher?.abbreviation,
                    parent_name: appt.parent_name,
                    parent_email: appt.parent_email,
                    parent_phone: appt.parent_phone,
                    date: appt.date,
                    start_time: appt.start_time,
                    end_time: appt.end_time,
                    status: appt.status,
                    cancellation_reason: appt.cancellation_reason
                }))
            };
        } catch (error) {
            logger.error(`Error getting parent dashboard: ${error.message}`, {error});
            return {
                success: false,
                message: 'Database error occurred'
            };
        }
    }
    // Get appointment confirmation details
    async getAppointmentConfirmation(appointmentId) {
        try {
            const appointment = await db.Appointment.findByPk(appointmentId, {
                include: [
                    {
                        model: db.User,
                        as: 'teacher',
                        attributes: ['name', 'abbreviation', 'email']
                    },
                    {
                        model: Student,
                        as: 'student',
                        include: [
                            {
                                model: db.Class,
                                as: 'class',
                                include: [{model: db.Level, as: 'level'}]
                            }
                        ]
                    }
                ]
            });

            if (!appointment) {
                return null;
            }

            return {
                appointment_details: {
                    appointment_id: appointment.appointment_id,
                    teacher: {
                        name: appointment.teacher.name,
                        abbreviation: appointment.teacher.abbreviation,
                        email: appointment.teacher.email
                    },
                    student: {
                        name: appointment.student.name,
                        student_number: appointment.student.student_number,
                        class: appointment.student.class?.class_name,
                        level: appointment.student.class?.level?.name
                    },
                    parent: {
                        name: appointment.parent_name,
                        email: appointment.parent_email,
                        phone: appointment.parent_phone
                    },
                    schedule: {
                        date: appointment.date,
                        start_time: appointment.start_time,
                        end_time: appointment.end_time
                    },
                    status: appointment.status,
                    created_at: appointment.created_at
                }
            };
        } catch (error) {
            logger.error(`Error getting appointment confirmation: ${ error.message }`, {error});
            throw error;
        }
    }
}
module.exports = new ParentService();
