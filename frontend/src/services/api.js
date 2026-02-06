import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        // Check if the response is HTML (which usually means the API URL is wrong and we're getting the React app's index.html)
        if (
            response.headers['content-type'] &&
            response.headers['content-type'].includes('text/html') &&
            response.config.url.startsWith(response.config.baseURL)
        ) {
            console.error('Received HTML response for API request. This likely means the API URL is incorrect.');
            return Promise.reject(new Error('Configuration Error: API not reachable (Received HTML). Check VITE_API_BASE_URL.'));
        }
        return response;
    },
    (error) => {
        // If the error response is HTML (e.g. 404 page from frontend server), treat it as a config error
        if (error.response && error.response.headers && error.response.headers['content-type'] && error.response.headers['content-type'].includes('text/html')) {
            console.error('Received HTML error response. API misconfiguration likely.');
            error.message = 'Configuration Error: API not reachable (Received HTML). Check VITE_API_BASE_URL.';
        }
        return Promise.reject(error);
    }
);

export default api;
