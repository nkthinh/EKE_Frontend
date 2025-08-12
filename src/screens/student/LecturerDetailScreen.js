import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../components/navigation/StudentLayout";

// Sample review data (you can replace this with dynamic data from your app)
const reviewData = {
  ratings: { 5: 40, 4: 10, 3: 2, 2: 0, 1: 0 }, // Percentage or count of each star rating
  averageRating: 4.8,
  totalReviews: 52,
  comments: [
    {
      user: "Chú Thậnh",
      time: "15 Mins Ago",
      text: "Xuất sắc! Gia sư tận tâm, giảng dạy dễ hiểu, giúp học viên tiến bộ nhanh chóng!",
      stars: 5,
    },
  ],
};

const LecturerDetailScreen = ({ navigation, route }) => {
  console.log("LecturerDetailScreen - route.params:", route.params);
  const { profile } = route.params || {};

  if (!profile) {
    console.error("No profile data received in LecturerDetailScreen");
    return (
      <StudentLayout navigation={navigation}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không có thông tin gia sư</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </StudentLayout>
    );
  }

  // Derive subject taught from skills or teaching experience
  const subjectTaught =
    profile.skills?.length > 0
      ? profile.skills[0].text
      : profile.teachingExperience || "Not specified";

  // Ensure teachingExperience is an array, default to empty array if undefined or not an array
  const teachingExperience = Array.isArray(profile.teachingExperience)
    ? profile.teachingExperience
    : [];

  return (
    <StudentLayout navigation={navigation}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={28} color="#31B7EC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{profile.name}</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={
              profile.profileImage
                ? { uri: profile.profileImage }
                : profile.image
            }
            style={styles.profileImage}
            defaultSource={require("../../assets/girl.jpg")}
            onError={(e) =>
              console.log("Image load error:", e.nativeEvent.error)
            }
          />
        </View>
        <View style={styles.divider} />

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Thông Tin Cá Nhân</Text>
          <View style={styles.infoItem}>
            <Icon name="person" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Giới Tính:</Text>
            <Text style={styles.value}>
              {profile.gender || "Not specified"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="calendar" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Năm Sinh:</Text>
            <Text style={styles.value}>
              {profile.birthYear || "Not specified"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="book" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Môn Nhận Dạy:</Text>
            <Text style={styles.value}>{subjectTaught}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="briefcase" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Chức Vụ:</Text>
            <Text style={styles.value}>{profile.position || "Sinh Viên"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="school" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Chuyên Ngành:</Text>
            <Text style={styles.value}>{profile.major || "Not specified"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="business" size={18} color="#666" style={styles.icon} />
            <Text style={styles.label}>Đơn Vị:</Text>
            <Text style={styles.value}>
              {profile.university || "Not specified"}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.introContainer}>
          <Text style={styles.sectionTitle}>Giới Thiệu</Text>
          {teachingExperience.length > 0 ? (
            teachingExperience.map((exp, index) => (
              <View key={index} style={styles.introItem}>
                <Text style={styles.introText}>• {exp}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.introText}>
              No teaching experience provided.
            </Text>
          )}
        </View>
        <View style={styles.divider} />

        <View style={styles.certContainer}>
          <Text style={styles.sectionTitle}>Chứng Chỉ</Text>
          <Image
            source={require("../../assets/cert.jpg")}
            style={styles.certImage}
            onError={(e) =>
              console.log("Image load error:", e.nativeEvent.error)
            }
          />
        </View>
        <View style={styles.divider} />

        <View style={styles.feeContainer}>
          <Text style={styles.sectionTitle}>Bảng Học Phí Tham Khảo</Text>
          <View style={styles.feeTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Môn học</Text>
              <Text style={styles.tableHeader}>Cấp bậc</Text>
              <Text style={styles.tableHeader} numberOfLines={1}>
                Học phí/Buổi
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Tiếng Anh</Text>
              <Text style={styles.tableCell}>Cấp 1</Text>
              <Text style={styles.tableCell}>200</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Tiếng Anh</Text>
              <Text style={styles.tableCell}>Cấp 2</Text>
              <Text style={styles.tableCell}>250</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />

        <View style={styles.reviewContainer}>
          <Text style={styles.sectionTitle}>
            Đánh giá từ phụ huynh/học sinh
          </Text>
          <View style={styles.reviewCard}>
            {/* Rating Distribution and Summary in a row */}
            <View style={styles.reviewContent}>
              {/* Rating Distribution (Left) */}
              <View style={styles.ratingDistribution}>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <View key={stars} style={styles.ratingRow}>
                    <Text style={styles.ratingText}>{stars} ★</Text>
                    <View style={styles.ratingBarContainer}>
                      <View
                        style={[
                          styles.ratingBar,
                          {
                            width: `${(reviewData.ratings[stars] / 40) * 100}%`,
                          }, // Assuming 40 is the max count for scaling
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
              {/* Rating Summary (Right) */}
              <View style={styles.ratingSummary}>
                <Text style={styles.averageRating}>
                  {reviewData.averageRating}
                </Text>
                <View style={styles.starContainer}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Icon
                      key={i}
                      name="star"
                      size={16}
                      color={
                        i < Math.floor(reviewData.averageRating)
                          ? "#FFD700"
                          : "#D3D3D3"
                      }
                    />
                  ))}
                </View>
                <Text style={styles.totalReviews}>
                  {reviewData.totalReviews} Reviews
                </Text>
              </View>
            </View>
          </View>
          {/* Comment Section */}
          {reviewData.comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Image
                source={require("../../assets/girl.jpg")}
                style={styles.commentProfileImage}
              />
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentStars}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Icon
                      key={i}
                      name="star"
                      size={16}
                      color={i < comment.stars ? "#FFD700" : "#D3D3D3"}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </StudentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 100,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "center",
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: "95%",
    height: 400,
    borderRadius: 10,
    resizeMode: "cover",
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  introContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  certContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  reviewContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  reviewCard: {
    backgroundColor: "#F8F8F8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  reviewContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingDistribution: {
    flex: 2,
    marginRight: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingText: {
    width: 40,
    fontSize: 16,
    color: "#333",
  },
  ratingBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  ratingBar: {
    height: "100%",
    backgroundColor: "#28A745",
    borderRadius: 5,
  },
  ratingSummary: {
    flex: 1,
    alignItems: "flex-end",
  },
  averageRating: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  totalReviews: {
    fontSize: 16,
    color: "#666",
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4081",
  },
  commentTime: {
    fontSize: 12,
    color: "#FF4081",
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  commentStars: {
    flexDirection: "row",
  },
  feeContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  introItem: {
    marginBottom: 5,
  },
  certImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    resizeMode: "contain",
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#666",
    width: 100,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  introText: {
    fontSize: 16,
    color: "#333",
  },
  feeTable: {
    borderColor: "#f0f0f0",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  divider: {
    height: 5,
    backgroundColor: "#d9d9d9",
    width: "100%",
    marginInline: 10,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF4444",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#31B7EC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LecturerDetailScreen;
