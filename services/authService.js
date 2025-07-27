import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/Auth/login', {
        email,
        password,
      });
      
      const { accessToken, refreshToken, user } = response.data;
      
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async registerAccount(accountData) {
    try {
      const response = await api.post('/Auth/register/account', accountData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async selectRole(roleData) {
    try {
      const response = await api.post('/Auth/register/role', roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async completeProfile(profileData) {
    try {
      const response = await api.post('/Auth/register/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async registerStudent(studentData) {
    try {
      const response = await api.post('/Auth/register/student', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async registerTutor(tutorData) {
    try {
      const response = await api.post('/Auth/register/tutor', tutorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async checkEmail(email) {
    try {
      const response = await api.get(`/Auth/check-email/${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async logout() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/Auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    }
  },

  async getCurrentUser() {
    try {
      const userStr = await AsyncStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  },
};

export default authService;