module.exports = {
    '/api/teacher/login': {
        post: {
            tags: ['Teacher'],
            summary: 'Teacher authentication',
            description: 'Authenticates a teacher and returns JWT token for accessing protected endpoints',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    description: 'Teacher email address',
                                    example: 'j.Janelenen@school.edu'
                                },
                                password: {
                                    type: 'string',
                                    minLength: 6,
                                    description: 'Teacher password',
                                    example: 'teacherPassword123'
                                }
                            },
                            required: ['email', 'password']
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Login successful' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            user: { $ref: '#/components/schemas/TeacherUser' },
                                            token: {
                                                type: 'string',
                                                description: 'JWT token for authentication',
                                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad Request - missing email or password',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - invalid credentials',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },

    '/api/teacher/logout': {
        post: {
            tags: ['Teacher'],
            summary: 'Teacher logout',
            description: 'Logs out teacher (mainly for logging purposes)',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Logout successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Logout successful' }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - invalid or missing token',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },

    '/api/teacher/dashboard': {
        get: {
            tags: ['Teacher'],
            summary: 'Get teacher dashboard',
            description: 'Retrieves comprehensive dashboard data for the authenticated teacher',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Dashboard data retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Dashboard data retrieved successfully' },
                                    data: { $ref: '#/components/schemas/TeacherDashboard' }
                                }
                            }
                        }
                    }
                },
                401: { $ref: '#/components/responses/Unauthorized' },
                403: { $ref: '#/components/responses/Forbidden' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/teacher/classes': {
        get: {
            tags: ['Teacher'],
            summary: 'Get teacher classes',
            description: 'Retrieves all classes that the authenticated teacher teaches',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Classes retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Classes retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            classes: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/TeacherClass' }
                                            },
                                            total: { type: 'integer', example: 3 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: { $ref: '#/components/responses/Unauthorized' },
                403: { $ref: '#/components/responses/Forbidden' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/teacher/students': {
        get: {
            tags: ['Teacher'],
            summary: 'Get all teacher students',
            description: 'Retrieves all students from all classes that the authenticated teacher teaches',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Students retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Students retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            students: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/TeacherStudent' }
                                            },
                                            total: { type: 'integer', example: 25 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: { $ref: '#/components/responses/Unauthorized' },
                403: { $ref: '#/components/responses/Forbidden' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/teacher/classes/{classId}/students': {
        get: {
            tags: ['Teacher'],
            summary: 'Get students by class',
            description: 'Retrieves all students from a specific class that the teacher teaches',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'classId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '905ce9a1-4f5c-45a2-baff-5d0f1df5c10c'
                    },
                    description: 'Unique identifier of the class'
                }
            ],
            responses: {
                200: {
                    description: 'Students retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Students retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            students: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/TeacherStudent' }
                                            },
                                            total: { type: 'integer', example: 12 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                403: {
                    description: 'Forbidden - teacher does not teach this class',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: { $ref: '#/components/responses/NotFound' },
                401: { $ref: '#/components/responses/Unauthorized' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/teacher/availability': {
        post: {
            tags: ['Teacher'],
            summary: 'Create availability slots',
            description: 'Creates new availability slots for parent-teacher appointments',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                date: {
                                    type: 'string',
                                    format: 'date',
                                    description: 'Date for availability (YYYY-MM-DD)',
                                    example: '2025-06-15'
                                },
                                startTime: {
                                    type: 'string',
                                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                    description: 'Start time (HH:MM)',
                                    example: '09:00'
                                },
                                endTime: {
                                    type: 'string',
                                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                    description: 'End time (HH:MM)',
                                    example: '17:00'
                                },
                                slotDuration: {
                                    type: 'integer',
                                    minimum: 10,
                                    maximum: 30,
                                    description: 'Duration of each slot in minutes (10-30 as per model validation)',
                                    example: 30
                                },
                                breakDuration: {
                                    type: 'integer',
                                    minimum: 0,
                                    maximum: 60,
                                    description: 'Break duration between slots in minutes',
                                    example: 5
                                },
                                notes: {
                                    type: 'string',
                                    maxLength: 1000,
                                    description: 'Additional notes about the availability',
                                    example: 'Office hours for parent consultations'
                                }
                            },
                            required: ['date', 'startTime', 'endTime', 'slotDuration']
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Availability slots created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Created 12 availability slots' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            slots_created: { type: 'integer', example: 12 },
                                            slots: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/AvailabilitySlot' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/Unauthorized' },
                403: { $ref: '#/components/responses/Forbidden' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        },
        get: {
            tags: ['Teacher'],
            summary: 'Get teacher availability',
            description: 'Retrieves availability slots for the authenticated teacher',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'startDate',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        format: 'date',
                        example: '2025-06-01'
                    },
                    description: 'Filter availability from this date (YYYY-MM-DD)'
                },
                {
                    name: 'endDate',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        format: 'date',
                        example: '2025-07-30'
                    },
                    description: 'Filter availability until this date (YYYY-MM-DD)'
                },
                {
                    name: 'includeBooked',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'boolean',
                        default: false
                    },
                    description: 'Include slots that are already booked'
                }
            ],
            responses: {
                200: {
                    description: 'Availability retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Availability retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            availability: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/AvailabilitySlot' }
                                            },
                                            total_slots: { type: 'integer', example: 24 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/Unauthorized' },
                403: { $ref: '#/components/responses/Forbidden' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        },
        delete: {
            tags: ['Teacher'],
            summary: 'Delete availability by date and time',
            description: 'Deletes availability slots for a specific date and time',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                date: {
                                    type: 'string',
                                    format: 'date',
                                    description: 'Date of availability to delete (YYYY-MM-DD)',
                                    example: '2025-06-15'
                                },
                                startTime: {
                                    type: 'string',
                                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                    description: 'Start time to delete (HH:MM)',
                                    example: '14:30'
                                },
                                endTime: {
                                    type: 'string',
                                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                    description: 'End time to delete (HH:MM) - optional',
                                    example: '15:00'
                                }
                            },
                            required: ['date', 'startTime']
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Availability deleted successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Deleted 2 availability slot(s)' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            deleted_count: { type: 'integer', example: 2 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/Unauthorized' },
                403: { $ref: '#/components/responses/Forbidden' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/teacher/appointments': {
        get: {
            tags: ['Teacher'],
            summary: 'Get teacher appointments',
            description: 'Retrieves appointments for the authenticated teacher with filtering options',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'status',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['Scheduled', 'Cancelled'],
                        example: 'Scheduled'
                    },
                    description: 'Filter by appointment status'
                },
                {
                    name: 'startDate',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        format: 'date',
                        example: '2024-06-01'
                    },
                    description: 'Filter appointments from this date (YYYY-MM-DD)'
                },
                {
                    name: 'endDate',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        format: 'date',
                        example: '2024-06-30'
                    },
                    description: 'Filter appointments until this date (YYYY-MM-DD)'
                }
            ],
            responses: {
                200: {
                    description: 'Appointments retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Appointments retrieved successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            appointments: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/TeacherAppointment' }
                                            },
                                            total: { type: 'integer', example: 8 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/Unauthorized' },
                403: { $ref: '#/components/responses/Forbidden' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/teacher/appointments/{appointmentId}/cancel': {
        put: {
            tags: ['Teacher'],
            summary: 'Cancel appointment',
            description: 'Cancels a scheduled appointment',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'appointmentId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '123e4567-e89b-12d3-a456-426614174000'
                    },
                    description: 'Unique identifier of the appointment to cancel'
                }
            ],
            requestBody: {
                required: false,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                cancellationReason: {
                                    type: 'string',
                                    maxLength: 500,
                                    description: 'Reason for cancelling the appointment',
                                    example: 'Teacher illness - need to reschedule'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Appointment cancelled successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Appointment cancelled successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            appointment_id: { type: 'string', format: 'uuid' },
                                            cancellation_reason: { type: 'string', example: 'Teacher illness' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/BadRequest' },
                404: {
                    description: 'Appointment not found or already cancelled',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                401: { $ref: '#/components/responses/Unauthorized' },
                403: { $ref: '#/components/responses/Forbidden' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    }
};
