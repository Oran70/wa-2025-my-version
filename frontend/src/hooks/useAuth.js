import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApiService from '../services/AuthApiServices';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApiService.login(email, password);

            if (response.success && response.data?.token) {
                // Store the token and user data from the correct nested location
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                const userRoles = response.data.user.roles || [];
                if (userRoles.includes('Administrator')) {
                    // If they are an admin, navigate to the admin dashboard.
                    navigate('/admin/dashboard');
                } else {
                    // Otherwise, navigate to the teacher dashboard.
                    navigate('/teacher/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};

// Logout hook work in progess...
export const useLogout = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
    };
    return { logout };
};