module.exports = {
    // Base response schemas
    ApiResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                description: 'Indicates if the request was successful'
            },
            data: {
                type: 'object',
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

    // Basic data types (updated with populate script examples)
    UUID: {
        type: 'string',
        format: 'uuid',
        pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
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
}
