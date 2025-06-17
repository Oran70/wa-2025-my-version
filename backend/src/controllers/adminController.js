const adminService = require('../services/adminService');
const logger = require('../utils/logger');

const adminController = {
    getDashboardStats: async (req, res) => {
        try {
            const stats = await adminService.getDashboardStats();
            res.json({
                success: true,
                data: stats,
                message: "Dashboard statistics retrieved successfully"
            });
        } catch (error) {
            logger.error('Error fetching admin dashboard stats:', error);
            res.status(500).json({ success: false, error: 'Server error retrieving dashboard stats' });
        }
    }
};

module.exports = adminController;