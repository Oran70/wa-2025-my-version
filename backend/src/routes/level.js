const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /api/levels
router.get('/', async (req, res) => {
    try {
        const levels = await db.Level.findAll({ order: [['name', 'ASC']] });
        res.json({ success: true, data: levels });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;