import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { COLORS, SIZES } from "../constants";

const TestNavigation = ({ navigation }) => {
  const { userData } = useAuth();
  const [testResults, setTestResults] = useState([]);

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

  const testNavigation = async (screenName, description) => {
    try {
      addTestResult(`Navigate to ${screenName}`, "Testing...", description);

      console.log(`🔍 Testing navigation to: ${screenName}`);
      navigation.navigate(screenName);

      addTestResult(`Navigate to ${screenName}`, "PASSED", description);
    } catch (error) {
      console.error(`❌ Navigation error to ${screenName}:`, error);
      addTestResult(`Navigate to ${screenName}`, "FAILED", error.message);
    }
  };

  const runAllNavigationTests = () => {
    setTestResults([]);

    // Test basic navigation
    testNavigation("TutorHome", "Basic navigation to TutorHome");
    testNavigation("StudentHome", "Basic navigation to StudentHome");
    testNavigation("ChatList", "Basic navigation to ChatList");
    testNavigation("ChatDetail", "Basic navigation to ChatDetail");

    // Test role-based navigation
    if (userData?.role === "tutor") {
      testNavigation("TutorMessage", "Tutor-specific navigation");
      testNavigation("TutorProfile", "Tutor profile navigation");
    } else {
      testNavigation("StudentMessage", "Student-specific navigation");
      testNavigation("StudentProfile", "Student profile navigation");
    }
  };

  const testSpecificNavigation = () => {
    const screens = [
      "TutorHome",
      "TutorMessage",
      "StudentHome",
      "StudentMessage",
      "ChatList",
      "ChatDetail",
      "TutorProfile",
      "StudentProfile",
    ];

    screens.forEach((screen) => {
      testNavigation(screen, `Testing ${screen} navigation`);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Navigation Test</Text>
        <Text style={styles.subtitle}>Test navigation between screens</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <Text style={styles.infoText}>
          User ID: {userData?.id || "Not available"}
        </Text>
        <Text style={styles.infoText}>
          Role: {userData?.role || "Not available"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Controls</Text>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={runAllNavigationTests}
        >
          <Text style={styles.buttonText}>Run All Navigation Tests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={testSpecificNavigation}
        >
          <Text style={styles.buttonText}>Test Specific Screens</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={() => testNavigation("ChatList", "Direct ChatList test")}
        >
          <Text style={styles.buttonText}>Test ChatList Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.messageButton]}
          onPress={() => {
            if (userData?.role === "tutor") {
              testNavigation("TutorMessage", "Tutor message test");
            } else {
              testNavigation("StudentMessage", "Student message test");
            }
          }}
        >
          <Text style={styles.buttonText}>Test Message Navigation</Text>
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

export default TestNavigation;
