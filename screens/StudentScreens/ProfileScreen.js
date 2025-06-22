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
          <Image
            source={require("../../assets/girl.jpg")}
            style={styles.profileImage}
          />
          <View style={styles.progressBar} />
        </View>
        <Text style={styles.id}>ID: 1234567</Text>
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={[styles.iconButton, styles.shadow]}>
              <Icon name="log-out-outline" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Đăng Xuất</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[styles.iconButton, styles.shadow]}
              onPress={() => navigation.navigate("WalletScreen")}
            >
              <Icon name="wallet-outline" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Ví Tiền</Text>
          </View>
        </View>
        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity
            style={[styles.iconButton, styles.shadow]}
            onPress={() => navigation.navigate("UpdateProfile")}
          >
            <Icon name="person-outline" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.buttonText}>Hồ Sơ</Text>
        </View>
        <View style={styles.platinumSection}>
          <Text style={styles.platinumText}>EKE Platinum</Text>
          <Text style={styles.upgradeText}>Nâng cấp tài khoản</Text>
          <TouchableOpacity
            style={[styles.registerButton, styles.shadow]}
            onPress={() => navigation.navigate("PackageScreen")}
          >
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
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#31B7EC",
  },
  profileContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
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
    justifyContent: "space-between",
    width: "70%",
  },
  buttonWrapper: {
    alignItems: "center",
  },
  centerButtonWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    color: "#000",
  },
  platinumSection: {
    backgroundColor: "#F5F7FA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 40,
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
    backgroundColor: "#FCFCFE",
    paddingVertical: 20,
    paddingHorizontal: 70,
    borderRadius: 30,
  },
  registerButtonText: {
    fontSize: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default ProfileScreen;