const StudentService = require('../services/studentService');
const logger = require('../utils/logger');

const studentController = {
    async getAllStudents(req, res) {
        try {
            const students = await StudentService.getAllStudents();
            res.status(200).json(students);
        } catch (error) {
            logger.error('Error fetching students:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async getStudentById(req, res) {
        const studentId = req.params.studentId;
        try {
            const student = await StudentService.getStudentById(studentId);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(student);
        } catch (error) {
            logger.error(`Error fetching student with ID ${studentId}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async createStudent(req, res) {
        try {
            const newStudent = await StudentService.createStudent(req.body);
            res.status(201).json(newStudent);
        } catch (error) {
            logger.error('Error creating student:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async createStudentGroup(req, res) {
        const { students } = req.body;
        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'Invalid student data' });
        }

        try {
            const createdStudents = await StudentService.createStudentGroup(students);
            res.status(201).json(createdStudents);
        } catch (error) {
            logger.error('Error creating student group:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async updateStudent(req, res) {
        const studentId = req.params.studentId;
        try {
            const updatedStudent = await StudentService.updateStudent(studentId, req.body);
            if (!updatedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(200).json(updatedStudent);
        } catch (error) {
            logger.error(`Error updating student with ID ${studentId}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async deleteStudent(req, res) {
        const studentId = req.params.studentId;
        try {
            const deleted = await StudentService.deleteStudent(studentId);
            if (!deleted) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.status(204).send();
        } catch (error) {
            logger.error(`Error deleting student with ID ${studentId}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async deleteStudentGroup(req, res) {
        const { studentIds } = req.body;
        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ message: 'Invalid student IDs' });
        }

        try {
            const deletedCount = await StudentService.deleteStudentGroup(studentIds);
            if (deletedCount === 0) {
                return res.status(404).json({ message: 'No students found for deletion' });
            }
            res.status(204).send();
        } catch (error) {
            logger.error('Error deleting student group:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = studentController;
