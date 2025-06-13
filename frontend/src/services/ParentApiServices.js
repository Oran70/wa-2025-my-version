class ParentApiService {
    constructor(baseURL = 'http://localhost:3000/api/parent') {
        this.baseURL = baseURL;
    }

    async makeRequest(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(`${this.baseURL}${url}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Validate access code
    async validateAccessCode(accessCode) {
        return this.makeRequest('/validate-access-code', {
            method: 'POST',
            body: JSON.stringify({ accessCode }),
        });
    }

    // Get teacher availability
    async getTeacherAvailability(teacherId, startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const queryString = params.toString();
        const url = `/teachers/${teacherId}/availability${queryString ? `?${queryString}` : ''}`;

        return this.makeRequest(url);
    }

    // Create appointment
    async createAppointment(appointmentData) {
        return this.makeRequest('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData),
        });
    }

    // Get appointment confirmation
    async getAppointmentConfirmation(appointmentId) {
        return this.makeRequest(`/appointments/${appointmentId}/confirmation`);
    }

    // Cancel appointment
    async cancelAppointment(appointmentId, accessCode, cancellationReason) {
        return this.makeRequest(`/appointments/${appointmentId}/cancel`, {
            method: 'PUT',
            body: JSON.stringify({ accessCode, cancellationReason }),
        });
    }

    // Get parent dashboard
    async getDashboard(accessCode) {
        return this.makeRequest('/dashboard', {
            method: 'POST',
            body: JSON.stringify({ accessCode }),
        });
    }
}

export default ParentApiService;
