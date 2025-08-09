import { ApiService } from "../api/apiService";

class MessageService extends ApiService {
  constructor() {
    super("");
  }

  // ==================== CONVERSATION MANAGEMENT ====================

  // Create conversation when tutor accepts student
  // Using the correct API endpoint: GET /Conversations/match/{matchId}
  async createConversationFromMatch(matchData) {
    try {
      console.log("🔍 Creating conversation from match:", matchData);

      // Extract matchId from the data
      const { matchId } = matchData;

      if (!matchId) {
        throw new Error("matchId is required for conversation creation");
      }

      // Use the correct API endpoint: GET /Conversations/match/{matchId}
      const response = await this.get(`/Conversations/match/${matchId}`);

      console.log("📥 Conversation created successfully:", response);

      // Extract conversation ID from response and get conversation details
      if (response && response.data && response.data.id) {
        const conversationId = response.data.id;
        console.log("🔍 Getting conversation details for ID:", conversationId);

        // Get conversation details using /Conversations/{conversationId}
        const conversationDetails = await this.getConversationById(
          conversationId
        );
        console.log("📥 Conversation details loaded:", conversationDetails);

        return {
          ...response,
          conversationDetails: conversationDetails,
        };
      }

      return response;
    } catch (error) {
      console.error("❌ Create conversation error:", error);

      // Try alternative endpoints if the main one fails
      try {
        console.log("⚠️ Trying alternative endpoint...");
        const response = await this.get(`/Conversations/${matchData.matchId}`);
        console.log(
          "📥 Conversation created with alternative endpoint:",
          response
        );
        return response;
      } catch (error2) {
        console.error("❌ Alternative endpoint also failed:", error2);
        throw error;
      }
    }
  }

  // Get conversations by user ID (GET api/Conversations/user/{userid})
  async getConversationsByUserId(userId) {
    try {
      console.log("🔍 === GET CONVERSATIONS BY USER ID API CALL ===");
      console.log("📋 userId:", userId);
      console.log("📋 userId type:", typeof userId);

      if (!userId) {
        throw new Error("userId is required for getting conversations");
      }

      const endpoint = `/Conversations/user/${userId}`;
      console.log("🌐 API Endpoint:", endpoint);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Request Parameters: None (GET request)");

      const response = await this.get(endpoint);

      console.log("📥 === CONVERSATIONS BY USER API RESPONSE ===");
      console.log("📥 Response Data:", JSON.stringify(response, null, 2));
      console.log("✅ === GET CONVERSATIONS BY USER SUCCESS ===");

      return response;
    } catch (error) {
      console.error("❌ === GET CONVERSATIONS BY USER ERROR ===");
      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error Status Text:", error.response?.statusText);
      console.error("❌ Error Data:", error.response?.data);
      console.error("❌ Full Error:", error);
      throw error;
    }
  }

  // Get conversation by user ID
  // Note: This endpoint might not exist in the current API
  // We'll use the conversations endpoint instead
  async getConversationByUserId(userId) {
    try {
      console.log("🔍 Getting conversation for user:", userId);

      // Use the conversations endpoint and filter by user
      const response = await this.get("/Conversations");
      console.log("📥 All conversations:", response);

      // Filter conversations for the specific user
      if (Array.isArray(response)) {
        const userConversations = response.filter((conv) =>
          conv.participants?.some((p) => p.id === userId || p.userId === userId)
        );
        return userConversations;
      }

      return response;
    } catch (error) {
      console.error("❌ Get user conversation error:", error);
      throw error;
    }
  }

  // Get conversation by conversation ID
  async getConversationById(conversationId) {
    try {
      console.log("🔍 === GET CONVERSATION BY ID API CALL ===");
      console.log("📋 conversationId:", conversationId);
      console.log("📋 conversationId type:", typeof conversationId);

      if (!conversationId) {
        throw new Error("conversationId is required");
      }

      const endpoint = `/Conversations/${conversationId}`;
      console.log("🌐 API Endpoint:", endpoint);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Base URL:", this.basePath);
      console.log("🌐 Full URL:", `${this.basePath}${endpoint}`);

      const response = await this.get(endpoint);

      console.log("📥 === GET CONVERSATION BY ID RESPONSE ===");
      console.log("📥 Response Data:", JSON.stringify(response, null, 2));
      console.log("✅ === GET CONVERSATION BY ID SUCCESS ===");

      return response;
    } catch (error) {
      console.error("❌ === GET CONVERSATION BY ID ERROR ===");
      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error Status Text:", error.response?.statusText);
      console.error("❌ Error Data:", error.response?.data);
      console.error("❌ Full Error:", error);
      throw error;
    }
  }

  // ==================== MESSAGING APIs ====================

