import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StudentLayout = ({ children, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("StudentHome")}
        >
          <Ionicons name="home-outline" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("StudentMessage")}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("StudentLecturerFeedback")}
        >
          <Ionicons name="medal-outline" size={24} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("StudentProfile")}
        >
          <Ionicons name="person-outline" size={24} color="#666666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    paddingBottom: 80, // Thêm padding để không bị che bởi navBar
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});

export default StudentLayout;
