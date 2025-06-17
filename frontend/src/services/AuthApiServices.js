import api from './api';

class AuthApiService {
    /**
     * Logs in a teacher.
     * @param {string} email - The teacher's email.
     * @param {string} password - The teacher's password.
     * @returns {Promise<any>} The response data from the API, including user and token.
     */
    login(email, password) {
        return api.post('/teacher/login', { email, password });
    }

    // You can add logout, register, etc. functions here later
}

// Export a singleton instance of the service
const authApiService = new AuthApiService();
export default authApiService;