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
import { CustomDatePicker } from "../../components/common";
import { getUserRole } from "../../utils/storage";

const { width } = Dimensions.get("window");

const TutorSignupScreen = ({ navigation, route }) => {
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
    educationLevel: "",
    university: "",
    major: "",
    experienceYears: "",
    hourlyRate: "",
    introduction: "",
    subjectIds: [],
    profileImage: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const subjects = [
    { id: 1, name: "Toán học" },
    { id: 2, name: "Vật lý" },
    { id: 3, name: "Hóa học" },
    { id: 4, name: "Sinh học" },
    { id: 5, name: "Văn học" },
    { id: 6, name: "Tiếng Anh" },
    { id: 7, name: "Lịch sử" },
    { id: 8, name: "Địa lý" },
  ];

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

  const toggleSubject = (subjectId) => {
    const newSubjectIds = form.subjectIds.includes(subjectId)
      ? form.subjectIds.filter((id) => id !== subjectId)
      : [...form.subjectIds, subjectId];
    handleChange("subjectIds", newSubjectIds);
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    if (!form.fullName.trim()) newErrors.fullName = "Họ tên là bắt buộc";
    if (!form.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^\d{9,11}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (9-11 số)";
    }
    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
    } else {
      const selectedDate = new Date(form.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      if (age < 18 || age > 100) {
        newErrors.dateOfBirth =
          "Ngày sinh không hợp lệ (phải từ 18 tuổi trở lên)";
      }
    }
    if (!form.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự";
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    if (!form.educationLevel.trim())
      newErrors.educationLevel = "Trình độ học vấn là bắt buộc";
    if (form.subjectIds.length === 0) {
      newErrors.subjectIds = "Vui lòng chọn ít nhất một môn học";
    }
    if (form.profileImage && !/^https?:\/\/.+/.test(form.profileImage)) {
      newErrors.profileImage = "Link ảnh không hợp lệ";
    }

    // Optional validations
    if (
      form.experienceYears &&
      (isNaN(form.experienceYears) || form.experienceYears < 0)
    ) {
      newErrors.experienceYears = "Số năm kinh nghiệm không hợp lệ";
    }
    if (form.hourlyRate && (isNaN(form.hourlyRate) || form.hourlyRate < 0)) {
      newErrors.hourlyRate = "Giá tiền/giờ không hợp lệ";
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
        console.log("🎯 TutorSignupScreen - About to call selectRole API");
        console.log("📋 Role data to send:", {
          role: String(savedRole || 2),
        });
        console.log("💾 Saved role from storage:", savedRole);

        const roleResult = await authService.selectRole({
          role: String(savedRole || 2), // Convert to string
        });
        console.log("✅ TutorSignupScreen - Role selected:", roleResult);

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
          schoolName: "string",
          gradeLevel: "string",
          learningGoals: "string",
          budgetMin: form.budgetMin ? parseFloat(form.budgetMin) : 0,
          budgetMax: form.budgetMax ? parseFloat(form.budgetMax) : 0,
          educationLevel: form.educationLevel || "string",
          university: form.university || "string",
          major: form.major || "string",
          experienceYears: form.experienceYears
            ? parseInt(form.experienceYears)
            : 0,
          hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : 0,
          introduction: form.introduction || "string",
          subjectIds: form.subjectIds.length > 0 ? form.subjectIds : [1, 2, 3],
          profileImage: form.profileImage || "https://via.placeholder.com/150",
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
            [{ text: "OK", onPress: () => navigation.navigate("TutorLogin") }]
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

      // COMMENT OUT - Không cần gọi registerTutor nữa vì đã hoàn thành ở selectRole
      /*
      // Cuối cùng gọi API đăng ký tutor với thông tin chi tiết
      const tutorData = {
        email: form.email,
        fullName: form.fullName,
        password: form.password, // Thêm password theo yêu cầu của API
        phone: form.phone || null,
        dateOfBirth: form.dateOfBirth
          ? new Date(form.dateOfBirth).toISOString()
          : null,
        educationLevel: form.educationLevel,
        university: form.university || null,
        major: form.major || null,
        experienceYears: form.experienceYears
          ? parseInt(form.experienceYears)
          : 0,
        hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : 0,
        introduction: form.introduction || null,
        subjectIds: form.subjectIds.length > 0 ? form.subjectIds : null,
      };

      console.log("🎯 TutorSignupScreen - About to call registerTutor API");
      console.log("📋 Tutor data to send:", JSON.stringify(tutorData, null, 2));
      console.log("📝 Form data:", form);

      const tutorResult = await authService.registerTutor(tutorData);
      console.log("✅ TutorSignupScreen - Tutor registered:", tutorResult);

      // Check success field instead of just relying on no exception
      if (tutorResult && tutorResult.success === true) {
        Alert.alert(
          "Thành công",
          tutorResult.message || "Đăng ký thành công!",
          [{ text: "OK", onPress: () => navigation.navigate("TutorLogin") }]
        );
      } else {
        throw new Error(tutorResult?.message || "Đăng ký thất bại");
      }
      */
    } catch (error) {
      console.error("Register error:", error);

      // Extract meaningful error message
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
          <Text style={styles.title}>Đăng Ký Gia Sư</Text>
          <Text style={styles.subtitle}>Tạo tài khoản gia sư của bạn</Text>
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
            label="Số điện thoại *"
            placeholder="0123456789"
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color="#666" />}
            error={errors.phone}
          />
          <Text style={styles.label}>Ngày sinh</Text>
          <CustomDatePicker
            value={form.dateOfBirth}
            onDateChange={(date) => handleChange("dateOfBirth", date)}
            placeholder="Chọn ngày sinh"
            minAge={18}
            maxAge={100}
            error={errors.dateOfBirth}
          />
          {errors.dateOfBirth && (
            <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
          )}

          <Text style={styles.label}>Trình độ học vấn *</Text>
          <View
            style={[
              styles.pickerWrapper,
              errors.educationLevel && styles.errorInput,
            ]}
          >
            <Picker
              selectedValue={form.educationLevel}
              onValueChange={(value) => handleChange("educationLevel", value)}
              style={{ color: form.educationLevel ? "#000" : "#999" }}
            >
              <Picker.Item label="Chọn trình độ học vấn" value="" />
              <Picker.Item label="THPT" value="THPT" />
              <Picker.Item label="Cao đẳng" value="Cao đẳng" />
              <Picker.Item label="Đại học" value="Đại học" />
              <Picker.Item label="Thạc sĩ" value="Thạc sĩ" />
              <Picker.Item label="Tiến sĩ" value="Tiến sĩ" />
            </Picker>
          </View>
          {errors.educationLevel && (
            <Text style={styles.errorText}>{errors.educationLevel}</Text>
          )}

          <Input
            label="Trường đại học"
            placeholder="Tên trường đại học"
            value={form.university}
            onChangeText={(text) => handleChange("university", text)}
            leftIcon={<Ionicons name="school-outline" size={20} color="#666" />}
            error={errors.university}
          />
          <Input
            label="Chuyên ngành"
            placeholder="Chuyên ngành học"
            value={form.major}
            onChangeText={(text) => handleChange("major", text)}
            leftIcon={
              <Ionicons name="library-outline" size={20} color="#666" />
            }
            error={errors.major}
          />
          <Input
            label="Năm kinh nghiệm"
            placeholder="0"
            value={form.experienceYears}
            onChangeText={(text) => handleChange("experienceYears", text)}
            keyboardType="numeric"
            leftIcon={<Ionicons name="time-outline" size={20} color="#666" />}
            error={errors.experienceYears}
          />
          <Input
            label="Giá/giờ (VNĐ)"
            placeholder="100000"
            value={form.hourlyRate}
            onChangeText={(text) => handleChange("hourlyRate", text)}
            keyboardType="numeric"
            leftIcon={<Ionicons name="cash-outline" size={20} color="#666" />}
            error={errors.hourlyRate}
          />

          <Input
            label="Giới thiệu bản thân"
            placeholder="Mô tả về bản thân và kinh nghiệm giảng dạy"
            value={form.introduction}
            onChangeText={(text) => handleChange("introduction", text)}
            leftIcon={<Ionicons name="person-outline" size={20} color="#666" />}
            error={errors.introduction}
            multiline
            numberOfLines={3}
          />

          <Input
            label="Link ảnh đại diện"
            placeholder="https://example.com/avatar.jpg"
            value={form.profileImage}
            onChangeText={(text) => handleChange("profileImage", text)}
            leftIcon={<Ionicons name="image-outline" size={20} color="#666" />}
            error={errors.profileImage}
          />

          <Text style={styles.label}>Môn học dạy *</Text>
          <View style={styles.subjectsContainer}>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectChip,
                  form.subjectIds.includes(subject.id) && styles.selectedChip,
                ]}
                onPress={() => toggleSubject(subject.id)}
              >
                <Text
                  style={[
                    styles.subjectText,
                    form.subjectIds.includes(subject.id) && styles.selectedText,
                  ]}
                >
                  {subject.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.subjectIds && (
            <Text style={styles.errorText}>{errors.subjectIds}</Text>
          )}

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
          onPress={() => navigation.navigate("TutorLogin")}
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
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
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
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  dateInputContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  subjectChip: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: "#f9f9f9",
  },
  selectedChip: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  subjectText: {
    fontSize: 14,
    color: "#666",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
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

export default TutorSignupScreen;
