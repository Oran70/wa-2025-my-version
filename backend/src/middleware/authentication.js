const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
// List of completely public routes that don't require any authentication
const PUBLIC_ROUTES = [
    '/health',
    '/api-docs',
    '/',
    '/api' // Root API info endpoint
];

// List of parent routes that use access code validation instead of JWT
const PARENT_ACCESS_CODE_ROUTES = [
    '/api/validate-access-code',
    '/api/teachers/',
    '/api/appointments',
    '/api/dashboard'
];

module.exports = {
    verifyToken: (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Authentication token is required'
                });
            }

            const token = authHeader.substring(7); // Remove "Bearer " prefix

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user information to request
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                roles: decoded.roles,
                type: decoded.type
            };

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expired',
                    message: 'Authentication token has expired. Please login again.'
                });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token',
                    message: 'Authentication token is invalid'
                });
            } else {
                logger.error('Error verifying token:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Server error',
                    message: 'Error verifying authentication token'
                });
            }
        }
    },

    // Main authentication middleware
    authenticate: (req, res, next) => {
        // Check if the route is completely public
        const isPublicRoute = PUBLIC_ROUTES.some(route =>
            req.path === route || req.path.startsWith(route)
        );

        if (isPublicRoute) {
            return next();
        }

        // Check if this is a parent route that uses access codes
        const isParentAccessCodeRoute = PARENT_ACCESS_CODE_ROUTES.some(route =>
            req.path === route || req.path.startsWith(route)
        );

        if (isParentAccessCodeRoute) {
            // For parent routes, we don't require JWT authentication
            // Access code validation is handled in the route-specific validation
            return next();
        }

        // For all other routes (teacher/admin), require JWT authentication
        return module.exports.verifyToken(req, res, next);
    },

    // Access code authentication for parent endpoints
    authenticateWithAccessCode: async (req, res, next) => {
        const accessCode = req.body.accessCode || req.query.accessCode;

        if (!accessCode) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Access code is required'
            });
        }

        // TODO: Add access code verification logic
        // This should validate the access code against the database
        // and set req.parent with the parent user information

        next();
    },

    // Generic role-based access control middleware
    hasRole: (allowedRoles) => {
        return (req, res, next) => {
            const { roles, userId } = req.user || {};

            // Check if user has required roles
            if (!roles || !Array.isArray(roles) || !roles.some(role =>
                allowedRoles.includes(role)
            )) {
                logger.warn(`Unauthorized access attempt by user ${userId || 'unknown'} - Required one of roles: ${allowedRoles.join(', ')}`);
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: `Access denied: Required role not found. Must have one of: ${allowedRoles.join(', ')}`
                });
            }

            next();
        };
    },

    // Specific role middleware for backwards compatibility
    requireTeacherRole: (req, res, next) => {
        // First verify the token
        module.exports.verifyToken(req, res, (err) => {
            if (err) return; // verifyToken already sent the response

            const { roles } = req.user || {};

            if (!roles || !Array.isArray(roles) || !roles.some(role =>
                ['Teacher', 'Mentor', 'Admin'].includes(role)
            )) {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'Access denied: Teacher role required'
                });
            }

            next();
        });
    },

    requireAdminRole: (req, res, next) => {
        // First verify the token
        module.exports.verifyToken(req, res, (err) => {
            if (err) return; // verifyToken already sent the response

            const { roles, userId } = req.user || {};

            // From Ensar: Changed value from 'Admin' to 'Administrator to match role in the database'
            if (!roles || !Array.isArray(roles) || !roles.includes('Administrator')) {
                logger.warn(`Unauthorized admin access attempt by user ${userId || 'unknown'}`);
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'Access denied: Admin role required'
                });
            }

            next();
        });
    },

    // Teacher-specific authentication (JWT + Teacher role check)
    authenticateTeacher: (req, res, next) => {
        // First verify the JWT token
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Authentication token is required'
            });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user information to request
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                roles: decoded.roles,
                type: decoded.type
            };

            // Check if user has teacher role
            const { roles } = req.user;
            if (!roles || !Array.isArray(roles) || !roles.some(role =>
                ['Teacher', 'Mentor', 'Admin'].includes(role)
            )) {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'Access denied: Teacher role required'
                });
            }

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expired',
                    message: 'Authentication token has expired. Please login again.'
                });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token',
                    message: 'Authentication token is invalid'
                });
            } else {
                logger.error('Error verifying token:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Server error',
                    message: 'Error verifying authentication token'
                });
            }
        }
    },
};
