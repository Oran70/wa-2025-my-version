const UserService = require('../services/userService');
const logger = require('../utils/logger');

const userController = {
    // get all users with optional filters
    getAllUsers: async (req, res, next) => {
        try {
            const { page, limit, search, role, isActive } = req.query;

            const options = {
                page: page || 1,
                limit: limit || 10,
                search,
                role,
                isActive: isActive !== undefined ? isActive === 'true' : undefined
            };

            const result = await UserService.getAllUsers(options);

            logger.info(`Retrieved ${result.users.length} users (page ${options.page})`);

            return res.status(200).json({
                success: true,
                data: result.users,
                pagination: result.pagination,
                message: `Found ${result.pagination.totalUsers} users`
            });
        } catch (error) {
            logger.error('Error fetching users:', error);
            next(error);
        }
    },
    // get user by ID
    getUserById: async (req, res, next) => {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid user ID',
                    message: 'User ID is required'
                });
            }


            const user = await UserService.getUserById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID ${userId}`
                });
            }

            logger.info(`Retrieved user with ID ${user.user_id}`);

            return res.status(200).json({
                success: true,
                data: user,
                message: 'User retrieved successfully'
            });
        } catch (error) {
            logger.error('Error fetching user by ID:', error);
            next(error);
        }
    },

    // create a new user
    createUser: async (req, res, next) => {
        try {
            const { name, email, password, phone, abbreviation, notes, roles } = req.body;

            // Validate required fields
            if (!name || !email) {
                return res.status(400).json({
                    success: false,
                    error: 'Name and email are required'
                });
            }

            // Validate authentication method
            if (!password) {
                return res.status(400).json({
                    success: false,
                    error: 'Either password or unique access code is required'
                });
            }

            const userData = {
                name,
                email,
                password,
                phone,
                abbreviation,
                notes,
                roles: roles || [],

            };

            const newUser = await UserService.createUser(userData);

            logger.info(`Created new user with ID ${newUser.user_id}`);

            return res.status(201).json({
                success: true,
                data: newUser,
                message: 'User created successfully'
            });
        } catch (error) {
            if (error.message === 'Email already exists') {
                return res.status(409).json({
                    success: false,
                    error: 'Email already exists'
                });
            }
            logger.error('Error creating user:', error);
            next(error);
        }
    },
    // update user by ID
    updateUser: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { name, email, password, phone, abbreviation, notes, is_active, roles } = req.body;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid user ID',
                    message: 'User ID is required'
                });
            }
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (email !== undefined) updateData.email = email;
            if (password !== undefined) updateData.password = password;
            if (phone !== undefined) updateData.phone = phone;
            if (abbreviation !== undefined) updateData.abbreviation = abbreviation;
            if (notes !== undefined) updateData.notes = notes;
            if (is_active !== undefined) updateData.is_active = is_active;
            if (roles !== undefined) updateData.roles = roles;

            const updatedUser = await UserService.updateUser(userId, updateData);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID ${userId}`
                });
            }

            logger.info(`Updated user with ID ${updatedUser.user_id}`);

            return res.status(200).json({
                success: true,
                data: updatedUser,
                message: 'User updated successfully'
            });
        } catch (error) {
            logger.error('Error updating user:', error);
            next(error);
        }
    },

    toggleUserStatus: async (req, res, next) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid user ID',
                    message: 'User ID is required'
                });
            }

            const updatedUser = await UserService.toggleUserStatus(userId);
            const status = updatedUser.is_active ? 'activated' : 'deactivated';

            logger.info(`User ${userId} ${status}`);

            return res.status(200).json({
                success: true,
                data: updatedUser,
                message: `User ${status} successfully`
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID ${req.params.userId}`
                });
            }

            logger.error('Error toggling user status:', error);
            next(error);
        }
    },

    hardDeleteUser: async (req, res, next) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid user ID',
                    message: 'User ID is required'
                });
            }

            const result = await UserService.hardDeleteUser(userId);

            logger.info(`Hard deleted user ${userId}`);

            return res.status(200).json({
                success: true,
                message: result.message || 'User permanently deleted'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    error: 'User not found',
                    message: `No user found with ID ${req.params.userId}`
                });
            }

            if (error.message.includes('Cannot delete user due to existing references')) {
                return res.status(409).json({
                    success: false,
                    error: 'Cannot delete user',
                    message: 'User has associated records. Please deactivate instead or contact administrator.'
                });
            }

            logger.error('Error hard deleting user:', error);
            next(error);
        }
    },
}
module.exports = userController;
