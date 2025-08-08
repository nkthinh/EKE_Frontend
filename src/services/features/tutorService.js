import { ApiService } from "../api/apiService";

class TutorService extends ApiService {
  constructor() {
    super("/Tutor");
  }

  // ==================== SWIPE ACTION METHODS ====================

  // Get available tutors for student to swipe
  async getAvailableTutors(studentId, filters = {}) {
    try {
      const params = new URLSearchParams();

      if (studentId) params.append("studentId", studentId);
      if (filters.subject) params.append("subject", filters.subject);
      if (filters.minRating) params.append("minRating", filters.minRating);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.location) params.append("location", filters.location);

      return this.get(`/available?${params.toString()}`);
    } catch (error) {
      console.error("Get available tutors error:", error);
      throw error;
    }
  }

  // Get recommended tutors for student
  async getRecommendedTutors(studentId) {
    try {
      return this.get(`/recommended/${studentId}`);
    } catch (error) {
      console.error("Get recommended tutors error:", error);
      throw error;
    }
  }

  // ==================== BASIC CRUD ====================

  // Basic CRUD
  async getTutors(params = {}) {
    return this.get("/all", params);
  }

  async getTutorById(id) {
    return this.get(`/${id}`);
  }

  async createTutor(tutorData) {
    return this.post("", tutorData);
  }

  async updateTutor(id, tutorData) {
    return this.put(`/${id}`, tutorData);
  }

  async deleteTutor(id) {
    return this.delete(`/${id}`);
  }

  // Search and Discovery
  async searchTutors(searchParams = {}) {
    return this.get("/search", searchParams);
  }

  async getFeaturedTutors(limit = 12) {
    return this.get(`/featured?limit=${limit}`);
  }

  async getNearbyTutors(city, district, page = 1, pageSize = 20) {
    const params = {
      page,
      pageSize,
      ...(city && { city }),
      ...(district && { district }),
    };
    return this.get("/nearby", params);
  }

  async getTutorsBySubject(subjectId, page = 1, pageSize = 20) {
    return this.get(
      `/by-subject/${subjectId}?page=${page}&pageSize=${pageSize}`
    );
  }

  async getTutorRecommendations(studentId, limit = 10) {
    return this.get(`/recommendations/${studentId}?limit=${limit}`);
  }

  // Profile Management
  async getTutorProfile(tutorId) {
    return this.get(`/${tutorId}/profile`);
  }

  async updateTutorProfile(tutorId, profileData) {
    return this.put(`/${tutorId}/profile`, profileData);
  }

  async checkProfileCompletion(tutorId) {
    return this.get(`/${tutorId}/complete-profile`);
  }

  // Availability and Schedule
  async updateAvailability(tutorId, availabilityData) {
    return this.put(`/${tutorId}/availability`, availabilityData);
  }

  async getTutorSchedule(tutorId, startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return this.get(`/${tutorId}/schedule`, params);
  }

  // Reviews and Ratings
  async getTutorReviews(tutorId, page = 1, pageSize = 10) {
    return this.get(`/${tutorId}/reviews?page=${page}&pageSize=${pageSize}`);
  }

  async getTutorStatistics(tutorId) {
    return this.get(`/${tutorId}/statistics`);
  }

  // Verification
  async verifyTutor(tutorId, verificationData) {
    return this.post(`/${tutorId}/verify`, verificationData);
  }

  async updateVerificationStatus(tutorId, statusData) {
    return this.patch(`/${tutorId}/verification-status`, statusData);
  }

  async getPendingVerificationTutors(page = 1, pageSize = 20) {
    return this.get(`/pending-verification?page=${page}&pageSize=${pageSize}`);
  }

  // Additional methods
  async getTutorSubjects(tutorId) {
    return this.get(`/${tutorId}/subjects`);
  }

  async addTutorSubject(tutorId, subjectData) {
    return this.post(`/${tutorId}/subjects`, subjectData);
  }

  async removeTutorSubject(tutorId, subjectId) {
    return this.delete(`/${tutorId}/subjects/${subjectId}`);
  }

  async getTutorEarnings(tutorId, period = "month") {
    return this.get(`/${tutorId}/earnings?period=${period}`);
  }

  async getTutorAnalytics(tutorId) {
    return this.get(`/${tutorId}/analytics`);
  }
}

const tutorService = new TutorService();
export default tutorService;
