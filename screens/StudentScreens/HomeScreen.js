import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../layout/StudentLayout";

const HomeScreen = ({ navigation }) => {
  return (
    <StudentLayout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.logoHeader}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
        </View>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Xin Chào,</Text>
            <Text style={styles.username}>ABCDE</Text>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.icon}>
              <Icon name="settings" size={24} color="#31B7EC" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon}>
              <Icon name="notifications" size={24} color="#31B7EC" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/girl.jpg")}
            style={styles.profileImage}
          />
          <View style={styles.overlay}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>Nguyen Thi Thao, 22</Text>
              <Text style={styles.location}>
                © Đại học Sư phạm HCM
              </Text>
              <Text style={styles.location}>
                © 13/28 Nguyen Hue, Tan Binh, Tp HCM
              </Text>
            </View>
            <View style={styles.skillsContainer}>
              <TouchableOpacity style={[styles.skillButton, { backgroundColor: "#AFB7FF" }]}>
                <Text style={styles.skillText}>Tieng Anh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.skillButton, { backgroundColor: "#FFCC80" }]}>
                <Text style={styles.skillText}>Cap 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.skillButton, { backgroundColor: "#FFCC80" }]}>
                <Text style={styles.skillText}>Cap 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.skillButton, { backgroundColor: "#FF4B4A" }]}>
                <Text style={styles.skillText}>IELTS 6.5</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="arrow-back" size={30} color="#ff4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="close" size={30} color="#ff4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="star" size={30} color="#ffd700" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart" size={30} color="#00cc00" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="flash" size={30} color="#cc00cc" />
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
  },
  logoHeader: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerText: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  username: {
    fontSize: 18,
    color: "#007bff",
    marginLeft: 0,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 15,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 4,
  },
  imageContainer: {
    position: "relative",
    height: "70%",
    marginTop: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 10,
    flexDirection: "column",
  },
  userInfo: {
    padding: 10,
    alignItems: "flex-start",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  skillsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    marginTop: 10,
  },
  skillButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  skillText: {
    color: "#fff",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;