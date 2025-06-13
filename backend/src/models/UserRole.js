const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const UserRole = sequelize.define('UserRole', {
        user_role_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        role_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'role',
                key: 'role_id'
            }
        }
    }, {
        tableName: 'user_role',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'role_id']
            }
        ]
    });

    UserRole.associate = (models) => {
        UserRole.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        UserRole.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
    };

    return UserRole;
};
