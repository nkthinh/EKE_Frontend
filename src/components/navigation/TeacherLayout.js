import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const TeacherLayout = ({ children, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("TutorHome")}
        >
          <Icon name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ChatList")}
        >
          <Icon name="chatbubble" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("RateScreen")}
        >
          <Icon name="medal" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("TutorProfile")}
        >
          <Icon name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#31B7EC",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
  },
});

export default TeacherLayout;
