const ParentService = require('../services/parentService');
const logger = require('../utils/logger');

const parentController = {
    // Validate AccessCode and return student/teacher info
    validateAccessCode: async (req, res) => {
        try {
            const accessCode = req.body.accessCode || req.body.parent_access_code || req.body.access_code;
            if (!accessCode) {
                return res.status(400).json({
                    success: false,
                    error: res.message || 'Access code is required EA'
                });
            }

            const result = await ParentService.validateAccessCode(accessCode);
            if(!result.valid) {
                return res.status(404).json({
                    success: false,
                    error: result.message
                });
            }

            res.json({
                success: true,
                message: result.message,
                data: {
                    student: result.student_info,
                    teachers: result.available_teachers,
                    accessCode
                }
            });
        } catch (error) {
            logger.error('Error validating access code:', error);
            res.status(500).json({
                success: false,
                error: 'Server error during access code validation: Contact Eleonora'
            });
        }
    },

    // Get teacher availability for a specific teacher
    getTeacherAvailability: async (req, res) => {
        try {
            const {teacherId} = req.params;
            const {startDate, endDate} = req.query;

            const availability = await ParentService.getTeacherAvailability(
                teacherId,
                startDate,
                endDate
            );
            res.json({
                success: true,
                message: `Found ${availability.length} availability slots for teacher ${teacherId}`,
                data: {
                    teacherId,
                    availability
                }
            });
        }
        catch (error) {
            logger.error('Error fetching teacher availability:', error);
            res.status(500).json({
                success: false,
                error: 'Server error while fetching availability. Contact Eleonora'
            });
        }
    },
    createAppointment: async (req, res) => {
        try {
            const appointmentData = await req.body;
            // Normalize field names to handle different casing
            const normalizedData = {
                accessCode: appointmentData.accessCode || appointmentData.parent_access_code,
                teacherId: appointmentData.teacherId || appointmentData.teacher_id,
                availabilityId: appointmentData.availabilityId || appointmentData.availability_id,
                parentName: appointmentData.parentName || appointmentData.parent_name,
                parentEmail: appointmentData.parentEmail || appointmentData.parent_email,
                parentPhone: appointmentData.parentPhone || appointmentData.parent_phone
            };

            // Validate required fields
            const requiredFields = ['accessCode', 'teacherId', 'availabilityId', 'parentName', 'parentEmail'];
            const missingFields = requiredFields.filter(field => !normalizedData[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Call service to create appointment
            const result = await ParentService.createAppointmentFromForm(normalizedData);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.message
                });
            }

            // Return success response - note the correct property name is appointment_id, not appointment.appointment_id
            res.status(201).json({
                success: true,
                message: result.message || 'Appointment created successfully',
                data: {
                    appointmentId: result.appointment_id,
                    confirmation: result.confirmation_details
                }
            });
        } catch (error) {
            logger.error('Error creating appointment:', error);
            res.status(500).json({
                success: false,
                error: 'Server error while creating appointment. Contact Eleonora'
            });
        }
    },

    getAppointmentConfirmation: async (req, res) => {
        try {
            const {appointmentId} = req.params;

            const result = await ParentService.getAppointmentConfirmation(appointmentId);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    error: 'Appointment not found'
                });
            }
            res.json({
                success: true,
                data: result.appointment_details
            });
        } catch (error) {
            logger.error('Error fetching appointment confirmation:', error);
            res.status(500).json({
                success: false,
                error: 'Server error while fetching appointment confirmation. Contact Eleonora'
            });
        }
    },

    // Cancel appointment using access code
    cancelAppointment: async (req, res) => {
        try {
            const { appointmentId } = req.params;
            const { accessCode, cancellationReason } = req.body;

            if (!appointmentId || !accessCode)
            {
                return res.status(400).json({
                    success: false,
                    error: 'Appointment ID and access code are required'
                });
            }
            const result = await ParentService.cancelAppointmentByParent(accessCode, appointmentId, cancellationReason);
            if (!result.success)

                return res.status(400).json({
                    success: false,
                    error: result.message
                });
            res.json({
                success: true,
                message: result.message || 'Appointment cancelled successfully',
            });

        } catch (error) {
            logger.error('Cancel appointment error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to cancel appointment. Contact Eleonora!'
            });
        }
    },
    // Get parent dashboard with appointments
    getDashboard: async (req, res) => {
        try {
            // TODO: REMOVE ONCE CLEAR WHICH
            // const accessCode = req.query.accessCode || req.query.parent_access_code || req.query.access_code;
            const accessCode = req.query.accessCode ||
                req.query.parent_access_code ||
                req.query.access_code ||
                req.body.accessCode ||
                req.body.parent_access_code ||
                req.body.access_code;
            if (!accessCode) {
                return res.status(400).json({
                    success: false,
                    error: 'Access code is required'
                });
            }

            // Call service to get parent dashboard
            const result = await ParentService.getParentDashboard(accessCode);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: result.message
                });
            }

            res.json({
                success: true,
                message: 'Parent dashboard loaded successfully',
                data: {
                    student: result.student_info,
                    upcomingAppointments: result.upcoming_appointments,
                    pastAppointments: result.past_appointments,
                    stats: {
                        totalUpcoming: result.upcoming_appointments.length,
                        totalPast: result.past_appointments.length
                    }
                }
            });
        } catch (error) {
            logger.error('Get parent dashboard error:', error);
            res.status(500).json({
                success: false,
                error: 'Unable to load dashboard. Contact Eleonora!'
            });
        }
    },
    // Get teacher availability with access code
    getAvailabilityOverview: async (req, res) => {
        try {
            const access_code = req.body.parent_access_code || req.body.accessCode;

            if (!access_code) {
                return res.status(400).json({
                    success: false,
                    error: 'Access code is required'
                });
            }

            // Call service to get availability overview
            const result = await ParentService.getTeacherAvailability(access_code);

            if (!result.valid) {
                return res.status(400).json({
                    success: false,
                    error: result.message
                });
            }

            res.json({
                success: true,
                data: {
                    teachers: result.teachers
                }
            });

        } catch (error) {
            logger.error('Get availability overview error:', error);
            res.status(500).json({
                success: false,
                error: 'Unable to fetch overview'
            });
        }
    }
};

module.exports = parentController;
