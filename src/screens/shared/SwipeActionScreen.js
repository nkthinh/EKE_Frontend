import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import { useMatch } from "../../hooks/useMatch";
import { useAuth } from "../../hooks/useAuth";
import tutorService from "../../services/features/tutorService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { COLORS, SIZES } from "../../constants";

const SwipeActionScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const {
    handleStudentSwipe,
    fetchLikedStudents,
    handleTutorResponse,
    likedStudents,
    loading,
    error,
  } = useMatch();

  const [refreshing, setRefreshing] = useState(false);
  const [tutors, setTutors] = useState([]); // This should come from tutor service

  useEffect(() => {
    if (userData?.role === "tutor") {
      fetchLikedStudents();
    } else {
      // Fetch available tutors for student
      fetchTutors();
    }
  }, [userData?.role]);

  const fetchTutors = async () => {
    try {
      setLoading(true);

      if (userData?.id) {
        // Get available tutors from API
        console.log("🔍 Fetching tutors for student ID:", userData.id);
        const availableTutors = await tutorService.getAvailableTutors(
          userData.id
        );
        console.log(
          "📥 Available tutors response:",
          JSON.stringify(availableTutors, null, 2)
        );
        setTutors(availableTutors || []);
      } else {
        // Fallback placeholder data
        setTutors([
          {
            id: 1,
            name: "John Doe",
            subject: "Mathematics",
            rating: 4.8,
            profileImage: null,
            experience: "5 years",
            pricePerHour: "$25",
            bio: "Experienced math tutor with a passion for teaching",
          },
          {
            id: 2,
            name: "Jane Smith",
            subject: "English",
            rating: 4.9,
            profileImage: null,
            experience: "3 years",
            pricePerHour: "$30",
            bio: "English literature expert and writing coach",
          },
        ]);
      }
    } catch (error) {
      console.error("Fetch tutors error:", error);
      // Use fallback data on error
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (userData?.role === "tutor") {
      await fetchLikedStudents();
    } else {
      await fetchTutors();
    }
    setRefreshing(false);
  };

  // Student swipes tutor
  const handleSwipe = async (tutorId, action) => {
    console.log("🔍 SwipeActionScreen - handleSwipe:");
    console.log("👤 Student ID:", userData?.id);
    console.log("👨‍🏫 Tutor ID:", tutorId);
    console.log("🎯 Action:", action);
    console.log("📊 Tutor ID type:", typeof tutorId);

    try {
      const result = await handleStudentSwipe(tutorId, action);

      if (result.success && result.isInstantMatch) {
        // Navigate to chat screen
        navigation.navigate("ChatDetail", {
          match: result.match,
        });
      }
    } catch (error) {
      console.error("Swipe error:", error);
    }
  };

  // Tutor responds to student's like
  const handleResponse = async (studentId, action) => {
    try {
      const result = await handleTutorResponse(studentId, action);

      if (result.success && result.match) {
        // Navigate to chat screen
        navigation.navigate("ChatDetail", {
          match: result.match,
        });
      }
    } catch (error) {
      console.error("Response error:", error);
    }
  };

  // Render tutor card for student
  const renderTutorCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.profileImage
            ? { uri: item.profileImage }
            : require("../../assets/teacher.jpg")
        }
        style={styles.profileImage}
      />

      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.details}>
          ⭐ {item.rating} • {item.experience}
        </Text>
        <Text style={styles.price}>{item.pricePerHour}/hour</Text>
        {item.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => {
            console.log("🔍 Pass button pressed for tutor:", item);
            console.log("👨‍🏫 Tutor ID from item:", item.id);
            handleSwipe(item.id, "pass");
          }}
          disabled={loading}
        >
          <Text style={styles.passButtonText}>❌</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => {
            console.log("🔍 Like button pressed for tutor:", item);
            console.log("👨‍🏫 Tutor ID from item:", item.id);
            handleSwipe(item.id, "like");
          }}
          disabled={loading}
        >
          <Text style={styles.likeButtonText}>💖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render liked student card for tutor
  const renderLikedStudentCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.profileImage
            ? { uri: item.profileImage }
            : require("../../assets/avatar.png")
        }
        style={styles.profileImage}
      />

      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.fullName || item.name}</Text>
        <Text style={styles.subject}>{item.grade || "Student"}</Text>
        <Text style={styles.details}>
          Interested in: {item.subject || "General tutoring"}
        </Text>
        <Text style={styles.timestamp}>
          Liked you {new Date(item.likedAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleResponse(item.studentId || item.id, "reject")}
        >
          <Text style={styles.rejectButtonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleResponse(item.studentId || item.id, "accept")}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {userData?.role === "student"
          ? "Find Your Tutor"
          : "Students Interested in You"}
      </Text>

      {userData?.role === "student" ? (
        <FlatList
          data={tutors}
          renderItem={renderTutorCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No tutors available right now
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={likedStudents}
          renderItem={renderLikedStudentCard}
          keyExtractor={(item) => (item.studentId || item.id).toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No students have shown interest yet
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  header: {
    fontSize: SIZES.h2,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: SIZES.base,
  },
  cardContent: {
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  name: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  subject: {
    fontSize: SIZES.body3,
    color: COLORS.primary,
    marginBottom: 4,
  },
  details: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    marginBottom: 4,
  },
  price: {
    fontSize: SIZES.body2,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: 4,
  },
  bio: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    fontStyle: "italic",
    marginTop: 4,
  },
  timestamp: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    minWidth: 80,
    alignItems: "center",
  },
  likeButton: {
    backgroundColor: COLORS.success,
  },
  passButton: {
    backgroundColor: COLORS.lightGray,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  rejectButton: {
    backgroundColor: COLORS.red,
  },
  likeButtonText: {
    fontSize: 20,
  },
  passButtonText: {
    fontSize: 16,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  rejectButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: SIZES.body2,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default SwipeActionScreen;
