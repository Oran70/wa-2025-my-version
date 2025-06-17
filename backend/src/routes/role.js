const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', async (req, res) => {
    try {
        const roles = await db.Role.findAll({ order: [['name', 'ASC']] });
        res.json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;