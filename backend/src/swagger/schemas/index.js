const commonSchemas = require('./common');
const parentSchemas = require('./parent');
const userSchemas = require('./user');
const teacherSchemas = require('./teacher');

module.exports = {
    ...commonSchemas,
    ...parentSchemas,
    ...userSchemas,
    ...teacherSchemas
};
