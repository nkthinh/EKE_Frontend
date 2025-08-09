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
  StatusBar,
} from "react-native";
import { useMatch } from "../../hooks/useMatch";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../hooks/useGlobalState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { COLORS, SIZES } from "../../constants";
import { isTutor } from "../../utils/navigation";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { messageService } from "../../services";

const TutorLikedStudentsScreen = ({ navigation }) => {
  const { userData } = useAuth();
  const { likedStudents: globalLikedStudents, updateLikedStudents } =
    useGlobalState();
  const {
    likedStudents: localLikedStudents,
    fetchLikedStudents,
    handleTutorResponseWithConversation,
    loading,
    error,
  } = useMatch();

  // Use global liked students if available, otherwise use local
  const likedStudents =
    globalLikedStudents.length > 0 ? globalLikedStudents : localLikedStudents;

  const [refreshing, setRefreshing] = useState(false);
  const [processingStudents, setProcessingStudents] = useState(new Set());

  // Log when component mounts
  useEffect(() => {
    console.log("🎯 TutorLikedStudentsScreen - Component mounted");
    console.log("👤 Initial userData:", userData);
  }, []);

  // Auto-fetch liked students when component mounts and user data is available
  useEffect(() => {
    if (userData?.id && isTutor(userData?.role)) {
      console.log("🚀 Auto-fetching liked students on mount...");
      console.log("👤 User ID:", userData.id);
      console.log("👨‍🏫 User Role:", userData.role);
      fetchLikedStudents();
    }
  }, [userData?.id, userData?.role, fetchLikedStudents]);

  // Additional effect to handle role changes
  useEffect(() => {
    const isTutorUser = isTutor(userData?.role);
    console.log("🔍 TutorLikedStudentsScreen - Role check:", {
      userRole: userData?.role,
      isTutor: isTutorUser,
      userId: userData?.id,
    });
  }, [userData?.role]);

  const onRefresh = async () => {
    setRefreshing(true);
    const result = await fetchLikedStudents();

    // Update global state with fresh data
    if (result && Array.isArray(result)) {
      updateLikedStudents(result);
    } else if (result && result.data && Array.isArray(result.data)) {
      updateLikedStudents(result.data);
    } else if (
      result &&
      result.likedStudents &&
      Array.isArray(result.likedStudents)
    ) {
      updateLikedStudents(result.likedStudents);
    }

    setRefreshing(false);
  };

  const handleResponse = async (studentId, action) => {
    console.log("🔍 === HANDLE RESPONSE DEBUG ===");
    console.log("📥 Input parameters:");
    console.log("   studentId:", studentId, "(type:", typeof studentId, ")");
    console.log("   action:", action);

    if (processingStudents.has(studentId)) return;

    setProcessingStudents((prev) => new Set(prev).add(studentId));

    try {
      console.log("🔍 Calling handleTutorResponseWithConversation with:");
      console.log("   studentId:", studentId, "(type:", typeof studentId, ")");
      console.log("   action:", action);

      // Callback function to handle conversation creation success
      const onConversationCreated = (conversation) => {
        console.log(
          "🎉 Conversation created successfully, navigating to message tab"
        );
        console.log("📱 Conversation data:", conversation);

        // Navigate to message tab to show the new conversation
        navigation.navigate("TutorMessage");
      };

      const result = await handleTutorResponseWithConversation(
        studentId,
        action,
        onConversationCreated
      );

      console.log("📥 handleTutorResponseWithConversation result:", result);

      if (result.success) {
        if (result.type === "match_created_with_conversation") {
          // Show success message and navigate to message tab
          Alert.alert(
            "🎉 Match Created!",
            "You have successfully matched with the student! Check your messages to start chatting.",
            [
              {
                text: "View Messages",
                onPress: () => {
                  console.log("🚀 Navigating to message tab");
                  navigation.navigate("TutorMessage");
                },
              },
              {
                text: "Start Chatting",
                onPress: async () => {
                  console.log(
                    "🚀 Navigating to chat with conversation:",
                    result.conversation
                  );

                  try {
                    // Gọi API để lấy thông tin chi tiết cuộc trò chuyện ngay khi ấn vào
                    const conversationId = result.conversation.id;
                    console.log(
                      "🔍 Calling API /Conversations/{conversationId} for ID:",
                      conversationId
                    );
                    const conversationDetails =
                      await messageService.getConversationById(conversationId);
                    console.log(
                      "📥 Conversation details loaded:",
                      conversationDetails
                    );

                    // Navigate với thông tin chi tiết đã được cập nhật
                    navigation.navigate("ChatDetail", {
                      conversationId: conversationId,
                      match: result.match,
                      conversation: conversationDetails, // Sử dụng thông tin chi tiết từ API
                      otherUser:
                        result.match.student || result.match.studentName,
                      name:
                        result.match.studentName ||
                        result.match.student?.fullName ||
                        "Student",
                      userId: userData?.id, // Thêm userId
                    });
                  } catch (error) {
                    console.error(
                      "❌ Error loading conversation details:",
                      error
                    );

                    // Fallback: Navigate với thông tin cũ nếu API fail
                    navigation.navigate("ChatDetail", {
                      conversationId: result.conversation.id,
                      match: result.match,
                      conversation: result.conversation,
                      otherUser:
                        result.match.student || result.match.studentName,
                      name:
                        result.match.studentName ||
                        result.match.student?.fullName ||
                        "Student",
                      userId: userData?.id, // Thêm userId
                    });
                  }
                },
              },
              {
                text: "Later",
                style: "cancel",
              },
            ]
          );
        } else if (result.type === "match_created_no_conversation") {
          // Match created but conversation failed
          Alert.alert(
            "Match Created!",
            "You've successfully matched with the student, but there was an issue creating the conversation. Please try again.",
            [
              {
                text: "Try Again",
                onPress: () => handleResponse(studentId, action),
              },
              {
                text: "Later",
                style: "cancel",
              },
            ]
          );
        } else if (result.type === "already_accepted") {
          Alert.alert("Success", "Student already accepted successfully!");
        } else if (result.type === "already_rejected") {
          Alert.alert("Success", "Student already rejected successfully!");
        } else if (action === "reject") {
          Alert.alert("Done", "Student request has been declined.");
        } else {
          Alert.alert("Success", "Request processed successfully.");
        }
      } else {
        console.error("❌ Response failed:", result.error);
        Alert.alert("Error", "Failed to process request. Please try again.");
      }
    } catch (error) {
      console.error("❌ Response error:", error);
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
    console.log("🔍 === RENDER STUDENT CARD DEBUG ===");
    console.log("📥 Item data:", item);
    console.log("📥 Item type:", typeof item);

    // Handle different data structures
    const student = item.student || item;
    const studentId = student.id || item.studentId || item.id;
    const isProcessing = processingStudents.has(studentId);

    console.log("🔍 Extracted data:");
    console.log("   student:", student);
    console.log("   student.id:", student.id, "(type:", typeof student.id, ")");
    console.log(
      "   item.studentId:",
      item.studentId,
      "(type:",
      typeof item.studentId,
      ")"
    );
    console.log("   item.id:", item.id, "(type:", typeof item.id, ")");
    console.log(
      "   Final studentId:",
      studentId,
      "(type:",
      typeof studentId,
      ")"
    );
    console.log("   isProcessing:", isProcessing);

    console.log("🔍 Student data:", {
      student,
      studentId,
      isProcessing,
      fullName: student.fullName || student.name || "Student",
      profileImage: student.profileImage,
    });

    return (
      <View style={styles.studentCard}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                student.profileImage
                  ? { uri: student.profileImage }
                  : require("../../assets/avatar.png")
              }
              style={styles.profileImage}
            />
            {student.isOnline && <View style={styles.onlineIndicator} />}
          </View>

          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>
              {student.fullName || student.name || "Student"}
            </Text>

            <View style={styles.studentDetailsRow}>
              {student.gradeLevel && (
                <View style={styles.detailItem}>
                  <Ionicons name="school" size={14} color={COLORS.gray} />
                  <Text style={styles.detailText}>
                    Grade {student.gradeLevel}
                  </Text>
                </View>
              )}
              {student.schoolName && (
                <View style={styles.detailItem}>
                  <Ionicons name="location" size={14} color={COLORS.gray} />
                  <Text style={styles.detailText}>{student.schoolName}</Text>
                </View>
              )}
            </View>

            {student.learningGoals && (
              <View style={styles.learningGoalsContainer}>
                <Ionicons name="book" size={16} color={COLORS.primary} />
                <Text style={styles.learningGoalsText} numberOfLines={2}>
                  {student.learningGoals}
                </Text>
              </View>
            )}

            {student.learningStyle && (
              <View style={styles.learningStyleContainer}>
                <Ionicons name="bulb" size={14} color={COLORS.secondary} />
                <Text style={styles.learningStyleText} numberOfLines={1}>
                  {student.learningStyle}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.declineButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={() => handleResponse(studentId, "reject")}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#ff4757", "#ff3742"]}
              style={styles.buttonGradient}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.declineButtonText}>
                {isProcessing ? "Processing..." : "Decline"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.acceptButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={() => handleResponse(studentId, "accept")}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#000", "#333"]}
              style={styles.buttonGradient}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.acceptButtonText}>
                {isProcessing ? "Processing..." : "Accept"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Liked Date */}
        <View style={styles.likedDateContainer}>
          <Ionicons name="heart" size={14} color={COLORS.red} />
          <Text style={styles.likedDate}>
            Liked you on{" "}
            {new Date(
              item.createdAt || item.likedAt || Date.now()
            ).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  // Show loading spinner when initially loading
  if (loading && !refreshing && likedStudents.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.header}>Students Interested in You</Text>
            <Text style={styles.subtitle}>Loading...</Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text style={styles.loadingText}>Loading students...</Text>
        </View>
      </View>
    );
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

  // Debug logging
  console.log(
    "🔍 TutorLikedStudentsScreen - Current likedStudents:",
    likedStudents
  );
  console.log(
    "🔍 TutorLikedStudentsScreen - likedStudents.length:",
    likedStudents.length
  );
  console.log("🔍 TutorLikedStudentsScreen - Loading state:", loading);
  console.log("🔍 TutorLikedStudentsScreen - Refreshing state:", refreshing);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.header}>Students Interested in You</Text>
          <Text style={styles.subtitle}>
            {likedStudents.length} student
            {likedStudents.length !== 1 ? "s" : ""}
            {likedStudents.length === 0
              ? " have"
              : likedStudents.length === 1
              ? " has"
              : " have"}{" "}
            shown interest
          </Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={likedStudents}
        renderItem={renderStudentCard}
        keyExtractor={(item) => {
          const student = item.student || item;
          const studentId = student.id || item.studentId || item.id;
          return studentId.toString();
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name="heart-outline"
                size={80}
                color={COLORS.lightGray}
              />
            </View>
            <Text style={styles.emptyTitle}>No Students Yet</Text>
            <Text style={styles.emptyText}>
              Students who are interested in your tutoring services will appear
              here. Make sure your profile is complete and attractive
            </Text>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate("TutorProfile")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#000", "#333"]}
                style={styles.profileButtonGradient}
              >
                <Ionicons
                  name="person"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.profileButtonText}>Update Profile</Text>
              </LinearGradient>
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
    backgroundColor: "#fff",
  },

  // Header Styles
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 20,
    padding: 6,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  headerRight: {
    width: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  // Student Card Styles
  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  // Profile Section
  profileSection: {
    flexDirection: "row",
    marginBottom: SIZES.padding,
  },
  profileImageContainer: {
    position: "relative",
    marginRight: SIZES.padding,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#000",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#2ed573",
    borderWidth: 2,
    borderColor: "#fff",
  },
  studentInfo: {
    flex: 1,
    justifyContent: "center",
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  studentDetailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  learningGoalsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  learningGoalsText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },
  learningStyleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  learningStyleText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    flex: 1,
    fontStyle: "italic",
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButton: {
    borderRadius: 30,
    overflow: "hidden",
    minWidth: 120,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  acceptButton: {
    backgroundColor: "#000",
  },
  declineButton: {
    backgroundColor: "#ff4757",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 6,
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  declineButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // Liked Date
  likedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  likedDate: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontStyle: "italic",
    fontWeight: "500",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 1,
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  profileButton: {
    borderRadius: 30,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  profileButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  // Loading Container
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 15,
    letterSpacing: 0.5,
  },

  // List Container
  listContainer: {
    paddingBottom: 20,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4757",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default TutorLikedStudentsScreen;
