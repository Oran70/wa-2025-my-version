const { body, param, query } = require('express-validator');
const { validateRequest } = require('./validation');

const teacherValidators = {
    login: [
        body('email')
            .isEmail()
            .withMessage('Valid email is required'),
        body('password')
            .isString()
            .notEmpty()
            .withMessage('Password is required'),
        validateRequest
    ],

    createAvailability: [
        body('date')
            .isDate()
            .withMessage('Valid date is required (YYYY-MM-DD)'),
        body('startTime')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .withMessage('Start time must be in HH:MM format'),
        body('endTime')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
            .withMessage('End time must be in HH:MM format')
            .custom((endTime, { req }) => {
                if (req.body.startTime) {
                    const [startHour, startMin] = req.body.startTime.split(':').map(Number);
                    const [endHour, endMin] = endTime.split(':').map(Number);

                    const startMinutes = startHour * 60 + startMin;
                    const endMinutes = endHour * 60 + endMin;

                    if (endMinutes <= startMinutes) {
                        throw new Error('End time must be after start time');
                    }
                }
                return true;
            }),
        body('slotDuration')
            .isInt({ min: 10, max: 30 })
            .withMessage('Slot duration must be between 10 and 30 minutes (as per Availability model validation)'),
        body('breakDuration')
            .optional()
            .isInt({ min: 0, max: 60 })
            .withMessage('Break duration must be between 0 and 60 minutes'),
        body('notes')
            .optional()
            .isLength({ max: 1000 })
            .trim()
            .escape()
            .withMessage('Notes must be less than 1000 characters'),
        body('recurringWeeks')
            .optional()
            .isInt({ min: 0, max: 12 })
            .withMessage('Recurring weeks must be between 0 and 12'),
        validateRequest
    ],

    cancelAppointment: [
        param('appointmentId')
            .isUUID()
            .withMessage('Valid appointment ID is required'),
        body('cancellationReason')
            .isString()
            .notEmpty()
            .withMessage('Cancellation reason is required'),
        validateRequest
    ]
};

module.exports = { teacherValidators };
