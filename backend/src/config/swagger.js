const swaggerJsDoc = require('swagger-jsdoc');

const paths = require('../swagger/paths');

/**
 * Creates Swagger configuration for the EduPlan API
 * @returns {Object} Swagger documentation object
 */
const createSwaggerDefinition = () => {
    return {
        openapi: '3.1.0',
        info: {
            title: 'EduPlan API',
            version: '1.1.0',
            description: 'Parent-Teacher Appointment System API',
            contact: {
                name: 'Development Team',
                email: 'nora.avaleva@gmail.com',
                url: 'https://eduplan.com/support'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://api.eduplan.com'
                    : `http://localhost:${process.env.PORT || 8000}`,
                description: process.env.NODE_ENV === 'production'
                    ? 'Production server'
                    : 'Development server'
            }
        ],
        tags: [
            {
                name: 'Teacher',
                description: 'Teacher authentication and management endpoints'
            },
            {
                name: 'Parent',
                description: 'Parent portal endpoints for appointment management'
            },
            {
                name: 'Users',
                description: 'User management endpoints'
            },
            {
                name: 'Students',
                description: 'Student management endpoints'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authenticated users (teachers, admins)'
                },
                accessCodeAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-Access-Code',
                    description: 'Parent access code for appointment booking'
                }
            },
            schemas: {
                // Base response schemas
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indicates if the request was successful'
                        },
                        data: {
                            description: 'Response data (varies by endpoint)'
                        },
                        message: {
                            type: 'string',
                            description: 'Human-readable message about the operation'
                        },
                        error: {
                            type: 'string',
                            description: 'Error message (only present when success is false)'
                        }
                    },
                    required: ['success']
                },

                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            description: 'Error type or category'
                        },
                        message: {
                            type: 'string',
                            description: 'Detailed error message'
                        },
                        details: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {type: 'string'},
                                    message: {type: 'string'}
                                }
                            },
                            description: 'Validation error details (optional)'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Timestamp when error occurred'
                        },
                        path: {
                            type: 'string',
                            description: 'API endpoint path where error occurred'
                        }
                    },
                    required: ['success', 'error', 'message']
                },

                // Basic data types
                UUID: {
                    type: 'string',
                    format: 'uuid',
                    example: '8deed4bf-e75a-4018-ba0e-d54a15784c2d'
                },

                AccessCode: {
                    type: 'string',
                    pattern: '^[A-Z0-9]{10}$',
                    minLength: 10,
                    maxLength: 10,
                    example: 'B3Y6N1Q5R9',
                    description: '10-character alphanumeric access code (uppercase letters and numbers only)'
                },

                DateTime: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-05-19T14:30:00Z'
                },

                Date: {
                    type: 'string',
                    format: 'date',
                    example: '2025-05-21'
                },

                Time: {
                    type: 'string',
                    format: 'time',
                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                    example: '14:00'
                },

                // Role schema (define before User)
                Role: {
                    type: 'object',
                    properties: {
                        role_id: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        name: {
                            type: 'string',
                            example: 'Teacher'
                        },
                        description: {
                            type: 'string',
                            example: 'School teaching staff'
                        }
                    }
                },

                // Level schema (define before other schemas that reference it)
                Level: {
                    type: 'object',
                    properties: {
                        level_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique level identifier'
                        },
                        level_name: {
                            type: 'string',
                            description: 'Name of the educational level',
                            example: 'HAVO'
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the educational level',
                            example: 'Higher General Continued Education'
                        },
                        grade_range: {
                            type: 'string',
                            description: 'Grade range for this level',
                            example: '7-11'
                        }
                    }
                },

                // Class schema (define before schemas that reference it)
                Class: {
                    type: 'object',
                    properties: {
                        class_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique class identifier'
                        },
                        class_name: {
                            type: 'string',
                            description: 'Name of the class',
                            example: '3H1'
                        },
                        school_year: {
                            type: 'string',
                            description: 'Academic year for the class',
                            example: '2024-2025'
                        },
                        student_count: {
                            type: 'integer',
                            description: 'Number of students in the class',
                            example: 26
                        },
                        level: {
                            type: 'object',
                            properties: {
                                level_id: {
                                    type: 'string',
                                    format: 'uuid'
                                },
                                level_name: {
                                    type: 'string',
                                    example: 'HAVO'
                                },
                                description: {
                                    type: 'string',
                                    example: 'Higher General Continued Education'
                                }
                            }
                        }
                    }
                },

                // User related schemas
                User: {
                    type: 'object',
                    properties: {
                        user_id: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com'
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe'
                        },
                        phone: {
                            type: 'string',
                            example: '+31612345678'
                        },
                        is_active: {
                            type: 'boolean',
                            example: true
                        },
                        abbreviation: {
                            type: 'string',
                            example: 'JD'
                        },
                        unique_access_code: {
                            type: 'string',
                            example: 'Abc123XyZ789'
                        },
                        notes: {
                            type: 'string',
                            example: 'Primary mentor for grade 8'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-05-19T14:30:00Z'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-05-19T14:30:00Z'
                        }
                    }
                },

                // Teacher schemas
                TeacherUser: {
                    type: 'object',
                    properties: {
                        user_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for the teacher',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Teacher email address',
                            example: 'j.Janelenen@school.edu'
                        },
                        name: {
                            type: 'string',
                            description: 'Full name of the teacher',
                            example: 'Jane Smith'
                        },
                        abbreviation: {
                            type: 'string',
                            description: 'Teacher abbreviation',
                            example: 'JSM'
                        },
                        roles: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Teacher roles',
                            example: ['Teacher', 'Mentor']
                        }
                    },
                    required: ['user_id', 'email', 'name', 'roles']
                },

                TeacherClass: {
                    type: 'object',
                    properties: {
                        class_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for the class',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        class_name: {
                            type: 'string',
                            description: 'Name of the class',
                            example: 'Mathematics 5A'
                        },
                        level_name: {
                            type: 'string',
                            description: 'Grade level name',
                            example: 'Grade 5'
                        },
                        school_year: {
                            type: 'string',
                            description: 'Academic year',
                            example: '2024-2025'
                        },
                        is_primary_mentor: {
                            type: 'boolean',
                            description: 'Whether teacher is primary mentor for this class',
                            example: true
                        },
                        teacher_class_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for teacher-class relationship',
                            example: '987fcdeb-51a2-43d1-9f6e-8c7b5a4d3e2f'
                        }
                    },
                    required: ['class_id', 'class_name', 'level_name', 'school_year', 'is_primary_mentor']
                },

                TeacherStudent: {
                    type: 'object',
                    properties: {
                        student_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for the student',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        name: {
                            type: 'string',
                            description: 'Full name of the student',
                            example: 'John Doe'
                        },
                        student_number: {
                            type: 'string',
                            description: 'Student identification number',
                            example: 'ST2024001'
                        },
                        class_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Class identifier',
                            example: '987fcdeb-51a2-43d1-9f6e-8c7b5a4d3e2f'
                        },
                        class_name: {
                            type: 'string',
                            description: 'Name of the class',
                            example: 'Mathematics 5A'
                        },
                        level_name: {
                            type: 'string',
                            description: 'Grade level name',
                            example: 'Grade 5'
                        },
                        school_year: {
                            type: 'string',
                            description: 'Academic year',
                            example: '2024-2025'
                        },
                        is_mentored_by_me: {
                            type: 'boolean',
                            description: 'Whether this teacher is the primary mentor for this student',
                            example: false
                        },
                        parent_access_code: {
                            type: 'string',
                            description: 'Access code for parent to book appointments',
                            example: 'B3Y6N1Q5R9'
                        }
                    },
                    required: ['student_id', 'name', 'student_number', 'class_name', 'level_name']
                },

                TeacherAppointment: {
                    type: 'object',
                    properties: {
                        appointment_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for the appointment',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        availability_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Availability slot identifier',
                            example: '987fcdeb-51a2-43d1-9f6e-8c7b5a4d3e2f'
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            example: '2025-05-21'
                        },
                        start_time: {
                            type: 'string',
                            format: 'time',
                            example: '14:00'
                        },
                        end_time: {
                            type: 'string',
                            format: 'time',
                            example: '14:30'
                        },
                        parent_name: {
                            type: 'string',
                            description: 'Name of the parent booking the appointment',
                            example: 'Alice Doe'
                        },
                        parent_email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email of the parent booking the appointment',
                            example: 'alice.doe@email.com'
                        },
                        parent_phone: {
                            type: 'string',
                            description: 'Phone number of the parent booking the appointment',
                            example: '+31 6 12345678'
                        },
                        status: {
                            type: 'string',
                            enum: ['Scheduled', 'Cancelled'],
                            description: 'Status of the appointment',
                            example: 'Scheduled'
                        },
                        cancellation_reason: {
                            type: 'string',
                            description: 'Reason for cancellation if applicable',
                            example: 'Parent requested to reschedule'
                        },
                        cancellation_datetime: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date and time when the appointment was cancelled',
                            example: '2024-02-15T12:00:00Z'
                        },
                        cancelled_by: {
                            type: 'string',
                            enum: ['Parent', 'Teacher'],
                            description: 'Who cancelled the appointment',
                            example: 'Parent'
                        }
                    },
                    required: ['appointment_id', 'availability_id', 'date', 'start_time', 'end_time', 'parent_name', 'parent_email']
                },

                TeacherDashboard: {
                    type: 'object',
                    properties: {
                        teacher: {
                            type: 'object',
                            properties: {
                                user_id: {
                                    type: 'string',
                                    format: 'uuid'
                                },
                                email: {
                                    type: 'string',
                                    format: 'email'
                                },
                                name: {
                                    type: 'string'
                                },
                                abbreviation: {
                                    type: 'string'
                                },
                                roles: {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    }
                                }
                            }
                        },
                        upcomingAppointments: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    appointment_id: {
                                        type: 'string',
                                        format: 'uuid'
                                    },
                                    date: {
                                        type: 'string',
                                        format: 'date'
                                    },
                                    start_time: {
                                        type: 'string',
                                        format: 'time'
                                    },
                                    end_time: {
                                        type: 'string',
                                        format: 'time'
                                    },
                                    parent_name: {
                                        type: 'string'
                                    },
                                    parent_email: {
                                        type: 'string',
                                        format: 'email'
                                    },
                                    status: {
                                        type: 'string'
                                    }
                                }
                            }
                        },
                        todaysAppointments: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    appointment_id: {
                                        type: 'string',
                                        format: 'uuid'
                                    },
                                    date: {
                                        type: 'string',
                                        format: 'date'
                                    },
                                    start_time: {
                                        type: 'string',
                                        format: 'time'
                                    },
                                    end_time: {
                                        type: 'string',
                                        format: 'time'
                                    },
                                    parent_name: {
                                        type: 'string'
                                    },
                                    parent_email: {
                                        type: 'string',
                                        format: 'email'
                                    },
                                    status: {
                                        type: 'string'
                                    }
                                }
                            }
                        },
                        stats: {
                            type: 'object',
                            properties: {
                                totalClasses: {type: 'integer'},
                                totalStudents: {type: 'integer'},
                                upcomingCount: {type: 'integer'}
                            }
                        }
                    }
                },

                // Student schemas
                Student: {
                    type: 'object',
                    properties: {
                        student_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique student identifier',
                            example: '61a82d86-e296-43d5-a7d7-5376d8e9a00b'
                        },
                        name: {
                            type: 'string',
                            description: 'Full name of the student',
                            example: 'Emma Johnson'
                        },
                        student_number: {
                            type: 'string',
                            description: 'Unique student identification number',
                            example: '2024008'
                        },
                        level_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference to the student\'s grade level'
                        },
                        class_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference to the student\'s class'
                        },
                        parent_access_code: {
                            type: 'string',
                            maxLength: 10,
                            example: 'ABC123XYZ9',
                            description: 'Unique access code for parent portal'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-05-19T14:30:00Z'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-05-19T14:30:00Z'
                        }
                    },
                    required: ['student_id', 'name', 'student_number', 'level_id', 'class_id']
                },

                StudentWithDetails: {
                    type: 'object',
                    properties: {
                        student_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique student identifier',
                            example: '61a82d86-e296-43d5-a7d7-5376d8e9a00b'
                        },
                        name: {
                            type: 'string',
                            description: 'Full name of the student',
                            example: 'Emma Johnson'
                        },
                        student_number: {
                            type: 'string',
                            description: 'Unique student identification number',
                            example: '2024008'
                        },
                        level_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference to the student\'s grade level'
                        },
                        class_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference to the student\'s class'
                        },
                        parent_access_code: {
                            type: 'string',
                            maxLength: 10,
                            example: 'ABC123XYZ9',
                            description: 'Unique access code for parent portal'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-05-19T14:30:00Z'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-05-19T14:30:00Z'
                        },
                        class: {
                            type: 'object',
                            properties: {
                                class_id: {
                                    type: 'string',
                                    format: 'uuid'
                                },
                                class_name: {
                                    type: 'string',
                                    example: 'Class 5A'
                                },
                                level: {
                                    type: 'object',
                                    properties: {
                                        level_id: {
                                            type: 'string',
                                            format: 'uuid'
                                        },
                                        level_name: {
                                            type: 'string',
                                            example: 'Grade 5'
                                        },
                                        school_year: {
                                            type: 'string',
                                            example: '2024-2025'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                StudentCreation: {
                    type: 'object',
                    properties: {
                        student_number: {
                            type: 'string',
                            maxLength: 50,
                            example: 'ST2024001',
                            description: 'Unique student identifier number'
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                            description: 'Student\'s full name'
                        },
                        level_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference to the student\'s grade level'
                        },
                        class_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference to the student\'s class'
                        }
                    },
                    required: ['student_number', 'name', 'level_id', 'class_id']
                },

                StudentUpdate: {
                    type: 'object',
                    properties: {
                        student_number: {
                            type: 'string',
                            maxLength: 50,
                            example: 'ST2024001',
                            description: 'Unique student identifier number'
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe',
                            description: 'Student\'s full name'
                        },
                        level_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference to the student\'s grade level'
                        },
                        class_id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Reference to the student\'s class'
                        }
                    }
                },

                StudentBulkCreation: {
                    type: 'object',
                    properties: {
                        students: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    student_number: {
                                        type: 'string',
                                        maxLength: 50,
                                        example: 'ST2024001'
                                    },
                                    name: {
                                        type: 'string',
                                        example: 'John Doe'
                                    },
                                    class_id: {
                                        type: 'string',
                                        format: 'uuid',
                                        description: 'Class ID to assign all students to'
                                    },
                                    level_id: {
                                        type: 'string',
                                        format: 'uuid'
                                    }
                                },
                                required: ['student_number', 'name', 'level_id']
                            },
                            minItems: 1,
                            maxItems: 100,
                            example: [
                                {
                                    student_number: 'ST2024001',
                                    name: 'Bulk Creation John Doe',
                                    level_id: '94fed718-4c10-414f-971f-4010a4218dc9',
                                    class_id: '23147a46-ce9f-4705-a425-be7bc6aabfb4'
                                },
                                {
                                    student_number: 'ST2024002',
                                    name: 'Bulk Creation Jane Smith',
                                    level_id: '94fed718-4c10-414f-971f-4010a4218dc9',
                                    class_id: '23147a46-ce9f-4705-a425-be7bc6aabfb4'
                                }
                            ]
                        }
                    },
                    required: ['class_id', 'students']
                },

                StudentGroupDeletion: {
                    type: 'object',
                    properties: {
                        student_ids: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'uuid'
                            },
                            minItems: 1,
                            maxItems: 100,
                            example: [
                                '123e4567-e89b-12d3-a456-426614174000',
                                '987fcdeb-51a2-43d1-9f8a-6def12345678'
                            ],
                            description: 'Array of student IDs to delete'
                        }
                    },
                    required: ['student_ids']
                },

                // Parent/Appointment schemas
                AccessCodeValidation: {
                    type: 'object',
                    required: ['accessCode'],
                    properties: {
                        accessCode: {
                            type: 'string',
                            pattern: '^[A-Z0-9]{10}$',
                            minLength: 10,
                            maxLength: 10,
                            example: 'B3Y6N1Q5R9'
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
                            type: 'string',
                            pattern: '^[A-Z0-9]{10}$',
                            example: 'B3Y6N1Q5R9'
                        },
                        teacherId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier of the teacher'
                        },
                        availabilityId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier of the availability slot'
                        },
                        parentName: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 255,
                            pattern: '^[a-zA-Z\\s\\-\'\.]+$',
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
                            type: 'string',
                            pattern: '^[A-Z0-9]{10}$',
                            example: 'B3Y6N1Q5R9'
                        },
                        cancellationReason: {
                            type: 'string',
                            maxLength: 500,
                            example: 'Schedule conflict - need to reschedule',
                            description: 'Optional reason for cancelling the appointment'
                        }
                    }
                },

                StudentInfo: {
                    type: 'object',
                    properties: {
                        student_id: {
                            type: 'string',
                            format: 'uuid'
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
                            type: 'string',
                            format: 'uuid'
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
                            type: 'string',
                            format: 'uuid'
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            example: '2025-05-21'
                        },
                        start_time: {
                            type: 'string',
                            format: 'time',
                            example: '14:00'
                        },
                        end_time: {
                            type: 'string',
                            format: 'time',
                            example: '14:30'
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
                        },
                        notes: {
                            type: 'string',
                            description: 'Additional notes about the availability',
                            example: 'Office hours for parent consultations'
                        },
                        is_visible: {
                            type: 'boolean',
                            description: 'Whether the slot is visible to parents',
                            example: true
                        },
                        is_booked: {
                            type: 'boolean',
                            description: 'Whether the slot is already booked',
                            example: false
                        }
                    }
                },

                AppointmentDetails: {
                    type: 'object',
                    properties: {
                        appointment_id: {
                            type: 'string',
                            format: 'uuid'
                        },
                        student: {
                            type: 'object',
                            properties: {
                                name: {type: 'string'},
                                student_number: {type: 'string'},
                                class: {type: 'string'},
                                level: {type: 'string'}
                            }
                        },
                        teacher: {
                            type: 'object',
                            properties: {
                                name: {type: 'string'},
                                abbreviation: {type: 'string'},
                                email: {type: 'string', format: 'email'}
                            }
                        },
                        schedule: {
                            type: 'object',
                            properties: {
                                date: {
                                    type: 'string',
                                    format: 'date',
                                    example: '2025-05-21'
                                },
                                start_time: {
                                    type: 'string',
                                    format: 'time',
                                    example: '14:00'
                                },
                                end_time: {
                                    type: 'string',
                                    format: 'time',
                                    example: '14:30'
                                }
                            }
                        },
                        parent: {
                            type: 'object',
                            properties: {
                                name: {type: 'string'},
                                email: {type: 'string', format: 'email'},
                                phone: {type: 'string'}
                            }
                        },
                        status: {
                            type: 'string',
                            enum: ['Scheduled', 'Cancelled'],
                            example: 'Scheduled'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-05-19T14:30:00Z'
                        }
                    }
                },

                DashboardData: {
                    type: 'object',
                    properties: {
                        student: {
                            type: 'object',
                            properties: {
                                student_id: {
                                    type: 'string',
                                    format: 'uuid'
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
                        upcomingAppointments: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    appointment_id: {
                                        type: 'string',
                                        format: 'uuid'
                                    },
                                    teacher_name: {type: 'string'},
                                    teacher_abbreviation: {type: 'string'},
                                    date: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2025-05-21'
                                    },
                                    start_time: {
                                        type: 'string',
                                        format: 'time',
                                        example: '14:00'
                                    },
                                    end_time: {
                                        type: 'string',
                                        format: 'time',
                                        example: '14:30'
                                    },
                                    status: {type: 'string'}
                                }
                            }
                        },
                        pastAppointments: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    appointment_id: {
                                        type: 'string',
                                        format: 'uuid'
                                    },
                                    teacher_name: {type: 'string'},
                                    teacher_abbreviation: {type: 'string'},
                                    date: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2025-05-21'
                                    },
                                    start_time: {
                                        type: 'string',
                                        format: 'time',
                                        example: '14:00'
                                    },
                                    end_time: {
                                        type: 'string',
                                        format: 'time',
                                        example: '14:30'
                                    },
                                    status: {type: 'string'},
                                    cancellation_reason: {
                                        type: 'string',
                                        nullable: true
                                    }
                                }
                            }
                        }
                    }
                }
            },

        responses: {
            // Success responses
            Success: {
                description: 'Successful operation',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: { type: 'object' },
                                message: { type: 'string' }
                            }
                        }
                    }
                }
            },

            Created: {
                description: 'Resource created successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: { type: 'object' },
                                message: { type: 'string', example: 'Resource created successfully' }
                            }
                        }
                    }
                }
            },

            // Error responses
            BadRequest: {
                description: 'Bad Request - Validation error or malformed request',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Bad Request' },
                                message: { type: 'string', example: 'Validation failed' },
                                details: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            field: { type: 'string' },
                                            message: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },

            Unauthorized: {
                description: 'Unauthorized - Authentication required',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Unauthorized' },
                                message: { type: 'string', example: 'Authentication required' }
                            }
                        }
                    }
                }
            },

            Forbidden: {
                description: 'Forbidden - Insufficient permissions',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Forbidden' },
                                message: { type: 'string', example: 'Insufficient permissions' }
                            }
                        }
                    }
                }
            },

            NotFound: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Not Found' },
                                message: { type: 'string', example: 'Resource not found' }
                            }
                        }
                    }
                }
            },

            Conflict: {
                description: 'Conflict - Resource already exists',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Conflict' },
                                message: { type: 'string', example: 'Resource already exists' }
                            }
                        }
                    }
                }
            },

            TooManyRequests: {
                description: 'Too Many Requests - Rate limit exceeded',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Too Many Requests' },
                                message: { type: 'string', example: 'Rate limit exceeded' }
                            }
                        }
                    }
                }
            },

            InternalServerError: {
                description: 'Internal Server Error',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: false },
                                error: { type: 'string', example: 'Internal Server Error' },
                                message: { type: 'string', example: 'An unexpected error occurred' }
                            }
                        }
                    }
                }
            },

            // Specific success responses for different operations
            StudentCreated: {
                description: 'Student created successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'object',
                                    properties: {
                                        student_id: { type: 'string', format: 'uuid' },
                                        name: { type: 'string' },
                                        student_number: { type: 'string' },
                                        parent_access_code: { type: 'string' }
                                    }
                                },
                                message: { type: 'string', example: 'Student created successfully' }
                            }
                        }
                    }
                }
            },

            StudentsRetrieved: {
                description: 'Students retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            student_id: { type: 'string', format: 'uuid' },
                                            name: { type: 'string' },
                                            student_number: { type: 'string' },
                                            class: {
                                                type: 'object',
                                                properties: {
                                                    class_name: { type: 'string' },
                                                    level: {
                                                        type: 'object',
                                                        properties: {
                                                            level_name: { type: 'string' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                message: { type: 'string', example: 'Students retrieved successfully' }
                            }
                        }
                    }
                }
            },

            AccessCodeValidated: {
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
                                        student: {
                                            type: 'object',
                                            properties: {
                                                student_id: { type: 'string', format: 'uuid' },
                                                student_name: { type: 'string' },
                                                student_number: { type: 'string' },
                                                class_name: { type: 'string' },
                                                level_name: { type: 'string' }
                                            }
                                        },
                                        teachers: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    teacher_id: { type: 'string', format: 'uuid' },
                                                    teacher_name: { type: 'string' },
                                                    abbreviation: { type: 'string' },
                                                    is_primary_mentor: { type: 'boolean' }
                                                }
                                            }
                                        }
                                    }
                                },
                                message: { type: 'string', example: 'Access code validated successfully' }
                            }
                        }
                    }
                }
            },

            AppointmentCreated: {
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
                                        appointment_id: { type: 'string', format: 'uuid' },
                                        parent_user_id: { type: 'string', format: 'uuid' },
                                        confirmation: {
                                            type: 'object',
                                            properties: {
                                                date: { type: 'string', format: 'date' },
                                                time: { type: 'string', format: 'time' },
                                                teacher_name: { type: 'string' },
                                                student_name: { type: 'string' }
                                            }
                                        }
                                    }
                                },
                                message: { type: 'string', example: 'Appointment created successfully' }
                            }
                        }
                    }
                }
            }
        }
        },
        paths: paths
    };
};

