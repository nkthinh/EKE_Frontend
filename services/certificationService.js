import api from './api';

const certificationService = {
  async getTutorCertifications(tutorId) {
    try {
      const response = await api.get(`/tutors/${tutorId}/certifications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async addCertification(tutorId, formData) {
    try {
      const response = await api.post(`/tutors/${tutorId}/certifications`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateCertification(tutorId, certificationId, formData) {
    try {
      const response = await api.put(`/tutors/${tutorId}/certifications/${certificationId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteCertification(tutorId, certificationId) {
    try {
      const response = await api.delete(`/tutors/${tutorId}/certifications/${certificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async verifyCertification(tutorId, certificationId) {
    try {
      const response = await api.post(`/tutors/${tutorId}/certifications/${certificationId}/verify`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default certificationService;