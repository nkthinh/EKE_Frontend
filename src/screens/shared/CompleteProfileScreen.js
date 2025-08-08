import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // For icons
import { Picker } from "@react-native-picker/picker"; // For dropdown select
import DateTimePicker from "@react-native-community/datetimepicker"; // For date picker
import { useNavigation } from "@react-navigation/native";

export default function CompleteProfileScreen() {
  const [fullName, setFullName] = useState("example@example.com");
  const [gender, setGender] = useState("Nam");
  const [phoneNumber, setPhoneNumber] = useState("123 456 789");
  const [birthYear, setBirthYear] = useState(
    new Date("1990-01-01T00:00:00+07:00")
  ); // Explicitly set UTC+07:00 for Vietnam
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthYear;
    const adjustedDate = new Date(currentDate.getTime());
    setShowDatePicker(Platform.OS === "ios");
    setBirthYear(adjustedDate);
  };

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.topHeaderText}>Hồ Sơ</Text>
        <Text style={styles.headerText}>Hoàn thiện hồ sơ học viên</Text>
        <Text style={styles.subHeaderText}>
          Hoàn thiện hồ sơ còn lại để có thể trải nghiệm nền tảng tốt nhất
        </Text>
        <View style={styles.iconContainer}>
          <Icon name="user" size={50} color="white" style={styles.checkIcon} />
          <TouchableOpacity style={styles.editIconContainer}>
            <Icon name="pencil" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Form Section */}
      <View style={styles.formContainer}>
        {/* Họ và tên */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Họ và tên</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Giới tính */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              style={styles.picker}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Nam" value="Nam" />
              <Picker.Item label="Nữ" value="Nữ" />
            </Picker>
          </View>
        </View>

        {/* Số điện thoại */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="123 456 789"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />
        </View>

        {/* Năm sinh */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Năm sinh</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {birthYear.toLocaleDateString("vi-VN")}{" "}
              {/* Use Vietnamese locale */}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthYear}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
      </View>

      {/* Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => navigation.navigate("StudentHome")}
      >
        <Text style={styles.buttonText}>HOÀN TẤT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    marginBottom: 30,
  },
  topHeaderText: {
    fontSize: 30,
    color: "#31B7EC",
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 30,
    textAlign: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    textAlign: "left",
  },
  subHeaderText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "left",
  },
  iconContainer: {
    position: "relative",
    alignSelf: "center",
  },
  checkIcon: {
    marginBottom: 10,
    backgroundColor: "#31B7EC",
    borderRadius: 50,
    padding: 30,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    backgroundColor: "#31B7EC",
    borderRadius: 15,
    padding: 5,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    padding: 10,
    fontSize: 18,
    backgroundColor: "#fff",
    height: 50,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    backgroundColor: "#fff",
    height: 55,
    justifyContent: "center",
    paddingVertical: 5, //
  },
  picker: {
    height: 60,
    width: "100%",
  },
  dateText: {
    fontSize: 18,
    color: "#333",
    lineHeight: 30,
  },
  updateButton: {
    backgroundColor: "#31B7EC",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 30,
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
