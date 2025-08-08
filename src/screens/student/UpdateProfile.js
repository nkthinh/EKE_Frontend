import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import StudentLayout from "../../components/navigation/StudentLayout";
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

const UpdateProfile = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Cá nhân");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Thành Phố Hồ Chí Minh");
  const [studentFullName, setStudentFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [className, setClassName] = useState("");
  const [academicPerformance, setAcademicPerformance] = useState("Trung Bình");

  const handleDateChange = (text) => {
    // Simple date validation (e.g., dd/mm/yyyy format)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
      setBirthDate(text);
    }
  };

  return (
    <StudentLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Cập Nhật Hồ Sơ</Text>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleTab,
              activeTab === "Cá nhân" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Cá nhân")}
          >
            <Text
              style={[
                styles.toggleText,
                activeTab === "Cá nhân" && styles.activeText,
              ]}
            >
              Cá nhân
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleTab,
              activeTab === "Thông Tin Học Sinh" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("Thông Tin Học Sinh")}
          >
            <Text
              style={[
                styles.toggleText,
                activeTab === "Thông Tin Học Sinh" && styles.activeText,
              ]}
            >
              Thông Tin Học Sinh
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "Cá nhân" ? (
          <>
            <View style={styles.profileImageContainer}>
              <Image
                source={require("../../assets/girl.jpg")}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              onChangeText={setFullName}
              placeholder="Họ và tên"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPhone}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Tỉnh/Thành Phố</Text>
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={city}
                style={styles.picker}
                onValueChange={(itemValue) => setCity(itemValue)}
              >
                <Picker.Item
                  label="Thành Phố Hồ Chí Minh"
                  value="Thành Phố Hồ Chí Minh"
                />
                <Picker.Item label="Hà Nội" value="Hà Nội" />
                <Picker.Item label="Đà Nẵng" value="Đà Nẵng" />
              </Picker>
            </View>
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueText}>Tiếp Tục</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.studentContainer}>
              <View style={styles.studentHeader}>
                <Text style={styles.studentTitle}>Học Sinh 1</Text>
                <TouchableOpacity>
                  <Icon name="trash" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                onChangeText={setStudentFullName}
                placeholder="Họ và tên"
                value={studentFullName}
              />
              <Text style={styles.label}>Ngày sinh</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleDateChange}
                placeholder="dd/mm/yyyy"
                value={birthDate}
                keyboardType="numeric"
              />
              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={className}
                  style={styles.picker}
                  onValueChange={(itemValue) => setClassName(itemValue)}
                >
                  <Picker.Item label="Nữ" value="Nữ" />
                </Picker>
              </View>
              <Text style={styles.label}>Học lực</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={academicPerformance}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setAcademicPerformance(itemValue)
                  }
                >
                  <Picker.Item label="Trung Bình" value="Trung Bình" />
                  <Picker.Item label="Khá" value="Khá" />
                  <Picker.Item label="Giỏi" value="Giỏi" />
                </Picker>
              </View>
            </View>
            <TouchableOpacity style={styles.addStudentButton}>
              <Text style={styles.addStudentText}>Thêm Học Sinh</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backText}>Quay lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitText}>Hoàn Thành</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </StudentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  backArrow: {
    fontSize: 24,
    color: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#31B7EC",
  },
  toggleText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  activeText: {
    color: "#31B7EC",
    fontWeight: "bold",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 55,
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#31B7EC",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "30%",
    alignSelf: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  studentContainer: {
    marginTop: 20,
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  studentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#31B7EC",
  },
  addStudentButton: {
    backgroundColor: "#ccc",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addStudentText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#ccc",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  backText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#31B7EC",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UpdateProfile;
