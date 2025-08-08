import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StudentLayout from "../../components/navigation/StudentLayout";

const FeedbackScreen = ({ navigation, route }) => {
  const { name } = route.params || { name: "Thủy Chi (Pù)" };
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sessionRating, setSessionRating] = useState(0);
  const [sessionFeedback, setSessionFeedback] = useState("");

  const handleStarPress = (value) => setRating(value);
  const handleSessionStarPress = (value) => setSessionRating(value);

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
        <Text style={styles.headerTitle}>Viết Đánh Giá</Text>
        <TouchableOpacity>
          <Icon
            name="notifications"
            size={24}
            color="#FFFFFF"
            style={styles.notiIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Feedback Sections */}
      <View style={styles.feedbackContainer}>
        {/* First Card - Tutor Feedback */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Viết Đánh Giá về Gia Sư</Text>
          <Text style={styles.cardDescription}>
            Hãy giúp chúng tôi cải thiện công cụ để phù hợp nhất với nhu cầu của
            bạn bằng cách đánh giá chúng tôi tại đây!
          </Text>
          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleStarPress(value)}
                style={styles.starContainer}
              >
                <Icon
                  name={value <= rating ? "star" : "star-outline"}
                  size={40}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.commentTitle}>Bình luận</Text>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Nhập bình luận..."
            placeholderTextColor="#666"
            multiline
          />
        </View>

        {/* Second Card - Session Feedback */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Đánh Giá Buổi Học</Text>
          <Text style={styles.cardDescription}>
            Mức độ hài lòng về buổi học này{"\n"}1-Không Hài Lòng & 5-Rất Hài
            Lòng
          </Text>
          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleSessionStarPress(value)}
              >
                <View
                  style={[
                    styles.ratingCircle,
                    value <= sessionRating
                      ? styles.selectedRatingCircle
                      : styles.unselectedRatingCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.sessionRatingText,
                      value <= sessionRating
                        ? styles.selectedRatingText
                        : styles.unselectedRatingText,
                    ]}
                  >
                    {value}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.commentTitle}>Góp ý về buổi học</Text>
          <TextInput
            style={styles.commentInput}
            value={sessionFeedback}
            onChangeText={setSessionFeedback}
            placeholder="Buổi học này..."
            placeholderTextColor="#666"
            multiline
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={[styles.buttonText, { color: "black" }]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.buttonText}>Nộp</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  feedbackContainer: {
    margin: 10,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  starRating: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 10,
  },
  starContainer: {
    marginHorizontal: 10,
  },
  commentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentInput: {
    height: 80,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  ratingCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedRatingCircle: {
    backgroundColor: "#D3D3D3",
  },
  selectedRatingCircle: {
    backgroundColor: "#FEF2E1",
    borderRadius: 30,
  },
  sessionRatingText: {
    fontSize: 16,
  },
  unselectedRatingText: {
    color: "#000",
  },
  selectedRatingText: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  submitButton: {
    backgroundColor: "#31B7EC",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default FeedbackScreen;
