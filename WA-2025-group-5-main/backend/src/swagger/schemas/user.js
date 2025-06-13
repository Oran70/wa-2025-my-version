module.exports = {
    // Core schemas
    UUID: {
        type: 'string',
        format: 'uuid',
        example: '084ef544-e2ae-4bee-a8c4-09fe5441e9d0'
    },

    Date: {
        type: 'string',
        format: 'date',
        example: '2025-05-20'
    },

    DateTime: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-20T14:30:00Z'
    },

    Time: {
        type: 'string',
        pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
        example: '14:00'
    },

    AccessCode: {
        type: 'string',
        pattern: '^[A-Za-z0-9]{10}$',
        example: 'Abc123XyZ789'
    },

    // User related schemas
    User: {
        type: 'object',
        properties: {
            user_id: { $ref: '#/components/schemas/UUID' },
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
            created_at: { $ref: '#/components/schemas/DateTime' },
            updated_at: { $ref: '#/components/schemas/DateTime' },
            role: {
                type: 'array',
                items: { $ref: '#/components/schemas/Role' }
            },
            classes: {
                type: 'array',
                items: { $ref: '#/components/schemas/TeacherClass' }
            }
        }
    },

    Role: {
        type: 'object',
        properties: {
            role_id: { $ref: '#/components/schemas/UUID' },
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

    TeacherClass: {
        type: 'object',
        properties: {
            teacher_class_id: { $ref: '#/components/schemas/UUID' },
            user_id: { $ref: '#/components/schemas/UUID' },
            class_id: { $ref: '#/components/schemas/UUID' },
            is_primary_mentor: {
                type: 'boolean',
                example: true
            },
            school_year: {
                type: 'string',
                example: '2024-2025'
            },
            class: {
                type: 'object',
                properties: {
                    class_name: {
                        type: 'string',
                        example: '3H1'
                    },
                    level_name: {
                        type: 'string',
                        example: 'HAVO'
                    },
                    student_count: {
                        type: 'integer',
                        example: 26
                    }
                }
            }
        }
    },
    // Error response schema
    ErrorResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: false
            },
            error: {
                type: 'string',
                example: 'Unauthorized'
            },
            message: {
                type: 'string',
                example: 'Authentication required to access this resource'
            }
        }
    }
};
