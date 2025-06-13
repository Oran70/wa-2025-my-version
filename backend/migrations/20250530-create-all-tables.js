'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Enable UUID extension
        await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        await queryInterface.createTable('role', {
            role_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.createTable('user', {
            user_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            abbreviation: {
                type: Sequelize.STRING(10),
                allowNull: true
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Create user_role table
        await queryInterface.createTable('user_role', {
            user_role_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'user_id'
                },
                onDelete: 'CASCADE'
            },
            role_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'role',
                    key: 'role_id'
                },
                onDelete: 'CASCADE'
            }
        });

        try {
            await queryInterface.addConstraint('user_role', {
                fields: ['user_id', 'role_id'],
                type: 'unique',
                name: 'user_role_unique'
            });
        } catch (error)
        {
            // Constraint might already exist, ignore the error
            console.log('Constraint user_role_unique already exists, skipping...');
        }

        // Create level table
        await queryInterface.createTable('level', {
            level_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        });

        await queryInterface.createTable('class', {
            class_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            class_name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            level_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'level',
                    key: 'level_id'
                },
                onDelete: 'RESTRICT'
            },
            school_year: {
                type: Sequelize.STRING(20),
                allowNull: false
            }
        });

        // Add unique constraint for class (only if it doesn't exist)
        try {
            await queryInterface.addConstraint('class', {
                fields: ['class_name', 'school_year'],
                type: 'unique',
                name: 'class_name_year_unique'
            });
        } catch (error)
        {
            // Constraint might already exist, ignore the error
            console.log('Constraint class_name_year_unique already exists, skipping...');
        }

        await queryInterface.createTable('student', {
            student_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            student_number: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            level_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'level',
                    key: 'level_id'
                },
                onDelete: 'RESTRICT'
            },
            class_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'class',
                    key: 'class_id'
                },
                onDelete: 'RESTRICT'
            },
            parent_access_code: {
                type: Sequelize.STRING(10),
                allowNull: false,
                unique: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('teacher_class', {
            teacher_class_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'user_id'
                },
                onDelete: 'CASCADE'
            },
            class_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'class',
                    key: 'class_id'
                },
                onDelete: 'CASCADE'
            },
            is_primary_mentor: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            school_year: {
                type: Sequelize.STRING(20),
                allowNull: false
            }
        });

        // Add unique constraint for teacher_class (only if it doesn't exist)
        try {
            await queryInterface.addConstraint('teacher_class', {
                fields: ['user_id', 'class_id', 'school_year'],
                type: 'unique',
                name: 'teacher_class_unique'
            });
        } catch (error) {
            // Constraint might already exist, ignore the error
            console.log('Constraint teacher_class_unique already exists, skipping...');
        }

        await queryInterface.createTable('availability', {
            availability_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'user_id'
                },
                onDelete: 'CASCADE'
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            start_time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            end_time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            slot_duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 10,
                    max: 30
                }
            },
            is_visible: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('appointment', {
            appointment_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            availability_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'availability',
                    key: 'availability_id'
                },
                onDelete: 'RESTRICT'
            },
            teacher_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'user',
                    key: 'user_id'
                },
                onDelete: 'RESTRICT'
            },
            student_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'student',
                    key: 'student_id'
                },
                onDelete: 'RESTRICT'
            },
            parent_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            parent_email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            parent_phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            start_time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            end_time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('Scheduled', 'Cancelled'),
                defaultValue: 'Scheduled'
            },
            cancellation_datetime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            cancelled_by: {
                type: Sequelize.ENUM('Parent', 'Teacher'),
                allowNull: true
            },
            cancellation_reason: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        await queryInterface.createTable('log', {
            log_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal('uuid_generate_v4()'),
                primaryKey: true
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'user',
                    key: 'user_id'
                },
                onDelete: 'SET NULL'
            },
            action: {
                type: Sequelize.STRING,
                allowNull: false
            },
            entity_type: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            entity_id: {
                type: Sequelize.UUID,
                allowNull: true
            },
            details: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            ip_address: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    }
};
