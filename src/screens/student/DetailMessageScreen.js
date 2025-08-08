import React, { useState } from "react";
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

const DetailMessageScreen = ({ navigation, route }) => {
  const { name } = route.params || { name: "Thủy Chi (Pù)" };
  const [message, setMessage] = useState("");
  const messages = [
    { text: "Xin chào! Tớ có thể giúp gì cho bạn?", sender: "other" },
    { text: "Chào bạn! Tôi muốn tìm gia sư toán.", sender: "me" },
    { text: "Tuyệt vời! Bạn cần gia sư cho cấp độ nào?", sender: "other" },
    { text: "Tôi cần gia sư cho lớp 10..", sender: "me" },
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

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
        <Text style={styles.headerTitle}>{name}</Text>
        <TouchableOpacity>
          <Icon name="call" size={24} color="#FFFFFF" style={styles.callIcon} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text
              style={[
                msg.sender === "me"
                  ? [styles.messageText, { color: "white" }]
                  : styles.messageText,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    marginBottom: "20%",
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
});

export default DetailMessageScreen;
