const { Op } = require('sequelize');
const db = require('../models');
const logger = require('../utils/logger');

const Student = db.Student;
const Class = db.Class;
const Level = db.Level;




/**
 * Generate a unique parent access code
 * @param {Array} existingCodes - Set of existing codes to avoid duplicates
 * @returns {string} - Unique 10-character access code
 */
function generateAccessCode(existingCodes = new Set()) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        if (!existingCodes.has(code)) {
            existingCodes.add(code);
            return code;
        }
        attempts++;
    }

    throw new Error('Unable to generate unique access code after maximum attempts');
}

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
            // Validate required fields
            const { name, student_number, class_id, level_id } = studentData;

            if (!name || !student_number || !class_id || !level_id) {
                throw new Error('Missing required fields: name, student_number, class_id, level_id');
            }
            const existingStudents = await Student.findAll({
                attributes: ['parent_access_code']
            });
            const existingCodes = new Set(existingStudents.map(s => s.parent_access_code));

            const accessCode = generateAccessCode(existingCodes);

            const newStudent = await Student.create({
                name,
                student_number,
                class_id,
                level_id,
                parent_access_code: accessCode
            });

            // Return student with related data
            return await Student.findByPk(newStudent.student_id, {
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
     Create a group of students in a class.
     * @param {string} classId - The ID of the class to add students to.
     * @param {Array} studentData - Array of student objects to create.
     * @returns {Promise<Array>} List of created student objects.
     */
    /**
     * Create a group of students.
     * @param {Array} studentData - Array of student objects to create.
     * @returns {Promise<Array>} List of created student objects.
     */
    async createStudentGroup(studentData) {
        const transaction = await Student.sequelize.transaction();

        try {
            // Validate all students first
            const validatedStudents = [];

            for (const data of studentData) {
                const { name, student_number, class_id, level_id } = data;

                if (!name || !student_number || !class_id || !level_id) {
                    throw new Error(`Missing required fields for student: ${JSON.stringify(data)}`);
                }

                validatedStudents.push({
                    name,
                    student_number,
                    class_id,
                    level_id
                });
            }

            // Check for duplicate student numbers in the batch
            const studentNumbers = validatedStudents.map(s => s.student_number);
            const duplicates = studentNumbers.filter((num, index) => studentNumbers.indexOf(num) !== index);

            if (duplicates.length > 0) {
                throw new Error(`Duplicate student numbers in batch: ${duplicates.join(', ')}`);
            }

            // Check if any student numbers already exist in database
            const existingStudents = await Student.findAll({
                where: {
                    student_number: studentNumbers
                },
                attributes: ['student_number'],
                transaction
            });

            if (existingStudents.length > 0) {
                const existingNumbers = existingStudents.map(s => s.student_number);
                throw new Error(`Students with these numbers already exist: ${existingNumbers.join(', ')}`);
            }

            // PRE-GENERATE unique access codes for all students
            const existingCodes = new Set();

            // Get all existing access codes from database
            const existing = await Student.findAll({
                attributes: ['parent_access_code'],
                transaction
            });
            existing.forEach(s => existingCodes.add(s.parent_access_code));

            // Generate unique codes for each student BEFORE bulk creation
            for (const student of validatedStudents) {
                let isUnique = false;
                let attempts = 0;
                const maxAttempts = 100;

                while (!isUnique && attempts < maxAttempts) {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    let code = '';
                    for (let i = 0; i < 10; i++) {
                        code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }

                    if (!existingCodes.has(code)) {
                        student.parent_access_code = code;
                        existingCodes.add(code); // Add to local set to avoid duplicates in this batch
                        isUnique = true;
                    }

                    attempts++;
                }

                if (!isUnique) {
                    throw new Error(`Unable to generate unique parent access code for student ${student.name} after maximum attempts`);
                }
            }

            // Now all students have unique access codes, create them
            const createdStudents = await Student.bulkCreate(validatedStudents, {
                transaction,
                returning: true
            });

            await transaction.commit();

            // Return students with related data
            const studentIds = createdStudents.map(s => s.student_id);
            return await Student.findAll({
                where: {
                    student_id: {
                        [Op.in]: studentIds
                    }
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

        } catch (error) {
            await transaction.rollback();
            logger.error('Error creating student group:', error);
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
