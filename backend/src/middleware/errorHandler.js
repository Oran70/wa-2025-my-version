const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });

    // Database connection errors
    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            success: false,
            error: 'Database connection failed',
            message: 'Service temporarily unavailable'
        });
    }

    // PostgreSQL errors
    if (err.code && err.code.startsWith('P0')) {
        return res.status(400).json({
            success: false,
            error: 'Database operation failed',
            message: 'Invalid request parameters'
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            message: err.message
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : err.message
    });
};

module.exports = errorHandler;
