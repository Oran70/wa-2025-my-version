const parentPaths = require('./parent');
const userPaths = require('./user');
const teacherPaths = require('./teacher');
const studentPaths = require('./student');
module.exports = {
    ...parentPaths,
    ...userPaths,
    ...teacherPaths,
    ...studentPaths
};
