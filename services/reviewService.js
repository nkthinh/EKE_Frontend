import api from './api';

const reviewService = {
  async createReview(reviewData) {
    try {
      const response = await api.post('/Reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateReview(reviewId, reviewData) {
    try {
      const response = await api.put(`/Reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteReview(reviewId) {
    try {
      const response = await api.delete(`/Reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getReviewById(reviewId) {
    try {
      const response = await api.get(`/Reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getReviewsByTutor(tutorId) {
    try {
      const response = await api.get(`/Reviews/tutor/${tutorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getMyReviews() {
    try {
      const response = await api.get('/Reviews/my-reviews');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default reviewService;