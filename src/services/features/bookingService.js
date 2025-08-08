import { ApiService } from "../api/apiService";

class BookingService extends ApiService {
  constructor() {
    super("/Booking");
  }

  async getBookings(params = {}) {
    return this.get("", params);
  }

  async getBookingById(id) {
    return this.get(`/${id}`);
  }

  async createBooking(bookingData) {
    return this.post("", bookingData);
  }

  async updateBooking(id, bookingData) {
    return this.put(`/${id}`, bookingData);
  }

  async deleteBooking(id) {
    return this.delete(`/${id}`);
  }

  async getBookingsByStudent(studentId) {
    return this.get(`/student/${studentId}`);
  }

  async getBookingsByTutor(tutorId) {
    return this.get(`/tutor/${tutorId}`);
  }

  async getUpcomingBookings(userId, isTutor = false) {
    return this.get(`/upcoming/${userId}?isTutor=${isTutor}`);
  }

  async getPastBookings(userId, isTutor = false) {
    return this.get(`/past/${userId}?isTutor=${isTutor}`);
  }

  async updateBookingStatus(id, statusData) {
    return this.patch(`/${id}/status`, statusData);
  }

  async cancelBooking(id) {
    return this.put(`/${id}/cancel`);
  }

  async confirmBooking(id) {
    return this.put(`/${id}/confirm`);
  }

  async checkBookingConflict(conflictData) {
    return this.post("/check-conflict", conflictData);
  }

  async getTutorSchedule(tutorId, date) {
    const params = date ? { date } : {};
    return this.get(`/tutor/${tutorId}/schedule`, params);
  }

  async getPendingBookings() {
    return this.get("/pending");
  }

  async getBookingStatistics() {
    return this.get("/statistics");
  }

  // Additional methods
  async rescheduleBooking(id, rescheduleData) {
    return this.put(`/${id}/reschedule`, rescheduleData);
  }

  async getBookingHistory(userId, isTutor = false) {
    return this.get(`/history/${userId}?isTutor=${isTutor}`);
  }
}

const bookingService = new BookingService();
export default bookingService;
