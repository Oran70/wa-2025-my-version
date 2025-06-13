const express = require('express');
const studentController = require('../controllers/studentController');


const router = express.Router();
// TODO: This paths should only be accessible by the admin user
router.get('/',studentController.getAllStudents);
router.get('/students/:studentId', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:studentId', studentController.updateStudent);
router.delete('/:studentId', studentController.deleteStudent);
router.delete('/', studentController.deleteStudentGroup);

module.exports = router;
