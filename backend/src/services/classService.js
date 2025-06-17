// codebase/backend/src/services/classService.js
const db = require('../models');

class ClassService {
    getAllClasses() {
        return db.Class.findAll({
            include: [{ model: db.Level, as: 'level' }],
            order: [['class_name', 'ASC']]
        });
    }

    async createClass(classData) {
        const { name, level_id, school_year } = classData;
        return db.Class.create({
            class_name: name,
            level_id,
            school_year: school_year || '2024-2025'
        });
    }

    async updateClass(classId, classData) {
        const { name, level_id } = classData;
        const classInstance = await db.Class.findByPk(classId);
        if (!classInstance) {
            throw new Error('Class not found');
        }
        return classInstance.update({ class_name: name, level_id });
    }

    async deleteClass(classId) {
        const classInstance = await db.Class.findByPk(classId);
        if (!classInstance) {
            throw new Error('Class not found');
        }
        return classInstance.destroy();
    }
}

module.exports = new ClassService();