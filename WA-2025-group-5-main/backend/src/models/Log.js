const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Log = sequelize.define('Log', {
        log_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        entity_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        entity_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        details: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        ip_address: {
            type: DataTypes.STRING(50),
            allowNull: true
        }
    }, {
        tableName: 'log',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false // Only created_at, no updated_at
    });

    Log.associate = (models) => {
        Log.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };

    return Log;
};
