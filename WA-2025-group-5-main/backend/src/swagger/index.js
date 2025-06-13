const swaggerUi = require('swagger-ui-express');
const { setupSwagger } = require('../config/swagger');

// Export Swagger middleware
module.exports = {
    serve: swaggerUi.serve,
    setup: (app) => setupSwagger(app)
};
