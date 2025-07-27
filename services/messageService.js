import api from './api';

const messageService = {
  async getConversationMessages(conversationId, page = 1, pageSize = 50) {
    try {
      const response = await api.get(`/Messages/conversation/${conversationId}?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getConversationByMatch(matchId) {
    try {
      const response = await api.get(`/Messages/conversation/by-match/${matchId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async sendMessage(messageData) {
    try {
      const response = await api.post('/Messages', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async sendMessageWithFile(formData) {
    try {
      const response = await api.post('/Messages/with-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async markConversationAsRead(conversationId) {
    try {
      const response = await api.put(`/Messages/conversation/${conversationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getUnreadCount() {
    try {
      const response = await api.get('/Messages/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getConversations() {
    try {
      const response = await api.get('/Messages/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`/Messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async searchMessages(conversationId, query, page = 1, pageSize = 20) {
    try {
      const response = await api.get(`/Messages/conversation/${conversationId}/search?query=${query}&page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getMessageStatistics() {
    try {
      const response = await api.get('/Messages/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default messageService;