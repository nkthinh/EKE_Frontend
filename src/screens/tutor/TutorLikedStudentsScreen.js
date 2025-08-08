import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { useMatch } from "../../hooks/useMatch";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { COLORS, SIZES } from "../../constants";
import { isTutor } from "../../utils/navigation";

const TutorLikedStudentsScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const {
    likedStudents,
    fetchLikedStudents,
    handleTutorResponse,
    loading,
    error,
  } = useMatch();

  const [refreshing, setRefreshing] = useState(false);
  const [processingStudents, setProcessingStudents] = useState(new Set());

  useEffect(() => {
    // Check for both string and number role values
    const isTutorUser = isTutor(userData?.role);

    console.log("🔍 TutorLikedStudentsScreen - Role check:", {
      userRole: userData?.role,
      isTutor: isTutorUser,
    });

    if (isTutorUser) {
      fetchLikedStudents();
    }
  }, [userData?.role]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLikedStudents();
    setRefreshing(false);
  };

  const handleResponse = async (studentId, action) => {
    if (processingStudents.has(studentId)) return;

    setProcessingStudents((prev) => new Set(prev).add(studentId));

    try {
      const result = await handleTutorResponse(studentId, action);

      if (result.success && result.match) {
        // Show success message and navigate to chat
        Alert.alert(
          "🎉 Match Created!",
          "You have successfully matched with the student!",
          [
            {
              text: "Start Chatting",
              onPress: () =>
                navigation.navigate("ChatDetail", {
                  match: result.match,
                  otherUser: result.match.student,
                }),
            },
            {
              text: "Later",
              style: "cancel",
            },
          ]
        );
      }
    } catch (error) {
      console.error("Response error:", error);
      Alert.alert("Error", "Failed to process request. Please try again.");
    } finally {
      setProcessingStudents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  const renderStudentCard = ({ item }) => {
    const student = item.student || item;
    const isProcessing = processingStudents.has(student.id || item.studentId);

    return (
      <View style={styles.studentCard}>
        <Image
          source={
            student.profileImage
              ? { uri: student.profileImage }
              : require("../../assets/avatar.png")
          }
          style={styles.profileImage}
        />

        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>
            {student.fullName || student.name || "Student"}
          </Text>

          <Text style={styles.studentDetails}>
            {student.grade && `Grade: ${student.grade}`}
            {student.age && ` • Age: ${student.age}`}
          </Text>

          <Text style={styles.subject}>
            Interested in:{" "}
            {student.subject || item.subject || "General tutoring"}
          </Text>

          {student.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {student.bio}
            </Text>
          )}

          <Text style={styles.likedDate}>
            Liked you on{" "}
            {new Date(item.createdAt || item.likedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.declineButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={() =>
              handleResponse(student.id || item.studentId, "reject")
            }
            disabled={isProcessing}
          >
            <Text style={styles.declineButtonText}>
              {isProcessing ? "..." : "Decline"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.acceptButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={() =>
              handleResponse(student.id || item.studentId, "accept")
            }
            disabled={isProcessing}
          >
            <Text style={styles.acceptButtonText}>
              {isProcessing ? "..." : "Accept"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  // Check for both string and number role values
  const isTutorUser = isTutor(userData?.role);

  if (!isTutorUser) {
    console.log("❌ Not a tutor, showing error screen");
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          This screen is only available for tutors.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Students Interested in You</Text>

      <Text style={styles.subtitle}>
        {likedStudents.length} student{likedStudents.length !== 1 ? "s" : ""}
        {likedStudents.length === 0
          ? " have"
          : likedStudents.length === 1
          ? " has"
          : " have"}{" "}
        shown interest
      </Text>

      <FlatList
        data={likedStudents}
        renderItem={renderStudentCard}
        keyExtractor={(item) =>
          (item.id || item.studentId || item.student?.id).toString()
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/girl.jpg")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No Students Yet</Text>
            <Text style={styles.emptyText}>
              Students who are interested in your tutoring services will appear
              here. Make sure your profile is complete and attractive!
            </Text>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate("TutorProfile")}
            >
              <Text style={styles.profileButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: SIZES.padding,
  },
  studentCard: {
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
  studentInfo: {
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  studentName: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    marginBottom: 4,
  },
  subject: {
    fontSize: SIZES.body3,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  bio: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: SIZES.base,
  },
  likedDate: {
    fontSize: SIZES.caption,
    color: COLORS.lightGray,
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    minWidth: 100,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  declineButton: {
    backgroundColor: COLORS.red,
  },
  disabledButton: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: SIZES.body3,
  },
  declineButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: SIZES.body3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SIZES.padding,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  emptyText: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
    lineHeight: SIZES.body3 * 1.5,
  },
  profileButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  profileButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body2,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding,
  },
  errorText: {
    fontSize: SIZES.body2,
    color: COLORS.red,
    textAlign: "center",
  },
});

export default TutorLikedStudentsScreen;
