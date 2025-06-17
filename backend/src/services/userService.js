const { Op } = require('sequelize');
const db = require('../models');
const logger = require('../utils/logger');

class UserService {
    // Get all users
    async getAllUsers(options = {}) {
        try {
            const {page = 1, limit = 10, search, isActive} = options;
            const offset = (page - 1) * limit;

            // Build where clause
            const whereClause = {};

            if (search) {
                whereClause[Op.or] = [
                    {name: {[Op.iLike]: `%${ search }%`}},
                    {email: {[Op.iLike]: `%${ search }%`}}
                ];
            }

            if (isActive !== undefined) {
                whereClause.is_active = isActive;
            }

            const users = await db.User.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: db.Role,
                        as: 'roles',
                        attributes: ['role_id', 'name', 'description'],
                        through: {attributes: []}
                    },
                    {
                        model: db.Class,
                        as: 'classes',
                        attributes: ['class_id', 'class_name'],
                        through: { attributes: [] },
                        include: [{
                            model: db.Level,
                            as: 'level',
                            attributes: ['name']
                        }]
                    }
                ],
                attributes: {exclude: ['password']}, // Never return passwords
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['created_at', 'DESC']]
            });

            return {
                users: users.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(users.count / limit),
                    totalUsers: users.count,
                    hasNext: page * limit < users.count,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            logger.error('Error in getAllUsers:', error);
            throw error;
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            console.log('UserService.getUserById called with:', userId); // Debug log

            if (!userId) {
                throw new Error('User ID is required');
            }

            const user = await db.User.findByPk(userId, {
                include: [
                    {
                        model: db.Role,
                        as: 'roles',
                        attributes: ['role_id', 'name', 'description'],
                        through: {attributes: []}
                    }
                ],
                attributes: {exclude: ['password']} // Never return passwords
            });

            if (!user) {
                logger.warn(`User with ID ${ userId } not found`);
                throw new Error('User not found');
            }

            logger.info(`Successfully retrieved user ${ userId }`);
            return user;
        } catch (error) {
            logger.error(`Error in getUserById for user ${ userId }:`, error);
            throw error;
        }
    }

    async createUser(userData) {
        const transaction = await db.sequelize.transaction();
        try {
            const {name, email, password, role, abbreviation, notes, roles = [], classId} = userData;
            // Check if email already exists
            const existingUser = await db.User.findOne({where: {email}});
            if (existingUser) {
                logger.warn(`User with email ${email} already exists`);
                throw new Error('User with this email already exists');
            }

            if (!password) {
                throw new Error('Password is required');
            }

            const newUser = await db.User.create({
                name,
                email,
                password,
                is_active: true,
                abbreviation,
                notes
            }, {transaction});

            // Collect all role names to assign
            let rolesToAssign = [];
            if (role) {
                rolesToAssign.push(role);
            }
            if (roles && roles.length > 0) {
                rolesToAssign = [...rolesToAssign, ...roles];
            }
            // Remove duplicates
            rolesToAssign = [...new Set(rolesToAssign)];

            if (rolesToAssign.length > 0) {
                // Find roles by name
                const roleInstances = await db.Role.findAll({
                    where: {
                        name: {
                            [Op.in]: rolesToAssign
                        }
                    },
                    transaction
                });

                // Check if all roles were found
                const foundRoleNames = roleInstances.map(role => role.name);
                const missingRoles = rolesToAssign.filter(roleName => !foundRoleNames.includes(roleName));

                if (missingRoles.length > 0) {
                    throw new Error(`One or more roles do not exist: ${missingRoles.join(', ')}`);
                }

                // Create user-role associations
                const userRoles = roleInstances.map(roleInstance => ({
                    user_id: newUser.user_id,
                    role_id: roleInstance.role_id,
                }));

                for (const userRole of userRoles) {
                    try {
                        await db.UserRole.create(userRole, { transaction });
                    } catch (roleError) {
                        throw new Error(`Failed to assign role: ${roleError.message}`);
                    }
                }
            } else {
                console.log('No roles to assign'); // Debug log
            }

            if (classId) {
                await db.TeacherClass.create({
                    user_id: newUser.user_id,
                    class_id: classId,
                    school_year: '2024-2025',
                    is_primary_mentor: false
                }, { transaction });
                console.log(`Assigned new user ${newUser.user_id} to class ${classId}`);
            }

            // Commit the transaction
            await transaction.commit();

            // Fetch the user with roles (outside the transaction)
            const userWithRoles = await db.User.findByPk(newUser.user_id, {
                include: [
                    {
                        model: db.Role,
                        as: 'roles',
                        attributes: ['role_id', 'name', 'description'],
                        through: {attributes: []}
                    }
                ],
                attributes: {exclude: ['password']}
            });

            if (!userWithRoles) {
                throw new Error('Failed to retrieve created user');
            }

            logger.info(`Successfully created user ${userWithRoles.user_id} with email ${email}`);

            return userWithRoles;

        } catch (error) {
            await transaction.rollback();
            logger.error('Error creating user:', error);
            throw error;
        }
    }
    // Update user
    async updateUser(userId, updateData) {
        const transaction = await db.sequelize.transaction();

        try {
            const {name, email, password, phone, abbreviation, notes, roles, classId, is_active} = updateData;

            // Check if user exists
            const user = await db.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Check email uniqueness if email is being updated
            if (email && email !== user.email) {
                const existingUser = await db.User.findOne({where: {email}});
                if (existingUser) {
                    throw new Error('Email already exists');
                }
            }

            // Prepare update data
            const updateFields = {};
            if (name !== undefined) updateFields.name = name;
            if (email !== undefined) updateFields.email = email;
            if (password !== undefined) updateFields.password = password; // Will be hashed by hook
            if (phone !== undefined) updateFields.phone = phone;
            if (abbreviation !== undefined) updateFields.abbreviation = abbreviation;
            if (notes !== undefined) updateFields.notes = notes;
            if (is_active !== undefined) updateFields.is_active = is_active;

            // Update user
            await user.update(updateFields, {transaction});

            if (roles && Array.isArray(roles)) {
                const roleInstances = await db.Role.findAll({
                    where: { name: { [db.Sequelize.Op.in]: roles } },
                    transaction
                });
                // setRoles is a smart Sequelize function that automatically
                // adds and removes roles as needed in the user_role table.
                await user.setRoles(roleInstances, { transaction });
            }

            if (classId) {
                // First, remove any existing class assignment for this user
                await db.TeacherClass.destroy({ where: { user_id: userId }, transaction });
                // Then, create the new assignment
                await db.TeacherClass.create({
                    user_id: userId,
                    class_id: classId,
                    school_year: '2024-2025'
                }, { transaction });
            }

            await transaction.commit();

            // return updated user with roles
            return await this.getUserById(userId);
        } catch (error) {
            await transaction.rollback();
            logger.error(`Error updating user ${ userId }:`, error);
            throw error;
        }
    }
    // Toggle user active status
    async toggleUserStatus(userId) {
        try {
            const user = await db.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const newStatus = !user.is_active;
            await user.update({ is_active: newStatus });

            const status = newStatus ? 'activated' : 'deactivated';
            logger.info(`User ${userId} ${status}`);

            // Return the updated user with roles
            return await this.getUserById(userId);
        } catch (error) {
            logger.error(`Error toggling user status ${userId}:`, error);
            throw error;
        }
    }

