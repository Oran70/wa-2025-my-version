const { Op } = require('sequelize');
const db = require('../models');

class AdminService {
    async getDashboardStats() {
        // Get total counts
        const totalUsers = await db.User.count({ where: { is_active: true } });
        const totalClasses = await db.Class.count();
        const totalAppointments = await db.Appointment.count();

        // Get appointments for today
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));

        const appointmentsToday = await db.Appointment.count({
            where: {
                date: {
                    [Op.between]: [startOfToday, endOfToday]
                },
                status: 'Scheduled'
            }
        });

        // Get the 5 most recent log entries
        const recentActivity = await db.Log.findAll({
            order: [['created_at', 'DESC']],
            limit: 5,
            include: [{ model: db.User, as: 'user', attributes: ['name'] }]
        });

        return {
            totalUsers,
            totalClasses,
            totalAppointments,
            appointmentsToday,
            recentActivity
        };
    }
}

module.exports = new AdminService();