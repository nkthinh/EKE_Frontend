import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useMatch } from "../hooks/useMatch";
import { useAuth } from "../hooks/useAuth";

const TestLikedStudents = () => {
  const { userData } = useAuth();
  const { likedStudents, fetchLikedStudents, loading, error } = useMatch();
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Auto fetch on mount
    handleFetchLikedStudents();
  }, []);

  const handleFetchLikedStudents = async () => {
    try {
      setDebugInfo("🔄 Fetching liked students...");
      const result = await fetchLikedStudents();

      setDebugInfo(
        (prev) => prev + `\n📥 Result: ${JSON.stringify(result, null, 2)}`
      );

      if (result) {
        setDebugInfo((prev) => prev + `\n✅ Fetch completed successfully`);
      } else {
        setDebugInfo((prev) => prev + `\n❌ No result returned`);
      }
    } catch (error) {
      setDebugInfo((prev) => prev + `\n❌ Error: ${error.message}`);
    }
  };

  const handleRefresh = () => {
    setDebugInfo("");
    handleFetchLikedStudents();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test Liked Students API</Text>

      <Text style={styles.userInfo}>
        Current User: {userData?.fullName || "Unknown"} (ID:{" "}
        {userData?.id || "N/A"})
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleFetchLikedStudents}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : "Fetch Liked Students"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.refreshButton]}
          onPress={handleRefresh}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Debug Information:</Text>
        <Text style={styles.debugText}>{debugInfo}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Current State:</Text>
        <Text style={styles.infoText}>Loading: {loading ? "Yes" : "No"}</Text>
        <Text style={styles.infoText}>Error: {error || "None"}</Text>
        <Text style={styles.infoText}>
          Liked Students Count: {likedStudents.length}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Liked Students Data:</Text>
        <Text style={styles.dataText}>
          {JSON.stringify(likedStudents, null, 2)}
        </Text>
      </View>

      {likedStudents.length > 0 && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Students List:</Text>
          {likedStudents.map((item, index) => (
            <View key={index} style={styles.studentItem}>
              <Text style={styles.studentText}>
                {index + 1}. ID: {item.id || item.studentId || "N/A"} - Name:{" "}
                {item.fullName || item.name || "Unknown"}
              </Text>
              {item.profileImage && (
                <Text style={styles.studentText}>
                  Image: {item.profileImage}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    minWidth: 150,
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  debugText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
  },
  dataText: {
    fontSize: 10,
    color: "#333",
    fontFamily: "monospace",
  },
  studentItem: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  studentText: {
    fontSize: 12,
    color: "#333",
  },
});

export default TestLikedStudents;
