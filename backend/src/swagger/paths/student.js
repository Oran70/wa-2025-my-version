module.exports = {
    '/api/students': {
        get: {
            summary: 'Get all students',
            description: 'Retrieves all students with their associated class and level information',
            tags: ['Students'],
            responses: {
                200: { $ref: '#/components/responses/StudentsRetrieved' },
                400: { $ref: '#/components/responses/BadRequest' },
                401: { $ref: '#/components/responses/Unauthorized' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        },

        post: {
            summary: 'Create a new student',
            description: 'Creates a new student record. Parent access code is automatically generated if not provided.',
            tags: ['Students'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/StudentCreation' }
                    }
                }
            },
            responses: {
                201: { $ref: '#/components/responses/StudentCreated' },
                400: { $ref: '#/components/responses/BadRequest' },
                409: { $ref: '#/components/responses/Conflict' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        },

        delete: {
            summary: 'Delete multiple students',
            description: 'Deletes multiple students by their IDs',
            tags: ['Students'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/StudentGroupDeletion' }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/Success' },
                400: { $ref: '#/components/responses/BadRequest' },
                404: { $ref: '#/components/responses/NotFound' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/students/{studentId}': {
        get: {
            summary: 'Get student by ID',
            description: 'Retrieves a specific student by their ID with class and level information',
            tags: ['Students'],
            parameters: [
                {
                    in: 'path',
                    name: 'studentId',
                    required: true,
                    schema: { $ref: '#/components/schemas/UUID' },
                    description: 'Student\'s unique identifier'
                }
            ],
            responses: {
                200: { $ref: '#/components/responses/Success' },
                400: { $ref: '#/components/responses/BadRequest' },
                404: { $ref: '#/components/responses/NotFound' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        },

        put: {
            summary: 'Update student',
            description: 'Updates an existing student\'s information',
            tags: ['Students'],
            parameters: [
                {
                    in: 'path',
                    name: 'studentId',
                    required: true,
                    schema: { $ref: '#/components/schemas/UUID' },
                    description: 'Student\'s unique identifier'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/StudentUpdate' }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/Success' },
                400: { $ref: '#/components/responses/BadRequest' },
                404: { $ref: '#/components/responses/NotFound' },
                409: { $ref: '#/components/responses/Conflict' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        },

        delete: {
            summary: 'Delete student',
            description: 'Deletes a specific student by their ID',
            tags: ['Students'],
            parameters: [
                {
                    in: 'path',
                    name: 'studentId',
                    required: true,
                    schema: { $ref: '#/components/schemas/UUID' },
                    description: 'Student\'s unique identifier'
                }
            ],
            responses: {
                200: { $ref: '#/components/responses/Success' },
                400: { $ref: '#/components/responses/BadRequest' },
                404: { $ref: '#/components/responses/NotFound' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    },

    '/api/students/bulk': {
        post: {
            summary: 'Create multiple students',
            description: 'Creates multiple students for a specific class in bulk operation',
            tags: ['Students'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/StudentBulkCreation' }
                    }
                }
            },
            responses: {
                200: { $ref: '#/components/responses/Success' },
                400: { $ref: '#/components/responses/BadRequest' },
                404: { $ref: '#/components/responses/NotFound' },
                500: { $ref: '#/components/responses/InternalServerError' }
            }
        }
    }
};
