const rateLimit = require('express-rate-limit');

const createRateLimiter = (options) => {
    return rateLimit({
        standardHeaders: true,
        legacyHeaders: false,
        ...options
    });
};
// Rate limiters for different routes
const apiLimiter = createRateLimiter({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
        success: false,
        error: 'Too many requests',
        message: 'Too many requests from this IP, please try again later.'
    }
});

const strictLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: 'Too many appointment requests',
        message: 'Too many appointment creation attempts. Please wait before trying again.'
    }
});

const accessCodeLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: 'Too many validation attempts',
        message: 'Too many access code validation attempts. Please wait before trying again.'
    }
});

const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: 'Too many login attempts',
        message: 'Too many login attempts. Please wait 15 minutes before trying again.'
    }
});

module.exports = {
    apiLimiter,
    strictLimiter,
    accessCodeLimiter,
    loginLimiter
};
