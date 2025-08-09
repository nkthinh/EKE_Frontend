import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useMatch } from "../hooks/useMatch";
import { useMessage } from "../hooks/useMessage";
import { useAuth } from "../hooks/useAuth";

const ConversationExample = () => {
  const { userData } = useAuth();
  const { handleTutorResponseWithConversation } = useMatch();
  const {
    createConversationFromMatch,
    getConversationByUserId,
    getConversationById,
    sendMessage,
    getConversationMessages,
    getCurrentUserConversationId,
    sendMessageToConversation,
    messages,
    conversations,
    loading,
  } = useMessage();

  const [conversationId, setConversationId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [studentId, setStudentId] = useState("");

  // Example: Tutor accepts student and creates conversation
  const handleTutorAcceptStudent = async () => {
    if (!studentId) {
      Alert.alert("Error", "Please enter a student ID");
      return;
    }

    try {
      console.log("🎯 Tutor accepting student:", studentId);
      const result = await handleTutorResponseWithConversation(
        studentId,
        "accept"
      );

      if (result.success && result.conversation) {
        Alert.alert(
          "Success",
          `Conversation created with ID: ${result.conversation.id}`
        );
        setConversationId(result.conversation.id);
      }
    } catch (error) {
      console.error("Error accepting student:", error);
      Alert.alert("Error", "Failed to accept student");
    }
  };

  // Example: Get conversation by user ID
  const handleGetConversationByUserId = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "No user data available");
      return;
    }

    try {
      console.log("🔍 Getting conversation for user:", userData.id);
      const conversation = await getConversationByUserId(userData.id);

      if (conversation) {
        Alert.alert(
          "Success",
          `Found conversation: ${JSON.stringify(conversation, null, 2)}`
        );
        setConversationId(conversation.id);
      } else {
        Alert.alert("Info", "No conversation found for this user");
      }
    } catch (error) {
      console.error("Error getting conversation:", error);
      Alert.alert("Error", "Failed to get conversation");
    }
  };

  // Example: Get conversation by conversation ID
  const handleGetConversationById = async () => {
    if (!conversationId) {
      Alert.alert("Error", "Please enter a conversation ID");
      return;
    }

    try {
      console.log("🔍 Getting conversation by ID:", conversationId);
      const conversation = await getConversationById(conversationId);

      if (conversation) {
        Alert.alert(
          "Success",
          `Conversation details: ${JSON.stringify(conversation, null, 2)}`
        );
      } else {
        Alert.alert("Info", "No conversation found with this ID");
      }
    } catch (error) {
      console.error("Error getting conversation:", error);
      Alert.alert("Error", "Failed to get conversation");
    }
  };

  // Example: Send message
  const handleSendMessage = async () => {
    if (!conversationId || !messageText.trim()) {
      Alert.alert("Error", "Please enter conversation ID and message");
      return;
    }

    try {
      console.log("📤 Sending message to conversation:", conversationId);
      const result = await sendMessageToConversation(
        conversationId,
        messageText.trim()
      );

      if (result.success) {
        Alert.alert("Success", "Message sent successfully!");
        setMessageText("");

        // Refresh messages
        await getConversationMessages(conversationId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    }
  };

  // Example: Get messages in conversation
  const handleGetMessages = async () => {
    if (!conversationId) {
      Alert.alert("Error", "Please enter a conversation ID");
      return;
    }

    try {
      console.log("🔍 Getting messages for conversation:", conversationId);
      const messages = await getConversationMessages(conversationId);

      if (messages && messages.length > 0) {
        Alert.alert("Success", `Found ${messages.length} messages`);
      } else {
        Alert.alert("Info", "No messages found in this conversation");
      }
    } catch (error) {
      console.error("Error getting messages:", error);
      Alert.alert("Error", "Failed to get messages");
    }
  };

  // Example: Get current user's conversation ID
  const handleGetCurrentUserConversationId = async () => {
    try {
      console.log("🔍 Getting current user conversation ID");
      const id = await getCurrentUserConversationId();

      if (id) {
        Alert.alert("Success", `Current user conversation ID: ${id}`);
        setConversationId(id);
      } else {
        Alert.alert("Info", "No conversation found for current user");
      }
    } catch (error) {
      console.error("Error getting current user conversation ID:", error);
      Alert.alert("Error", "Failed to get conversation ID");
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Conversation & Messaging Example
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Current User: {userData?.fullName || "Unknown"} (ID:{" "}
        {userData?.id || "N/A"})
      </Text>

      {/* Tutor Accept Student Section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Tutor Accept Student
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginBottom: 10,
          }}
          placeholder="Enter Student ID"
          value={studentId}
          onChangeText={setStudentId}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={{ backgroundColor: "#007AFF", padding: 15, borderRadius: 5 }}
          onPress={handleTutorAcceptStudent}
          disabled={loading}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            {loading ? "Processing..." : "Accept Student & Create Conversation"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Get Conversation Section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Get Conversation
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#34C759",
            padding: 15,
            borderRadius: 5,
            marginBottom: 10,
          }}
          onPress={handleGetConversationByUserId}
          disabled={loading}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Get Conversation by User ID
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#34C759",
            padding: 15,
            borderRadius: 5,
            marginBottom: 10,
          }}
          onPress={handleGetCurrentUserConversationId}
          disabled={loading}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Get Current User Conversation ID
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conversation ID Input */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Conversation ID
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginBottom: 10,
          }}
          placeholder="Enter Conversation ID"
          value={conversationId || ""}
          onChangeText={setConversationId}
        />
        <TouchableOpacity
          style={{ backgroundColor: "#FF9500", padding: 15, borderRadius: 5 }}
          onPress={handleGetConversationById}
          disabled={loading}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Get Conversation Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Send Message Section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Send Message
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            marginBottom: 10,
          }}
          placeholder="Enter message"
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#007AFF",
            padding: 15,
            borderRadius: 5,
            marginBottom: 10,
          }}
          onPress={handleSendMessage}
          disabled={loading}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Send Message
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: "#FF9500", padding: 15, borderRadius: 5 }}
          onPress={handleGetMessages}
          disabled={loading}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Get Messages
          </Text>
        </TouchableOpacity>
      </View>

      {/* Display Messages */}
      {messages.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Messages ({messages.length})
          </Text>
          {messages.map((message, index) => (
            <View
              key={index}
              style={{
                padding: 10,
                backgroundColor: "#f0f0f0",
                marginBottom: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                Sender: {message.senderId}
              </Text>
              <Text>Content: {message.content}</Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                {new Date(message.timestamp || message.sentAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Display Conversations */}
      {conversations.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Conversations ({conversations.length})
          </Text>
          {conversations.map((conversation, index) => (
            <View
              key={index}
              style={{
                padding: 10,
                backgroundColor: "#f0f0f0",
                marginBottom: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>ID: {conversation.id}</Text>
              <Text>Match ID: {conversation.matchId}</Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                Created: {new Date(conversation.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ConversationExample;
