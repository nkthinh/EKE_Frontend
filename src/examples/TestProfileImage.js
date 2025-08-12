import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TestProfileImage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Profile Image Feature</Text>
      <Text style={styles.subtitle}>Các thay đổi đã được thực hiện:</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. StudentRegisterScreen</Text>
        <Text style={styles.item}>
          ✓ Thêm trường profileImage vào form state
        </Text>
        <Text style={styles.item}>✓ Thêm validation cho profileImage</Text>
        <Text style={styles.item}>✓ Thêm input field cho profileImage</Text>
        <Text style={styles.item}>✓ Gửi profileImage trong API call</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. TutorSignupScreen</Text>
        <Text style={styles.item}>
          ✓ Thêm trường profileImage vào form state
        </Text>
        <Text style={styles.item}>✓ Thêm validation cho profileImage</Text>
        <Text style={styles.item}>✓ Thêm input field cho profileImage</Text>
        <Text style={styles.item}>✓ Gửi profileImage trong API call</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Profile Screens</Text>
        <Text style={styles.item}>✓ Cập nhật Student ProfileScreen</Text>
        <Text style={styles.item}>✓ Cập nhật Tutor ProfileScreen</Text>
        <Text style={styles.item}>✓ Cập nhật TutorProfileView</Text>
        <Text style={styles.item}>✓ Cập nhật UpdateProfile</Text>
        <Text style={styles.item}>✓ Cập nhật TutorProfileStep1</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Display Screens</Text>
        <Text style={styles.item}>✓ Cập nhật HomeScreen (tutor cards)</Text>
        <Text style={styles.item}>✓ Cập nhật LecturerDetailScreen</Text>
        <Text style={styles.item}>✓ TutorLikedStudentsScreen (đã có sẵn)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Validation</Text>
        <Text style={styles.item}>✓ Kiểm tra format URL hợp lệ</Text>
        <Text style={styles.item}>✓ Hiển thị lỗi validation</Text>
        <Text style={styles.item}>✓ Fallback về ảnh mặc định</Text>
      </View>

      <Text style={styles.note}>
        Lưu ý: Người dùng chỉ cần nhập link ảnh (URL), không cần upload file.
      </Text>
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
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#31B7EC",
  },
  item: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  note: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
  },
});

export default TestProfileImage;
