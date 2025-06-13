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
                200: {
                    description: 'Access code validated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            student: { $ref: '#/components/schemas/StudentInfo' },
                                            teachers: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/TeacherInfo' }
                                            }
                                        }
                                    },
                                    message: { type: 'string', example: 'Access code valid. Please select a teacher and appointment time.' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                401: {
                    description: 'Invalid access code',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                429: {
                    description: 'Too many requests',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
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
                200: {
                    description: 'Teacher availability retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/AvailabilitySlot' }
                                    },
                                    message: { type: 'string', example: 'Found 5 available slots' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
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
                201: {
                    description: 'Appointment created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            appointmentId: { $ref: '#/components/schemas/UUID' },
                                            parentUserId: { $ref: '#/components/schemas/UUID' },
                                            confirmation: { $ref: '#/components/schemas/AppointmentDetails' }
                                        }
                                    },
                                    message: { type: 'string', example: 'Appointment successfully scheduled!' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Failed to create appointment',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                429: {
                    description: 'Too many appointment requests',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
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
            responses: {
                200: {
                    description: 'Appointment confirmation retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: { $ref: '#/components/schemas/AppointmentDetails' },
                                    message: { type: 'string', example: 'Appointment confirmation retrieved successfully' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'Appointment not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
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
            responses: {
                200: {
                    description: 'Appointment cancelled successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Appointment cancelled successfully' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Failed to cancel appointment',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
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
            responses: {
                200: {
                    description: 'Dashboard data retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: { $ref: '#/components/schemas/DashboardData' },
                                    message: { type: 'string', example: 'Dashboard data retrieved successfully' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'Student not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    }
};
