const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdminRole } = require('../middleware/authentication');

// All routes in this file will first be checked for an Admin role
router.use(requireAdminRole);

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;