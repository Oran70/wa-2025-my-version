module.exports = {
    // Input schemas
    AccessCodeValidation: {
        type: 'object',
        required: ['accessCode'],
        properties: {
            accessCode: {
                $ref: '#/components/schemas/AccessCode'
            }
        }
    },

    AppointmentCreation: {
        type: 'object',
        required: [
            'accessCode',
            'teacherId',
            'availabilityId',
            'parentName',
            'parentEmail',
            'parentPhone',
        ],
        properties: {
            accessCode: {
                $ref: '#/components/schemas/AccessCode'
            },
            teacherId: {
                $ref: '#/components/schemas/UUID',
                description: 'Unique identifier of the teacher'
            },
            availabilityId: {
                $ref: '#/components/schemas/UUID',
                description: 'Unique identifier of the availability slot'
            },
            parentName: {
                type: 'string',
                minLength: 2,
                maxLength: 255,
                pattern: '^[a-zA-Z\\s\\-\'\\\.]+$',
                example: 'John Doe',
                description: 'Full name of the parent/guardian'
            },
            parentEmail: {
                type: 'string',
                format: 'email',
                example: 'john.doe@example.com',
                description: 'Email address of the parent/guardian'
            },
            parentPhone: {
                type: 'string',
                pattern: '^\\+?[1-9]\\d{1,14}$',
                example: '+31612345678',
                description: 'Phone number in international format'
            }
        }
    },

    AppointmentCancellation: {
        type: 'object',
        required: ['accessCode'],
        properties: {
            accessCode: {
                $ref: '#/components/schemas/AccessCode'
            },
            cancellationReason: {
                type: 'string',
                maxLength: 500,
                example: 'Schedule conflict - need to reschedule',
                description: 'Optional reason for cancelling the appointment'
            }
        }
    },

    // Response schemas
    StudentInfo: {
        type: 'object',
        properties: {
            student_id: {
                $ref: '#/components/schemas/UUID'
            },
            student_name: {
                type: 'string',
                example: 'Alice Johnson'
            },
            student_number: {
                type: 'string',
                example: '2024001'
            },
            class_name: {
                type: 'string',
                example: '3H1'
            },
            level_name: {
                type: 'string',
                example: 'HAVO'
            },
            school_year: {
                type: 'string',
                example: '2024-2025'
            }
        }
    },

    TeacherInfo: {
        type: 'object',
        properties: {
            teacher_id: {
                $ref: '#/components/schemas/UUID'
            },
            teacher_name: {
                type: 'string',
                example: 'Dr. Emma Smith'
            },
            abbreviation: {
                type: 'string',
                example: 'ES'
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'emma.smith@school.edu'
            },
            is_primary_mentor: {
                type: 'boolean',
                example: true
            },
            role: {
                type: 'string',
                example: 'Primary Mentor',
                enum: ['Primary Mentor', 'Subject Teacher']
            }
        }
    },

    AvailabilitySlot: {
        type: 'object',
        properties: {
            availability_id: {
                $ref: '#/components/schemas/UUID'
            },
            date: {
                $ref: '#/components/schemas/Date'
            },
            start_time: {
                $ref: '#/components/schemas/Time'
            },
            end_time: {
                $ref: '#/components/schemas/Time'
            },
            slot_duration: {
                type: 'integer',
                minimum: 10,
                maximum: 30,
                example: 20,
                description: 'Duration of the appointment slot in minutes'
            },
            is_available: {
                type: 'boolean',
                example: true,
                description: 'Whether this slot is available for booking'
            }
        }
    },

    AppointmentDetails: {
        type: 'object',
        properties: {
            appointment_id: {
                $ref: '#/components/schemas/UUID'
            },
            student: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    student_number: { type: 'string' },
                    class: { type: 'string' },
                    level: { type: 'string' }
                }
            },
            teacher: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    abbreviation: { type: 'string' },
                    email: { type: 'string', format: 'email' }
                }
            },
            schedule: {
                type: 'object',
                properties: {
                    date: { $ref: '#/components/schemas/Date' },
                    start_time: { $ref: '#/components/schemas/Time' },
                    end_time: { $ref: '#/components/schemas/Time' },
                }
            },
            parent: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' }
                }
            },
            status: {
                type: 'string',
                enum: ['Scheduled', 'Cancelled'],
                example: 'Scheduled'
            },
            created_at: {
                $ref: '#/components/schemas/DateTime'
            }
        }
    },

    DashboardData: {
        type: 'object',
        properties: {
            student: {
                $ref: '#/components/schemas/StudentInfo'
            },
            upcomingAppointments: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        appointment_id: { $ref: '#/components/schemas/UUID' },
                        teacher_name: { type: 'string' },
                        teacher_abbreviation: { type: 'string' },
                        date: { $ref: '#/components/schemas/Date' },
                        start_time: { $ref: '#/components/schemas/Time' },
                        end_time: { $ref: '#/components/schemas/Time' },
                        status: { type: 'string' }
                    }
                }
            },
            pastAppointments: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        appointment_id: { $ref: '#/components/schemas/UUID' },
                        teacher_name: { type: 'string' },
                        teacher_abbreviation: { type: 'string' },
                        date: { $ref: '#/components/schemas/Date' },
                        start_time: { $ref: '#/components/schemas/Time' },
                        end_time: { $ref: '#/components/schemas/Time' },
                        status: { type: 'string' },
                        cancellation_reason: {
                            type: 'string',
                            nullable: true
                        }
                    }
                }
            }
        }
    }
};
