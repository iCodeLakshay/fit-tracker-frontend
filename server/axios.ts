import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', // Using environment variable with fallback
    withCredentials: true,
});

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Add token to Authorization header if it exists
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Redirect to login if 401 Unauthorized
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;