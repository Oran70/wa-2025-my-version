const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Class = sequelize.define('Class', {
        class_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        class_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        level_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'level',
                key: 'level_id'
            }
        },
        school_year: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName: 'class',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['class_name', 'school_year']
            }
        ]
    });

    Class.associate = (models) => {
        Class.belongsTo(models.Level, { foreignKey: 'level_id', as: 'level' });
        Class.hasMany(models.Student, { foreignKey: 'class_id', as: 'students' });
        Class.belongsToMany(models.User, {
            through: models.TeacherClass,
            foreignKey: 'class_id',
            as: 'teachers'
        });
    };

    return Class;
};
