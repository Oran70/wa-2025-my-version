const TeacherService = require('../services/teacherService');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const teacherController = {
    // Authentication endpoint
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Email and password are required'
                });
            }

            // Validate teacher credentials
            const teacher = await TeacherService.validateTeacherCredentials(email, password);

            if (!teacher) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    userId: teacher.user_id,
                    email: teacher.email,
                    roles: teacher.roles,
                    type: 'Teacher' || 'Mentor' || 'Admin'
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
            );

            // Log successful login
            logger.info(`Teacher login successful: ${teacher.email}`);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        user_id: teacher.user_id,
                        email: teacher.email,
                        name: teacher.name,
                        abbreviation: teacher.abbreviation,
                        roles: teacher.roles
                    },
                    token
                }
            });

        } catch (error) {
            logger.error('Error during teacher login:', error);
            res.status(500).json({
                success: false,
                error: 'Server error during login'
            });
        }
    },

    // Get teacher's classes
    getClasses: async (req, res) => {
        try {
            const teacherId = req.user.userId;

            const classes = await TeacherService.getTeacherClasses(teacherId);

            res.json({
                success: true,
                message: 'Classes retrieved successfully',
                data: {
                    classes,
                    total: classes.length
                }
            });

        } catch (error) {
            logger.error('Error getting teacher classes:', error);
            res.status(500).json({
                success: false,
                error: 'Server error retrieving classes'
            });
        }
    },

    // Get teacher's students (all classes)
    getStudents: async (req, res) => {
        try {
            const teacherId = req.user.userId;

            const students = await TeacherService.getTeacherStudents(teacherId);

            res.json({
                success: true,
                message: 'Students retrieved successfully',
                data: {
                    students,
                    total: students.length
                }
            });

        } catch (error) {
            logger.error('Error getting teacher students:', error);
            res.status(500).json({
                success: false,
                error: 'Server error retrieving students'
            });
        }
    },

    // Get students by specific class
    getStudentsByClass: async (req, res) => {
        try {
            const teacherId = req.user.userId;
            const { classId } = req.params;

            if (!classId) {
                return res.status(400).json({
                    success: false,
                    error: 'Class ID is required'
                });
            }

            const result = await TeacherService.getStudentsByClass(teacherId, classId);

            if (!result.success) {
                return res.status(403).json({
                    success: false,
                    error: result.message
                });
            }

            res.json({
                success: true,
                message: 'Students retrieved successfully',
                data: {
                    students: result.students,
                    total: result.students.length
                }
            });

        } catch (error) {
            logger.error('Error getting students by class:', error);
            res.status(500).json({
                success: false,
                error: 'Server error retrieving students'
            });
        }
    },

    // Create availability slots
    createAvailability: async (req, res) => {
        try {
            const teacherId = req.user.userId;
            const availabilityData = req.body;

            const result = await TeacherService.createAvailability(teacherId, availabilityData);

            res.status(201).json({
                success: true,
                message: result.message,
                data: {
                    slots_created: result.slots.length,
                    slots: result.slots
                }
            });

        } catch (error) {
            logger.error('Error creating availability:', error);
            res.status(500).json({
                success: false,
                error: 'Server error creating availability'
            });
        }
    },

    // Get teacher's availability overview
    getAvailabilityOverview: async (req, res) => {
        try {
            const teacherId = req.user.userId;
            const { startDate, endDate, includeBooked } = req.query;

            const availability = await TeacherService.getTeacherAvailability(
                teacherId,
                startDate,
                endDate,
                includeBooked === 'true'
            );

            res.json({
                success: true,
                message: 'Availability retrieved successfully',
                data: {
                    availability,
                    total_slots: availability.length,
                    filters: {
                        start_date: startDate || null,
                        end_date: endDate || null,
                        include_booked: includeBooked === 'true'
                    }
                }
            });

        } catch (error) {
            logger.error('Error getting availability overview:', error);
            res.status(500).json({
                success: false,
                error: 'Server error retrieving availability'
            });
        }
    },

    // Delete availability by date and time
    deleteAvailability: async (req, res) => {
        try {
            const teacherId = req.user.userId;
            const { date, startTime, endTime } = req.body;

            if (!date || !startTime) {
                return res.status(400).json({
                    success: false,
                    error: 'Date and start time are required'
                });
            }

            const result = await TeacherService.deleteAvailability(teacherId, date, startTime, endTime);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.message
                });
            }

            res.json({
                success: true,
                message: result.message,
                data: {
                    deleted_count: result.deletedCount,
                    deleted_slots: result.deletedSlots
                }
            });

        } catch (error) {
            logger.error('Error deleting availability:', error);
            res.status(500).json({
                success: false,
                error: 'Server error deleting availability'
            });
        }
    },
    // Get teacher's appointments
    getTeacherAppointments: async (req, res) => {
        try {
            const teacherId = req.user.userId;
            const { status, startDate, endDate } = req.query;

            const appointments = await TeacherService.getTeacherAppointments(
                teacherId,
                status,
                startDate,
                endDate
            );

            res.json({
                success: true,
                message: 'Appointments retrieved successfully',
                data: {
                    appointments,
                    total: appointments.length,
                    filters: {
                        status: status || 'all',
                        start_date: startDate || null,
                        end_date: endDate || null
                    }
                }
            });

        } catch (error) {
            logger.error('Error getting teacher appointments:', error);
            res.status(500).json({
                success: false,
                error: 'Server error retrieving appointments'
            });
        }
    },

    // Cancel appointment
    cancelAppointment: async (req, res) => {
        try {
            const teacherId = req.user.userId;
            const { appointmentId } = req.params;
            const { cancellationReason } = req.body;

            if (!appointmentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Appointment ID is required'
                });
            }

            const result = await TeacherService.cancelAppointmentByTeacher(
                teacherId,
                appointmentId,
                cancellationReason
            );

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    error: result.message
                });
            }

            res.json({
                success: true,
                message: result.message,
                data: {
                    appointment_id: appointmentId,
                    cancelled_appointment: result.appointment,
                    cancellation_reason: cancellationReason
                }
            });

        } catch (error) {
            logger.error('Error cancelling appointment:', error);
            res.status(500).json({
                success: false,
                error: 'Server error cancelling appointment'
            });
        }
    },

    // Get teacher dashboard
    getDashboard: async (req, res) => {
        try {
            const teacherId = req.user.userId;

            const dashboardData = await TeacherService.getTeacherDashboard(teacherId);

            res.json({
                success: true,
                message: 'Dashboard data retrieved successfully',
                data: dashboardData
            });

        } catch (error) {
            logger.error('Error getting teacher dashboard:', error);
            res.status(500).json({
                success: false,
                error: 'Server error retrieving dashboard data'
            });
        }
    }
};

module.exports = teacherController;
