const express = require('express');
const parentController = require('../controllers/parentController');
const { accessCodeLimiter, strictLimiter } = require('../middleware/rateLimiter');

const router = express.Router();
// Rate limiting middleware for appointment creation
router.post('/validate-access-code', accessCodeLimiter, parentController.validateAccessCode );
router.get('/teachers/:teacherId/availability', parentController.getTeacherAvailability);
router.post('/appointments', strictLimiter, parentController.createAppointment);
router.get('/appointments/:appointmentId/confirmation', parentController.getAppointmentConfirmation);
router.put('/appointments/:appointmentId/cancel', parentController.cancelAppointment);
router.get('/dashboard', accessCodeLimiter, parentController.getDashboard);
router.post('/availability-overview', parentController.getAvailabilityOverview);

module.exports = router;
