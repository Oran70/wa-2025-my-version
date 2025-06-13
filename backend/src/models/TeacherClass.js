const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TeacherClass = sequelize.define('TeacherClass', {
        teacher_class_id: {
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
        class_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'class',
                key: 'class_id'
            }
        },
        is_primary_mentor: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        school_year: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        tableName: 'teacher_class',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'class_id', 'school_year']
            }
        ]
    });

    TeacherClass.associate = (models) => {
        TeacherClass.belongsTo(models.User, { foreignKey: 'user_id', as: 'teacher' });
        TeacherClass.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
    };

    return TeacherClass;
};
