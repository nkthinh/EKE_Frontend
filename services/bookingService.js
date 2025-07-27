import api from './api';

const bookingService = {
  async getAllBookings() {
    try {
      const response = await api.get('/Booking');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createBooking(bookingData) {
    try {
      const response = await api.post('/Booking', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getBookingById(id) {
    try {
      const response = await api.get(`/Booking/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateBooking(id, bookingData) {
    try {
      const response = await api.put(`/Booking/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteBooking(id) {
    try {
      const response = await api.delete(`/Booking/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getBookingsByStudent(studentId) {
    try {
      const response = await api.get(`/Booking/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getBookingsByTutor(tutorId) {
    try {
      const response = await api.get(`/Booking/tutor/${tutorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getUpcomingBookings(userId, isTutor = false) {
    try {
      const response = await api.get(`/Booking/upcoming/${userId}?isTutor=${isTutor}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getPastBookings(userId, isTutor = false) {
    try {
      const response = await api.get(`/Booking/past/${userId}?isTutor=${isTutor}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateBookingStatus(id, statusData) {
    try {
      const response = await api.patch(`/Booking/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async checkBookingConflict(conflictData) {
    try {
      const response = await api.post('/Booking/check-conflict', conflictData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getTutorSchedule(tutorId, date) {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await api.get(`/Booking/tutor/${tutorId}/schedule${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getPendingBookings() {
    try {
      const response = await api.get('/Booking/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getBookingStatistics() {
    try {
      const response = await api.get('/Booking/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default bookingService;