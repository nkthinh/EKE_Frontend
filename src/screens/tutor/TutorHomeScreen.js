import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import BottomMenu from "../../components/common/BottomMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { tutorService, notificationService } from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { useMatch } from "../../hooks/useMatch";
import { isTutor } from "../../utils/navigation";

const defaultTutors = Array(9).fill({
  id: 1,
  fullName: "Nguyễn Thị Thảo",
  university: "Đại học Sư phạm",
  major: "Toán học",
  address: "13/28 Nguyễn Huệ, Tân Bình, Tp HCM",
  image: require("../../assets/avatar.png"),
  averageRating: 4.8,
  hourlyRate: 150000,
  experienceYears: 2,
});

const TutorHomeScreen = ({ navigation }) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [location, setLocation] = useState(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [minAge, setMinAge] = useState(5);
  const [maxAge, setMaxAge] = useState(30);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { userData } = useAuth();
  const { likedStudents, fetchLikedStudents } = useMatch();

  // Lấy thông tin user từ đăng nhập
  const userName = userData?.fullName || "Gia Sư";

  useEffect(() => {
    loadData();
    // Load liked students for tutor
    if (isTutor(userData?.role)) {
      fetchLikedStudents();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch tutors from API
      const response = await tutorService.searchTutors({
        page: 1,
        pageSize: 20,
        sortBy: "AverageRating",
        sortOrder: "DESC",
      });

      if (response.success && response.data) {
        // Transform API response to match component format
        const tutorList = response.data.map((tutor) => ({
          id: tutor.id,
          fullName: tutor.fullName,
          university: tutor.university || "Chưa cập nhật",
          major: tutor.major || "Chưa cập nhật",
          address:
            tutor.city && tutor.district
              ? `${tutor.district}, ${tutor.city}`
              : "Chưa cập nhật",
          image: tutor.profileImage
            ? { uri: tutor.profileImage }
            : require("../../assets/avatar.png"),
          averageRating: tutor.averageRating || 0,
          hourlyRate: tutor.hourlyRate || 0,
          experienceYears: tutor.experienceYears || 0,
          ratingDisplay: tutor.ratingDisplay || "Chưa có đánh giá",
          hourlyRateText: tutor.hourlyRateText || "Thỏa thuận",
          experienceText: tutor.experienceText || "Mới bắt đầu",
        }));
        setTutors(tutorList.length > 0 ? tutorList : defaultTutors);
      } else {
        setTutors(defaultTutors);
      }
    } catch (error) {
      console.error("Error loading tutors:", error);
      setTutors(defaultTutors);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const notifications = await notificationService.getUnreadNotifications();
      setUnreadNotifications(notifications.length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TutorProfileView", { tutorId: item.id })
      }
    >
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.bottomOverlay}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.university}>🎓 {item.university}</Text>
          <Text style={styles.major}>📚 {item.major}</Text>
          <Text style={styles.address}>
            <Icon name="map-marker" size={16} color="#fff" /> {item.address}
          </Text>
          <View style={styles.statsRow}>
            <Text style={styles.rating}>⭐ {item.ratingDisplay}</Text>
            <Text style={styles.hourlyRate}>{item.hourlyRateText}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/logo1.png")}
          style={styles.logoTop}
        />
        <View style={styles.row}>
          <View style={styles.leftGreeting}>
            <Text style={styles.greeting}>Xin Chào,</Text>
            <Text style={styles.username}>{userName}</Text>
          </View>
          <View style={styles.rightIcons}>
            <TouchableOpacity onPress={() => setFilterVisible(true)}>
              <Icon name="filter-variant" size={30} color="#31B7EC" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("NotificationScreen")}
            >
              <View style={styles.bellWrapper}>
                <Icon name="bell-outline" size={28} color="#F5A623" />
                {unreadNotifications > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.searchBox}>
        <TextInput placeholder="Nhập Tên" style={styles.searchInput} />
        <TouchableOpacity>
          <Icon name="magnify" size={22} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Card hiển thị học sinh đã swipe */}
      <TouchableOpacity
        style={styles.likedStudentsCard}
        onPress={() => navigation.navigate("TutorLikedStudents")}
      >
        <View style={styles.likedStudentsContent}>
          <View style={styles.likedStudentsLeft}>
            <Icon name="heart" size={24} color="#FF6B6B" />
            <Text style={styles.likedStudentsTitle}>Học sinh quan tâm</Text>
            <Text style={styles.likedStudentsSubtitle}>
              {likedStudents.length} học sinh đã swipe bạn
            </Text>
          </View>
          <View style={styles.likedStudentsRight}>
            <Icon name="chevron-right" size={24} color="#31B7EC" />
            {likedStudents.length > 0 && (
              <View style={styles.likedStudentsBadge}>
                <Text style={styles.likedStudentsBadgeText}>
                  {likedStudents.length}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#31B7EC" />
          <Text style={styles.loadingText}>Đang tải danh sách gia sư...</Text>
        </View>
      ) : (
        <FlatList
          data={tutors}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadData}
        />
      )}

      <BottomMenu navigation={navigation} userRole={userData?.role} />

      {/* Filter Modal */}
      <Modal transparent animationType="fade" visible={filterVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bộ Lọc</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    setNameFilter("");
                    setLocation("");
                    setMinAge(5);
                    setMaxAge(30);
                  }}
                >
                  <Text style={styles.reset}>Reset all</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterVisible(false)}>
                  <Icon name="close" size={22} style={{ marginLeft: 16 }} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tên học viên */}
            <Text style={styles.label}>Tên Học Viên</Text>
            <TextInput
              placeholder="Nhập tên học viên"
              value={nameFilter}
              onChangeText={setNameFilter}
              style={styles.modalInput}
            />

            {/* Địa điểm */}
            <Text style={styles.label}>Địa Điểm</Text>
            <TextInput
              placeholder="Long Thạnh Mỹ, Thành Phố Thủ Đức"
              value={location}
              onChangeText={setLocation}
              style={styles.modalInput}
            />

            {/* Độ tuổi */}

            <Text style={styles.label}>Độ Tuổi</Text>
            <View style={styles.ageInputRow}>
              <TextInput
                value={minAge.toString()}
                editable={false}
                style={styles.ageInput}
              />
              <TextInput
                value={maxAge.toString()}
                editable={false}
                style={styles.ageInput}
              />
            </View>

            <MultiSlider
              values={[minAge, maxAge]}
              min={5}
              max={50}
              step={1}
              sliderLength={width - 70}
              onValuesChange={(values) => {
                setMinAge(values[0]);
                setMaxAge(values[1]);
              }}
              selectedStyle={{ backgroundColor: "#1E88E5" }}
              unselectedStyle={{ backgroundColor: "#ddd" }}
              markerStyle={{
                height: 20,
                width: 20,
                borderRadius: 10,
                backgroundColor: "#1E88E5",
              }}
              containerStyle={{ marginTop: 8 }}
            />

            {/* Button */}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.searchText}>Tìm Kiếm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingTop: 40,
    alignItems: "center",
    marginBottom: 12,
  },
  logoTop: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 12,
  },
  row: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftGreeting: {
    flexDirection: "column",
  },
  greeting: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
  },
  username: {
    fontSize: 20,
    color: "#444",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bellWrapper: {
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  card: {
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    width: cardWidth,
    height: 280,
    backgroundColor: "#000",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  age: {
    fontWeight: "normal",
    color: "#ccc",
  },

  address: {
    fontSize: 16,
    color: "#eee",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 25,
    marginTop: 80,
    marginHorizontal: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reset: {
    fontSize: 18,
    color: "#1E88E5",
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 14,
    fontSize: 18,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 6,
    height: 40,
    marginBottom: 10,
  },
  dropdownBox: {
    borderColor: "#ccc",
  },
  ageLabel: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  ageInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ageInput: {
    width: "48%",
    backgroundColor: "#f2f2f2",
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 17,
  },
  searchButton: {
    backgroundColor: "#1E88E5",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 18,
  },
  searchText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontSize: 20,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  university: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 2,
  },
  major: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  rating: {
    fontSize: 13,
    color: "#FFD700",
    fontWeight: "bold",
  },
  hourlyRate: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  // Styles for liked students card
  likedStudentsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  likedStudentsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likedStudentsLeft: {
    flex: 1,
  },
  likedStudentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  likedStudentsSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  likedStudentsRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  likedStudentsBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  likedStudentsBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default TutorHomeScreen;
