import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useMessage } from "../hooks/useMessage";
import { COLORS, SIZES } from "../constants";

const TestConversationsByUser = ({ navigation }) => {
  const { userData } = useAuth();
  const { getConversationsByUserId } = useMessage();

  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(userData?.id?.toString() || "62");
  const [conversations, setConversations] = useState(null);

  const addTestResult = (test, result, details = "") => {
    setTestResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        test,
        result,
        details,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const testGetConversationsByUserId = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID is required");
      return;
    }

    setLoading(true);
    try {
      addTestResult(
        "Get Conversations By User ID",
        "Testing...",
        `User ID: ${userId}`
      );

      console.log("🔍 Testing getConversationsByUserId with:");
      console.log("   User ID:", userId);

      const result = await getConversationsByUserId(parseInt(userId));

      console.log("📥 getConversationsByUserId result:", result);

      if (result && result.success) {
        addTestResult(
          "Get Conversations By User ID",
          "PASSED",
          `Found ${result.data?.length || 0} conversations`
        );
        setConversations(result.data);

        // Log conversation details
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach((conv, index) => {
            console.log(`📊 Conversation ${index + 1}:`, {
              id: conv.id,
              matchId: conv.matchId,
              studentId: conv.studentId,
              tutorId: conv.tutorId,
              studentName: conv.studentName,
              tutorName: conv.tutorName,
              lastMessage: conv.lastMessage,
              unreadCount: conv.unreadCount,
            });
          });
        }
      } else {
        addTestResult(
          "Get Conversations By User ID",
          "FAILED",
          result?.error || "No data returned"
        );
      }
    } catch (error) {
      console.error("❌ Test error:", error);
      addTestResult("Get Conversations By User ID", "FAILED", error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToChat = (conversation) => {
    if (!conversation?.id) {
      Alert.alert("Error", "No conversation ID available");
      return;
    }

    navigation.navigate("ChatDetail", {
      conversationId: conversation.id,
      name: conversation.studentName || conversation.tutorName || "User",
      conversation: conversation,
      match: {
        studentId: conversation.studentId,
        tutorId: conversation.tutorId,
        studentName: conversation.studentName,
        tutorName: conversation.tutorName,
      },
    });
  };

  const clearResults = () => {
    setTestResults([]);
    setConversations(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Conversations By User ID</Text>
        <Text style={styles.subtitle}>
          Test GET /Conversations/user/{userId}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <Text style={styles.infoText}>
          Current User ID: {userData?.id || "Not available"}
        </Text>
        <Text style={styles.infoText}>
          Role: {userData?.role || "Not available"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Configuration</Text>
        <Text style={styles.label}>User ID to test:</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="Enter user ID"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Controls</Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={testGetConversationsByUserId}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Testing..." : "Test Get Conversations By User ID"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      {conversations && conversations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Conversations Found ({conversations.length})
          </Text>
          {conversations.map((conversation, index) => (
            <TouchableOpacity
              key={conversation.id || index}
              style={styles.conversationCard}
              onPress={() => navigateToChat(conversation)}
            >
              <Text style={styles.conversationTitle}>
                Conversation {index + 1} (ID: {conversation.id})
              </Text>
              <Text style={styles.conversationDetail}>
                Match ID: {conversation.matchId}
              </Text>
              <Text style={styles.conversationDetail}>
                Student: {conversation.studentName || "N/A"} (ID:{" "}
                {conversation.studentId})
              </Text>
              <Text style={styles.conversationDetail}>
                Tutor: {conversation.tutorName || "N/A"} (ID:{" "}
                {conversation.tutorId})
              </Text>
              <Text style={styles.conversationDetail}>
                Last Message: {conversation.lastMessage || "No messages"}
              </Text>
              <Text style={styles.conversationDetail}>
                Unread: {conversation.unreadCount || 0}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {testResults.map((result) => (
          <View key={result.id} style={styles.resultItem}>
            <Text style={styles.resultTest}>{result.test}</Text>
            <Text
              style={[
                styles.resultStatus,
                result.result === "PASSED"
                  ? styles.passed
                  : result.result === "FAILED"
                  ? styles.failed
                  : styles.testing,
              ]}
            >
              {result.result}
            </Text>
            {result.details && (
              <Text style={styles.resultDetails}>{result.details}</Text>
            )}
            <Text style={styles.resultTime}>{result.timestamp}</Text>
          </View>
        ))}
        {testResults.length === 0 && (
          <Text style={styles.noResults}>
            No test results yet. Run tests to see results.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: SIZES.padding,
  },
  header: {
    marginBottom: SIZES.padding * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SIZES.padding,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  clearButton: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  conversationCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
  },
  conversationDetail: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  resultItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  resultTest: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  passed: {
    color: "#4CAF50",
  },
  failed: {
    color: "#f44336",
  },
  testing: {
    color: "#FF9800",
  },
  resultDetails: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  resultTime: {
    fontSize: 10,
    color: COLORS.lightGray,
  },
  noResults: {
    textAlign: "center",
    color: COLORS.gray,
    fontStyle: "italic",
  },
});

export default TestConversationsByUser;
