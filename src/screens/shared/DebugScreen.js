import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { debugStorage, clearAllUserData } from "../../utils/debugStorage";

const DebugScreen = ({ navigation }) => {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDebugData();
  }, []);

  const loadDebugData = async () => {
    setLoading(true);
    try {
      const data = await debugStorage();
      setDebugData(data);
    } catch (error) {
      console.error("Error loading debug data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa tất cả dữ liệu người dùng?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await clearAllUserData();
              await loadDebugData();
              Alert.alert("Thành công", "Đã xóa tất cả dữ liệu người dùng");
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa dữ liệu");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRestart = () => {
    navigation.replace("Splash");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug Screen</Text>

      <TouchableOpacity style={styles.button} onPress={loadDebugData}>
        <Text style={styles.buttonText}>Refresh Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.clearButton]}
        onPress={handleClearData}
      >
        <Text style={styles.buttonText}>Clear All User Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.restartButton]}
        onPress={handleRestart}
      >
        <Text style={styles.buttonText}>Restart App</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loading}>Loading...</Text>}

      {debugData && (
        <View style={styles.debugContainer}>
          <Text style={styles.sectionTitle}>Storage Data:</Text>

          <Text style={styles.label}>User Token:</Text>
          <Text style={styles.value}>{debugData.token || "null"}</Text>

          <Text style={styles.label}>User Role:</Text>
          <Text style={styles.value}>{debugData.userRole || "null"}</Text>

          <Text style={styles.label}>User Data:</Text>
          <Text style={styles.value}>
            {debugData.userData
              ? JSON.stringify(debugData.userData, null, 2)
              : "null"}
          </Text>

          <Text style={styles.label}>All Storage Keys:</Text>
          <Text style={styles.value}>
            {debugData.allKeys ? debugData.allKeys.join(", ") : "null"}
          </Text>
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
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
  },
  restartButton: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loading: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
  },
  debugContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default DebugScreen;
