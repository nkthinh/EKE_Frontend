// SplashScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../hooks/useAuth";
import { navigateToHomeByRole } from "../../utils/navigation";
import { debugStorage } from "../../utils/debugStorage";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const checkAuthState = async () => {
      try {
        // Debug storage data
        const debugData = await debugStorage();
        console.log("=== SPLASH SCREEN DEBUG ===");
        console.log("isAuthenticated:", isAuthenticated);
        console.log("userRole:", userRole);
        console.log("loading:", loading);
        console.log("Debug data:", debugData);

        // Đợi cho đến khi hook useAuth hoàn thành việc kiểm tra
        if (loading) return;

        if (isAuthenticated && userRole) {
          // Nếu đã đăng nhập, chuyển đến màn hình tương ứng
          // Use utility function for consistent navigation
          navigateToHomeByRole(navigation, userRole, "SplashScreen");
        } else {
          // Nếu chưa đăng nhập, chuyển đến onboarding
          console.log("Not authenticated, navigating to Onboarding");
          navigation.replace("Onboarding");
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        navigation.replace("Onboarding");
      }
    };

    const timer = setTimeout(() => {
      checkAuthState();
    }, 3000); // 3 giây

    return () => clearTimeout(timer);
  }, [isAuthenticated, userRole, loading]);

  return (
    <LinearGradient
      colors={["#ffffff", "#f8f9fa", "#e9ecef"]}
      style={styles.container}
    >
      <View style={styles.backgroundPattern}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
      </View>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <Image source={require("../../assets/logo1.png")} style={styles.logo} />
        <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>
          EKE Education
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
          Nền tảng giáo dục thông minh
        </Animated.Text>
      </Animated.View>

      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>

      {/* Debug Button */}
      <TouchableOpacity
        style={[styles.debugButton, { opacity: fadeAnim }]}
        onPress={() => navigation.navigate("Debug")}
      >
        <Text style={styles.debugButtonText}>Debug</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundPattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    top: -50,
    right: -50,
  },
  circle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    bottom: 100,
    left: -30,
  },
  circle3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.015)",
    top: height * 0.3,
    right: 50,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    alignItems: "center",
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000000",
    marginHorizontal: 4,
  },
  dot1: {
    animationName: "pulse",
    animationDuration: "1.4s",
    animationIterationCount: "infinite",
    animationDelay: "0s",
  },
  dot2: {
    animationName: "pulse",
    animationDuration: "1.4s",
    animationIterationCount: "infinite",
    animationDelay: "0.2s",
  },
  dot3: {
    animationName: "pulse",
    animationDuration: "1.4s",
    animationIterationCount: "infinite",
    animationDelay: "0.4s",
  },
  debugButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  debugButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default SplashScreen;
