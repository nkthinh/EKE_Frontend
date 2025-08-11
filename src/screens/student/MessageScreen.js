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
import StudentLayout from "../../components/navigation/StudentLayout";
import { messageService, matchService } from "../../services";
import { useMessage } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";

const MessageScreen = ({ navigation }) => {
  const { userData, isAuthenticated, loading: authLoading } = useAuth();
  const { conversationRefreshTrigger } = useGlobalState();
  const [conversations, setConversations] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use the new message hook
  const {
    conversations: hookConversations,
    loading: messageLoading,
    getConversations,
    getConversationsByUserId,
  } = useMessage();

  // Debug useEffect to check userData
  useEffect(() => {
    console.log("🔍 === MESSAGE SCREEN MOUNTED ===");
    console.log("📋 userData on mount:", userData);
    console.log("📋 userData?.id on mount:", userData?.id);
  }, [userData]);

  // Load conversations when screen is focused or refresh trigger changes
  useFocusEffect(
    useCallback(() => {
      console.log("🔍 === SCREEN FOCUSED ===");
      console.log("📋 userData on focus:", userData);
      console.log("📋 userData?.id on focus:", userData?.id);
      loadConversations();
    }, [conversationRefreshTrigger, userData?.id])
  );

  // Load conversations using the message hook
  const loadConversations = async () => {
    console.log("🔍 === LOADING MESSAGE SCREEN DATA ===");
    console.log("📋 Current userData:", userData);
    console.log("📋 Current userData?.id:", userData?.id);

    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      if (!userData?.id) {
        console.log("⚠️ userData not ready yet, skipping loadConversations");
        setLoading(false);
        return;
      }

      console.log("🔍 Loading conversations for student:", userData?.id);

      // Use getConversationsByUserId instead of getConversations
      const result = await getConversationsByUserId(userData?.id);
      console.log("📥 Conversations loaded:", result);

      console.log("📥 Processing conversations result:", result);

      if (result && result.success && Array.isArray(result.data)) {
        console.log("✅ Using result.data, length:", result.data.length);
        setConversations(result.data);
      } else if (result && Array.isArray(result)) {
        console.log("✅ Using result directly, length:", result.length);
        setConversations(result);
      } else {
        console.warn("⚠️ No conversations found or invalid format.");
        setConversations([]); // Set empty array instead of fallback
      }
    } catch (error) {
      console.error("❌ Error loading conversations:", error);
      setError(error.message || "An unknown error occurred.");
      setConversations([]); // Clear conversations on error
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const navigateToChat = async (conversation) => {
    try {
      // Gọi API để lấy thông tin chi tiết cuộc trò chuyện ngay khi ấn vào
      const conversationId = conversation.id;
      console.log(
        "🔍 Calling API /Conversations/{conversationId} for ID:",
        conversationId
      );
      const conversationDetails = await messageService.getConversationById(
        conversationId
      );
      console.log("📥 Conversation details loaded:", conversationDetails);

      // Navigate với thông tin chi tiết đã được cập nhật
      navigation.navigate("StudentDetailMessage", {
        conversationId: conversationId,
        conversation: conversationDetails, // Sử dụng thông tin chi tiết từ API
        name: conversation.name || conversation.participantName,
        userId: userData?.id, // Thêm userId
      });
    } catch (error) {
      console.error("❌ Error loading conversation details:", error);

      // Fallback: Navigate với thông tin cũ nếu API fail
      navigation.navigate("StudentDetailMessage", {
        conversationId: conversation.id,
        name: conversation.name || conversation.participantName,
        userId: userData?.id, // Thêm userId
      });
    }
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.participantName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.studentName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conversation.tutorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversation = ({ item }) => {
    // Determine the name to display based on user role
    let displayName = "Unknown";
    if (userData?.id === item.studentId) {
      // If current user is student, show tutor name
      displayName = item.tutorName || "Tutor";
    } else if (userData?.id === item.tutorId) {
      // If current user is tutor, show student name
      displayName = item.studentName || "Student";
    } else {
      // Fallback
      displayName =
        item.participantName ||
        item.name ||
        item.tutorName ||
        item.studentName ||
        "Unknown";
    }

    // Format timestamp
    const formatTime = (timestamp) => {
      if (!timestamp) return "";
      try {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return "";
      }
    };

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={async () => await navigateToChat(item)}
      >
        <Image
          source={
            item.participantImage ||
            item.image ||
            require("../../assets/teacher.jpg")
          }
          style={styles.avatar}
        />
        <View style={styles.conversationInfo}>
          <Text style={styles.conversationName}>{displayName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || item.preview || "No messages yet"}
          </Text>
        </View>
        <View style={styles.conversationMeta}>
          <Text style={styles.messageTime}>
            {formatTime(
              item.lastMessageAt || item.lastMessageTime || item.previewTime
            )}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <StudentLayout navigation={navigation}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gia Sư Của Tôi</Text>
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm gia sư....."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Conversations List */}
      {authLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Đang kiểm tra đăng nhập...</Text>
        </View>
      ) : !isAuthenticated ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Vui lòng đăng nhập để xem tin nhắn
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("StudentLogin")}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <Text>Đang tải cuộc trò chuyện...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lỗi: {error}</Text>
          <TouchableOpacity
            onPress={loadConversations}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
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
    padding: 15,
    paddingTop: 50,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  conversationMeta: {
    alignItems: "flex-end",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#31B7EC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default MessageScreen;
