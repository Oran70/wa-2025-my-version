const { Sequelize } = require('sequelize');
const config = require('../../config/config.js')[process.env.NODE_ENV || 'development'];

const db = {};

// Initialize Sequelize
const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(config.database, config.username, config.password, config);

// Manually import all models
db.Appointment = require('./Appointment')(sequelize);
db.Availability = require('./Availability')(sequelize);
db.Class = require('./Class')(sequelize);
db.Level = require('./Level')(sequelize);
db.Log = require('./Log')(sequelize);
db.Role = require('./Role')(sequelize);
db.Student = require('./Student')(sequelize);
db.TeacherClass = require('./TeacherClass')(sequelize);
db.User = require('./User')(sequelize);
db.UserRole = require('./UserRole')(sequelize);

// Debug log to verify all models are loaded
console.log('Loaded models:', Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize'));

// Set up associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        console.log(`Setting up associations for ${modelName}`); // Debug log
        db[modelName].associate(db);
    }
});

// Debug log to verify associations
console.log('Models with associations set up:',
    Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize' && db[key].associate)
);

// Add sequelize instances
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
