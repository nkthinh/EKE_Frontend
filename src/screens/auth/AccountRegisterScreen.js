import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "../../components/common";
import { authService } from "../../services";

const AccountRegisterScreen = ({ navigation, route }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Gọi API đăng ký account cơ bản
      const accountData = {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      };

      const result = await authService.registerAccount(accountData);
      console.log("Account registered:", result);

      if (result && result.success === true) {
        Alert.alert("Thành công", "Tạo tài khoản thành công!", [
          {
            text: "OK",
            onPress: () => {
              // Chuyển đến màn hình chọn role với thông tin account
              navigation.navigate("RoleSelection", {
                accountData: {
                  email: form.email,
                  fullName: form.fullName,
                  accountId: result.data?.id || result.id,
                },
              });
            },
          },
        ]);
      } else {
        throw new Error(result?.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Register error:", error);

      let errorMessage = "Đăng ký thất bại";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Lỗi đăng ký", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
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
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <Image source={require("../../assets/logo1.png")} style={styles.logo} />
        <Text style={styles.title}>Tạo Tài Khoản</Text>
        <Text style={styles.subtitle}>Bắt đầu hành trình học tập của bạn</Text>

        <View style={styles.form}>
          <Input
            label="Họ và tên"
            placeholder="Nhập họ và tên đầy đủ"
            value={form.fullName}
            onChangeText={(value) => updateForm("fullName", value)}
            error={errors.fullName}
            leftIcon="person-outline"
          />

          <Input
            label="Email"
            placeholder="example@example.com"
            value={form.email}
            onChangeText={(value) => updateForm("email", value)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Input
            label="Mật khẩu"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            value={form.password}
            onChangeText={(value) => updateForm("password", value)}
            error={errors.password}
            secureTextEntry={!showPassword}
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChangeText={(value) => updateForm("confirmPassword", value)}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            leftIcon="lock-closed-outline"
            rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <Button
            title="Tạo Tài Khoản"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Đã có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("RoleSelection")}
            >
              <Text style={styles.loginLink}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },
  registerButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginPromptText: {
    fontSize: 16,
    color: "#666",
  },
  loginLink: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});

export default AccountRegisterScreen;
