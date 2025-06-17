module.exports = {
    '/api/validate-access-code': {
        post: {
            summary: 'Validate parent access code',
            description: 'Validates a parent access code and returns student information and available teachers',
            tags: ['Parent'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/AccessCodeValidation'
                        }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/AccessCodeValidated' },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/Unauthorized' },
                429: { $ref: '#/components/responses/TooManyRequests' }
            }
        }
    },

    '/api/teachers/{teacherId}/availability': {
        get: {
            summary: 'Get teacher availability slots',
            description: 'Retrieves available appointment slots for a specific teacher within a date range',
            tags: ['Parent'],
            parameters: [
                {
                    in: 'path',
                    name: 'teacherId',
                    required: true,
                    schema: { $ref: '#/components/schemas/UUID' },
                    description: 'Teacher\'s unique identifier'
                },
            ],
            responses: {
                201: { $ref: '#/components/responses/AppointmentCreated' },
                400: { $ref: '#/components/responses/BadRequest' },
                429: { $ref: '#/components/responses/TooManyRequests' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/appointments': {
        post: {
            summary: 'Create a new appointment',
            description: 'Creates a new appointment between parent and teacher. Automatically creates parent user if needed.',
            tags: ['Parent'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AppointmentCreation' }
                    }
                }
            },
            responses: {
                201: { $ref: '#/components/responses/AppointmentCreated' },
                400: { $ref: '#/components/responses/BadRequest' },
                429: { $ref: '#/components/responses/TooManyRequests' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/appointments/{appointmentId}/confirmation': {
        get: {
            summary: 'Get appointment confirmation details',
            description: 'Retrieves detailed confirmation information for a specific appointment',
            tags: ['Parent'],
            parameters: [
                {
                    in: 'path',
                    name: 'appointmentId',
                    required: true,
                    schema: { $ref: '#/components/schemas/UUID' },
                    description: 'Appointment\'s unique identifier'
                }
            ],
           // TODO: Add response schema for appointment confirmation details
    },

    '/api/appointments/{appointmentId}/cancel': {
        put: {
            summary: 'Cancel an appointment',
            description: 'Cancels an existing appointment. Only the parent who created the appointment can cancel it.',
            tags: ['Parent'],
            parameters: [
                {
                    in: 'path',
                    name: 'appointmentId',
                    required: true,
                    schema: { $ref: '#/components/schemas/UUID' },
                    description: 'Appointment\'s unique identifier'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AppointmentCancellation' }
                    }
                }
            },
            // TODO: Add response schema for appointment confirmation details
        }
    },

    '/api/dashboard': {
        get: {
            summary: 'Get parent dashboard data',
            description: 'Retrieves comprehensive dashboard information including student details and appointment history',
            tags: ['Parent'],
            parameters: [
                {
                    in: 'query',
                    name: 'access_code',
                    required: true,
                    schema: { $ref: '#/components/schemas/AccessCodeValidation' },
                    description: 'Student\'s access code  to fetch dashboard data'
                }
            ],
            // TODO: Add response schema for appointment confirmation details
        }
    }
    }
};
