const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Availability = sequelize.define('Availability', {
        availability_id: {
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
        slot_duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 10,
                max: 30
            }
        },
        is_visible: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'availability',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['user_id'] },
            { fields: ['date'] },
            { fields: ['user_id', 'date'] }
        ],
        validate: {
            startTimeBeforeEndTime() {
                if (this.start_time >= this.end_time) {
                    throw new Error('Start time must be before end time');
                }
            }
        }
    });

    // Instance methods
    Availability.prototype.getTotalSlots = function() {
        const startMinutes = this.getTimeInMinutes(this.start_time);
        const endMinutes = this.getTimeInMinutes(this.end_time);
        const totalMinutes = endMinutes - startMinutes;
        return Math.floor(totalMinutes / this.slot_duration);
    };

    Availability.prototype.getTimeInMinutes = function(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };

    Availability.prototype.generateTimeSlots = function() {
        const slots = [];
        const startMinutes = this.getTimeInMinutes(this.start_time);
        const endMinutes = this.getTimeInMinutes(this.end_time);

        for (let minutes = startMinutes; minutes + this.slot_duration <= endMinutes; minutes += this.slot_duration) {
            const startTime = this.formatTime(minutes);
            const endTime = this.formatTime(minutes + this.slot_duration);
            slots.push({ start_time: startTime, end_time: endTime });
        }

        return slots;
    };

    Availability.prototype.formatTime = function(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    // Association with User model and with Appointment model
    Availability.associate = (models) => {
        // Belongs to a teacher/user
        Availability.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'teacher'
        });

        // Has many appointments
        Availability.hasMany(models.Appointment, {
            foreignKey: 'availability_id',
            as: 'appointments'
        });
    };
    return Availability;
};
