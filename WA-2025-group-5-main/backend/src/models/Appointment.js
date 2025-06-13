const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Appointment = sequelize.define('Appointment', {
        appointment_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        availability_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'availability',
                key: 'availability_id'
            }
        },
        teacher_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        student_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'student',
                key: 'student_id'
            }
        },
        parent_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        parent_email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        parent_phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Scheduled', 'Cancelled'),
            defaultValue: 'Scheduled'
        },
        cancellation_datetime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        cancelled_by: {
            type: DataTypes.ENUM('Parent', 'Teacher'),
            allowNull: true
        },
        cancellation_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'appointment',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['availability_id'] },
            { fields: ['teacher_id'] },
            { fields: ['student_id'] },
            { fields: ['parent_email'] },
            { fields: ['date'] },
            { fields: ['status'] }
        ],
        validate: {
            startTimeBeforeEndTime() {
                if (this.start_time >= this.end_time) {
                    throw new Error('Start time must be before end time');
                }
            },
            cancellationFields() {
                if (this.status === 'Cancelled') {
                    if (!this.cancelled_by || !this.cancellation_reason) {
                        throw new Error('Cancelled appointments must have cancelled_by and cancellation_reason');
                    }
                }
            }
        }
    });

    // Instance methods
    Appointment.prototype.cancel = function(cancelledBy, reason) {
        this.status = 'Cancelled';
        this.cancelled_by = cancelledBy;
        this.cancellation_reason = reason;
        this.cancellation_datetime = new Date();
        return this.save();
    };

    Appointment.prototype.isCancellable = function() {
        return this.status === 'Scheduled' && new Date(this.date) >= new Date();
    };

    Appointment.associate = (models) => {
        // Teacher relationship (FK to User table)
        Appointment.belongsTo(models.User, {
            foreignKey: 'teacher_id',
            as: 'teacher'
        });

        // Student relationship (FK to Student table)
        Appointment.belongsTo(models.Student, {
            foreignKey: 'student_id',
            as: 'student'
        });

        // Availability relationship
        Appointment.belongsTo(models.Availability, {
            foreignKey: 'availability_id',
            as: 'availability'
        });
    };
    return Appointment;
};
