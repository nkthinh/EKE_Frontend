import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { authService } from "../../services";
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
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    setErrors((prev) => ({ ...prev, [key]: null })); // clear error when editing
  };

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
    if (form.subjectIds.length === 0)
      newErrors.subjectIds = "Vui lòng chọn ít nhất một môn học";
    if (!form.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự";
    }

    // Optional validations
    if (form.phone && !/^\d{9,11}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
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

  const renderInput = (
    label,
    key,
    placeholder,
    keyboardType = "default",
    secure = false
  ) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={[styles.input, errors[key] && { borderColor: "red" }]}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        value={form[key]}
        onChangeText={(text) => handleChange(key, text)}
      />
      {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
    </>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Image source={require("../../assets/logo1.png")} style={styles.logo} />
      <Text style={styles.title}>Đăng Ký</Text>

      <View style={styles.inputContainer}>
        {renderInput("Họ Và Tên *", "fullName", "Nguyễn Văn A")}
        {renderInput("Email *", "email", "example@email.com", "email-address")}
        {renderInput("Số Điện Thoại", "phone", "0123456789", "phone-pad")}
        {renderInput("Ngày Sinh", "dateOfBirth", "DD/MM/YYYY")}

        <Text style={styles.label}>Trình Độ Học Vấn *</Text>
        <View
          style={[
            styles.pickerWrapper,
            errors.educationLevel && { borderColor: "red" },
          ]}
        >
          <Picker
            selectedValue={form.educationLevel}
            onValueChange={(value) => handleChange("educationLevel", value)}
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
          <Text style={styles.error}>{errors.educationLevel}</Text>
        )}

        {renderInput("Trường Đại Học", "university", "Tên trường đại học")}
        {renderInput("Chuyên Ngành", "major", "Chuyên ngành học")}
        {renderInput("Năm Kinh Nghiệm", "experienceYears", "0", "numeric")}
        {renderInput("Giá/Giờ (VNĐ)", "hourlyRate", "100000", "numeric")}

        <Text style={styles.label}>Giới Thiệu Bản Thân</Text>
        <TextInput
          placeholder="Mô tả về bản thân, kinh nghiệm giảng dạy..."
          style={[
            styles.textArea,
            errors.introduction && { borderColor: "red" },
          ]}
          value={form.introduction}
          onChangeText={(text) => handleChange("introduction", text)}
          multiline
          numberOfLines={4}
        />
        {errors.introduction && (
          <Text style={styles.error}>{errors.introduction}</Text>
        )}

        <Text style={styles.label}>Môn Học Giảng Dạy</Text>
        <View style={styles.subjectsContainer}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[
                styles.subjectButton,
                form.subjectIds.includes(subject.id) &&
                  styles.subjectButtonSelected,
              ]}
              onPress={() => toggleSubject(subject.id)}
            >
              <Text
                style={[
                  styles.subjectButtonText,
                  form.subjectIds.includes(subject.id) &&
                    styles.subjectButtonTextSelected,
                ]}
              >
                {subject.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderInput("Mật Khẩu *", "password", "Mật khẩu", "default", true)}
        {renderInput(
          "Nhập Lại Mật Khẩu *",
          "confirmPassword",
          "Nhập lại mật khẩu",
          "default",
          true
        )}
      </View>

      <Text style={styles.policy}>
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <Text style={{ fontWeight: "bold" }}>Điều khoản sử dụng</Text> và{" "}
        <Text style={{ fontWeight: "bold" }}>Chính sách bảo mật</Text>.
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang đăng ký..." : "Đăng Ký"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("TutorLogin")}>
        <Text style={styles.loginHint}>
          Bạn đã có tài khoản?{" "}
          <Text style={{ textDecorationLine: "underline" }}>
            Đăng Nhập ngay
          </Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffefb",
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 25,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  logo: {
    width: width * 0.35,
    height: 120,
    resizeMode: "contain",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    color: "#007bff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    marginBottom: 6,
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
    paddingLeft: 10,
  },
  policy: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#31B7EC",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginHint: {
    fontSize: 13,
    color: "#333",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  textArea: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 4,
    textAlignVertical: "top",
    minHeight: 80,
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  subjectButton: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: "#fff",
  },
  subjectButtonSelected: {
    backgroundColor: "#31B7EC",
    borderColor: "#31B7EC",
  },
  subjectButtonText: {
    fontSize: 14,
    color: "#333",
  },
  subjectButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TutorSignupScreen;
