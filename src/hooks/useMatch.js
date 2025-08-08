import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import matchService from "../services/features/matchService";
import messageService from "../services/features/messageService";
import { useAuth } from "./useAuth";
import { isTutor } from "../utils/navigation";

export const useMatch = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [likedStudents, setLikedStudents] = useState([]);
  const [error, setError] = useState(null);
  const { userData } = useAuth();

  // ==================== NEW SWIPE ACTION FLOW ====================

  // Student swipes/likes a tutor
  const handleStudentSwipe = useCallback(
    async (tutorId, action = "like") => {
      console.log("🔍 useMatch - handleStudentSwipe:");
      console.log("👤 Student ID:", userData?.id);
      console.log("👨‍🏫 Tutor ID:", tutorId);
      console.log("🎯 Action:", action);
      console.log("📊 Tutor ID type:", typeof tutorId);

      if (!userData?.id) {
        Alert.alert("Error", "User data not available");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        console.log("📡 Calling matchService.studentMatchWorkflow with:");
        console.log("   Student ID:", userData.id);
        console.log("   Tutor ID:", tutorId);

        const result = await matchService.studentMatchWorkflow(
          userData.id,
          tutorId
        );

        if (result.type === "instant_match") {
          Alert.alert(
            "🎉 It's a Match!",
            "Congratulations! You have a new match! Start chatting now.",
            [
              {
                text: "Start Chat",
                onPress: () => {
                  // Navigate to chat
                },
              },
            ]
          );

          // Refresh matches
          fetchMatches();

          return {
            success: true,
            isInstantMatch: true,
            match: result.match,
          };
        } else {
          Alert.alert(
            "Interest Sent! 💕",
            "Your interest has been sent to the tutor. You'll be notified if they're interested too!"
          );

          return {
            success: true,
            isInstantMatch: false,
          };
        }
      } catch (err) {
        console.error("Swipe error:", err);
        Alert.alert("Error", "Failed to send interest. Please try again.");
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [userData?.id]
  );

  // Tutor gets list of students who liked them
  const fetchLikedStudents = useCallback(async () => {
    // Check for both string and number role values
    const isTutorUser = isTutor(userData?.role);

    if (!userData?.id || !isTutorUser) {
      console.log("⚠️ Not a tutor or no user ID:", {
        userId: userData?.id,
        userRole: userData?.role,
        isTutor: isTutorUser,
      });
      return;
    }

    console.log("🔍 Fetching liked students for tutor:", userData.id);
    console.log("👤 User role:", userData.role);

    setLoading(true);
    setError(null);

    try {
      const result = await matchService.tutorMatchWorkflow(userData.id);
      console.log("📥 API Response:", JSON.stringify(result, null, 2));

      if (result && result.likedStudents) {
        console.log("✅ Setting liked students:", result.likedStudents.length);
        setLikedStudents(result.likedStudents);
      } else {
        console.log("⚠️ No likedStudents in response, setting empty array");
        setLikedStudents([]);
      }

      return result;
    } catch (err) {
      console.error("❌ Fetch liked students error:", err);
      setError(err.message);
      setLikedStudents([]);
    } finally {
      setLoading(false);
    }
  }, [userData?.id, userData?.role]);

  // Tutor responds to student's like (accept/reject)
  const handleTutorResponse = useCallback(
    async (studentId, action) => {
      if (!userData?.id) {
        Alert.alert("Error", "User data not available");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        const result = await matchService.tutorRespondToLike(
          userData.id,
          studentId,
          action
        );

        if (result.type === "match_created") {
          Alert.alert(
            "🎉 Match Created!",
            "You've successfully matched with the student! Start chatting now.",
            [
              {
                text: "Start Chat",
                onPress: () => {
                  // Navigate to chat
                },
              },
            ]
          );

          // Refresh both liked students and matches
          await Promise.all([fetchLikedStudents(), fetchMatches()]);

          return {
            success: true,
            match: result.match,
          };
        } else {
          Alert.alert("Done", "Student request has been processed.");
          fetchLikedStudents(); // Refresh liked students list

          return { success: true };
        }
      } catch (err) {
        console.error("Tutor response error:", err);
        Alert.alert("Error", "Failed to process request. Please try again.");
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [userData?.id, fetchLikedStudents]
  );

  // ==================== MATCH MANAGEMENT ====================

  // Fetch matches for current user
  const fetchMatches = useCallback(async () => {
    if (!userData?.id) return;

    setLoading(true);
    setError(null);

    try {
      const matchesData =
        userData.role === "student"
          ? await matchService.getStudentMatches(userData.id)
          : await matchService.getTutorMatches(userData.id);

      setMatches(matchesData);
      return matchesData;
    } catch (err) {
      console.error("Fetch matches error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userData?.id, userData?.role]);

  // ==================== LEGACY METHODS (Updated) ====================

  // Create a new match when student swipes left (likes tutor)
  const createMatch = useCallback(
    async (tutorId) => {
      try {
        setLoading(true);

        if (!userData || !userData.id) {
          throw new Error("User data not available");
        }

        const matchData = {
          studentId: userData.id,
          tutorId: tutorId,
        };

        console.log("Creating match with data:", matchData);
        console.log("User data being used:", userData);
        const response = await matchService.createMatch(matchData);

        console.log("Match creation response:", response);

        // Check if response is successful (API might return data directly or wrapped)
        if (response) {
          console.log("Match created successfully:", response);

          // Show success message
          Alert.alert(
            "Đã kết nối!",
            "Bạn đã kết nối thành công với gia sư. Bạn có thể bắt đầu trò chuyện ngay bây giờ.",
            [
              {
                text: "OK",
                onPress: () => {
                  // Optionally navigate to chat
                },
              },
            ]
          );

          return response;
        } else {
          throw new Error("Failed to create match");
        }
      } catch (error) {
        console.error("Error creating match:", error);

        // Handle specific error cases
        if (error.response?.status === 409) {
          Alert.alert("Thông báo", "Bạn đã kết nối với gia sư này rồi!");
        } else if (error.response?.status === 404) {
          Alert.alert("Lỗi", "Không tìm thấy gia sư này!");
        } else {
          Alert.alert(
            "Lỗi",
            "Không thể kết nối với gia sư. Vui lòng thử lại sau."
          );
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [userData]
  );

  // Get all matches for current user
  const getMatches = useCallback(async () => {
    try {
      setLoading(true);

      if (!userData || !userData.id) {
        throw new Error("User data not available");
      }

      let response;
      // Check user role to call appropriate API
      if (userData.role === "Student") {
        response = await matchService.getStudentMatches(userData.id);
      } else if (userData.role === "Tutor") {
        response = await matchService.getTutorMatches(userData.id);
      } else {
        throw new Error("Invalid user role");
      }

      console.log("Get matches response:", response);

      // Check if response is successful (API might return data directly or wrapped)
      if (response) {
        const matchesData = Array.isArray(response)
          ? response
          : response.data || [];
        setMatches(matchesData);
        return matchesData;
      } else {
        throw new Error("Failed to fetch matches");
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userData]);

  // Get match details
  const getMatchDetails = useCallback(async (matchId) => {
    try {
      setLoading(true);
      const response = await matchService.getMatchDetails(matchId);

      console.log("Get match details response:", response);

      if (response) {
        return response;
      } else {
        throw new Error("Failed to fetch match details");
      }
    } catch (error) {
      console.error("Error fetching match details:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Start conversation after match
  const startConversation = useCallback(async (matchId) => {
    try {
      setLoading(true);

      // First check if conversation already exists for this match
      const existingConversation = await messageService.getConversationByMatch(
        matchId
      );

      console.log("Existing conversation response:", existingConversation);

      if (existingConversation && existingConversation.data) {
        // Conversation already exists
        return existingConversation.data;
      }

      // Create new conversation
      const conversationData = {
        matchId: matchId,
        participants: [], // This will be handled by backend based on match
        createdAt: new Date().toISOString(),
      };

      const response = await messageService.createConversation(
        conversationData
      );

      console.log("Create conversation response:", response);

      if (response) {
        return response;
      } else {
        throw new Error("Failed to start conversation");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      Alert.alert(
        "Lỗi",
        "Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại sau."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    matches,
    likedStudents,
    createMatch,
    getMatches,
    getMatchDetails,
    startConversation,
    handleStudentSwipe,
    fetchLikedStudents,
    handleTutorResponse,
    fetchMatches,
  };
};
