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
import { useMatch } from "../hooks/useMatch";
import conversationService from "../services/features/conversationService";
import { COLORS, SIZES } from "../constants";

const TestMatchConversation = ({ navigation }) => {
  const { userData } = useAuth();
  const { handleTutorResponseWithConversation, createConversationFromMatch } =
    useMatch();

  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("5");
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

  const testTutorResponse = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "User data not available");
      return;
    }

    setLoading(true);
    try {
      addTestResult(
        "Tutor Response Test",
        "Testing...",
        `Student ID: ${studentId}`
      );

      console.log("🔍 Testing tutor response with:");
      console.log("   User ID:", userData.id);
      console.log("   Student ID:", studentId);

      const result = await handleTutorResponseWithConversation(
        studentId,
        "accept"
      );

      console.log("📥 Tutor response result:", result);

      if (result.success) {
        addTestResult("Tutor Response Test", "PASSED", `Type: ${result.type}`);

        if (result.match) {
          addTestResult(
            "Match Data",
            "PASSED",
            `Match ID: ${result.match.matchId || result.match.id}`
          );
        }

        if (result.conversation) {
          setConversationId(result.conversation.id);
          addTestResult(
            "Conversation Created",
            "PASSED",
            `ID: ${result.conversation.id}`
          );
        } else if (result.error) {
          addTestResult("Conversation Failed", "FAILED", result.error);
        }
      } else {
        addTestResult("Tutor Response Test", "FAILED", result.error);
      }
    } catch (error) {
      console.error("❌ Test error:", error);
      addTestResult("Tutor Response Test", "FAILED", error.message);
    } finally {
      setLoading(false);
    }
  };

  const testDirectConversationCreation = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "User data not available");
      return;
    }

    setLoading(true);
    try {
      addTestResult(
        "Direct Conversation Creation",
        "Testing...",
        "Creating conversation directly with GET request"
      );

      // Test with mock data - now using GET request with matchId
      const testMatchData = {
        matchId: 999, // This will be used in the URL path
      };

      console.log(
        "🔍 Creating conversation with GET request, matchId:",
        testMatchData.matchId
      );

      const result = await createConversationFromMatch(testMatchData);

      if (result.success) {
        addTestResult(
          "Direct Conversation Creation",
          "PASSED",
          `Conversation ID: ${result.conversation?.id}`
        );
        setConversationId(result.conversation?.id);
      } else {
        addTestResult("Direct Conversation Creation", "FAILED", result.error);
      }
    } catch (error) {
      console.error("❌ Direct conversation error:", error);
      addTestResult("Direct Conversation Creation", "FAILED", error.message);
    } finally {
      setLoading(false);
    }
  };

  const testConversationServiceDirectly = async () => {
    if (!userData?.id) {
      Alert.alert("Error", "User data not available");
      return;
    }

    setLoading(true);
    try {
      addTestResult(
        "Conversation Service Direct Test",
        "Testing...",
        "Testing conversation service directly"
      );

      // Test conversation service directly
      const result = await conversationService.createConversationFromMatch(999);

      if (result.success) {
        addTestResult(
          "Conversation Service Direct Test",
          "PASSED",
          `Conversation ID: ${result.conversation?.id}`
        );
        setConversationId(result.conversation?.id);
      } else {
        addTestResult(
          "Conversation Service Direct Test",
          "FAILED",
          result.error
        );
      }
    } catch (error) {
      console.error("❌ Conversation service direct error:", error);
      addTestResult(
        "Conversation Service Direct Test",
        "FAILED",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToChat = () => {
    if (!conversationId) {
      Alert.alert("Error", "No conversation ID available");
      return;
    }

    navigation.navigate("ChatDetail", {
      conversationId: conversationId,
      name: "Test Student",
      conversation: { id: conversationId },
    });
  };

  const clearResults = () => {
    setTestResults([]);
    setConversationId(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Match & Conversation Test</Text>
        <Text style={styles.subtitle}>
          Test match creation and conversation flow
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
        <Text style={styles.sectionTitle}>Test Configuration</Text>
        <Text style={styles.label}>Student ID:</Text>
        <TextInput
          style={styles.input}
          value={studentId}
          onChangeText={setStudentId}
          placeholder="Enter student ID"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Controls</Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={testTutorResponse}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Testing..." : "Test Tutor Response"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={testDirectConversationCreation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            Test Direct Conversation Creation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={testConversationServiceDirectly}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            Test Conversation Service Directly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={navigateToChat}
          disabled={!conversationId}
        >
          <Text style={styles.buttonText}>Navigate to Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
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
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  successButton: {
    backgroundColor: "#4CAF50",
  },
  infoButton: {
    backgroundColor: "#2196F3",
  },
  clearButton: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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

export default TestMatchConversation;
