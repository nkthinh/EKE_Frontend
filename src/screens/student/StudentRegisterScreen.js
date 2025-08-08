import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { authService } from "../../services";
import Input from "../../components/common/Input";
import { getUserRole } from "../../utils/storage";

const { width } = Dimensions.get("window");

const StudentRegisterScreen = ({ navigation, route }) => {
  // Get account data from previous screen (if coming from role selection)
  const accountData = route?.params?.accountData;
  const skipAccountRegistration = route?.params?.skipAccountRegistration;

  const [form, setForm] = useState({
    fullName: accountData?.fullName || "",
    email: accountData?.email || "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    schoolName: "",
    gradeLevel: "",
    learningGoals: "",
    budgetMin: "",
    budgetMax: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors((prev) => ({ ...prev, [key]: null }));

    // Kiểm tra email khi user nhập
    if (key === "email" && value && /^\S+@\S+\.\S+$/.test(value)) {
      checkEmailAvailability(value);
    }
  };

  const checkEmailAvailability = useCallback(async (email) => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return;

    setCheckingEmail(true);
    try {
      await authService.checkEmail(email);
      // Email available - không cần làm gì
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors((prev) => ({ ...prev, email: "Email này đã được đăng ký" }));
      }
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Họ tên là bắt buộc";
    if (!form.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (form.phone && !/^\d{9,11}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!form.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (form.budgetMin && (isNaN(form.budgetMin) || form.budgetMin < 0)) {
      newErrors.budgetMin = "Ngân sách tối thiểu không hợp lệ";
    }
    if (form.budgetMax && (isNaN(form.budgetMax) || form.budgetMax < 0)) {
      newErrors.budgetMax = "Ngân sách tối đa không hợp lệ";
    }
    if (
      form.budgetMin &&
      form.budgetMax &&
      parseFloat(form.budgetMin) > parseFloat(form.budgetMax)
    ) {
      newErrors.budgetMax = "Ngân sách tối đa phải lớn hơn ngân sách tối thiểu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (!skipAccountRegistration) {
        // Gọi API đăng ký account trước (chỉ khi chưa có account)
        const accountDataToRegister = {
          email: form.email,
          password: form.password,
          fullName: form.fullName,
        };

        const accountResult = await authService.registerAccount(
          accountDataToRegister
        );
        console.log("Account registered:", accountResult);

        if (!accountResult || accountResult.success !== true) {
          throw new Error(
            accountResult?.message || "Đăng ký tài khoản thất bại"
          );
        }

        // Sau đó gọi API chọn role với role đã lưu trong storage
        const savedRole = await getUserRole();
        console.log("🎯 StudentRegisterScreen - About to call selectRole API");
        console.log("📋 Role data to send:", {
          role: String(savedRole || 1),
        });
        console.log("💾 Saved role from storage:", savedRole);

        const roleResult = await authService.selectRole({
          role: String(savedRole || 1), // Convert to string
        });
        console.log("✅ StudentRegisterScreen - Role selected:", roleResult);

        if (!roleResult || roleResult.success !== true) {
          throw new Error(roleResult?.message || "Chọn vai trò thất bại");
        }

        // Sau khi chọn role thành công, gọi API register/profile với giá trị mặc định
        console.log("🎯 Role selection completed successfully!");
        console.log("📋 Full roleResult:", JSON.stringify(roleResult, null, 2));

        // Chuẩn bị data cho API register/profile với giá trị mặc định
        const profileData = {
          phone: form.phone || "092391203",
          dateOfBirth: form.dateOfBirth
            ? new Date(form.dateOfBirth).toISOString()
            : "2025-08-07T17:18:11.163Z",
          gender: "string",
          schoolName: form.schoolName || "string",
          gradeLevel: form.gradeLevel || "string",
          learningGoals: form.learningGoals || "string",
          budgetMin: form.budgetMin ? parseFloat(form.budgetMin) : 0,
          budgetMax: form.budgetMax ? parseFloat(form.budgetMax) : 0,
          educationLevel: "string",
          university: "string",
          major: "string",
          experienceYears: 0,
          hourlyRate: 0,
          introduction: "string",
          subjectIds: [1, 2, 3],
        };

        console.log("🎯 About to call register/profile API");
        console.log(
          "📋 Profile data to send:",
          JSON.stringify(profileData, null, 2)
        );

        const profileResult = await authService.completeProfile(profileData);
        console.log("✅ Profile completed:", profileResult);

        if (profileResult && profileResult.success === true) {
          Alert.alert(
            "Thành công",
            profileResult.message || "Đăng ký thành công!",
            [{ text: "OK", onPress: () => navigation.navigate("StudentLogin") }]
          );
        } else {
          throw new Error(
            profileResult?.message || "Hoàn thiện hồ sơ thất bại"
          );
        }
        return; // Kết thúc flow đăng ký
      }

      // Đoạn code này sẽ KHÔNG BAO GIỜ được thực thi vì đã return ở trên
      console.log("⚠️ This should never be reached!");

      // COMMENT OUT - Không cần gọi registerStudent nữa vì đã hoàn thành ở selectRole
      /*
      // Cuối cùng gọi API đăng ký student với thông tin chi tiết
      const studentData = {
        email: form.email,
        password: form.password || null, // Chỉ cần nếu chưa có account
        fullName: form.fullName,
        phone: form.phone || null,
        dateOfBirth: form.dateOfBirth
          ? new Date(form.dateOfBirth).toISOString()
          : null,
        schoolName: form.schoolName || null,
        gradeLevel: form.gradeLevel || null,
        learningGoals: form.learningGoals || null,
        budgetMin: form.budgetMin ? parseFloat(form.budgetMin) : 0,
        budgetMax: form.budgetMax ? parseFloat(form.budgetMax) : 0,
      };

      const studentResult = await authService.registerStudent(studentData);
      console.log("Student registered:", studentResult);

      // Check success field
      if (studentResult && studentResult.success === true) {
        Alert.alert(
          "Thành công",
          studentResult.message || "Đăng ký thành công!",
          [{ text: "OK", onPress: () => navigation.navigate("StudentLogin") }]
        );
      } else {
        throw new Error(studentResult?.message || "Đăng ký thất bại");
      }
      */
    } catch (error) {
      console.error("Register error:", error);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Đăng ký thất bại";

      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 409:
            errorMessage =
              "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.";
            // Set error cho field email
            setErrors((prev) => ({ ...prev, email: "Email đã tồn tại" }));
            break;
          case 400:
            errorMessage =
              data?.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
            break;
          case 500:
            errorMessage = "Lỗi server. Vui lòng thử lại sau.";
            break;
          default:
            errorMessage = data?.message || `Lỗi ${status}: Đăng ký thất bại`;
        }
      } else if (error.request) {
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      } else {
        errorMessage = error.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      }

      Alert.alert("Lỗi đăng ký", errorMessage);
    } finally {
      setLoading(false);
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

        <View style={styles.header}>
          <Image
            source={require("../../assets/logo1.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Đăng Ký Học Viên</Text>
          <Text style={styles.subtitle}>Tạo tài khoản học viên của bạn</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Họ và Tên *"
            placeholder="Nhập họ và tên"
            value={form.fullName}
            onChangeText={(text) => handleChange("fullName", text)}
            leftIcon={<Ionicons name="person-outline" size={20} color="#666" />}
            error={errors.fullName}
          />
          <Input
            label="Email *"
            placeholder="example@email.com"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Ionicons name="mail-outline" size={20} color="#666" />}
            rightIcon={
              checkingEmail ? (
                <Ionicons name="hourglass-outline" size={20} color="#666" />
              ) : null
            }
            error={errors.email}
          />
          <Input
            label="Số điện thoại"
            placeholder="0123456789"
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color="#666" />}
            error={errors.phone}
          />
          <Input
            label="Ngày sinh"
            placeholder="DD/MM/YYYY"
            value={form.dateOfBirth}
            onChangeText={(text) => handleChange("dateOfBirth", text)}
            leftIcon={
              <Ionicons name="calendar-outline" size={20} color="#666" />
            }
            error={errors.dateOfBirth}
          />
          <Input
            label="Tên trường"
            placeholder="Nhập tên trường"
            value={form.schoolName}
            onChangeText={(text) => handleChange("schoolName", text)}
            leftIcon={<Ionicons name="school-outline" size={20} color="#666" />}
            error={errors.schoolName}
          />
          <Text style={styles.label}>Lớp học</Text>
          <View
            style={[
              styles.pickerWrapper,
              errors.gradeLevel && styles.errorInput,
            ]}
          >
            <Picker
              selectedValue={form.gradeLevel}
              onValueChange={(value) => handleChange("gradeLevel", value)}
              style={{ color: form.gradeLevel ? "#000" : "#999" }}
            >
              <Picker.Item label="Chọn lớp học" value="" />
              <Picker.Item label="Lớp 1" value="1" />
              <Picker.Item label="Lớp 2" value="2" />
              <Picker.Item label="Lớp 3" value="3" />
              <Picker.Item label="Lớp 4" value="4" />
              <Picker.Item label="Lớp 5" value="5" />
              <Picker.Item label="Lớp 6" value="6" />
              <Picker.Item label="Lớp 7" value="7" />
              <Picker.Item label="Lớp 8" value="8" />
              <Picker.Item label="Lớp 9" value="9" />
              <Picker.Item label="Lớp 10" value="10" />
              <Picker.Item label="Lớp 11" value="11" />
              <Picker.Item label="Lớp 12" value="12" />
              <Picker.Item label="Đại học" value="University" />
            </Picker>
          </View>
          {errors.gradeLevel && (
            <Text style={styles.errorText}>{errors.gradeLevel}</Text>
          )}
          <Input
            label="Mục tiêu học tập"
            placeholder="Mô tả mục tiêu học tập của bạn"
            value={form.learningGoals}
            onChangeText={(text) => handleChange("learningGoals", text)}
            leftIcon={<Ionicons name="bulb-outline" size={20} color="#666" />}
            error={errors.learningGoals}
            multiline
            numberOfLines={3}
          />
          <Input
            label="Ngân sách tối thiểu (VNĐ/giờ)"
            placeholder="50000"
            value={form.budgetMin}
            onChangeText={(text) => handleChange("budgetMin", text)}
            keyboardType="numeric"
            leftIcon={<Ionicons name="cash-outline" size={20} color="#666" />}
            error={errors.budgetMin}
          />
          <Input
            label="Ngân sách tối đa (VNĐ/giờ)"
            placeholder="200000"
            value={form.budgetMax}
            onChangeText={(text) => handleChange("budgetMax", text)}
            keyboardType="numeric"
            leftIcon={<Ionicons name="cash-outline" size={20} color="#666" />}
            error={errors.budgetMax}
          />
          <Input
            label="Mật khẩu *"
            placeholder="Nhập mật khẩu"
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
            }
            error={errors.password}
          />
          <Input
            label="Xác nhận mật khẩu *"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            secureTextEntry
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
            }
            error={errors.confirmPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#000", "#333"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("StudentLogin")}
        >
          <Text style={styles.linkText}>
            Đã có tài khoản? <Text style={styles.linkTextBold}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 24,
  },
  logo: {
    width: width * 0.3,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  form: {
    width: "100%",
    marginBottom: 24,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
  },
  errorInput: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 8,
  },
  registerButton: {
    width: "100%",
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
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 30,
  },
  linkText: {
    fontSize: 16,
    color: "#666",
  },
  linkTextBold: {
    color: "#000",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default StudentRegisterScreen;
