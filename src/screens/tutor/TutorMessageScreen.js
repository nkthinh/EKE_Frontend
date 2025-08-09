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
import { messageService } from "../../services";
import { useMessage } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";

const TutorMessageScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const { conversationRefreshTrigger } = useGlobalState();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use the new message hook
  const {
    conversations,
    loading: messageLoading,
    getConversations,
    getConversationsByUserId,
  } = useMessage();

  // Load conversations when screen is focused or refresh trigger changes
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [conversationRefreshTrigger])
  );

  // Load conversations using the message hook
  const loadConversations = async () => {
    try {
      if (!userData?.id) {
        console.log("⚠️ userData not ready yet, skipping loadConversations");
        return;
      }

      setLoading(true);
      console.log("🔍 Loading conversations for tutor:", userData?.id);

      // Use getConversationsByUserId instead of getConversations
      const result = await getConversationsByUserId(userData?.id);
      console.log("📥 Conversations loaded:", result);

      if (result && result.success && Array.isArray(result.data)) {
        setStudents(result.data);
      } else if (result && Array.isArray(result)) {
        setStudents(result);
      } else {
        console.warn("⚠️ No conversations found, using fallback");
        await loadChatListFallback();
      }
    } catch (error) {
      console.error("❌ Error loading conversations:", error);
      await loadChatListFallback();
    } finally {
      setLoading(false);
    }
  };

  // Load chat list from API (fallback method)
  const loadChatListFallback = async () => {
    try {
      if (!userData?.id) {
        console.log("⚠️ userData not ready yet, skipping loadChatListFallback");
        return;
      }

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
          name: "Học sinh A",
          avatar: require("../../assets/avatar.png"),
          lastMessage: "Em muốn đăng ký học ạ.",
          time: "9:40 AM",
          online: true,
        },
        {
          name: "Học sinh B",
          avatar: require("../../assets/avatar.png"),
          lastMessage: "Tý có dạy giờ thêm không ạ?",
          time: "10:37 PM",
          online: false,
        },
        {
          name: "Học sinh C",
          avatar: require("../../assets/avatar.png"),
          lastMessage: "Ok ạ",
          time: "Yesterday",
          online: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      loadChatListFallback();
    }
  }, [userData?.id]);

  const navigateToChat = async (conversation) => {
    console.log("🚀 Navigating to chat with conversation:", conversation);

    // Extract conversation data for navigation
    const conversationId = conversation.id;
    const partnerName =
      conversation.studentName || conversation.tutorName || "Người dùng";
    const partnerId = conversation.studentId || conversation.tutorId;

    // Determine if current user is tutor or student
    const isCurrentUserTutor = userData?.role === "tutor";
    const otherUser = isCurrentUserTutor
      ? { id: conversation.studentId, name: conversation.studentName }
      : { id: conversation.tutorId, name: conversation.tutorName };

    try {
      // Gọi API để lấy thông tin chi tiết cuộc trò chuyện ngay khi ấn vào
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
        name: partnerName,
        otherUser: otherUser,
        userId: userData?.id, // Thêm userId
        match: {
          studentId: conversation.studentId,
          tutorId: conversation.tutorId,
          studentName: conversation.studentName,
          tutorName: conversation.tutorName,
        },
      });
    } catch (error) {
      console.error("❌ Error loading conversation details:", error);

      // Fallback: Navigate với thông tin cũ nếu API fail
      navigation.navigate("ChatDetail", {
        conversationId: conversationId,
        conversation: conversation,
        name: partnerName,
        otherUser: otherUser,
        userId: userData?.id, // Thêm userId
        match: {
          studentId: conversation.studentId,
          tutorId: conversation.tutorId,
          studentName: conversation.studentName,
          tutorName: conversation.tutorName,
        },
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const renderStudent = ({ item }) => {
    // Format conversation data for display
    const conversation = item;
    const partnerName =
      conversation.studentName || conversation.tutorName || "Người dùng";
    const lastMessage = conversation.lastMessage || "Chưa có tin nhắn";
    const lastMessageTime = conversation.lastMessageAt
      ? new Date(conversation.lastMessageAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Mới";
    const isOnline = conversation.isOnline || false;
    const unreadCount = conversation.unreadCount || 0;

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={async () => await navigateToChat(conversation)}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={
              conversation.avatar ||
              conversation.profileImage ||
              require("../../assets/avatar.png")
            }
            style={styles.avatar}
          />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={styles.partnerName} numberOfLines={1}>
              {partnerName}
            </Text>
            <Text style={styles.messageTime}>{lastMessageTime}</Text>
          </View>

          <View style={styles.conversationFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing && students.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Tin nhắn</Text>
          <TouchableOpacity onPress={() => navigation.navigate("TutorHome")}>
            <Ionicons name="search-outline" size={28} color="#00AEEF" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Đang tải tin nhắn...</Text>
        </View>
        <BottomMenu
          navigation={navigation}
          activeTab="message"
          userRole={userData?.role}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tin nhắn</Text>
        <TouchableOpacity onPress={() => navigation.navigate("TutorHome")}>
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
              Học sinh sẽ xuất hiện ở đây khi họ kết nối với bạn
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate("TutorHome")}
            >
              <Text style={styles.exploreButtonText}>Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <BottomMenu
        navigation={navigation}
        activeTab="message"
        userRole={userData?.role}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333",
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  messageMeta: {
    alignItems: "flex-end",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: "#00AEEF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  conversationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 15,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 10,
  },
  messageTime: {
    fontSize: 12,
    color: "#8e8e93",
    fontWeight: "400",
  },
  conversationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    fontSize: 14,
    color: "#8e8e93",
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default TutorMessageScreen;
