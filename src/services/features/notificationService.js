import { api } from "../api";

const notificationService = {
  async createNotification(notificationData) {
    try {
      const response = await api.post("/Notifications", notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getAllNotifications() {
    try {
      const response = await api.get("/Notifications");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createBulkNotifications(bulkData) {
    try {
      const response = await api.post("/Notifications/bulk", bulkData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getUnreadNotifications() {
    try {
      const response = await api.get("/Notifications/unread");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getNotificationById(notificationId) {
    try {
      const response = await api.get(`/Notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/Notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getNotificationsByType(type) {
    try {
      const response = await api.get(`/Notifications/type/${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getNotificationSummary() {
    try {
      const response = await api.get("/Notifications/summary");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getUnreadCount() {
    try {
      const response = await api.get("/Notifications/unread-count");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getRecentNotifications(days = 30) {
    try {
      const response = await api.get(`/Notifications/recent?days=${days}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/Notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async markAllAsRead() {
    try {
      const response = await api.put("/Notifications/mark-all-read");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default notificationService;
