import { useState, useCallback } from "react";
import { Alert } from "react-native";
import messageService from "../services/features/messageService";
import { useAuth } from "./useAuth";

export const useMessage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const { userData } = useAuth();

  // ==================== CONVERSATION MANAGEMENT ====================

  // Create conversation when tutor accepts student
  const createConversationFromMatch = useCallback(
    async (matchData) => {
      if (!userData?.id) {
        Alert.alert("Error", "User data not available");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        console.log("🔍 Creating conversation from match:", matchData);
        const result = await messageService.createConversationFromMatch(
          matchData
        );

        console.log("📥 Conversation created:", result);

        return {
          success: true,
          conversation: result,
        };
      } catch (err) {
        console.error("❌ Create conversation error:", err);
        Alert.alert(
          "Error",
          "Failed to create conversation. Please try again."
        );
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [userData?.id]
  );

  // Get conversations by user ID (GET api/Conversations/user/{userid})
  const getConversationsByUserId = useCallback(async (userId) => {
    if (!userId) {
      console.log("⚠️ No user ID provided");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Getting conversations for user:", userId);
      const result = await messageService.getConversationsByUserId(userId);

      console.log("📥 User conversations:", result);

      return result;
    } catch (err) {
      console.error("❌ Get user conversations error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get conversation by user ID (GET api/Conversations/user/{userid})
  const getConversationByUserId = useCallback(async (userId) => {
    if (!userId) {
      console.log("⚠️ No user ID provided");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Getting conversation for user:", userId);
      const result = await messageService.getConversationByUserId(userId);

      console.log("📥 User conversation:", result);

      return result;
    } catch (err) {
      console.error("❌ Get user conversation error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get conversation by conversation ID (GET {conversationid})
  const getConversationById = useCallback(async (conversationId) => {
    if (!conversationId) {
      console.log("⚠️ No conversation ID provided");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Getting conversation by ID:", conversationId);
      const result = await messageService.getConversationById(conversationId);

      console.log("📥 Conversation details:", result);

      return result;
    } catch (err) {
      console.error("❌ Get conversation by ID error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all conversations for current user
  const getAllConversations = useCallback(async () => {
    if (!userData?.id) {
      console.log("⚠️ No user data available");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Getting all conversations for user:", userData.id);
      const result = await messageService.getAllConversations();

      console.log("📥 All conversations:", result);
      setConversations(result || []);

      return result || [];
    } catch (err) {
      console.error("❌ Get all conversations error:", err);
      setError(err.message);
      setConversations([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userData?.id]);

  // ==================== MESSAGING APIs ====================

  // Send message (POST api/Message) - senderId is user ID from login response
  const sendMessage = useCallback(
    async (conversationId, content, messageType = 1) => {
      if (!userData?.id) {
        Alert.alert("Error", "User data not available");
        return { success: false };
      }

      if (!conversationId || !content) {
        Alert.alert(
          "Error",
          "Conversation ID and message content are required"
        );
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        // Prepare message data according to API specification
        const messageData = {
          conversationId: conversationId,
          senderId: userData.id, // Use user ID from login response
          content: content,
          messageType: messageType, // 1 for text message
        };

        console.log("🔍 Sending message:", messageData);
        const result = await messageService.sendMessage(messageData);

        console.log("📥 Message sent:", result);

        // Refresh messages for the conversation
        await getConversationMessages(conversationId);

        return {
          success: true,
          message: result,
        };
      } catch (err) {
        console.error("❌ Send message error:", err);
        Alert.alert("Error", "Failed to send message. Please try again.");
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [userData?.id]
  );

  // Get messages in conversation (GET api/Messages/conversation/{conversationId}/messages)
  const getConversationMessages = useCallback(
    async (conversationId, page = 1, pageSize = 10) => {
      if (!conversationId) {
        console.log("⚠️ No conversation ID provided");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("🔍 Getting messages for conversation:", conversationId);
        const result = await messageService.getConversationMessages(
          conversationId,
          page,
          pageSize
        );

        console.log("📥 Conversation messages:", result);

        // Handle different response structures
        let messagesData = [];
        if (Array.isArray(result)) {
          messagesData = result;
        } else if (result && Array.isArray(result.data)) {
          messagesData = result.data;
        } else if (result && Array.isArray(result.messages)) {
          messagesData = result.messages;
        }

        // Thêm sortTime và sắp xếp đơn giản như student screen
        const messagesWithSortTime = messagesData.map((msg) => ({
          ...msg,
          sortTime: new Date(msg.timestamp || msg.createdAt).getTime(),
        }));

        const sortedMessages = messagesWithSortTime.sort(
          (a, b) => a.sortTime - b.sortTime
        );

        console.log("📱 Sorted messages in hook:", sortedMessages);
        setMessages(sortedMessages);

        return sortedMessages;
      } catch (err) {
        console.error("❌ Get conversation messages error:", err);
        setError(err.message);
        setMessages([]);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Mark conversation as read
  const markConversationAsRead = useCallback(async (conversationId) => {
    if (!conversationId) {
      console.log("⚠️ No conversation ID provided");
      return false;
    }

    try {
      console.log("🔍 Marking conversation as read:", conversationId);
      const result = await messageService.markConversationAsRead(
        conversationId
      );

      console.log("📥 Conversation marked as read:", result);

      return true;
    } catch (err) {
      console.error("❌ Mark conversation as read error:", err);
      return false;
    }
  }, []);

  // ==================== UTILITY METHODS ====================

  // Set active conversation
  const setActiveConversation = useCallback(
    (conversation) => {
      setCurrentConversation(conversation);
      if (conversation?.id) {
        getConversationMessages(conversation.id);
      }
    },
    [getConversationMessages]
  );

  // Get conversation ID for current user
  const getCurrentUserConversationId = useCallback(async () => {
    if (!userData?.id) {
      console.log("⚠️ No user data available");
      return null;
    }

    try {
      const conversation = await getConversationByUserId(userData.id);
      return conversation?.id || null;
    } catch (err) {
      console.error("❌ Get current user conversation ID error:", err);
      return null;
    }
  }, [userData?.id, getConversationByUserId]);

  // Send message to specific conversation
  const sendMessageToConversation = useCallback(
    async (conversationId, content) => {
      if (!conversationId || !content) {
        Alert.alert(
          "Error",
          "Conversation ID and message content are required"
        );
        return { success: false };
      }

      return await sendMessage(conversationId, content, 1);
    },
    [sendMessage]
  );

  // Clear messages and conversations
  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversations([]);
    setError(null);
    setCurrentConversation(null);
  }, []);

  return {
    loading,
    error,
    messages,
    conversations,
    currentConversation,
    // Conversation methods
    createConversationFromMatch,
    getConversationsByUserId,
    getConversationByUserId,
    getConversationById,
    getAllConversations,
    // Message methods
    sendMessage,
    getConversationMessages,
    markConversationAsRead,
    // Utility methods
    setActiveConversation,
    getCurrentUserConversationId,
    sendMessageToConversation,
    clearMessages,
  };
};
