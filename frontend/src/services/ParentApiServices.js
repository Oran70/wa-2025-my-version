import api from './api';

class ParentApiService {
    /**
     * Validates the parent access code.
     * @param {string} accessCode - The access code provided by the parent.
     * @returns {Promise<any>} The response data from the API.
     */
    validateAccessCode(accessCode) {
        return api.post('/validate-access-code', { accessCode });
    }

    /**
     * Fetches the availability for a specific teacher.
     * @param {string} teacherId - The UUID of the teacher.
     * @returns {Promise<any>} The response data from the API.
     */
    getTeacherAvailability(teacherId) {
        if (!teacherId) {
            return Promise.resolve({ availability: [] }); // Return empty if no teacherId
        }
        return api.get(`/teachers/${teacherId}/availability`);
    }

    /**
     * Creates a new appointment.
     * @param {object} appointmentData - The data for the new appointment.
     * @returns {Promise<any>} The response data from the API.
     */
    createAppointment(appointmentData) {
        return api.post('/appointments', appointmentData);
    }
}

// Export a singleton instance of the service
const parentApiService = new ParentApiService();
export default parentApiService;




//     /**
//      * Gets the confirmation details for a specific appointment.
//      * @param {string} appointmentId - The UUID of the appointment.
//      * @returns {Promise} - The detailed appointment confirmation.
//      */
//     getAppointmentConfirmation(appointmentId) {
//         return api.get(`/parent/appointments/${appointmentId}/confirmation`);
//     }
//
//     /**
//      * Cancels an existing appointment.
//      * @param {string} appointmentId - The UUID of the appointment to cancel.
//      * @param {object} cancellationData - The data required for cancellation (e.g., accessCode, reason).
//      * @returns {Promise} - A confirmation message.
//      */
//     cancelAppointment(appointmentId, cancellationData) {
//         return api.put(`/parent/appointments/${appointmentId}/cancel`, cancellationData);
//     }
//
//     /**
//      * Gets all necessary data for the parent dashboard.
//      * @param {string} accessCode - The parent's access code.
//      * @returns {Promise} - The data for the parent dashboard.
//      */
//     getDashboard(accessCode) {
//         // Note: The backend route might expect a POST or a GET with params.
//         // Based on your controller, it seems to check req.query and req.body.
//         // A POST request is generally better for sending an access code.
//         return api.post('/parent/dashboard', { accessCode });
//     }
// }
//
// // Export a singleton instance of the class.
// export default new ParentApiService();
