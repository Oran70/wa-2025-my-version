const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/authentication');
const { teacherValidators } = require('../middleware/teacherValidator');
const { loginLimiter, strictLimiter } = require('../middleware/rateLimiter');

// Public authentication routes (no JWT required)
router.post('/login', loginLimiter, teacherValidators.login, teacherController.login);

// Protected routes (require JWT authentication and teacher role)
router.use(auth.authenticateTeacher); // This combines JWT verification + teacher role check

router.get('/classes', teacherController.getClasses);
router.get('/students', teacherController.getStudents);
router.get('/classes/:classId/students', teacherController.getStudentsByClass);
router.post('/availability', strictLimiter, teacherValidators.createAvailability, teacherController.createAvailability);
router.get('/availability', teacherController.getAvailabilityOverview);
router.delete('/availability', teacherController.deleteAvailability);
router.get('/appointments', teacherController.getTeacherAppointments);
router.put('/appointments/:appointmentId/cancel', teacherValidators.cancelAppointment, teacherController.cancelAppointment);
router.get('/dashboard', teacherController.getDashboard);

module.exports = router;
