import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const message = error.response.data?.message || 'An error occurred';
            
            if (error.response.status === 401) {
                // Clear auth data and redirect to login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
            window.location.href = '/login';
            }
            
            return Promise.reject(new Error(message));
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject(new Error('No response from server'));
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject(new Error('Request failed'));
        }
    }
);
