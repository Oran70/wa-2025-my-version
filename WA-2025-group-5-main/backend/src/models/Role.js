const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Role = sequelize.define('Role', {
        role_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'role',
        timestamps: false
    });

    Role.associate = (models) => {
        Role.belongsToMany(models.User, {
            through: models.UserRole,
            foreignKey: 'role_id',
            as: 'users'
        });
    };
    return Role;
};
