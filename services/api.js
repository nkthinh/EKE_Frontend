import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://42.113.205.92:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          // const response = await api.post('/Auth/refresh', { refreshToken });
          // const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          await AsyncStorage.setItem('accessToken', "");
          await AsyncStorage.setItem('refreshToken', "");
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // Navigate to login screen
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;