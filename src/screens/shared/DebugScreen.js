import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useMatch } from "../../hooks/useMatch";
import { isTutor } from "../../utils/navigation";

const DebugScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const { likedStudents, fetchLikedStudents, loading, error } = useMatch();
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    updateDebugInfo();
  }, [userData, likedStudents, loading, error]);

  const updateDebugInfo = () => {
    const info = `
=== DEBUG INFO ===
User Data:
- ID: ${userData?.id || "N/A"}
- Role: ${userData?.role || "N/A"}
- Is Tutor: ${isTutor(userData?.role) ? "YES" : "NO"}
- Full Name: ${userData?.fullName || "N/A"}

Liked Students:
- Count: ${likedStudents?.length || 0}
- Data: ${JSON.stringify(likedStudents, null, 2)}

Loading: ${loading}
Error: ${error || "None"}
    `;
    setDebugInfo(info);
  };

  const handleTestFetch = async () => {
    console.log("🧪 Testing fetchLikedStudents...");
    try {
      await fetchLikedStudents();
      Alert.alert("Success", "fetchLikedStudents completed");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAutoFetch = () => {
    console.log("🚀 Triggering auto-fetch...");
    if (userData?.id && isTutor(userData?.role)) {
      fetchLikedStudents();
    } else {
      Alert.alert("Error", "User not available or not a tutor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Screen</Text>

      <TouchableOpacity style={styles.button} onPress={handleTestFetch}>
        <Text style={styles.buttonText}>Test fetchLikedStudents</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAutoFetch}>
        <Text style={styles.buttonText}>Auto Fetch (like TutorHomeScreen)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={updateDebugInfo}>
        <Text style={styles.buttonText}>Refresh Debug Info</Text>
      </TouchableOpacity>

      <ScrollView style={styles.debugContainer}>
        <Text style={styles.debugText}>{debugInfo}</Text>
      </ScrollView>
    </View>
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
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  debugContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  debugText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
});

export default DebugScreen;
