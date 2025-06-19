import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../layout/StudentLayout";

const PackageScreen = ({ navigation }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(true);

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  return (
    <StudentLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Nâng Cấp Tài Khoản Platinum</Text>
            <Text style={styles.subtitle}>Dành cho tài khoản Phụ huynh/ Học Viên </Text>
          </View>
        </View>
        <View style={styles.packages}>
          <TouchableOpacity style={styles.package}>
            <View style={styles.packageLeft}>
              <Text style={styles.packageName}>Silver</Text>
              <Text style={styles.packageNote}>Thanh toán hàng tháng</Text>
            </View>
            <View style={styles.packageRight}>
              <Text style={styles.packagePrice}>50.000 đ</Text>
              <View style={styles.checkCircle}>
                <Icon name="checkmark" size={16} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.package}>
            <View style={styles.packageLeft}>
              <Text style={styles.packageName}>Gold</Text>
              <Text style={styles.packageNote}>Thanh toán hàng tháng</Text>
            </View>
            <View style={styles.packageRight}>
              <Text style={styles.packagePrice}>90.000 đ</Text>
              <View style={styles.checkCircle}>
                <Icon name="checkmark" size={16} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.package}>
            <View style={styles.packageLeft}>
              <Text style={styles.packageName}>Diamond</Text>
              <Text style={styles.packageNote}>Thanh toán hàng tháng</Text>
            </View>
            <View style={styles.packageRight}>
              <Text style={styles.packagePrice}>130.000 đ</Text>
              <View style={styles.checkCircle}>
                <Icon name="checkmark" size={16} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>Các Tình Năng Mới</Text>
            <TouchableOpacity onPress={toggleInfo}>
              <Icon name="remove" size={20} color="#6D4AFF" />
            </TouchableOpacity>
          </View>
          {isInfoVisible && (
            <>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>Tăng Giới Hạn Danh Sách Gia Sư Cô Thẻ Kết Nối</Text>
                <Icon name="checkmark-circle" size={20} color="#00C853" />
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>Sử Dụng Trợ Lý Học Tập AI</Text>
                <Icon name="checkmark-circle" size={20} color="#00C853" />
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>Khóa Hiện Thị Quảng Cáo</Text>
                <Icon name="checkmark-circle" size={20} color="#00C853" />
              </View>
            </>
          )}
        </View>
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Đăng Ký</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
    marginTop: 50,
  },
  headerText: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  packages: {
    marginBottom: 20,
  },
  package: {
    backgroundColor: "#E0F7FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBlock: 20,
  },
  packageLeft: {
    flex: 1,
  },
  packageRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  packageName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  packagePrice: {
    fontSize: 16,
    color: "#000",
    marginRight: 10,
  },
  packageNote: {
    fontSize: 12,
    color: "#666",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  info: {
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  registerButton: {
    backgroundColor: "#6D4AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PackageScreen;