  // Send message (POST /api/Messages)
  async sendMessage(messageData) {
    try {
      console.log("🔍 === SEND MESSAGE API CALL ===");
      console.log("📋 messageData:", messageData);
      console.log("📋 conversationId:", messageData.conversationId);
      console.log("📋 senderId:", messageData.senderId);
      console.log("📋 content:", messageData.content);
      console.log("📋 messageType:", messageData.messageType);

      if (
        !messageData.conversationId ||
        !messageData.senderId ||
        !messageData.content
      ) {
        throw new Error("conversationId, senderId, and content are required");
      }

      const endpoint = "/Messages";
      console.log("🌐 API Endpoint:", endpoint);
      console.log("📋 HTTP Method: POST");
      console.log("📋 Request Body:", JSON.stringify(messageData, null, 2));

      const response = await this.post(endpoint, messageData);

      console.log("📥 === SEND MESSAGE RESPONSE ===");
      console.log("📥 Response Data:", JSON.stringify(response, null, 2));
      console.log("✅ === SEND MESSAGE SUCCESS ===");

      return {
        success: true,
        message: response.data || response,
      };
    } catch (error) {
      console.error("❌ === SEND MESSAGE ERROR ===");
      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error Status Text:", error.response?.statusText);
      console.error("❌ Error Data:", error.response?.data);
      console.error("❌ Full Error:", error);
      throw error;
    }
  }

  // Get conversation messages (GET /api/Messages/conversation/{conversationId}/messages)
  async getConversationMessages(conversationId, page = 1, pageSize = 10) {
    try {
      console.log("🔍 === GET CONVERSATION MESSAGES API CALL ===");
      console.log("📋 conversationId:", conversationId);
      console.log("📋 page:", page);
      console.log("📋 pageSize:", pageSize);

      if (!conversationId) {
        throw new Error("conversationId is required");
      }

      const endpoint = `/Messages/conversation/${conversationId}/messages`;
      console.log("🌐 API Endpoint:", endpoint);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Request Parameters:", { page, pageSize });

      const response = await this.get(endpoint, {
        params: { page, pageSize },
      });

      console.log("📥 === GET CONVERSATION MESSAGES RESPONSE ===");
      console.log("📥 Response Data:", JSON.stringify(response, null, 2));
      console.log("✅ === GET CONVERSATION MESSAGES SUCCESS ===");

      // Trả về messages array từ response
      return response.data?.messages || response.messages || [];
    } catch (error) {
      console.error("❌ === GET CONVERSATION MESSAGES ERROR ===");
      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error Status Text:", error.response?.statusText);
      console.error("❌ Error Data:", error.response?.data);
      console.error("❌ Full Error:", error);
      throw error;
    }
  }

  // ==================== EXISTING METHODS ====================

  async getConversationByMatch(matchId) {
    try {
      const response = await this.get(`/Conversations/by-match/${matchId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async markConversationAsRead(conversationId) {
    try {
      const response = await this.put(`/Conversations/${conversationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get all conversations for current user (GET /Conversations/user/{userID})
  async getConversations(userId) {
    try {
      console.log("🔍 === GET CONVERSATIONS FOR USER API CALL ===");
      console.log("📋 userId:", userId);
      console.log("📋 userId type:", typeof userId);

      if (!userId) {
        throw new Error("userId is required for getting conversations");
      }

      const endpoint = `/Conversations/user/${userId}`;
      console.log("🌐 API Endpoint:", endpoint);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Base URL:", this.basePath);
      console.log("🌐 Full URL:", `${this.basePath}${endpoint}`);

      const response = await this.get(endpoint);

      console.log("📥 === GET CONVERSATIONS FOR USER RESPONSE ===");
      console.log("📥 Response Data:", JSON.stringify(response, null, 2));
      console.log("✅ === GET CONVERSATIONS FOR USER SUCCESS ===");

      return response;
    } catch (error) {
      console.error("❌ === GET CONVERSATIONS FOR USER ERROR ===");
      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error Status Text:", error.response?.statusText);
      console.error("❌ Error Data:", error.response?.data);
      console.error("❌ Full Error:", error);
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
    try {
      console.log("🔍 === GET CONVERSATION API CALL ===");
      console.log("📋 conversationId:", conversationId);
      console.log("📋 conversationId type:", typeof conversationId);

      if (!conversationId) {
        throw new Error("conversationId is required");
      }

      const endpoint = `/Conversations/${conversationId}`;
      console.log("🌐 API Endpoint:", endpoint);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Base URL:", this.basePath);
      console.log("🌐 Full URL:", `${this.basePath}${endpoint}`);

      const response = await this.get(endpoint);

      console.log("📥 === GET CONVERSATION RESPONSE ===");
      console.log("📥 Response Data:", JSON.stringify(response, null, 2));
      console.log("✅ === GET CONVERSATION SUCCESS ===");

      return response;
    } catch (error) {
      console.error("❌ === GET CONVERSATION ERROR ===");
      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error Status Text:", error.response?.statusText);
      console.error("❌ Error Data:", error.response?.data);
      console.error("❌ Full Error:", error);
      throw error;
    }
  }

  async deleteMessage(messageId) {
    return this.delete(`/${messageId}`);
  }

  async searchMessages(conversationId, query, page = 1, pageSize = 20) {
    return this.get(
      `/Conversations/${conversationId}/search?query=${query}&page=${page}&pageSize=${pageSize}`
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
    return this.put(`/Conversations/${conversationId}/leave`);
  }
}

const messageService = new MessageService();
export default messageService;
