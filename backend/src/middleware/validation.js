const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Request validation failed',
            details: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            message: 'Invalid input data',
            details: errors.array().map(error => ({
                field: error.path || error.param,
                message: error.msg,
                value: error.value
            }))
        });
    }

    next();
};

// Simplified access code validation (no database check in middleware)
const validateAccessCode = [
    body('accessCode')
        .isLength({ min: 10, max: 10 })
        .matches(/^[A-Z0-9]{10}$/)
        .withMessage('Access code must be exactly 10 alphanumeric characters'),
    handleValidationErrors
];

// Teacher availability with access code validation
const validateTeacherAvailabilityWithAccessCode = [
    body('access_code')  // Note: your service expects 'access_code'
        .isLength({ min: 10, max: 10 })
        .matches(/^[A-Z0-9]{10}$/)
        .withMessage('Access code must be exactly 10 alphanumeric characters'),
    body('teacher_id')   // Note: your service expects 'teacher_id'
        .isUUID()
        .withMessage('Teacher ID must be a valid UUID'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be in ISO 8601 format (YYYY-MM-DD)'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be in ISO 8601 format (YYYY-MM-DD)'),
    handleValidationErrors
];

// Availability overview validation
const validateAvailabilityOverview = [
    body('access_code')  // Note: your service expects 'access_code'
        .isLength({ min: 10, max: 10 })
        .matches(/^[A-Z0-9]{10}$/)
        .withMessage('Access code must be exactly 10 alphanumeric characters'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be in ISO 8601 format (YYYY-MM-DD)'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be in ISO 8601 format (YYYY-MM-DD)'),
    handleValidationErrors
];

// Appointment creation validation
const validateAppointmentCreation = [
    body('accessCode')
        .isLength({ min: 10, max: 10 })
        .matches(/^[A-Z0-9]{10}$/)
        .withMessage('Access code must be exactly 10 alphanumeric characters'),
    body('teacherId')
        .isUUID()
        .withMessage('Teacher ID must be a valid UUID'),
    body('availabilityId')
        .isUUID()
        .withMessage('Availability ID must be a valid UUID'),
    body('parentName')
        .isLength({ min: 2, max: 255 })
        .matches(/^[a-zA-Z\s\-'\.]+$/)
        .withMessage('Parent name must contain only letters, spaces, hyphens, apostrophes, and dots'),
    body('parentEmail')
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('parentPhone')
        .optional()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Phone number must be in valid international format'),
    body('locationPreference')
        .optional()
        .isIn(['On-site', 'Online', 'No preference'])
        .withMessage('Location preference must be On-site, Online, or No preference'),
    handleValidationErrors
];

// Teacher availability validation (public endpoint)
const validateTeacherAvailability = [
    param('teacherId')
        .isUUID()
        .withMessage('Teacher ID must be a valid UUID'),
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be in ISO 8601 format'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be in ISO 8601 format'),
    handleValidationErrors
];

// Appointment cancellation validation
const validateAppointmentCancellation = [
    body('accessCode')
        .isLength({ min: 10, max: 10 })
        .matches(/^[A-Z0-9]{10}$/)
        .withMessage('Access code must be exactly 10 alphanumeric characters'),
    param('appointmentId')
        .isUUID()
        .withMessage('Appointment ID must be a valid UUID'),
    body('cancellationReason')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Cancellation reason must not exceed 500 characters'),
    handleValidationErrors
];

// UUID parameter validation
const validateUUID = [
    param('appointmentId')
        .isUUID()
        .withMessage('ID must be a valid UUID'),
    handleValidationErrors
];

// Dashboard validation
const validateDashboard = [
    body('accessCode')
        .isLength({ min: 10, max: 10 })
        .matches(/^[A-Z0-9]{10}$/)
        .withMessage('Access code must be exactly 10 alphanumeric characters'),
    handleValidationErrors
];

// Teacher login validation
const validateTeacherLogin = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

module.exports = {
    validateAccessCode,
    validateTeacherAvailabilityWithAccessCode,
    validateAvailabilityOverview,
    validateAppointmentCreation,
    validateTeacherAvailability,
    validateAppointmentCancellation,
    validateUUID,
    validateDashboard,
    validateTeacherLogin,
    validateRequest,
    handleValidationErrors
};
