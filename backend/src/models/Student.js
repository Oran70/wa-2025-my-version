const { DataTypes } = require('sequelize');
const generateUniqueAccessCode = require("../hooks/GenerateUniqueAccessCodeHook");

module.exports = (sequelize) => {
    const Student = sequelize.define('Student', {
        student_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        student_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
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
        class_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'class',
                key: 'class_id'
            }
        },
        parent_access_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        }
    }, {
        tableName: 'student',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['student_number'] },
            { fields: ['parent_access_code'] },
            { fields: ['class_id'] },
            { fields: ['level_id'] }
        ],
        hooks: {
            beforeCreate: async (student) => {
                if (!student.parent_access_code) {
                    student.parent_access_code = await generateUniqueAccessCode(Student);
                }
            }
        }
    });
    Student.associate = (models) => {
        Student.belongsTo(models.Level, { foreignKey: 'level_id', as: 'level' });
        Student.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
    };
    return Student;
};
