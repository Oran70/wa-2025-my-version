import api from './api';

class TeacherApiService {
    /**
     * Fetches the dashboard data for the authenticated teacher.
     * The auth token is automatically sent by the api.js interceptor.
     * @returns {Promise<any>} The dashboard data from the API.
     */
    getDashboard() {
        return api.get('/teacher/dashboard');
    }


    getAppointments(params) {
        // params will be an object like { status: 'scheduled', startDate: '...' }
        return api.get('/teacher/appointments', {params});
    }


    cancelAppointment(appointmentId, reason) {
        return api.put(`/teacher/appointments/${appointmentId}/cancel`, { cancellationReason: reason });
    }


    getClasses() {
        return api.get('/teacher/classes');
    }


    getStudents() {
        return api.get('/teacher/students');
    }

    createAvailability(availabilityData) {
        return api.post('/teacher/availability', availabilityData);
    }
}

// Export a singleton instance of the service
const teacherApiService = new TeacherApiService();
export default teacherApiService;