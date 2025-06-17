import { useState, useCallback, useEffect } from 'react';
// Correctly import the singleton instance of our service
import parentApiService from '../services/ParentApiServices';

/**
 * Custom hook for handling the logic of validating a parent's access code.
 * It encapsulates the loading, error, and data states.
 */
export const useAccessCodeValidation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationData, setValidationData] = useState(null);

    const validateAccessCode = useCallback(async (accessCode) => {
        if (!accessCode || accessCode.trim() === '') {
            const err = 'Access code is required';
            setError(err);
            return Promise.reject(new Error(err));
        }

        setLoading(true);
        setError(null);
        setValidationData(null);

        try {
            // Our service call already returns the data or throws an error thanks to the api.js interceptor.
            const data = await parentApiService.validateAccessCode(accessCode);
            setValidationData(data);
            return data; // Return the data on success
        } catch (error) {
            setError(error.message);
            setValidationData(null);
            return Promise.reject(error); // Propagate the error
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to reset the state of the hook
    const reset = useCallback(() => {
        setError(null);
        setValidationData(null);
        setLoading(false);
    }, []);

    return {
        loading,
        error,
        validationData,
        validateAccessCode,
        reset
    };
};

/**
 * Custom hook for fetching teacher availability.
 */
export const useTeacherAvailability = (teacherId) => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!teacherId) return;

        const fetchAvailability = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await parentApiService.getTeacherAvailability(teacherId);
                // The actual availability array is nested in data.availability
                setAvailability(data.data.availability || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [teacherId]);

    return { availability, loading, error };
};


/**
 * Custom hook for creating a new appointment.
 */
export const useCreateAppointment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [appointment, setAppointment] = useState(null);

    const createAppointment = useCallback(async (appointmentData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await parentApiService.createAppointment(appointmentData);
            setAppointment(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createAppointment, loading, error, appointment };
};