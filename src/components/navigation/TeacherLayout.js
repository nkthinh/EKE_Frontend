import React from "react";
import { View, StyleSheet } from "react-native";
import BottomMenu from "../common/BottomMenu";
import { useAuth } from "../../hooks/useAuth";

const TeacherLayout = ({ children, navigation, activeTab }) => {
  const { userData } = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <BottomMenu
        navigation={navigation}
        userRole={userData?.role}
        activeTab={activeTab}
      />
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
    paddingBottom: 90, // chừa chỗ cho BottomMenu cố định
  },
});

export default TeacherLayout;
