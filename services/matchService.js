import api from './api';

const matchService = {
  async getAllMatches() {
    try {
      const response = await api.get('/Match');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createMatch(matchData) {
    try {
      const response = await api.post('/Match', matchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getMatchById(id) {
    try {
      const response = await api.get(`/Match/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateMatch(id, matchData) {
    try {
      const response = await api.put(`/Match/${id}`, matchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteMatch(id) {
    try {
      const response = await api.delete(`/Match/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getMatchesByStudent(studentId) {
    try {
      const response = await api.get(`/Match/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getMatchesByTutor(tutorId) {
    try {
      const response = await api.get(`/Match/tutor/${tutorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateMatchActivity(id) {
    try {
      const response = await api.patch(`/Match/${id}/activity`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async checkMatchExists(studentId, tutorId) {
    try {
      const response = await api.get(`/Match/check/${studentId}/${tutorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getMatchStatistics() {
    try {
      const response = await api.get('/Match/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default matchService;