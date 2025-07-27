import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import EKEImage from "../../assets/EKE.jpg";
import IIcon from "react-native-vector-icons/Ionicons";
import { authService } from "../../services";

export default function TutorLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { user } = response?.data;

      console.log("user", user);
      
      if (user.role == 2) {
        navigation.navigate("StudentHomeScreen");
      } else {
        Alert.alert("Lỗi", "Tài khoản này không phải là tài khoản gia sư");
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
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("RoleSelection")}>
        <IIcon name="arrow-back" size={30} color="#ff4444" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={EKEImage} style={styles.logo} />
        <Text style={styles.title}>Đăng Nhập Gia Sư</Text>
        <Text style={styles.subtitle}>Chào mừng trở lại!</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật Khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={[styles.loginButton, loading && styles.disabledButton]} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegisterRedirect}
      >
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Quên Mật Khẩu?</Text>
      </TouchableOpacity>

      <View style={styles.socialIconsContainer}>
        <Icon
          name="instagram"
          size={30}
          color="#000"
          style={styles.socialIcon}
        />
        <Icon name="google" size={30} color="#000" style={styles.socialIcon} />
        <Icon name="twitter" size={30} color="#000" style={styles.socialIcon} />
        <Icon
          name="whatsapp"
          size={30}
          color="#000"
          style={styles.socialIcon}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Thông Tin Hỗ Trợ</Text>
        <Text style={styles.footerText}>
          Giới Thiệu • Điều Khoản • Chính Sách
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: "100%",
    maxWidth: 200,
    height: 130,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    padding: 10,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
    width: "60%",
    alignSelf: "center",
  },
  registerButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    width: "60%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  forgotPassword: {
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialIcon: {
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    width: 40,
    height: 40,
    textAlign: "center",
    lineHeight: 30,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 12,
  },
});