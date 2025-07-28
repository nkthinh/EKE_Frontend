import api from './api';

const tutorService = {
  // Search and Discovery
  async searchTutors(searchParams = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== undefined && searchParams[key] !== null) {
          params.append(key, searchParams[key]);
        }
      });
      
      const response = await api.get(`/Tutor/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getFeaturedTutors(limit = 12) {
    try {
      const response = await api.get(`/Tutor/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getNearbyTutors(city, district, page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page,
        pageSize,
        ...(city && { city }),
        ...(district && { district })
      });
      const response = await api.get(`/Tutor/nearby?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getTutorsBySubject(subjectId, page = 1, pageSize = 20) {
    try {
      const response = await api.get(`/Tutor/by-subject/${subjectId}?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getTutorRecommendations(studentId, limit = 10) {
    try {
      const response = await api.get(`/Tutor/recommendations/${studentId}?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Profile Management
  async getTutorProfile(tutorId) {
    try {
      const response = await api.get(`/Tutor/${tutorId}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateTutorProfile(tutorId, profileData) {
    try {
      const response = await api.put(`/Tutor/${tutorId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async checkProfileCompletion(tutorId) {
    try {
      const response = await api.get(`/Tutor/${tutorId}/complete-profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Availability and Schedule
  async updateAvailability(tutorId, availabilityData) {
    try {
      const response = await api.put(`/Tutor/${tutorId}/availability`, availabilityData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getTutorSchedule(tutorId, startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/Tutor/${tutorId}/schedule?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reviews and Ratings
  async getTutorReviews(tutorId, page = 1, pageSize = 10) {
    try {
      const response = await api.get(`/Tutor/${tutorId}/reviews?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getTutorStatistics(tutorId) {
    try {
      const response = await api.get(`/Tutor/${tutorId}/statistics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verification
  async verifyTutor(tutorId, verificationData) {
    try {
      const response = await api.post(`/Tutor/${tutorId}/verify`, verificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateVerificationStatus(tutorId, statusData) {
    try {
      const response = await api.patch(`/Tutor/${tutorId}/verification-status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getPendingVerificationTutors(page = 1, pageSize = 20) {
    try {
      const response = await api.get(`/Tutor/pending-verification?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default tutorService;