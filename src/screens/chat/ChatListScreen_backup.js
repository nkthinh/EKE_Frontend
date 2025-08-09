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
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import BottomMenu from "../../components/common/BottomMenu";
import StudentLayout from "../../components/navigation/StudentLayout";
import { messageService } from "../../services";
import { useMessage } from "../../hooks";
import { assets } from "../../assets";

const ChatListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use the new message hook
  const {
    conversations,
    loading: messageLoading,
    getConversations
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
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Fallback to existing logic if new system fails
      loadChatListFallback();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
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
            avatar: require("../../assets/avatar.png"),
            lastMessage: "Hello ạ.",
            time: "10:40 PM",
            online: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadChatList();
  }, []);
  if (loading) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Học Viên Của Tôi</Text>
            <TouchableOpacity>
              <Icon name="bell-outline" size={28} color="#00AEEF" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 100,
            }}
          >
            <Text>Đang tải...</Text>
          </View>
        </ScrollView>
        <BottomMenu navigation={navigation} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Học Viên Của Tôi</Text>
            <TouchableOpacity>
              <Icon name="bell-outline" size={28} color="#00AEEF" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 100,
            }}
          >
            <Text>Lỗi: {error}</Text>
          </View>
        </ScrollView>
        <BottomMenu navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Học Viên Của Tôi</Text>
          <TouchableOpacity>
            <Icon name="bell-outline" size={28} color="#00AEEF" />
          </TouchableOpacity>
        </View>

        <TextInput style={styles.search} placeholder="Tìm kiếm học viên..." />

        <Text style={styles.subHeading}>Học Viên Được Kết Nối:</Text>
        <FlatList
          horizontal
          data={students}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => {
                try {
                  navigation.navigate("ChatDetail", { name: item.name });
                } catch (error) {
                  console.error("Error navigating to ChatDetail:", error);
                  Alert.alert("Lỗi", "Không thể mở chat. Vui lòng thử lại.");
                }
              }}
            >
              <Image source={item.avatar} style={styles.avatar} />
              <Text style={styles.avatarName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          showsHorizontalScrollIndicator={false}
        />

        {/* ✅ Giảm khoảng cách với phần Tin Nhắn */}
        <View style={{ height: 20 }} />

        <Text style={styles.subHeading}>Tin Nhắn:</Text>
        {students.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.messageItem}
            onPress={() => {
              try {
                navigation.navigate("ChatDetail", { name: item.name });
              } catch (error) {
                console.error("Error navigating to ChatDetail:", error);
                Alert.alert("Lỗi", "Không thể mở chat. Vui lòng thử lại.");
              }
            }}
          >
            <Image source={item.avatar} style={styles.avatarSmall} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.lastMessage}>You: {item.lastMessage}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
            {item.online && <View style={styles.dot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00AEEF",
  },
  search: {
    backgroundColor: "#f2f2f2",
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 10,
    color: "#333",
  },
  avatarWrapper: {
    alignItems: "center",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
  },
  avatarName: {
    fontSize: 14,
    width: 80,
    textAlign: "center",
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  time: {
    fontSize: 13,
    color: "#888",
    marginLeft: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1BC100",
    marginLeft: 8,
  },
});

export default ChatListScreen;
