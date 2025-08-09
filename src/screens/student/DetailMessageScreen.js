import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import StudentLayout from "../../components/navigation/StudentLayout";
import { messageService } from "../../services";
import { useAuth } from "../../hooks/useAuth";

const DetailMessageScreen = ({ navigation, route }) => {
  const { userData } = useAuth();
  const { name, conversationId, conversation, userId } = route.params || {
    name: "Thủy Chi (Pù)",
  };

  const chatConversationId = conversationId || conversation?.id;

  // Xác định tên hiển thị trên header
  const getDisplayName = () => {
    console.log("🔍 === GET DISPLAY NAME DEBUG ===");
    console.log("📋 name from params:", name);
    console.log("📋 conversation:", conversation);
    console.log(
      "📋 conversation?.data?.tutorName:",
      conversation?.data?.tutorName
    );
    console.log(
      "📋 conversation?.data?.studentName:",
      conversation?.data?.studentName
    );
    console.log("📋 userData?.id:", userData?.id);
    console.log("📋 userId from params:", userId);

    // Ưu tiên name từ params trước
    if (name && name !== "Thủy Chi (Pù)") {
      console.log("📋 Using name from params:", name);
      return name;
    }

    // Nếu có conversation.data, sử dụng tutorName từ data
    if (conversation?.data?.tutorName) {
      console.log(
        "📋 Using tutorName from conversation.data:",
        conversation.data.tutorName
      );
      return conversation.data.tutorName;
    }

    // Nếu có conversation.data, sử dụng studentName từ data
    if (conversation?.data?.studentName) {
      console.log(
        "📋 Using studentName from conversation.data:",
        conversation.data.studentName
      );
      return conversation.data.studentName;
    }

    // Fallback
    console.log("📋 Using fallback name: Gia sư");
    return "Gia sư";
  };

  const displayName = getDisplayName();

  // Debug conversation details
  console.log("🔍 === CONVERSATION DETAILS DEBUG ===");
  console.log("📋 conversation object:", conversation);
  console.log("📋 conversation?.studentId:", conversation?.studentId);
  console.log("📋 conversation?.tutorId:", conversation?.tutorId);
  console.log("📋 conversation?.studentName:", conversation?.studentName);
  console.log("📋 conversation?.tutorName:", conversation?.tutorName);
  console.log("📋 userData?.id:", userData?.id);
  console.log("📋 userId from params:", userId);
  console.log("📋 displayName:", displayName);
  console.log("🔍 === END CONVERSATION DETAILS DEBUG ===");

  console.log("🔍 DetailMessageScreen - Route params:", route.params);
  console.log("🔍 DetailMessageScreen - Conversation ID:", chatConversationId);

  const [messages, setMessages] = useState([]);

  // Function để tạo date separators
  const addDateSeparators = (messages) => {
    if (!messages || messages.length === 0) return [];

    const result = [];
    let currentDate = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp);
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      let dateLabel = null;

      // Kiểm tra ngày của tin nhắn
      if (messageDate.toDateString() === today.toDateString()) {
        dateLabel = "Hôm nay";
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        dateLabel = "Hôm qua";
      } else {
        dateLabel = messageDate.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      // Thêm date separator nếu ngày thay đổi
      if (currentDate !== dateLabel) {
        result.push({
          id: `date-${index}`,
          type: "date-separator",
          date: dateLabel,
          timestamp: message.timestamp,
          sortTime: messageDate.getTime(),
        });
        currentDate = dateLabel;
      }

      // Thêm tin nhắn
      result.push(message);
    });

    return result;
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  // Load messages when component mounts
  useFocusEffect(
    useCallback(() => {
      if (chatConversationId) {
        loadMessages();
      }
    }, [chatConversationId])
  );

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Loading messages for conversation:", chatConversationId);

      // Debug authentication
      const token = await AsyncStorage.getItem("accessToken");
      console.log(
        "🔐 Current token:",
        token ? `${token.substring(0, 20)}...` : "No token"
      );
      console.log("🔐 Token length:", token ? token.length : 0);

      if (chatConversationId) {
        // Gọi API để lấy tin nhắn trong cuộc trò chuyện
        const messagesData = await messageService.getConversationMessages(
          chatConversationId
        );
        console.log("📥 Messages loaded from API:", messagesData);

        // Format messages để hiển thị theo từng người
        if (messagesData && Array.isArray(messagesData)) {
          console.log("🔍 Debug message ownership:");
          console.log(
            "📋 userData?.id:",
            userData?.id,
            "(type:",
            typeof userData?.id,
            ")"
          );
          console.log(
            "📋 userId from params:",
            userId,
            "(type:",
            typeof userId,
            ")"
          );

          const formattedMessages = messagesData.map((msg) => {
            console.log("🔍 === MESSAGE OWNERSHIP DEBUG ===");
            console.log("📋 Message ID:", msg.id);
            console.log("📋 Message content:", msg.content);
            console.log(
              "📋 msg.senderId:",
              msg.senderId,
              "(type:",
              typeof msg.senderId,
              ")"
            );
            console.log(
              "📋 msg.isMine:",
              msg.isMine,
              "(type:",
              typeof msg.isMine,
              ")"
            );
            console.log("📋 msg.senderName:", msg.senderName);
            console.log(
              "📋 userData?.id:",
              userData?.id,
              "(type:",
              typeof userData?.id,
              ")"
            );
            console.log(
              "📋 userId from params:",
              userId,
              "(type:",
              typeof userId,
              ")"
            );

            // Kiểm tra từng điều kiện riêng biệt
            const isMineFromAPI = msg.isMine === true || msg.isMine === "true";
            const isMineFromSenderId =
              String(msg.senderId) === String(userId || userData?.id);

            console.log("📋 isMineFromAPI:", isMineFromAPI);
            console.log("📋 isMineFromSenderId:", isMineFromSenderId);
            console.log(
              "📋 senderId comparison:",
              `${msg.senderId} === ${userId || userData?.id}`
            );
            console.log("📋 conversation?.studentId:", conversation?.studentId);
            console.log("📋 conversation?.tutorId:", conversation?.tutorId);
            console.log("📋 currentUserId:", userId || userData?.id);

            // Cải thiện logic xác định tin nhắn của mình
            let isMyMessage = false;

            // 1. Kiểm tra isMine từ API trước
            if (isMineFromAPI) {
              isMyMessage = true;
            }
            // 2. Kiểm tra senderId với userData?.id
            else if (isMineFromSenderId) {
              isMyMessage = true;
            }
            // 3. Kiểm tra với conversation details
            else if (conversation) {
              const currentUserId = userId || userData?.id;
              console.log("📋 Checking conversation logic:");
              console.log("📋 currentUserId:", currentUserId);
              console.log("📋 conversation.studentId:", conversation.studentId);
              console.log("📋 conversation.tutorId:", conversation.tutorId);

              if (
                conversation.studentId &&
                String(conversation.studentId) === String(currentUserId)
              ) {
                // User hiện tại là student, tin nhắn của student sẽ hiển thị bên phải
                isMyMessage =
                  String(msg.senderId) === String(conversation.studentId);
                console.log(
                  "📋 User is student, checking if message is from student:",
                  isMyMessage
                );
              } else if (
                conversation.tutorId &&
                String(conversation.tutorId) === String(currentUserId)
              ) {
                // User hiện tại là tutor, tin nhắn của tutor sẽ hiển thị bên phải
                isMyMessage =
                  String(msg.senderId) === String(conversation.tutorId);
                console.log(
                  "📋 User is tutor, checking if message is from tutor:",
                  isMyMessage
                );
              } else {
                console.log("📋 User role not determined from conversation");
              }
            }

            console.log("📋 Final isMyMessage:", isMyMessage);
            console.log("🔍 === END MESSAGE OWNERSHIP DEBUG ===");

            return {
              id: msg.id,
              from: isMyMessage ? "me" : "other",
              text: msg.content,
              timestamp: msg.createdAt || msg.timestamp,
              type: msg.messageType === 1 ? "text" : "other",
              senderName: msg.senderName,
              senderAvatar: msg.senderAvatar,
              isRead: msg.isRead,
              isMine: msg.isMine,
              // Thêm timestamp để sort
              sortTime: new Date(msg.createdAt || msg.timestamp).getTime(),
            };
          });
          console.log("📱 Formatted messages:", formattedMessages);

          // Sort messages theo thời gian (cũ nhất trước, mới nhất sau)
          const sortedMessages = formattedMessages.sort(
            (a, b) => a.sortTime - b.sortTime
          );
          console.log("📱 Sorted messages:", sortedMessages);

          // Thêm date separators
          const messagesWithSeparators = addDateSeparators(sortedMessages);
          console.log("📱 Messages with separators:", messagesWithSeparators);

          setMessages(messagesWithSeparators);
        } else {
          console.log("⚠️ No messages data or not array");
          setMessages([]);
        }
      } else {
        console.warn("⚠️ No conversation ID available");
        setMessages([]);
      }
    } catch (error) {
      console.error("❌ Error loading messages:", error);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error data:", error.response?.data);

      if (error.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        // Optionally navigate to login
        // navigation.navigate("StudentLogin");
      } else {
        setError(error.message || "Có lỗi xảy ra khi tải tin nhắn");
      }
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      if (input.trim()) {
        const messageText = input.trim();
        setInput(""); // Clear input immediately for better UX

        console.log("🔍 Sending message:", messageText);
        console.log("🔍 Conversation ID:", chatConversationId);

        if (chatConversationId) {
          // Gọi API để gửi tin nhắn
          console.log(
            "📤 Sending message to conversation:",
            chatConversationId
          );

          try {
            const result = await messageService.sendMessage({
              conversationId: chatConversationId,
              senderId: userId || userData?.id, // Sử dụng userId từ params hoặc userData
              content: messageText,
              messageType: 1, // 1 for text message
            });

            console.log("✅ Message sent successfully:", result);

            // Thêm tin nhắn mới vào state ngay lập tức với thời gian hiện tại
            const now = new Date();
            const newMessage = {
              id: Date.now(), // Temporary ID
              from: "me",
              text: messageText,
              timestamp: now.toISOString(),
              type: "text",
              senderName: userData?.fullName || "Me",
              isRead: false,
              isMine: true,
              sortTime: now.getTime(),
            };

            setMessages((prevMessages) => {
              // Lọc bỏ date separators cũ
              const messagesOnly = prevMessages.filter(
                (msg) => msg.type !== "date-separator"
              );
              const updatedMessages = [...messagesOnly, newMessage];
              // Sort lại và thêm date separators
              const sortedMessages = updatedMessages.sort(
                (a, b) => a.sortTime - b.sortTime
              );
              return addDateSeparators(sortedMessages);
            });

            // Refresh messages sau 1 giây để lấy tin nhắn thật từ server
            setTimeout(() => {
              loadMessages();
            }, 1000);
          } catch (apiError) {
            console.error("❌ Error sending message to API:", apiError);
            Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
            // Restore input if sending failed
            setInput(messageText);
            return;
          }
        } else {
          console.warn("⚠️ No conversation ID available");
          Alert.alert("Lỗi", "Không tìm thấy cuộc trò chuyện");
          // Restore input if sending failed
          setInput(messageText);
          return;
        }

        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("❌ Error in handleSend:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi tin nhắn");
      // Restore input if sending failed
      setInput(input);
    }
  };

  // Thêm error handling cho route params
  if (!chatConversationId) {
    console.error("DetailMessageScreen: conversationId parameter is missing");
    return (
      <StudentLayout navigation={navigation}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Lỗi: Không tìm thấy thông tin cuộc trò chuyện</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: "#31B7EC", marginTop: 10 }}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </StudentLayout>
    );
  }

  // Handle authentication error
  if (error && error.includes("hết hạn")) {
    return (
      <StudentLayout navigation={navigation}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 20 }}>
            {error}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.navigate("StudentLogin")}
          >
            <Text style={styles.retryText}>Đăng nhập lại</Text>
          </TouchableOpacity>
        </View>
      </StudentLayout>
    );
  }

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
        <Text style={styles.headerTitle}>{displayName}</Text>
        <TouchableOpacity>
          <Icon name="call" size={24} color="#FFFFFF" style={styles.callIcon} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={flatListRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Đang tải tin nhắn...</Text>
          </View>
        ) : messages && Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg) => {
            // Hiển thị date separator
            if (msg.type === "date-separator") {
              return (
                <View key={msg.id} style={styles.dateSeparatorContainer}>
                  <Text style={styles.dateSeparatorText}>{msg.date}</Text>
                </View>
              );
            }

            // Hiển thị tin nhắn
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageContainer,
                  msg.from === "me"
                    ? styles.messageContainerMe
                    : styles.messageContainerOther,
                ]}
              >
                {/* Hiển thị tên người gửi cho tin nhắn của người khác */}
                {msg.from === "other" && msg.senderName && (
                  <Text style={styles.senderName}>{msg.senderName}</Text>
                )}

                <View
                  style={[
                    styles.messageBubble,
                    msg.from === "me" ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.from === "me" ? styles.textMe : styles.textOther,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>

                {/* Hiển thị thời gian và trạng thái đọc */}
                <View style={styles.messageFooter}>
                  {msg.timestamp && (
                    <Text style={styles.messageTime}>
                      {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  )}
                  {msg.from === "me" && (
                    <Text style={styles.readStatus}>
                      {msg.isRead ? "✓✓" : "✓"}
                    </Text>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có tin nhắn nào</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Gửi</Text>
        </TouchableOpacity>
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
    paddingTop: 50,
  },
  backIcon: {
    marginLeft: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  callIcon: {
    marginRight: 10,
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    paddingBottom: 120, // Tăng padding bottom để tránh bị che bởi input area
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageContainerMe: {
    alignItems: "flex-end",
  },
  messageContainerOther: {
    alignItems: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: "#31B7EC",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#E0E0E0",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
  },
  textMe: {
    color: "#fff",
  },
  textOther: {
    color: "#000",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  messageTime: {
    fontSize: 10,
    color: "#999",
    marginRight: 4,
  },
  readStatus: {
    fontSize: 10,
    color: "#31B7EC",
    marginLeft: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    position: "absolute",
    bottom: 80, // Tăng bottom để tránh bị đè bởi navigation bar
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#31B7EC",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendText: {
    color: "#FFF",
    fontWeight: "bold",
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
  dateSeparatorContainer: {
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  dateSeparatorText: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});

export default DetailMessageScreen;
