const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Base routes (already /api/students)
router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.delete('/', studentController.deleteStudentGroup);

// Individual student routes
router.get('/:studentId', studentController.getStudentById);
router.put('/:studentId', studentController.updateStudent);
router.delete('/:studentId', studentController.deleteStudent);

// Bulk operations
router.post('/bulk', studentController.createStudentGroup);

module.exports = router;
