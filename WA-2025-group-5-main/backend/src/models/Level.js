const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Level = sequelize.define('Level', {
        level_id: {
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
        tableName: 'level',
        timestamps: false
    });

    Level.associate = (models) => {
        Level.hasMany(models.Class, { foreignKey: 'level_id', as: 'classes' });
        Level.hasMany(models.Student, { foreignKey: 'level_id', as: 'students' });
    };
    return Level;
};
