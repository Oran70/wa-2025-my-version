const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Import core dependencies
const logger = require('./utils/logger');
const db = require('./models');
const swagger = require('../src/swagger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const apiRoutes = require('./routes');

class Server {
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT || 8001;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    initializeMiddlewares() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    imgSrc: ["'self'", "data:", `http://localhost:${this.PORT}`],
                    connectSrc: ["'self'"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                    frameSrc: ["'self'"]
                },
            },
        }));

        // CORS configuration
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // General middleware
        this.app.use(compression());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan('dev')); // HTTP request logger

        // Request logging
        this.app.use((req, res, next) => {
            logger.info(`${req.method} ${req.url}`, {
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            next();
        });

        // Rate limiting
        this.app.use('/api/', apiLimiter);
    }
    initializeRoutes() {
        // Swagger setup
        swagger.setup(this.app);

        // API routes
        this.app.use('/api', apiRoutes);

        // Serve static files
        this.app.use(express.static('public'));
    }

    initializeErrorHandling() {
        // Global error handler
        this.app.use(errorHandler);
    }

    async start() {
        try {
            // Test database connection
            await db.sequelize.authenticate();
            logger.info('Database connection established successfully.');

            // Sync database in development
            if (process.env.NODE_ENV === 'development') {
                await db.sequelize.sync({ alter: true });
                logger.info('Database synchronized successfully.');
            }

            // Start the server
            const server = this.app.listen(this.PORT, () => {
                logger.info(`EduPlan backend server running on port ${this.PORT}`);
                logger.info(`API documentation available at http://localhost:${this.PORT}/api-docs`);
                logger.info(`Health check available at http://localhost:${this.PORT}/health`);
            });

            // Graceful shutdown handler
            const gracefulShutdown = async (signal) => {
                logger.info(`${signal} received. Shutting down gracefully...`);
                server.close(async () => {
                    try {
                        await db.sequelize.close();
                        logger.info('Database connection closed.');
                        logger.info('Process terminated');
                        process.exit(0);
                    } catch (error) {
                        logger.error('Error during shutdown:', error);
                        process.exit(1);
                    }
                });
            };

            // Register shutdown handlers
            process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
            process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        } catch (error) {
            logger.error('Unable to start server:', error);
            process.exit(1);
        }
    }
}

// Immediately start the server
new Server().start();
