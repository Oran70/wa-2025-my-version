const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true  // Can be null for parent users
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        abbreviation: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        unique_access_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'user',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['email'] },
            { fields: ['unique_access_code'] }
        ],
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password') && user.password) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            }
        }
    });

    // Instance methods
    User.prototype.validatePassword = async function(password) {
        return bcrypt.compare(password, this.password);
    };

    User.prototype.toSafeJSON = function() {
        const { password, ...userWithoutPassword } = this.toJSON();
        return userWithoutPassword;
    };

    User.associate = (models) => {
        User.belongsToMany(models.Class, {
            through: models.TeacherClass,
            foreignKey: 'user_id',
            as: 'classes'
        });
        User.hasMany(models.Availability, {
            foreignKey: 'user_id',
            as: 'availabilities'
        });
        User.hasMany(models.Appointment, {
            foreignKey: 'teacher_id',
            as: 'appointments'
        });
        User.hasMany(models.Log, {
            foreignKey: 'user_id',
            as: 'logs'
        });
        User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: 'user_id',
            as: 'roles'
        });
    };
    return User;
};
