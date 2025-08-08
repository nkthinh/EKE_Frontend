import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import messageService from "../services/features/messageService";
import signalRService from "../services/features/signalRService";
import { useAuth } from "./useAuth";

export const useMessage = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const { userData } = useAuth();

  // Initialize SignalR connection
  useEffect(() => {
    const initializeSignalR = async () => {
      try {
        if (userData && !signalRService.isConnectionActive()) {
          await signalRService.connect();

          // Set up real-time message listener
          signalRService.onNewMessage((message) => {
            console.log("New message received:", message);
            handleNewMessage(message);
          });
        }
      } catch (error) {
        console.error("Failed to initialize SignalR:", error);
      }
    };

    initializeSignalR();

    // Cleanup on unmount
    return () => {
      signalRService.removeAllListeners();
    };
  }, [userData]);

  // Handle new message from SignalR
  const handleNewMessage = useCallback(
    (message) => {
      // Update messages if it's for current conversation
      if (
        currentConversation &&
        message.conversationId === currentConversation.id
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      // Update conversation list with latest message
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message,
                unreadCount: conv.unreadCount + 1,
              }
            : conv
        )
      );
    },
    [currentConversation]
  );

  // Get all conversations
  const getConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await messageService.getAllConversations();

      if (response.success) {
        setConversations(response.data || []);
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch conversations");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get messages for a specific conversation
  const getConversationMessages = useCallback(async (conversationId) => {
    try {
      setLoading(true);
      const response = await messageService.getConversationMessages(
        conversationId
      );

      if (response.success) {
        setMessages(response.data || []);

        // Join SignalR group for this conversation
        await signalRService.joinConversationGroup(conversationId);

        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = useCallback(
    async (conversationId, content, type = "text") => {
      try {
        if (!userData || !userData.id) {
          throw new Error("User data not available");
        }

        const messageData = {
          conversationId: conversationId,
          senderId: userData.id,
          content: content,
          messageType: type,
          sentAt: new Date().toISOString(),
        };

        console.log("Sending message:", messageData);
        const response = await messageService.sendMessage(messageData);

        if (response.success) {
          // Add message to local state immediately for better UX
          const newMessage = {
            ...messageData,
            id: response.data.id || Date.now(), // Use server ID or fallback
            isRead: false,
          };

          setMessages((prevMessages) => [...prevMessages, newMessage]);

          // Update conversation list
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.id === conversationId
                ? { ...conv, lastMessage: newMessage }
                : conv
            )
          );

          // Send real-time notification
          await signalRService.sendMessageNotification(
            conversationId,
            newMessage
          );

          return response.data;
        } else {
          throw new Error(response.message || "Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
        throw error;
      }
    },
    [userData]
  );

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId) => {
    try {
      const response = await messageService.markConversationAsRead(
        conversationId
      );

      if (response.success) {
        // Update local state
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );

        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, isRead: true }))
        );
      }
    } catch (error) {
      console.error("Error marking conversation as read:", error);
    }
  }, []);

  // Set current conversation
  const setActiveConversation = useCallback(
    async (conversation) => {
      try {
        // Leave previous conversation group
        if (currentConversation) {
          await signalRService.leaveConversationGroup(currentConversation.id);
        }

        setCurrentConversation(conversation);

        if (conversation) {
          // Load messages for new conversation
          await getConversationMessages(conversation.id);

          // Mark as read
          await markAsRead(conversation.id);
        }
      } catch (error) {
        console.error("Error setting active conversation:", error);
      }
    },
    [currentConversation, getConversationMessages, markAsRead]
  );

  // Get conversation by match ID
  const getConversationByMatch = useCallback(async (matchId) => {
    try {
      setLoading(true);
      const response = await messageService.getConversationByMatch(matchId);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || "Failed to fetch conversation");
      }
    } catch (error) {
      console.error("Error fetching conversation by match:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    conversations,
    currentConversation,
    messages,
    getConversations,
    getConversationMessages,
    sendMessage,
    markAsRead,
    setActiveConversation,
    getConversationByMatch,
  };
};
