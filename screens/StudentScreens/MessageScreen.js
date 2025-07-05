import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../layout/StudentLayout";
import { dummyMessages, dummyTutors } from "../../data/messageData";

const MessageScreen = ({ navigation }) => {


  return (
    <StudentLayout navigation={navigation}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gia Sư Của Tôi</Text>
        <TouchableOpacity>
          <Icon name="notifications" size={24} color="#FFFFFF" style={styles.notiIcon} />
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

      {/* Gia sư được kết nối */}
      <View style={styles.connectedTutors}>
        <Text style={styles.sectionTitle}>Gia Sư Được Kết Nối:</Text>
        <View style={styles.tutorRow}>
          {dummyTutors.map((tutor, index) => (
            <TouchableOpacity key={index}>
              <Image source={tutor.image} style={styles.tutorImage} />
              <Text style={styles.tutorName}>{tutor.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tin nhắn */}
      <View style={styles.messages}>
        <Text style={styles.sectionTitle}>Tin Nhắn:</Text>
        {dummyMessages.map((message, index) => (
          <TouchableOpacity style={styles.messageItem} key={index} onPress={() => navigation.navigate("StudentDetailMessageScreen", { name: message.name })}
          >
            <Image source={message.image} style={styles.messageImage} />
            <View style={styles.messageText}>
              <Text style={styles.messageName}>{message.name}</Text>
              <Text style={styles.messagePreview}>{message.preview} {message.previewTime}</Text>
            </View>
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
  connectedTutors: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tutorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tutorImage: {
    width: 100,
    height: 150,
    borderRadius: 20,
  },
  tutorName: {
    textAlign: "center",
    marginTop: 5,
  },
  messages: {
    margin: 10,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  messageImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 10,
  },
  messageText: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  messagePreview: {
    color: "#666",
  },
});

export default MessageScreen;