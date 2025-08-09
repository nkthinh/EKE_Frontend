import api from "../api/api";
import config from "../../constants/env";

class ConversationService {
  // Create conversation when tutor accepts student
  // Using the correct API endpoint: GET /Conversations/match/{matchId}
  async createConversationFromMatch(matchId) {
    try {
      console.log("🔍 === CREATE CONVERSATION API CALL ===");
      console.log("📋 Input matchId:", matchId);
      console.log("📋 Input type:", typeof matchId);

      if (!matchId) {
        throw new Error("matchId is required for conversation creation");
      }

      // Use the correct API endpoint: GET /Conversations/match/{matchId}
      // Use api instance directly to avoid baseURL prefix issues
      const endpoint = `/Conversations/match/${matchId}`;
      console.log("🌐 API Endpoint:", endpoint);
      console.log("🌐 Full URL:", `${config.api.baseURL}${endpoint}`);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Request Parameters: None (GET request)");

      const response = await api.get(endpoint);

      console.log("📥 === API RESPONSE ===");
      console.log("📥 Status:", response.status);
      console.log("📥 Status Text:", response.statusText);
      console.log("📥 Response Data:", JSON.stringify(response.data, null, 2));
      console.log("✅ === CREATE CONVERSATION SUCCESS ===");

      return {
        success: true,
        conversation: response.data.data || response.data,
      };
    } catch (error) {
      console.error("❌ === CREATE CONVERSATION ERROR ===");
      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error Status Text:", error.response?.statusText);
      console.error("❌ Error Data:", error.response?.data);
      console.error("❌ Full Error:", error);
      throw error;
    }
  }

  // Get conversations by user ID
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
      console.log("🌐 Full URL:", `${config.api.baseURL}${endpoint}`);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Request Parameters: None (GET request)");

      const response = await api.get(endpoint);

      console.log("📥 === CONVERSATIONS BY USER API RESPONSE ===");
      console.log("📥 Status:", response.status);
      console.log("📥 Status Text:", response.statusText);
      console.log("📥 Response Data:", JSON.stringify(response.data, null, 2));
      console.log("✅ === GET CONVERSATIONS BY USER SUCCESS ===");

      return response.data;
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

  // Get conversation by ID
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
      console.log("🌐 Full URL:", `${config.api.baseURL}${endpoint}`);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Request Parameters: None (GET request)");

      const response = await api.get(endpoint);

      console.log("📥 === GET CONVERSATION BY ID RESPONSE ===");
      console.log("📥 Status:", response.status);
      console.log("📥 Status Text:", response.statusText);
      console.log("📥 Response Data:", JSON.stringify(response.data, null, 2));
      console.log("✅ === GET CONVERSATION BY ID SUCCESS ===");

      return response.data;
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

  // Get all conversations for user
  async getConversations() {
    try {
      console.log("🔍 Getting all conversations");
      const response = await api.get("/Conversations");
      console.log("📥 All conversations:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Get conversations error:", error);
      throw error;
    }
  }

  // Get conversation messages
  async getConversationMessages(conversationId, page = 1, pageSize = 10) {
    try {
      console.log("🔍 === GET CONVERSATION MESSAGES API CALL ===");
      console.log("📋 conversationId:", conversationId);
      console.log("📋 page:", page);
      console.log("📋 pageSize:", pageSize);

      const endpoint = `/Messages/conversation/${conversationId}`;
      console.log("🌐 API Endpoint:", endpoint);
      console.log("🌐 Full URL:", `${config.api.baseURL}${endpoint}`);
      console.log("📋 HTTP Method: GET");
      console.log("📋 Request Parameters:", { page, pageSize });

      const response = await api.get(endpoint, {
        params: { page, pageSize },
      });

      console.log("📥 === MESSAGES API RESPONSE ===");
      console.log("📥 Status:", response.status);
      console.log("📥 Status Text:", response.statusText);
      console.log("📥 Response Data:", JSON.stringify(response.data, null, 2));
      console.log("✅ === GET MESSAGES SUCCESS ===");

      return response.data;
    } catch (error) {
      console.error("❌ === GET MESSAGES ERROR ===");
      console.error("❌ Error Message:", error.message);
      console.error("❌ Error Status:", error.response?.status);
      console.error("❌ Error Status Text:", error.response?.statusText);
      console.error("❌ Error Data:", error.response?.data);
      console.error("❌ Full Error:", error);
      throw error;
    }
  }
}

export default new ConversationService();