// delete user
    async hardDeleteUser(userId) {
        const transaction = await db.sequelize.transaction();

        try {
            const user = await db.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // I added this block to prevent FK issues.
            // It will delete the user's class assignments from the teacher_class table
            await db.TeacherClass.destroy({
                where: { user_id: userId },
                transaction
            });

            // Delete user-role associations first
            await db.UserRole.destroy({
                where: { user_id: userId },
                transaction
            });

            // Try to delete the user
            await user.destroy({ transaction });
            await transaction.commit();

            logger.info(`User ${userId} permanently deleted`);
            return {
                message: 'User permanently deleted',
                userId: userId
            };
        } catch (error) {
            await transaction.rollback();
            logger.error(`Error hard deleting user ${userId}:`, error);

            // Handle foreign key constraint errors
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new Error('Cannot delete user due to existing references. Some related records still exist.');
            }

            throw error;
        }
    }

    // // Create new teacher user
    // async createUser(req, res, next) {
    //     try {
    //         const { name, email, password } = req.body;
    //
    //         // Create new user
    //         const newUser = await User.create({
    //             name,
    //             email,
    //             password,
    //             is_active: true
    //         });
    //         // Assign Teacher role
    //         const teacherRole = await Role.findOne({ where: { name: 'Teacher' } });
    //         await UserRole.create({
    //             user_id: newUser.user_id,
    //             role_id: teacherRole.role_id
    //         });
    //         logger.info(`Created new teacher user with ID ${newUser.user_id}`);
    //         return res.status(201).json({
    //             success: true,
    //             data: newUser,
    //             message: 'Teacher user created successfully'
    //         });
    //     } catch (error) {
    //         logger.error('Error creating teacher user:', error);
    //         next(error);
    //     }
    // }
    // // Update user
    // async updateUser(req, res, next) {
    //     try {
    //         const { userId } = req.params;
    //         const { name, email, is_active } = req.body;
    //
    //         // Find user
    //         const user = await User.findByPk(userId);
    //
    //         if (!user) {
    //             logger.warn(`User with ID ${userId} not found`);
    //             return res.status(404).json({
    //                 success: false,
    //                 error: 'User not found',
    //                 message: 'The specified user does not exist'
    //             });
    //         }
    //
    //         // Update user details
    //         await user.update({ name, email, is_active });
    //
    //         logger.info(`Updated user with ID ${userId}`);
    //
    //         return res.json({
    //             success: true,
    //             data: user,
    //             message: 'User updated successfully'
    //         });
    //     } catch (error) {
    //         logger.error('Error updating user:', error);
    //         next(error);
    //     }
    // }
    // // Deactivate user
    // async deactivateUser(req, res, next) {
    //     try {
    //         const { userId } = req.params;
    //         // Find user
    //         const user = await User.findByPk(userId);
    //         if (!user) {
    //             logger.warn(`User with ID ${userId} not found`);
    //             return res.status(404).json({
    //                 success: false,
    //                 error: 'User not found',
    //                 message: 'The specified user does not exist'
    //             });
    //         }
    //         // Deactivate user
    //         await user.update({ is_active: false });
    //         logger.info(`Deactivated user with ID ${userId}`);
    //         return res.json({
    //             success: true,
    //             message: 'User deactivated successfully'
    //         });
    //     } catch (error) {
    //         logger.error('Error deactivating user:', error);
    //         next(error);
    //     }
    // }
}

module.exports = new UserService();
