const parentPaths = require('./parent');
const userPaths = require('./user');
const teacherPaths = require('./teacher');
// const studentPaths = require('./student'); // TODO: Uncomment when student service is ready
module.exports = {
    ...parentPaths,
    ...userPaths,
    ...teacherPaths
};
