import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../layout/StudentLayout";

const ProfileScreen = ({ navigation }) => {
  return (
    <StudentLayout navigation={navigation}>
      <View style={styles.container}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Phụ Huynh/ Học Sinh</Text>
        <View style={styles.profileContainer}>
          <Image source={require("../../assets/girl.jpg")} style={styles.profileImage} />
          <View style={styles.progressBar} />
        </View>
        <Text style={styles.id}>ID: 1234567</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Icon name="log-out-outline" size={20} color="#000" />
            <Text style={styles.buttonText}>Đăng Xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="wallet-outline" size={20} color="#000" />
            <Text style={styles.buttonText}>Ví Tiền</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.centerButton} onPress={() => navigation.navigate("UpdateProfile")}>
          <Icon name="person-outline" size={20} color="#000" />
          <Text style={styles.buttonText}>Hồ Sơ</Text>
        </TouchableOpacity>
        <View style={styles.platinumSection}>
          <Text style={styles.platinumText}>EKE Platinum</Text>
          <Text style={styles.upgradeText}>Nâng cấp tài khoản</Text>
          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("PackageScreen")}>
            <Text style={styles.registerButtonText}>Đăng Ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </StudentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginTop: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color:"#31B7EC"
  },
  profileContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 70,
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 70,
    borderWidth: 5,
    borderColor: "#00f",
    opacity: 0.2,
  },
  id: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginBottom: 10,
  },
  button: {
    alignItems: "center",
  },
  centerButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 14,
    marginTop: 5,
  },
  platinumSection: {
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 50,
  },
  platinumText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  upgradeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#00f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ProfileScreen;