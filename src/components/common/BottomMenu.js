import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants";
import { isTutor } from "../../utils/navigation";

const BottomMenu = ({ navigation, activeTab, userRole }) => {
  // Xác định screen dựa trên role
  const isTutorUser = isTutor(userRole);

  const menuItems = [
    {
      id: "home",
      title: "Trang chủ",
      icon: "home-outline",
      screen: isTutorUser ? "TutorHome" : "StudentHome",
    },
    {
      id: "message",
      title: "Tin nhắn",
      icon: "mail-outline",
      screen: isTutorUser ? "TutorMessage" : "StudentMessage",
    },
    {
      id: "chat",
      title: "Chat",
      icon: "chatbubbles-outline",
      screen: "ChatList",
    },
    {
      id: "profile",
      title: "Cá nhân",
      icon: "person-outline",
      screen: isTutorUser ? "TutorProfile" : "StudentProfile",
    },
  ];

  const handleTabPress = (screen) => {
    if (navigation && screen) {
      console.log("🔍 BottomMenu - Navigation:");
      console.log("👤 User role:", userRole);
      console.log("🎯 Navigating to:", screen);
      console.log("👨‍🏫 Is tutor:", isTutorUser);
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={() => handleTabPress(item.screen)}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={activeTab === item.id ? "#000" : "#666"}
          />
          <Text
            style={[
              styles.menuText,
              activeTab === item.id && styles.activeMenuText,
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
  },
  activeMenuText: {
    color: "#000",
    fontWeight: "600",
  },
});

export default BottomMenu;
