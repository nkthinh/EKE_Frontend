import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useMatch } from "../hooks/useMatch";
import { useAuth } from "../hooks/useAuth";
import { useMessage } from "../hooks/useMessage";
import { COLORS, SIZES } from "../constants";

const TestConversationFlow = ({ navigation }) => {
  const { userData } = useAuth();
  const { handleTutorResponseWithConversation, createConversationFromMatch } =
    useMatch();
  const { sendMessage, getConversationMessages } = useMessage();

  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);

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

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Check user data
      addTestResult("User Data Check", "Running...");
      if (!userData?.id) {
        addTestResult("User Data Check", "FAILED", "No user data available");
        return;
      }
      addTestResult(
        "User Data Check",
        "PASSED",
        `User ID: ${userData.id}, Role: ${userData.role}`
      );

      // Test 2: Test conversation creation
      addTestResult("Conversation Creation", "Running...");
      const testMatchData = {
        matchId: 999,
        studentId: 123,
        tutorId: userData.id,
      };

      try {
        const conversationResult = await createConversationFromMatch(
          testMatchData
        );
        if (conversationResult.success) {
          addTestResult(
            "Conversation Creation",
            "PASSED",
            `Conversation ID: ${conversationResult.conversation?.id}`
          );
          setConversationId(conversationResult.conversation?.id);
        } else {
          addTestResult(
            "Conversation Creation",
            "FAILED",
            conversationResult.error
          );
        }
      } catch (error) {
        addTestResult("Conversation Creation", "FAILED", error.message);
      }

      // Test 3: Test message sending (if conversation created)
      if (conversationId) {
        addTestResult("Message Sending", "Running...");
        try {
          const messageResult = await sendMessage({
            conversationId: conversationId,
            content: "Test message from conversation flow",
            messageType: 1,
          });

          if (messageResult.success) {
            addTestResult(
              "Message Sending",
              "PASSED",
              "Message sent successfully"
            );
          } else {
            addTestResult("Message Sending", "FAILED", messageResult.error);
          }
        } catch (error) {
          addTestResult("Message Sending", "FAILED", error.message);
        }
      }

      // Test 4: Test message retrieval
      if (conversationId) {
        addTestResult("Message Retrieval", "Running...");
        try {
          const messages = await getConversationMessages(conversationId);
          if (messages && Array.isArray(messages)) {
            addTestResult(
              "Message Retrieval",
              "PASSED",
              `${messages.length} messages retrieved`
            );
          } else {
            addTestResult(
              "Message Retrieval",
              "FAILED",
              "No messages returned"
            );
          }
        } catch (error) {
          addTestResult("Message Retrieval", "FAILED", error.message);
        }
      }
    } catch (error) {
      addTestResult("Test Suite", "FAILED", error.message);
    } finally {
      setLoading(false);
    }
  };

  const testTutorResponse = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "User data not available");
      return;
    }

    setLoading(true);
    try {
      // Test with a mock student ID
      const testStudentId = 123;
      const result = await handleTutorResponseWithConversation(
        testStudentId,
        "accept"
      );

      if (result.success) {
        Alert.alert("Success", `Test completed: ${result.type}`);
        addTestResult("Tutor Response Test", "PASSED", `Type: ${result.type}`);

        if (result.conversation) {
          setConversationId(result.conversation.id);
          addTestResult(
            "Conversation Created",
            "PASSED",
            `ID: ${result.conversation.id}`
          );
        }
      } else {
        Alert.alert("Error", result.error);
        addTestResult("Tutor Response Test", "FAILED", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      addTestResult("Tutor Response Test", "FAILED", error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!conversationId || !testMessage.trim()) {
      Alert.alert(
        "Error",
        "Please enter a message and ensure conversation ID is available"
      );
      return;
    }

    try {
      const result = await sendMessage({
        conversationId: conversationId,
        content: testMessage,
        messageType: 1,
      });

      if (result.success) {
        Alert.alert("Success", "Test message sent!");
        setTestMessage("");
        addTestResult(
          "Manual Message Test",
          "PASSED",
          `Message: ${testMessage}`
        );
      } else {
        Alert.alert("Error", result.error);
        addTestResult("Manual Message Test", "FAILED", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      addTestResult("Manual Message Test", "FAILED", error.message);
    }
  };

  const navigateToChat = () => {
    if (!conversationId) {
      Alert.alert("Error", "No conversation ID available");
      return;
    }

    navigation.navigate("ChatDetail", {
      conversationId: conversationId,
      name: "Test User",
      conversation: { id: conversationId },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversation Flow Test</Text>
        <Text style={styles.subtitle}>
          Test conversation creation and messaging
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <Text style={styles.infoText}>
          User ID: {userData?.id || "Not available"}
        </Text>
        <Text style={styles.infoText}>
          Role: {userData?.role || "Not available"}
        </Text>
        <Text style={styles.infoText}>
          Conversation ID: {conversationId || "Not available"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Controls</Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={runAllTests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Running Tests..." : "Run All Tests"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={testTutorResponse}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Tutor Response</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={navigateToChat}
          disabled={!conversationId}
        >
          <Text style={styles.buttonText}>Navigate to Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Test Message</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter test message..."
          value={testMessage}
          onChangeText={setTestMessage}
        />
        <TouchableOpacity
          style={[styles.button, styles.messageButton]}
          onPress={sendTestMessage}
          disabled={!conversationId || !testMessage.trim()}
        >
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {testResults.map((result) => (
          <View key={result.id} style={styles.resultItem}>
            <Text style={styles.resultTest}>{result.test}</Text>
            <Text
              style={[
                styles.resultStatus,
                result.result === "PASSED" ? styles.passed : styles.failed,
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
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  successButton: {
    backgroundColor: "#4CAF50",
  },
  messageButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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

export default TestConversationFlow;
