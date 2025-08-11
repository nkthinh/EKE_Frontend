import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const CustomDatePicker = ({
  value,
  onDateChange,
  placeholder = "Chọn ngày sinh",
  minAge = 5,
  maxAge = 100,
  style,
  error,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (value) {
      try {
        return new Date(value);
      } catch (error) {
        console.log("CustomDatePicker - error parsing initial value:", error);
        return new Date();
      }
    }
    return new Date();
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    if (value) {
      try {
        return new Date(value).getFullYear();
      } catch (error) {
        return new Date().getFullYear() - 18;
      }
    }
    return new Date().getFullYear() - 18;
  });

  const today = new Date();
  const minYear = today.getFullYear() - maxAge;
  const maxYear = today.getFullYear() - minAge;

  const years = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
  }

  // Cập nhật selectedDate khi value thay đổi
  useEffect(() => {
    if (value) {
      try {
        const newDate = new Date(value);
        setSelectedDate(newDate);
        setSelectedYear(newDate.getFullYear());
      } catch (error) {
        console.log("CustomDatePicker - error updating from value:", error);
      }
    }
  }, [value]);

  const months = [
    { value: 0, label: "Tháng 1" },
    { value: 1, label: "Tháng 2" },
    { value: 2, label: "Tháng 3" },
    { value: 3, label: "Tháng 4" },
    { value: 4, label: "Tháng 5" },
    { value: 5, label: "Tháng 6" },
    { value: 6, label: "Tháng 7" },
    { value: 7, label: "Tháng 8" },
    { value: 8, label: "Tháng 9" },
    { value: 9, label: "Tháng 10" },
    { value: 10, label: "Tháng 11" },
    { value: 11, label: "Tháng 12" },
  ];

  const handleYearChange = (year) => {
    setSelectedYear(year);
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
  };

  const handleMonthChange = (month) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month);
    setSelectedDate(newDate);
  };

  const handleDatePickerChange = (event, date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    const formattedDate = selectedDate.toISOString();
    console.log("CustomDatePicker - Selected date:", formattedDate);
    onDateChange(formattedDate);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const formatDisplayDate = () => {
    console.log("CustomDatePicker - formatDisplayDate - value:", value);
    if (!value) return placeholder;
    try {
      const date = new Date(value);
      const formatted = date.toLocaleDateString("vi-VN");
      console.log("CustomDatePicker - formatted date:", formatted);
      return formatted;
    } catch (error) {
      console.log("CustomDatePicker - error formatting date:", error);
      return placeholder;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.dateInput, style, error && styles.errorInput]}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.dateInputContent}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text
            style={[styles.dateText, !value && styles.placeholderText]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatDisplayDate()}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn ngày sinh</Text>
            </View>

            <View style={styles.pickerContainer}>
              {/* Năm */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Năm</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={handleYearChange}
                    style={styles.picker}
                  >
                    {years.map((year) => (
                      <Picker.Item
                        key={year}
                        label={year.toString()}
                        value={year}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Tháng */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Tháng</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedDate.getMonth()}
                    onValueChange={handleMonthChange}
                    style={styles.picker}
                  >
                    {months.map((month) => (
                      <Picker.Item
                        key={month.value}
                        label={month.label}
                        value={month.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Ngày */}
              <View style={styles.pickerSection}>
                <Text style={styles.pickerLabel}>Ngày</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {selectedDate.getDate()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDatePickerChange}
            minimumDate={new Date(minYear, 0, 1)}
            maximumDate={new Date(maxYear, 11, 31)}
          />
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    minHeight: 50,
  },
  dateInputContent: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 26,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
    textAlignVertical: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  placeholderText: {
    color: "#999",
  },
  errorInput: {
    borderColor: "#ff4444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "95%",
    maxWidth: 450,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  pickerContainer: {
    flexDirection: "column",
    marginBottom: 24,
    gap: 16,
  },
  pickerSection: {
    alignItems: "center",
    paddingHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    width: "100%",
    minHeight: 60,
  },
  picker: {
    height: 60,
    fontSize: 18,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    alignItems: "center",
    minHeight: 60,
    justifyContent: "center",
  },
  datePickerButtonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#000",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomDatePicker;
