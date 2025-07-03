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
        <View style={styles.divider} />

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
        <View style={styles.divider} />

        <View style={styles.introContainer}>
          <Text style={styles.sectionTitle}>Giới Thiệu</Text>
          {profile?.teachingExperience.map((exp, index) => (
            <View key={index} style={styles.introItem}>
              <Text style={styles.introText}>• {exp}</Text>
            </View>
          ))}
        </View>
        <View style={styles.divider} />

        <View style={styles.certContainer}>
          <Text style={styles.sectionTitle}>Chứng Chỉ</Text>
          <Image
            source={require("../../assets/cert.jpg")}
            style={styles.certImage}
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
          />
        </View>
        <View style={styles.divider} />

        <View style={styles.feeContainer}>
          <Text style={styles.sectionTitle}>Bảng Học Phí Tham Khảo</Text>
          <View style={styles.feeTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Môn học</Text>
              <Text style={styles.tableHeader}>Cấp bậc</Text>
              <Text style={styles.tableHeader} numberOfLines={1}>Học phí/Buổi</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Tiếng Anh</Text>
              <Text style={styles.tableCell}>Cấp 1</Text>
              <Text style={styles.tableCell}>200</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Tiếng Anh</Text>
              <Text style={styles.tableCell}>Cấp 2</Text>
              <Text style={styles.tableCell}>250</Text>
            </View>
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
    marginBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "center",
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: "95%",
    height: 400,
    borderRadius: 10,
    resizeMode: "cover",
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  introContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  certContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  feeContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  introItem: {
    marginBottom: 5,
  },
  certImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    resizeMode: "contain",
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
  introText: {
    fontSize: 16,
    color: "#333",
  },
  feeTable: {
    borderColor: "#f0f0f0",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  divider: {
    height: 5,
    backgroundColor: "#d9d9d9",
    width: "100%",
    marginInline:10
  },
});

export default LecturerDetailScreen;