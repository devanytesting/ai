// Axios API client: base URL, auth token injection, and error handling
import axios from 'axios';

// Create centralized Axios instance used across the app
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your actual API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 by clearing token and redirecting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Convenience wrappers for HTTP methods
export const api = {
  get: (url: string, config?: object) => apiClient.get(url, config),
  post: (url: string, data?: object, config?: object) => apiClient.post(url, data, config),
  put: (url: string, data?: object, config?: object) => apiClient.put(url, data, config),
  patch: (url: string, data?: object, config?: object) => apiClient.patch(url, data, config),
  delete: (url: string, config?: object) => apiClient.delete(url, config),
};

export default apiClient;