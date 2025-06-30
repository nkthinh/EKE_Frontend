import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../layout/StudentLayout";

const LecturerDetailScreen = ({ navigation, route }) => {
  const { profile } = route.params;

  // Derive subject taught from skills or teaching experience
  const subjectTaught = profile.skills.length > 0 ? profile.skills[0].text : (profile.teachingExperience || "Not specified");

  return (
    <StudentLayout navigation={navigation}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={28} color="#31B7EC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{profile.name}</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={profile.image}
            style={styles.profileImage}
            defaultSource={require("../../assets/girl.jpg")}
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Thông Tin Cá Nhân</Text>
          <View style={styles.infoItem}>
            <Icon name="person" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Giới Tính:</Text>
            <Text style={styles.value}>{profile.gender || "Not specified"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="calendar" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Năm Sinh:</Text>
            <Text style={styles.value}>{profile.birthYear || "Not specified"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="book" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Môn Nhận Dạy:</Text>
            <Text style={styles.value}>{subjectTaught}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="briefcase" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Chức Vụ:</Text>
            <Text style={styles.value}>{profile.position || "Sinh Viên"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="school" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Chuyên Ngành:</Text>
            <Text style={styles.value}>{profile.major || "Not specified"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="business" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Đơn Vị:</Text>
            <Text style={styles.value}>{profile.university || "Not specified"}</Text>
          </View>
        </View>
      </ScrollView>
    </StudentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  imageContainer: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
    resizeMode: "cover",
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#666",
    width: 100,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
});

export default LecturerDetailScreen;