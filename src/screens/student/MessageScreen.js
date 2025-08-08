import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../components/navigation/StudentLayout";
import { dummyMessages, dummyTutors } from "../../constants/messageData";
import { messageService, matchService } from "../../services";

const MessageScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [conversationsData, matchesData] = await Promise.all([
        messageService.getConversations(),
        matchService.getAllMatches(), // Or get matches for specific user
      ]);
      setConversations(conversationsData);
      setMatches(matchesData);
    } catch (error) {
      console.error("Error loading data:", error);
      // Fallback to dummy data if API fails
      setConversations(dummyMessages);
      setMatches(dummyTutors);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#31B7EC" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <ScrollView>
          {/* Gia sư được kết nối */}
          <View style={styles.connectedTutors}>
            <Text style={styles.sectionTitle}>Gia Sư Được Kết Nối:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tutorRow}>
                {(matches.length > 0 ? matches : dummyTutors).map(
                  (tutor, index) => (
                    <TouchableOpacity key={index} style={styles.tutorContainer}>
                      <Image
                        source={
                          tutor.image ||
                          tutor.tutorImage ||
                          require("../../assets/teacher.png")
                        }
                        style={styles.tutorImage}
                      />
                      <Text style={styles.tutorName}>
                        {tutor.name || tutor.tutorName}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </ScrollView>
          </View>

          {/* Tin nhắn */}
          <View style={styles.messages}>
            <Text style={styles.sectionTitle}>Tin Nhắn:</Text>
            {filteredConversations.length > 0
              ? filteredConversations.map((message, index) => (
                  <TouchableOpacity
                    style={styles.messageItem}
                    key={index}
                    onPress={() =>
                      navigation.navigate("StudentDetailMessage", {
                        conversationId: message.id,
                        name: message.name || message.participantName,
                      })
                    }
                  >
                    <Image
                      source={
                        message.image ||
                        message.participantImage ||
                        require("../../assets/teacher.png")
                      }
                      style={styles.messageImage}
                    />
                    <View style={styles.messageText}>
                      <Text style={styles.messageName}>
                        {message.name || message.participantName}
                      </Text>
                      <Text style={styles.messagePreview}>
                        {message.preview || message.lastMessage}{" "}
                        {message.previewTime || message.lastMessageTime}
                      </Text>
                    </View>
                    {message.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>
                          {message.unreadCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              : dummyMessages.map((message, index) => (
                  <TouchableOpacity
                    style={styles.messageItem}
                    key={index}
                    onPress={() =>
                      navigation.navigate("StudentDetailMessage", {
                        name: message.name,
                      })
                    }
                  >
                    <Image source={message.image} style={styles.messageImage} />
                    <View style={styles.messageText}>
                      <Text style={styles.messageName}>{message.name}</Text>
                      <Text style={styles.messagePreview}>
                        {message.preview} {message.previewTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
          </View>
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tutorContainer: {
    marginRight: 15,
    alignItems: "center",
  },
  unreadBadge: {
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 5,
    right: 5,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default MessageScreen;
