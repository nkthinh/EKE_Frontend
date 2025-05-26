import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // For icons
import { Picker } from '@react-native-picker/picker'; // For dropdown select
import DateTimePicker from '@react-native-community/datetimepicker'; // For date picker

export default function CompleteProfileScreen() {
  const [fullName, setFullName] = useState('example@example.com');
  const [gender, setGender] = useState('Nam');
  const [phoneNumber, setPhoneNumber] = useState('123 456 789');
  const [birthYear, setBirthYear] = useState(new Date(1990, 0, 1)); // Default date
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthYear;
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    setBirthYear(currentDate);
  };

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
            value={fullName}
            onChangeText={setFullName}
            editable={false} // Non-editable for now
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
              enabled={true} 
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
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
            editable={false} // Non-editable for now
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
              {birthYear.toISOString().split('T')[0]}
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
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.buttonText}>HOÀN TẤT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Keep background white
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  topHeaderText: {
    fontSize: 16,
    color: '#28a745', // Green text
    marginBottom: 10,
    textAlign: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: '', 
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'left', // Keep paragraph left-aligned
  },
  iconContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  checkIcon: {
    marginBottom: 10,
    backgroundColor: '#28a745',
    borderRadius: 50,
    padding: 30,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: '#28a745', // Green background for pen icon
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
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25, // Rounder inputs
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25, // Rounder picker
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    width: '50%', // Shorter button
    alignSelf: 'center', // Center the button
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});