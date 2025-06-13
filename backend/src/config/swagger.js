const swaggerJsDoc = require('swagger-jsdoc');
const schemas = require('../swagger/schemas');
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
                name: 'Appointments',
                description: 'Appointment scheduling and management'
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
            schemas: schemas
        },
        responses: {
            Success: {
                description: 'Successful operation',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ApiResponse' }
                    }
                }
            },
            BadRequest: {
                description: 'Bad Request',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            },
            Unauthorized: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            },
            Forbidden: {
                description: 'Forbidden',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
                    }
                }
            },
            InternalServerError: {
                description: 'Internal Server Error',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ErrorResponse' }
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
            requestInterceptor: (req) => {
                // Add any request interceptors here
                return req;
            }
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
