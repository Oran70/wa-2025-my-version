import api from './api';

class AdminApiService {
    /**
     * Fetches dashboard data.
     * For now, this points to the teacher's dashboard endpoint as requested.
     * The auth token is automatically sent by the api.js interceptor.
     * @returns {Promise<any>} The dashboard data from the API.
     */
    // getDashboardData() {
    //     return api.get('/teacher/dashboard');
    // }

    getDashboardStats() {
        return api.get('/admin/dashboard-stats');
    }

    getUsers() {
        return api.get('/users');
    }

    createUser(userData) {
        return api.post('/users', userData);
    }

    updateUser(userId, userData) {
        return api.put(`/users/${userId}`, userData);
    }

    deleteUser(userId) {
        return api.delete(`/users/${userId}`);
    }

    getClasses() {
        return api.get('/classes');
    }
    createClass(classData) {
        return api.post('/classes', classData);
    }
    updateClass(classId, classData) {
        return api.put(`/classes/${classId}`, classData);
    }
    deleteClass(classId) {
        return api.delete(`/classes/${classId}`);
    }

    getLevels() {
        return api.get('/levels');
    }

    getRoles() {
        return api.get('/roles');
    }

    getStudents(params = {}) {
        // Supports pagination and filtering, e.g., { page: 1, limit: 10, search: 'John' }
        return api.get('/students', { params });
    }

    createStudent(studentData) {
        return api.post('/students', studentData);
    }

    updateStudent(studentId, studentData) {
        return api.put(`/students/${studentId}`, studentData);
    }

    deleteStudent(studentId) {
        return api.delete(`/students/${studentId}`);
    }

}

// Export a singleton instance of the service
const adminApiService = new AdminApiService();
export default adminApiService;