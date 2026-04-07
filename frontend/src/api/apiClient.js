import axios from 'axios';
import useThemeStore from '../store/useThemeStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const unwrapListResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.results)) {
    return payload.results;
  }

  return [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Send current language to the backend
    const { language } = useThemeStore.getState();
    config.headers['Accept-Language'] = language === 'ar' ? 'ar' : 'en';
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Attempt token refresh logic here if needed
      // const refreshToken = localStorage.getItem('refreshToken');
      
      // If refresh fails or not implemented yet, logout
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
