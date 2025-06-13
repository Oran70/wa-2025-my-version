const { Op } = require('sequelize');
const db = require('../models');
const logger = require('../utils/logger');

const Student = db.Student;
const Class = db.Class;
const Level = db.Level;
/**
 * Service to handle student-related operations.
 */

class StudentService {
    /**
     * Get all students with their associated classes and levels.
     * @returns {Promise<Array>} List of students with class and level details.
     */
    async getAllStudents() {
        try {
            const students = await Student.findAll({
                include: [
                    {
                        model: Class,
                        as: 'class',
                        include: [
                            {
                                model: Level,
                                as: 'level'
                            }
                        ]
                    }
                ]
            });
            return students;
        } catch (error) {
            logger.error('Error fetching students:', error);
            throw error;
        }
    }

    /**
     * Get a student by ID with their associated class and level.
     * @param {string} studentId - The ID of the student to retrieve.
     * @returns {Promise<Object>} The student object with class and level details.
     */
    async getStudentById(studentId) {
        try {
            const student = await Student.findOne({
                where: {student_id: studentId},
                include: [
                    {
                        model: Class,
                        as: 'class',
                        include: [
                            {
                                model: Level,
                                as: 'level'
                            }
                        ]
                    }
                ]
            });
            if (!student) {
                throw new Error('Student not found');
            }
            return student;
        } catch (error) {
            logger.error(`Error fetching student with ID ${ studentId }:`, error);
            throw error;
        }
    }

    /**
     * Create a new student.
     * @param {Object} studentData - The data for the new student.
     * @returns {Promise<Object>} The created student object.
     */
    async createStudent(studentData) {
        try {
            const newStudent = await Student.create(studentData);
            return newStudent;
        } catch (error) {
            logger.error('Error creating student:', error);
            throw error;
        }
    }

    /**
     * Update an existing student.
     * @param {string} studentId - The ID of the student to update.
     * @param {Object} updateData - The data to update the student with.
     * @returns {Promise<Object>} The updated student object.
     */
    async updateStudent(studentId, updateData) {
        try {
            const [updatedRows, [updatedStudent]] = await Student.update(updateData, {
                where: {student_id: studentId},
                returning: true
            });
            if (updatedRows === 0) {
                throw new Error('Student not found or no changes made');
            }
            return updatedStudent;
        } catch (error) {
            logger.error(`Error updating student with ID ${ studentId }:`, error);
            throw error;
        }
    }

    /**
     * Delete a student by ID.
     * @param {string} studentId - The ID of the student to delete.
     * @returns {Promise<void>}
     */
    async deleteStudent(studentId) {
        try {
            const deletedRows = await Student.destroy({
                where: {student_id: studentId}
            });
            if (deletedRows === 0) {
                throw new Error('Student not found');
            }
        } catch (error) {
            logger.error(`Error deleting student with ID ${ studentId }:`, error);
            throw error;
        }
    }

    /**
     * Search for students by name or email.
     * @param {string} query - The search query (class or teacher).
     * @returns {Promise<Array>} List of students matching the search criteria.
     */
    async searchStudents(query) {
        try {
            const students = await Student.findAll({
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: `%${ query }%`}},
                        {email: {[Op.iLike]: `%${ query }%`}}
                    ]
                },
                include: [
                    {
                        model: Class,
                        as: 'class',
                        include: [
                            {
                                model: Level,
                                as: 'level'
                            }
                        ]
                    }
                ]
            });
            return students;
        } catch (error) {
            logger.error('Error searching students:', error);
            throw error;
        }
    }

    /**
     Create a group of students in a class.
     * @param {string} classId - The ID of the class to add students to.
     * @param {Array} studentData - Array of student objects to create.
     * @returns {Promise<Array>} List of created student objects.
     */
    async createStudentGroup(classId, studentData) {
        try {
            const students = await Student.bulkCreate(
                studentData.map(data => ({...data, class_id: classId})),
                {returning: true}
            );
            return students;
        } catch (error) {
            logger.error(`Error creating student group for class ${ classId }:`, error);
            throw error;
        }
    }

    /**
     Delete a group of students by their IDs.
     * @param {Array<string>} studentIds - Array of student IDs to delete.
     * @returns {Promise<void>}
     */
    async deleteStudentGroup(studentIds) {
        try {
            const deletedRows = await Student.destroy({
                where: {
                    student_id: {
                        [Op.in]: studentIds
                    }
                }
            });
            if (deletedRows === 0) {
                throw new Error('No students found to delete');
            }
        } catch (error) {
            logger.error('Error deleting student group:', error);
            throw error;
        }
    }
}
module.exports = new StudentService();
