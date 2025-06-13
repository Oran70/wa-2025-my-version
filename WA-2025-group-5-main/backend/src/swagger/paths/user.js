module.exports = {
    '/api/users': {
        get: {
            summary: 'Get all users',
            description: 'Retrieves a list of all users with pagination and filtering options',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    required: false,
                    schema: { type: 'integer', minimum: 1, default: 1 },
                    description: 'Page number for pagination'
                },
                {
                    name: 'limit',
                    in: 'query',
                    required: false,
                    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
                    description: 'Number of users per page'
                },
                {
                    name: 'search',
                    in: 'query',
                    required: false,
                    schema: { type: 'string' },
                    description: 'Search term for name and email'
                },
                {
                    name: 'isActive',
                    in: 'query',
                    required: false,
                    schema: { type: 'boolean' },
                    description: 'Filter by active status'
                },
                {
                    name: 'role',
                    in: 'query',
                    required: false,
                    schema: { type: 'string' },
                    description: 'Filter by role name'
                }
            ],
            // security: [
            //     { bearerAuth: [] }
            // ],
            responses: {
                200: {
                    description: 'List of users retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/User' }
                                    },
                                    pagination: {
                                        type: 'object',
                                        properties: {
                                            currentPage: { type: 'integer', example: 1 },
                                            totalPages: { type: 'integer', example: 5 },
                                            totalUsers: { type: 'integer', example: 50 },
                                            hasNext: { type: 'boolean', example: true },
                                            hasPrev: { type: 'boolean', example: false }
                                        }
                                    },
                                    message: { type: 'string', example: 'Found 50 users' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad Request - invalid query parameters',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - authentication required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                403: {
                    description: 'Forbidden - insufficient permissions',
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
        },
        post: {
            summary: 'Create a new user',
            description: 'Creates a new user with specified roles and information',
            tags: ['Users'],
            // security: [
            //     { bearerAuth: [] }
            // ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'Full name of the user',
                                    example: 'John Doe'
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    description: 'Email address of the user',
                                    example: 'j.Janelenen@school.edu'
                                },
                                password: {
                                    type: 'string',
                                    minLength: 6,
                                    description: 'Password for the user (required)',
                                    example: 'teacherPassword123'
                                },
                                abbreviation: {
                                    type: 'string',
                                    maxLength: 10,
                                    description: 'Short abbreviation for the user',
                                    example: 'JD'
                                },
                                notes: {
                                    type: 'string',
                                    description: 'Additional notes about the user',
                                    example: 'Mathematics teacher, started in 2024'
                                },
                                role: {
                                    type: 'string',
                                    description: 'Single role name (legacy support)',
                                    example: 'Teacher'
                                },
                                role: {
                                    type: 'array',
                                    description: 'Array of role names or role IDs',
                                    items: {
                                        type: 'string'
                                    },
                                    example: ['Teacher', 'Mentor']
                                }
                            },
                            required: ['name', 'email', 'password']
                        },
                        examples: {
                            teacher_user: {
                                summary: 'Create a teacher user',
                                value: {
                                    name: 'Jane Smith',
                                    email: 'j.Janelenen@school.edu',
                                    password: 'teacherPassword123',
                                    abbreviation: 'JSM',
                                    notes: 'Mathematics and Science teacher',
                                    role: ['Teacher']
                                }
                            },
                            admin_user: {
                                summary: 'Create an admin user',
                                value: {
                                    name: 'John Admin',
                                    email: 'admin@school.edu',
                                    password: 'adminPassword123',
                                    abbreviation: 'ADMIN',
                                    role: ['Admin']
                                }
                            },
                            multi_role_user: {
                                summary: 'User with multiple roles',
                                value: {
                                    name: 'Sarah Wilson',
                                    email: 's.wilson@school.edu',
                                    password: 'password123',
                                    abbreviation: 'SW',
                                    notes: 'Head of Mathematics Department',
                                    role: ['Teacher', 'Department Head']
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'User created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: { $ref: '#/components/schemas/User' },
                                    message: { type: 'string', example: 'User created successfully' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad Request - validation errors or missing required fields',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            examples: {
                                missing_password: {
                                    summary: 'Missing password error',
                                    value: {
                                        success: false,
                                        error: 'Password is required',
                                        message: 'Password is required'
                                    }
                                },
                                validation_error: {
                                    summary: 'Validation errors',
                                    value: {
                                        success: false,
                                        error: 'Validation failed',
                                        message: 'Name and email are required',
                                        details: [
                                            { field: 'name', message: 'Name is required' },
                                            { field: 'email', message: 'Valid email is required' }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                409: {
                    description: 'Conflict - Email already exists',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                error: 'User with this email already exists',
                                message: 'A user with this email address already exists in the system'
                            }
                        }
                    }
                },
                422: {
                    description: 'Unprocessable Entity - Invalid roles',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                error: 'One or more roles do not exist',
                                message: 'The specified roles are not valid'
                            }
                        }
                    }
                },
                500: {
                    description: 'Internal Server Error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    },

    // Combined GET and PUT for /api/users/{userId}
    '/api/users/{userId}': {
        get: {
            summary: 'Get user by ID',
            description: 'Retrieves a specific user by their unique identifier',
            tags: ['Users'],
            // security: [
            //     { bearerAuth: [] }
            // ],
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '123e4567-e89b-12d3-a456-426614174000'
                    },
                    description: 'Unique identifier of the user'
                }
            ],
            responses: {
                200: {
                    description: 'User retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: { $ref: '#/components/schemas/User' },
                                    message: { type: 'string', example: 'User retrieved successfully' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad Request - invalid user ID format',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                            example: {
                                success: false,
                                error: 'User not found',
                                message: 'No user found with the specified ID'
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - authentication required',
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
        },
        put: {
            summary: 'Update an existing user',
            description: 'Updates user information and roles by user ID',
            tags: ['Users'],
            // security: [
            //     { bearerAuth: [] }
            // ],
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '123e4567-e89b-12d3-a456-426614174000'
                    },
                    description: 'Unique identifier of the user to update'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'Full name of the user',
                                    example: 'John Doe Updated'
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    description: 'Email address of the user',
                                    example: 'john.doe.updated@example.com'
                                },
                                password: {
                                    type: 'string',
                                    minLength: 6,
                                    description: 'New password for the user (optional)',
                                    example: 'newSecurePassword123'
                                },
                                phone: {
                                    type: 'string',
                                    description: 'Phone number of the user',
                                    example: '+1234567890'
                                },
                                abbreviation: {
                                    type: 'string',
                                    maxLength: 10,
                                    description: 'Short abbreviation for the user',
                                    example: 'JDU'
                                },
                                notes: {
                                    type: 'string',
                                    description: 'Additional notes about the user',
                                    example: 'Updated notes about the user'
                                },
                                is_active: {
                                    type: 'boolean',
                                    description: 'Whether the user is active',
                                    example: true
                                },
                                role: {
                                    type: 'array',
                                    description: 'Array of role IDs to assign to the user',
                                    items: {
                                        type: 'string',
                                        format: 'uuid'
                                    },
                                    example: ['role-uuid-1', 'role-uuid-2']
                                }
                            }
                        },
                        examples: {
                            update_basic_info: {
                                summary: 'Update basic user information',
                                value: {
                                    name: 'Jane Smith Updated',
                                    email: 'jane.smith.new@school.edu',
                                    phone: '+1234567890',
                                    notes: 'Updated teacher information'
                                }
                            },
                            update_with_roles: {
                                summary: 'Update user with new roles',
                                value: {
                                    name: 'John Admin',
                                    role: ['admin-role-uuid', 'teacher-role-uuid'],
                                    is_active: true
                                }
                            },
                            deactivate_user: {
                                summary: 'Deactivate a user',
                                value: {
                                    is_active: false,
                                    notes: 'User deactivated on request'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'User updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    data: { $ref: '#/components/schemas/User' },
                                    message: { type: 'string', example: 'User updated successfully' }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Bad Request - invalid input or user ID',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                409: {
                    description: 'Conflict - Email already exists',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                422: {
                    description: 'Unprocessable Entity - Invalid roles provided',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized - authentication required',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                403: {
                    description: 'Forbidden - insufficient permissions',
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
        },
        delete: {
            summary: 'Permanently delete user',
            description: 'Permanently removes a user and associated user-role data. Use with caution.',
            tags: ['Users'],
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '123e4567-e89b-12d3-a456-426614174000'
                    },
                    description: 'Unique identifier of the user to delete'
                }
            ],
            responses: {
                200: {
                    description: 'User permanently deleted',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'User permanently deleted'
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Invalid user ID',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: false },
                                    error: { type: 'string', example: 'Invalid user ID' },
                                    message: { type: 'string', example: 'User ID is required' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: false },
                                    error: { type: 'string', example: 'User not found' },
                                    message: { type: 'string', example: 'No user found with the specified ID' }
                                }
                            }
                        }
                    }
                },
                409: {
                    description: 'Cannot delete due to existing references',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: false },
                                    error: { type: 'string', example: 'Cannot delete user' },
                                    message: { type: 'string', example: 'User has associated records. Please deactivate instead.' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    // Toggle user status
    '/api/users/{userId}/toggle-status': {
        patch: {
            summary: 'Toggle user active status',
            description: 'Switches user status between active and inactive',
            tags: ['Users'],
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '123e4567-e89b-12d3-a456-426614174000'
                    },
                    description: 'Unique identifier of the user'
                }
            ],
            responses: {
                200: {
                    description: 'User status toggled successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            user_id: { type: 'string', format: 'uuid' },
                                            name: { type: 'string', example: 'John Doe' },
                                            email: { type: 'string', example: 'john@example.com' },
                                            is_active: { type: 'boolean', example: false },
                                            role: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        role_id: { type: 'string' },
                                                        name: { type: 'string', example: 'Teacher' }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'User deactivated successfully'
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Invalid user ID',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: false },
                                    error: { type: 'string', example: 'Invalid user ID' },
                                    message: { type: 'string', example: 'User ID is required' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: false },
                                    error: { type: 'string', example: 'User not found' },
                                    message: { type: 'string', example: 'No user found with the specified ID' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
