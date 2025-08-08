import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { messageService } from "../../services";
import { useMessage } from "../../hooks";

const ChatDetailScreen = ({ route, navigation }) => {
  const { name, studentName, conversationId, conversation, student } =
    route.params || {};

  const displayName =
    name ||
    studentName ||
    conversation?.participants?.find(
      (p) => p.id !== conversation?.currentUserId
    )?.fullName ||
    "Người dùng";
  const chatConversationId = conversationId || conversation?.id;

  // Use the message hook
  const {
    messages: hookMessages,
    currentConversation,
    loading: messageLoading,
    getConversationMessages,
    sendMessage,
    markAsRead,
    setActiveConversation,
  } = useMessage();

  // Thêm error handling cho route params
  if (!displayName) {
    console.error("ChatDetailScreen: name parameter is missing");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Lỗi: Không tìm thấy thông tin chat</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#2196F3", marginTop: 10 }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const flatListRef = useRef(null);

  // Set active conversation when component mounts
  useFocusEffect(
    useCallback(() => {
      if (conversation && chatConversationId) {
        setActiveConversation(conversation);
      } else if (chatConversationId) {
        // Load conversation by ID if only ID is provided
        loadMessages();
      }
    }, [conversation, chatConversationId])
  );

  // Update local messages when hook messages change
  useEffect(() => {
    if (hookMessages && hookMessages.length > 0) {
      setMessages(hookMessages);
      setLoading(false);
    }
  }, [hookMessages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      if (chatConversationId) {
        await getConversationMessages(chatConversationId);
      } else {
        // Fallback to old system
        await loadMessagesFromAPI();
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setError(error.message);
      // Fallback to old system
      await loadMessagesFromAPI();
    }
  };

  // Load messages from API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        if (conversationId) {
          const response = await messageService.getConversationMessages(
            conversationId
          );
          console.log("Messages loaded from API:", response);
          setMessages(response.data || response || []);
        } else {
          // Fallback to mock data if no conversationId
          setMessages([
            {
              id: 1,
              from: "other",
              text: "Xin chào! Tôi có thể giúc gì cho bạn?",
            },
            { id: 2, from: "me", text: "Chào bạn! Tôi muốn tìm gia sư toán." },
            {
              id: 3,
              from: "other",
              text: "Tuyệt vời! Bạn cần gia sư cho cấp độ nào?",
            },
            { id: 4, from: "me", text: "Tôi cần gia sư cho lớp 10." },
          ]);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setError(error.message);
        // Fallback to mock data if API fails
        setMessages([
          {
            id: 1,
            from: "other",
            text: "Xin chào! Tôi có thể giúc gì cho bạn?",
          },
          { id: 2, from: "me", text: "Chào bạn! Tôi muốn tìm gia sư toán." },
          {
            id: 3,
            from: "other",
            text: "Tuyệt vời! Bạn cần gia sư cho cấp độ nào?",
          },
          { id: 4, from: "me", text: "Tôi cần gia sư cho lớp 10." },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  const handleSend = async () => {
    try {
      if (input.trim()) {
        const messageText = input.trim();
        setInput(""); // Clear input immediately for better UX

        if (chatConversationId && sendMessage) {
          // Use new message system
          await sendMessage(chatConversationId, messageText, "text");
        } else {
          // Fallback to old system
          const newMsg = {
            id: Date.now(),
            from: "me",
            text: messageText,
            timestamp: new Date().toISOString(),
          };
          setMessages((prevMessages) => [...prevMessages, newMsg]);

          // Save to API if available
          try {
            if (chatConversationId) {
              await messageService.sendMessage({
                conversationId: chatConversationId,
                content: messageText,
                messageType: "text",
              });
            }
          } catch (apiError) {
            console.error("Error saving message to API:", apiError);
          }
        }

        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Error in handleSend:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi tin nhắn");
      // Restore input if sending failed
      setInput(input);
    }
  };

  const startVideoCall = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: "me",
        text: "📹 Đã tham gia cuộc gọi Google Meet",
        type: "call",
      },
    ]);

    navigation.navigate("VideoCall");
  };

  const handleSchedulePress = () => {
    setEditingMessageId(null);
    setScheduleTitle("");
    setScheduleDate("");
    setScheduleTime("");
    setShowScheduleModal(true);
  };

  const confirmSchedule = async () => {
    try {
      if (
        !scheduleTitle.trim() ||
        !scheduleDate.trim() ||
        !scheduleTime.trim()
      ) {
        Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tiêu đề, ngày và thời gian.");
        return;
      }

      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      const timeRegex = /^\d{2}:\d{2}$/;

      if (!dateRegex.test(scheduleDate)) {
        Alert.alert("Lỗi", "Ngày không đúng định dạng dd/mm/yyyy");
        return;
      }

      if (!timeRegex.test(scheduleTime)) {
        Alert.alert("Lỗi", "Giờ không đúng định dạng HH:mm");
        return;
      }

      const formatted = `${scheduleDate} lúc ${scheduleTime}`;

      const newMessage = {
        id: editingMessageId || Date.now(),
        from: "me",
        text: `📅 [${scheduleTitle}] vào ${formatted}`,
        type: "schedule",
      };

      setMessages((prev) =>
        editingMessageId
          ? prev.map((msg) => (msg.id === editingMessageId ? newMessage : msg))
          : [...prev, newMessage]
      );

      const newNoti = {
        title: `⏰ Nhắc lịch: ${scheduleTitle}`,
        time: `${scheduleDate} - ${scheduleTime}`,
        student: name,
        icon: "calendar",
        color: "#4CAF50",
        section: "Sắp tới",
      };

      try {
        const existing = await AsyncStorage.getItem("notifications");
        const parsed = existing ? JSON.parse(existing) : [];
        parsed.unshift(newNoti);
        await AsyncStorage.setItem("notifications", JSON.stringify(parsed));
      } catch (e) {
        console.warn("Lỗi lưu notification:", e);
      }

      setEditingMessageId(null);
      setScheduleTitle("");
      setScheduleDate("");
      setScheduleTime("");
      setShowScheduleModal(false);
    } catch (error) {
      console.error("Error in confirmSchedule:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo lịch hẹn");
    }
  };

  const showScheduleOptions = (id) => {
    Alert.alert("Lịch hẹn", "Bạn muốn thực hiện gì?", [
      { text: "✏️ Chỉnh sửa", onPress: () => editSchedule(id) },
      {
        text: "❌ Huỷ lịch",
        onPress: () => deleteSchedule(id),
        style: "destructive",
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  const deleteSchedule = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  const editSchedule = (id) => {
    const msg = messages.find((m) => m.id === id);
    if (msg) {
      const match = msg.text.match(/\[(.*)\] vào (.*) lúc (.*)/);
      if (match) {
        setScheduleTitle(match[1]);
        setScheduleDate(match[2]);
        setScheduleTime(match[3]);
        setEditingMessageId(id);
        setShowScheduleModal(true);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerName}>{displayName}</Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Đang tải tin nhắn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerName}>{displayName}</Text>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Lỗi: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerName}>{displayName}</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={handleSchedulePress}
              style={{ marginRight: 16 }}
            >
              <Icon name="calendar-plus" size={26} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity onPress={startVideoCall}>
              <Icon name="phone" size={26} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <TouchableOpacity
              key={msg.id}
              onLongPress={() =>
                msg.type === "schedule" && showScheduleOptions(msg.id)
              }
            >
              <View
                style={[
                  styles.messageBox,
                  msg.from === "me" ? styles.me : styles.other,
                  msg.type === "schedule" && {
                    backgroundColor: "#E1F5FE",
                    borderColor: "#0288D1",
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.from === "me" ? styles.textMe : styles.textOther,
                    msg.type === "schedule" && {
                      color: "#0288D1",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Nhập tin nhắn..."
            style={styles.input}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendText}>Gửi</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showScheduleModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Nút Đóng ❌ */}
              <TouchableOpacity
                onPress={() => setShowScheduleModal(false)}
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <Icon name="close" size={24} color="#888" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Tạo lịch hẹn</Text>

              <TextInput
                value={scheduleTitle}
                onChangeText={setScheduleTitle}
                style={styles.modalInput}
                placeholder="Tiêu đề (VD: Học toán)"
              />

              <TextInput
                value={scheduleDate}
                onChangeText={setScheduleDate}
                style={styles.modalInput}
                placeholder="Ngày (VD: 25/06/2025)"
              />

              <TextInput
                value={scheduleTime}
                onChangeText={setScheduleTime}
                style={styles.modalInput}
                placeholder="Giờ (VD: 14:30)"
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
                  onPress={confirmSchedule}
                  style={styles.confirmBtn}
                >
                  <Text style={{ color: "#fff" }}>
                    {editingMessageId ? "Lưu" : "Tạo"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#eee",
    zIndex: 10,
  },
  backButton: {
    padding: 4,
  },
  headerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 100,
  },
  messageBox: {
    maxWidth: "75%",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
  },
  me: {
    backgroundColor: "#2196F3",
    alignSelf: "flex-end",
  },
  other: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  textMe: {
    color: "#fff",
  },
  textOther: {
    color: "#000",
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#2196F3",
    borderRadius: 25,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  cancelBtn: {
    marginRight: 12,
    padding: 10,
  },
  confirmBtn: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 6,
  },
  studentName: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});

export default ChatDetailScreen;
