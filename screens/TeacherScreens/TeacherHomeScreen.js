import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import TeacherLayout from "../../layout/TeacherLayout";

const TeacherHomeScreen = ({ navigation }) => {
  return (
    <TeacherLayout navigation={navigation}>
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập Tên"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Icon name="search" size={20} color="#31B7EC" />
          </TouchableOpacity>
        </View>

        {/* Pictures Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/girl3.png")}
                style={styles.gridImage}
              />
              <View style={styles.textOverlay}>
                <Text numberOfLines={1} style={styles.overlayName}>
                  Nguyễn Thị Thảo 22
                </Text>
                <Text style={styles.overlayLocation}>
                  © 13/28 Nguyễn Huệ, Tân Bình, Tp HCM
                </Text>
              </View>
            </View>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/girl3.png")}
                style={styles.gridImage}
              />
              <View style={styles.textOverlay}>
                <Text numberOfLines={1} style={styles.overlayName}>
                  Nguyễn Thị Thảo 22
                </Text>
                <Text style={styles.overlayLocation}>
                  © 13/28 Nguyễn Huệ, Tân Bình, Tp HCM
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/girl3.png")}
                style={styles.gridImage}
              />
              <View style={styles.textOverlay}>
                <Text numberOfLines={1} style={styles.overlayName}>
                  Nguyễn Thị Thảo 22
                </Text>
                <Text style={styles.overlayLocation}>
                  © 13/28 Nguyễn Huệ, Tân Bình, Tp HCM
                </Text>
              </View>
            </View>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/girl3.png")}
                style={styles.gridImage}
              />
              <View style={styles.textOverlay}>
                <Text numberOfLines={1} style={styles.overlayName}>
                  Nguyễn Thị Thảo 22
                </Text>
                <Text style={styles.overlayLocation}>
                  © 13/28 Nguyễn Huệ, Tân Bình, Tp HCM
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TeacherLayout>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",

    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
  gridContainer: {
    flex: 1,
    padding: 10,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  imageWrapper: {
    width: "48%",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
  },
  textOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 5,
    borderRadius: 5,
  },
  overlayName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
  },
  overlayLocation: {
    fontSize: 12,
    color: "#fff",
  },
});

export default TeacherHomeScreen;
