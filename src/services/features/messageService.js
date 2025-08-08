import { ApiService } from "../api/apiService";

class MessageService extends ApiService {
  constructor() {
    super("/messages");
  }

  // Core messaging APIs according to specification
  async sendMessage(messageData) {
    try {
      const response = await this.post("", messageData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getConversationMessages(conversationId) {
    try {
      const response = await this.get(`/conversation/${conversationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getConversationByMatch(matchId) {
    try {
      const response = await this.get(`/conversation/by-match/${matchId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async markConversationAsRead(conversationId) {
    try {
      const response = await this.put(`/conversation/${conversationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllConversations() {
    try {
      const response = await this.get("/conversations");
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async getMessages(params = {}) {
    return this.get("", params);
  }

  async getMessageById(id) {
    return this.get(`/${id}`);
  }

  async markAsRead(id) {
    return this.put(`/${id}/read`);
  }

  async getConversation(conversationId) {
    return this.get(`/conversation/${conversationId}`);
  }

  async deleteMessage(messageId) {
    return this.delete(`/${messageId}`);
  }

  async searchMessages(conversationId, query, page = 1, pageSize = 20) {
    return this.get(
      `/conversation/${conversationId}/search?query=${query}&page=${page}&pageSize=${pageSize}`
    );
  }

  async getMessageStatistics() {
    return this.get("/statistics");
  }

  // Additional methods
  async createConversation(conversationData) {
    return this.post("/conversation", conversationData);
  }

  async leaveConversation(conversationId) {
    return this.put(`/conversation/${conversationId}/leave`);
  }
}

const messageService = new MessageService();
export default messageService;
