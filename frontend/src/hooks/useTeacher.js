import {useState, useEffect, useCallback} from 'react';
import teacherApiService from '../services/TeacherApiServices';

export const useTeacherDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await teacherApiService.getDashboard();
                if (response.success) {
                    setDashboardData(response.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // The empty array means this effect runs once when the component mounts.

    return { dashboardData, loading, error };
};

export const useTeacherAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAppointments = useCallback(async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filters.status && filters.status !== 'all') params.status = filters.status;
            if (filters.startDate) params.startDate = filters.startDate;

            const response = await teacherApiService.getAppointments(params);
            if (response.success) {
                // The API gives us everything we need, so we just set the data directly.
                setAppointments(response.data.appointments || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load appointments.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to allow components to refresh the list after a change (like a cancellation)
    const refreshAppointments = (filters) => {
        fetchAppointments(filters);
    };

    return { appointments, loading, error, fetchAppointments, refreshAppointments };
};

export const useCreateAvailability = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const submitAvailability = useCallback(async (formData) => {
        setLoading(true);
        setError(null);
        setResult(null);

        // This function will loop through each selected date and make an API call
        const promises = formData.dates.map(date => {
            const payload = {
                date: date,
                startTime: formData.timeSlot.start,
                endTime: formData.timeSlot.end,
                slotDuration: formData.appointmentDuration,
                notes: formData.notes
                // The API doesn't use the other form fields like locationType or pause,
                // so we don't send them.
            };
            return teacherApiService.createAvailability(payload);
        });

        try {
            // Wait for all API calls to complete
            const responses = await Promise.allSettled(promises);
            const successfulSubmissions = responses.filter(r => r.status === 'fulfilled').length;
            setResult({ successfulSubmissions, total: formData.dates.length });
        } catch (err) {
            setError('An unexpected error occurred during submission.');
        } finally {
            setLoading(false);
        }
    }, []);

    return { submitAvailability, loading, error, result };
};
