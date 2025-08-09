import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import BottomMenu from "../../components/common/BottomMenu";
import StudentLayout from "../../components/navigation/StudentLayout";
import { messageService } from "../../services";
import { useMessage } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";

const ChatListScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use the new message hook
  const {
    conversations,
    loading: messageLoading,
    getConversations,
  } = useMessage();

  // Load conversations when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      await getConversations();
      // Use conversations from hook if available
      if (conversations && conversations.length > 0) {
        setStudents(
          conversations.map((conv) => ({
            id: conv.id,
            name:
              conv.participants?.find((p) => p.id !== conv.currentUserId)
                ?.fullName || "Người dùng",
            avatar: conv.participants?.find((p) => p.id !== conv.currentUserId)
              ?.profileImage
              ? {
                  uri: conv.participants.find(
                    (p) => p.id !== conv.currentUserId
                  ).profileImage,
                }
              : require("../../assets/avatar.png"),
            lastMessage: conv.lastMessage?.content || "Chưa có tin nhắn",
            time: formatTime(conv.lastMessage?.sentAt),
            online:
              conv.participants?.find((p) => p.id !== conv.currentUserId)
                ?.isOnline || false,
            unreadCount: conv.unreadCount || 0,
            conversationData: conv,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      loadChatListFallback();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Load chat list from API (fallback method)
  const loadChatListFallback = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversations(userData?.id);
      console.log("Chat list loaded from API:", response);
      setStudents(response.data || response || []);
    } catch (error) {
      console.error("Error loading chat list:", error);
      setError(error.message);
      // Fallback to mock data if API fails
      setStudents([
        {
          name: "Hải Tú",
          avatar: require("../../assets/avatar.png"),
          lastMessage: "Em muốn đăng ký ạ.",
          time: "9:40 AM",
          online: true,
        },
        {
          name: "Thùy Chi (Pu)",
          avatar: require("../../assets/avatar.png"),
          lastMessage: "Tý có dạy giờ hêm.",
          time: "10:37 PM",
          online: false,
        },
        {
          name: "Huệ Phương (Cara)",
          avatar: require("../../assets/avatar.png"),
          lastMessage: "Ôkê",
          time: "Yesterday",
          online: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatListFallback();
  }, []);

  const navigateToChat = async (student) => {
    if (student.conversationData) {
      try {
        // Gọi API để lấy thông tin chi tiết cuộc trò chuyện ngay khi ấn vào
        const conversationId = student.conversationData.id;
        console.log(
          "🔍 Calling API /Conversations/{conversationId} for ID:",
          conversationId
        );
        const conversationDetails = await messageService.getConversationById(
          conversationId
        );
        console.log("📥 Conversation details loaded:", conversationDetails);

        // Navigate với thông tin chi tiết đã được cập nhật
        navigation.navigate("ChatDetail", {
          conversationId: conversationId,
          conversation: conversationDetails, // Sử dụng thông tin chi tiết từ API
          studentName: student.name,
          userId: userData?.id, // Thêm userId
        });
      } catch (error) {
        console.error("❌ Error loading conversation details:", error);

        // Fallback: Navigate với thông tin cũ nếu API fail
        navigation.navigate("ChatDetail", {
          conversationId: student.conversationData.id,
          conversation: student.conversationData,
          studentName: student.name,
          userId: userData?.id, // Thêm userId
        });
      }
    } else {
      // Legacy navigation
      navigation.navigate("ChatDetail", {
        studentName: student.name,
        student: student,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Tin nhắn</Text>
            <TouchableOpacity>
              <Icon name="bell-outline" size={28} color="#00AEEF" />
            </TouchableOpacity>
          </View>
          <View style={styles.loadingContainer}>
            <Text>Đang tải...</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Tin nhắn</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lỗi: {error}</Text>
          <TouchableOpacity
            onPress={loadConversations}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={styles.studentItem}
      onPress={async () => await navigateToChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.studentInfo}>
        <View style={styles.studentHeader}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tin nhắn</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="search-outline" size={28} color="#00AEEF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm cuộc trò chuyện..."
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={students}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderStudent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#00AEEF"]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
            <Text style={styles.emptySubText}>
              Kết nối với gia sư để bắt đầu trò chuyện
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.exploreButtonText}>Khám phá gia sư</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <BottomMenu navigation={navigation} currentScreen="ChatList" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#00AEEF",
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "white",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  studentInfo: {
    flex: 1,
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: "#ff4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  exploreButton: {
    backgroundColor: "#00AEEF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  exploreButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChatListScreen;
