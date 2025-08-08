import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import authService from "../../services/core/authService";
import { setUserRole } from "../../utils/storage";

const { width, height } = Dimensions.get("window");

const RoleSelectionScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Check if we're in registration flow (has accountData) or login flow
  const accountData = route?.params?.accountData;
  const isRegistrationFlow = !!accountData;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSelectRole = async (role) => {
    setLoading(true);

    try {
      // Save user role selection to storage
      const roleNumber = role === "Gia sư" ? 2 : 1; // Gia sư = 2, Sinh viên = 1
      await setUserRole(roleNumber);

      if (isRegistrationFlow) {
        // Registration flow: call selectRole API
        const roleData = {
          email: accountData.email,
          role: role === "Gia sư" ? "Tutor" : "Student",
        };

        console.log("🎯 RoleSelectionScreen - About to call selectRole API");
        console.log("📋 Role data to send:", roleData);
        console.log("📧 Account data:", accountData);
        console.log("🎭 Selected role:", role);
        console.log("🔢 Role number saved:", roleNumber);

        await authService.selectRole(roleData);

        // Navigate to appropriate signup screen with account data
        if (role === "Gia sư") {
          navigation.navigate("TutorSignup", {
            accountData,
            skipAccountRegistration: true,
          });
        } else if (role === "Phụ huynh / Học viên") {
          navigation.navigate("StudentRegister", {
            accountData,
            skipAccountRegistration: true,
          });
        }
      } else {
        // Login flow: navigate directly to login screen
        if (role === "Gia sư") {
          navigation.navigate("TutorLogin");
        } else if (role === "Phụ huynh / Học viên") {
          navigation.navigate("StudentLogin");
        }
      }
    } catch (error) {
      console.error("Role selection error:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Có lỗi xảy ra khi chọn vai trò. Vui lòng thử lại.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePressIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient colors={["#ffffff", "#f8f9fa"]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Background Decorative Dots */}
      <View style={styles.backgroundDots}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
        <View style={[styles.dot, styles.dot4]} />
        <View style={[styles.dot, styles.dot5]} />
        <View style={[styles.dot, styles.dot6]} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.roleQuestion}>
            {isRegistrationFlow
              ? "Hoàn tất đăng ký - Chọn loại tài khoản"
              : "Chọn loại tài khoản của bạn"}
          </Text>

          <Text style={styles.roleDescription}>
            Vui lòng chọn vai trò phù hợp để tiếp tục
          </Text>
        </Animated.View>

        {/* Role Selection Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View style={styles.roleCardWrapper}>
            <TouchableOpacity
              style={[styles.roleCard, loading && styles.disabledCard]}
              onPress={() => handleSelectRole("Gia sư")}
              disabled={loading}
              activeOpacity={1}
              onPressIn={() => handlePressIn(scaleAnim)}
              onPressOut={() => handlePressOut(scaleAnim)}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="school-outline" size={48} color="#000000" />
                </View>
                <Text style={styles.roleTitle}>Gia Sư</Text>
                <Text style={styles.roleSubtitle}>
                  Dạy học và chia sẻ kiến thức
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={styles.roleCardWrapper}>
            <TouchableOpacity
              style={[styles.roleCard, loading && styles.disabledCard]}
              onPress={() => handleSelectRole("Phụ huynh / Học viên")}
              disabled={loading}
              activeOpacity={1}
              onPressIn={() => handlePressIn(scaleAnim)}
              onPressOut={() => handlePressOut(scaleAnim)}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person-outline" size={48} color="#000000" />
                </View>
                <Text style={styles.roleTitle}>Phụ Huynh / Học Viên</Text>
                <Text style={styles.roleSubtitle}>
                  Tìm kiếm gia sư chất lượng
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>Đang xử lý...</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  roleQuestion: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  roleDescription: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
  roleCardWrapper: {
    width: "100%",
  },
  roleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  cardContent: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  roleSubtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  disabledCard: {
    opacity: 0.6,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
  },
  backgroundDots: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  dot: {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  dot1: {
    top: height * 0.15,
    left: width * 0.1,
    width: 8,
    height: 8,
  },
  dot2: {
    top: height * 0.25,
    right: width * 0.15,
    width: 12,
    height: 12,
  },
  dot3: {
    bottom: height * 0.2,
    left: width * 0.2,
    width: 6,
    height: 6,
  },
  dot4: {
    bottom: height * 0.3,
    right: width * 0.1,
    width: 10,
    height: 10,
  },
  dot5: {
    top: height * 0.4,
    left: width * 0.3,
    width: 14,
    height: 14,
  },
  dot6: {
    bottom: height * 0.4,
    right: width * 0.25,
    width: 8,
    height: 8,
  },
});

export default RoleSelectionScreen;
