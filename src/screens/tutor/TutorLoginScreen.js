import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import EKEImage from "../../assets/EKE.jpg";
import { LinearGradient } from "expo-linear-gradient";
import { authService } from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { navigateToHomeByRole } from "../../utils/navigation";
import Input from "../../components/common/Input";

export default function TutorLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const user = response.user || response.data?.user;
      const role = user?.role;
      const accessToken = response.accessToken || response.data?.accessToken;

      console.log("TutorLoginScreen - Response:", response);
      console.log("TutorLoginScreen - User:", user);
      console.log("TutorLoginScreen - Role:", role);
      console.log("TutorLoginScreen - AccessToken:", accessToken);
      console.log(
        "🔍 TutorLoginScreen - Full response:",
        JSON.stringify(response, null, 2)
      );
      console.log("👤 User object:", JSON.stringify(user, null, 2));

      if (user && accessToken) {
        await login(accessToken, user, role);
      }

      if (user && role) {
        // Use utility function for consistent navigation
        navigateToHomeByRole(navigation, role, "TutorLoginScreen");
      } else {
        console.log("⚠️ No user or role, navigating to TutorHome");
        navigation.replace("TutorHome");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Lỗi đăng nhập", error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigation.navigate("TutorSignup");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("RoleSelection")}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={EKEImage} style={styles.logo} />
          <Text style={styles.title}>Đăng Nhập Gia Sư</Text>
          <Text style={styles.subtitle}>Chào mừng trở lại!</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="example@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color="#666" />}
          />
          <Input
            label="Mật khẩu"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
            }
          />

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#000", "#333"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegisterRedirect}
            activeOpacity={0.8}
          >
            <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialIconsContainer}>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-google" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-facebook" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-twitter" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thông Tin Hỗ Trợ</Text>
          <Text style={styles.footerText}>
            Giới Thiệu • Điều Khoản • Chính Sách
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 20,
    padding: 6,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 24,
  },
  logo: {
    width: 120,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  form: {
    marginBottom: 24,
  },
  loginButton: {
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  registerButton: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  registerText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500",
    textDecorationLine: "underline",
    letterSpacing: 0.2,
  },
  forgotButton: {
    alignItems: "flex-end",
    marginBottom: 4,
    marginTop: -8,
  },
  forgotPassword: {
    color: "#666",
    fontSize: 14,
    textAlign: "right",
    textDecorationLine: "underline",
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 12,
  },
  socialIcon: {
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    padding: 12,
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    color: "#666",
    fontSize: 12,
    marginBottom: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