/**
 * Generates Swagger documentation options
 * @returns {Object} Swagger documentation options
 */
const swaggerOptions = () => {
    return {
        definition: createSwaggerDefinition(),
        apis: [
            './src/routes/*.js',  // Scan route files for API documentation
            './src/controllers/*.js'  // Optionally scan controller files for additional documentation
        ]
    };
};

/**
 * Generates Swagger UI configuration
 * @returns {Object} Swagger UI configuration
 */
const swaggerUiOptions = () => {
    return {
        explorer: true,
        swaggerOptions: {
            docExpansion: 'none',
            filter: true,
            showSecurityDefinitions: true,
            tryItOutEnabled: true,
        },
        customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .info { margin: 20px 0; }
            .swagger-ui .info .title { color: #3b82f6; }
        `,
        customSiteTitle: 'EduPlan API Documentation',
        customfavIcon: '/favicon.ico'
    };
};

/**
 * Sets up Swagger middleware for Express application
 * @param {Object} app - Express application
 * @returns {Object} Swagger documentation
 */
const setupSwagger = (app) => {
    const swaggerJsDocOptions = swaggerOptions();
    const swaggerDocs = swaggerJsDoc(swaggerJsDocOptions);
    const swaggerUi = require('swagger-ui-express');

    // Swagger UI route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions()));

    // Optional: Expose Swagger JSON
    app.get('/api-docs.json', (req, res) => {
        res.json(swaggerDocs);
    });

    return swaggerDocs;
};

module.exports = {
    createSwaggerDefinition,
    swaggerOptions,
    swaggerUiOptions,
    setupSwagger
};
