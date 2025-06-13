const express = require('express');
const userRoutes = require('./user');
const parentRoutes = require('./parent');
const studentRoutes = require('./student');
const teacherRoutes = require('./teacher');

const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Mount parent routes at ROOT level, not at /parent
router.use('/api',apiLimiter); // Apply rate limiting to all API routes
router.use('/', parentRoutes);

router.use('/users', userRoutes);
router.use('/student', studentRoutes);
router.use('/teacher', teacherRoutes);

// API version and info endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'School Teacher Management API',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            users: '/api/users',
            validateAccessCode: '/api/validate-access-code',
            teacherAvailability: '/api/teachers/{teacherId}/availability',
            appointments: '/api/appointments',
            dashboard: '/api/dashboard'
        },
        status: 'active'
    });
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
        },
        environment: process.env.NODE_ENV || 'development'
    });
});

// TODO: Remove when documentation is ready
// Debug route to list all registered endpoints - MOVED BEFORE 404 HANDLER
router.get('/debug/routes', (req, res) => {
    const routes = [];

    // Function to extract routes from a router
    function extractRoutes(stack, basePath = '') {
        stack.forEach(layer => {
            if (layer.route) {
                const methods = Object.keys(layer.route.methods);
                routes.push({
                    path: basePath + layer.route.path,
                    methods: methods.join(', ').toUpperCase()
                });
            } else if (layer.name === 'router' && layer.handle.stack) {
                // Better path detection
                let path = '';
                if (layer.regexp.source.includes('users')) path = '/users';
                else if (layer.regexp.source.includes('parent')) path = '/parent';

                extractRoutes(layer.handle.stack, basePath + path);
            }
        });
    }

    extractRoutes(router.stack);

    res.json({
        totalRoutes: routes.length,
        routes: routes.sort((a, b) => a.path.localeCompare(b.path))
    });
});


// 404 handlers for unknown API routes - MUST BE LAST
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `API endpoint ${req.originalUrl} not found`
    });
});

module.exports = router;
