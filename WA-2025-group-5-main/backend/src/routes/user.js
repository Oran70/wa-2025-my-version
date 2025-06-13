const express = require('express');
const { authenticate, hasRole } = require('../middleware/authentication');
const userController = require('../controllers/userController');

const router = express.Router();

// Only Admin can access
// Get all users with optional filters
router.get('/',
    // authenticate,
    // hasRole(['Admin', 'Principal']),
    userController.getAllUsers);
router.get('/:userId',
    // authenticate,
    // hasRole(['Admin', 'Principal']),
    userController.getUserById);

// Create a new users  with role

router.post('/',
    // authenticate,
    // hasRole(['Admin', 'Principal']),
    userController.createUser
);

// Update a user by ID
router.put('/:userId',
    // authenticate,
    // hasRole(['Admin', 'Principal']),
    userController.updateUser);

router.delete('/:userId',
    // authenticate,
    // hasRole(['Admin']), // Only admins should be able to permanently delete
    userController.hardDeleteUser);

// Toggle user active status
router.patch('/:userId/toggle-status',
    // authenticate,
    // hasRole(['Admin', 'Principal']),
    userController.toggleUserStatus);


module.exports = router;
