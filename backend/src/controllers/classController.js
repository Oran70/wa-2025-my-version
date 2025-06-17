const classService = require('../services/classService');

const classController = {

    getAllClasses: async (req, res) => {
        try {
            const classes = await classService.getAllClasses();
            res.json({success: true, data: classes});
        } catch (error) {
            res.status(500).json({success: false, error: 'Server error'});
        }
    },

    createClass: async (req, res) => {
        try {
            const newClass = await classService.createClass(req.body);
            res.status(201).json({success: true, data: newClass});
        } catch (error) {
            res.status(500).json({success: false, error: 'Failed to create class'});
        }
    },

    updateClass: async (req, res) => {
        try {
            const updatedClass = await classService.updateClass(req.params.classId, req.body);
            res.json({success: true, data: updatedClass});
        } catch (error) {
            res.status(500).json({success: false, error: 'Failed to update class'});
        }
    },

    deleteClass: async (req, res) => {
        try {
            await classService.deleteClass(req.params.classId);
            res.json({success: true, message: 'Class deleted successfully'});
        } catch (error) {
            res.status(500).json({success: false, error: 'Failed to delete class'});
        }
    }
};

module.exports = classController;