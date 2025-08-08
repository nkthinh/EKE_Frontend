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
import StudentLayout from "../../components/navigation/StudentLayout";

const LecturerFeedbackScreen = ({ navigation }) => {
  const lecturers = [
    { name: "Hải Tú", image: require("../../assets/msg1.png"), status: true },
    {
      name: "Thủy Chi (Pù)",
      image: require("../../assets/msg2.png"),
      status: false,
    },
    {
      name: "Huệ Phượng (Cara)",
      image: require("../../assets/msg3.png"),
      status: false,
    },
  ];

  return (
    <StudentLayout navigation={navigation}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back"
            size={24}
            color="#FFFFFF"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gia Sư Của Tôi</Text>
        <TouchableOpacity>
          <Icon
            name="notifications"
            size={24}
            color="#FFFFFF"
            style={styles.notiIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm gia sư....."
          placeholderTextColor="#666"
        />
      </View>

      {/* Lecturers */}
      <View style={styles.lecturers}>
        {lecturers.map((lecturer, index) => (
          <TouchableOpacity
            key={index}
            style={styles.lecturerItem}
            onPress={() =>
              navigation.navigate("StudentFeedback", {
                name: lecturer.name,
              })
            }
          >
            <Image source={lecturer.image} style={styles.lecturerImage} />
            <Text style={styles.lecturerName}>{lecturer.name}</Text>
            <Icon
              name={lecturer.status ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={lecturer.status ? "#00CC00" : "#666"}
              style={styles.statusIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </StudentLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#31B7EC",
    padding: 10,
    paddingTop: 20,
  },
  backIcon: {
    marginLeft: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  notiIcon: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  lecturers: {
    margin: 10,
  },
  lecturerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  lecturerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  lecturerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  statusIcon: {
    marginLeft: 10,
  },
});

export default LecturerFeedbackScreen;
