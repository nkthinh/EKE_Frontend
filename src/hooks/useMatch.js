import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import matchService from "../services/features/matchService";
import messageService from "../services/features/messageService";
import conversationService from "../services/features/conversationService";
import { useAuth } from "./useAuth";
import { isTutor } from "../utils/navigation";
import { useGlobalState } from "./useGlobalState";

export const useMatch = () => {
  const { userData } = useAuth();
  const {
    triggerConversationRefresh,
    likedStudents: globalLikedStudents,
    updateLikedStudents: updateGlobalLikedStudents,
    preFetchLikedStudents,
  } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [likedStudents, setLikedStudents] = useState([]);

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
    if (!userData?.id || !isTutor(userData?.role)) {
      console.log("⚠️ Not a tutor or no user ID, skipping fetch");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching liked students for tutor:", userData.id);
      const result = await matchService.tutorMatchWorkflow(userData.id);

      // Handle different response structures
      let likedStudentsData = [];

      if (result && result.success && Array.isArray(result.data)) {
        likedStudentsData = result.data;
      } else if (result && Array.isArray(result)) {
        likedStudentsData = result;
      } else if (
        result &&
        result.likedStudents &&
        Array.isArray(result.likedStudents)
      ) {
        likedStudentsData = result.likedStudents;
      }

      console.log("📥 Liked students fetched:", likedStudentsData.length);
      setLikedStudents(likedStudentsData);

      // Also update global state
      updateGlobalLikedStudents(likedStudentsData);

      return result;
    } catch (err) {
      console.error("❌ Fetch liked students error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [userData?.id, updateGlobalLikedStudents]);

  // Pre-fetch liked students (for use in other components)
  const preFetchLikedStudentsForTutor = useCallback(async () => {
    if (!userData?.id || !isTutor(userData?.role)) {
      console.log("⚠️ Not a tutor or no user ID, skipping pre-fetch");
      return [];
    }

    try {
      console.log("🚀 Pre-fetching liked students for tutor...");
      const result = await preFetchLikedStudents(userData);
      return result;
    } catch (error) {
      console.error("❌ Pre-fetch liked students error:", error);
      return [];
    }
  }, [userData, preFetchLikedStudents]);

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

  // ==================== CONVERSATION & MESSAGING ====================

  // Create conversation from match
  const createConversationFromMatch = useCallback(async (matchData) => {
    try {
      console.log("🔍 Creating conversation from match in hook:", matchData);

      // Extract matchId from the data
      const matchId = matchData.matchId || matchData.id;

      if (!matchId) {
        throw new Error("matchId is required for conversation creation");
      }

      const result = await conversationService.createConversationFromMatch(
        matchId
      );
      console.log("📥 Conversation creation result:", result);
      return result;
    } catch (error) {
      console.error("❌ Create conversation from match error:", error);
      return { success: false, error: error.message };
    }
  }, []);

  // Get conversation by user ID
  const getConversationByUserId = useCallback(async (userId) => {
    if (!userId) {
      console.log("⚠️ No user ID provided");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Getting conversation for user:", userId);
      const result = await messageService.getConversationByUserId(userId);

      console.log("📥 User conversation:", result);

      return result;
    } catch (err) {
      console.error("❌ Get user conversation error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get conversation by conversation ID
  const getConversationById = useCallback(async (conversationId) => {
    if (!conversationId) {
      console.log("⚠️ No conversation ID provided");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Getting conversation by ID:", conversationId);
      const result = await messageService.getConversationById(conversationId);

      console.log("📥 Conversation details:", result);

      return result;
    } catch (err) {
      console.error("❌ Get conversation by ID error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message (senderId is user ID from login response)
  const sendMessage = useCallback(
    async (messageData) => {
      if (!userData?.id) {
        Alert.alert("Error", "User data not available");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        // Ensure senderId is set to current user ID
        const messageWithSender = {
          ...messageData,
          senderId: userData.id,
        };

        console.log("🔍 Sending message:", messageWithSender);
        const result = await messageService.sendMessage(messageWithSender);

        console.log("📥 Message sent:", result);

        return {
          success: true,
          message: result,
        };
      } catch (err) {
        console.error("❌ Send message error:", err);
        Alert.alert("Error", "Failed to send message. Please try again.");
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [userData?.id]
  );

  // Get messages in conversation
  const getConversationMessages = useCallback(async (conversationId) => {
    if (!conversationId) {
      console.log("⚠️ No conversation ID provided");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Getting messages for conversation:", conversationId);
      const result = await messageService.getConversationMessages(
        conversationId
      );

      console.log("📥 Conversation messages:", result);

      return result;
    } catch (err) {
      console.error("❌ Get conversation messages error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ENHANCED TUTOR RESPONSE ====================

  // Enhanced tutor response that creates conversation after accepting
  const handleTutorResponseWithConversation = useCallback(
    async (studentId, action, onConversationCreated) => {
      console.log("🔍 === HANDLE TUTOR RESPONSE WITH CONVERSATION DEBUG ===");
      console.log("📥 Input parameters:");
      console.log("   studentId:", studentId, "(type:", typeof studentId, ")");
      console.log("   action:", action);
      console.log(
        "   userData.id:",
        userData?.id,
        "(type:",
        typeof userData?.id,
        ")"
      );

      if (!userData?.id) {
        Alert.alert("Error", "User data not available");
        return { success: false };
      }

      setLoading(true);
      setError(null);

      try {
        console.log("🔍 Calling tutorRespondToLike with:");
        console.log(
          "   tutorUserId:",
          userData.id,
          "(type:",
          typeof userData.id,
          ")"
        );
        console.log(
          "   studentId:",
          studentId,
          "(type:",
          typeof studentId,
          ")"
        );
        console.log("   action:", action);

        const result = await matchService.tutorRespondToLike(
          userData.id,
          studentId,
          action
        );

        console.log("📥 tutorRespondToLike result:", result);

        if (result.type === "match_created") {
          // Create conversation after successful match
          console.log("🎉 Match created, creating conversation...");
          console.log("📥 Match result:", result);

          // Extract the correct matchId and tutorId from the response
          const matchData = result.match || result;
          const matchId = matchData.matchId || matchData.id;
          const tutorId = matchData.tutorId || result.tutorId;

          console.log("🔍 Extracted data:");
          console.log("   matchId:", matchId);
          console.log("   tutorId:", tutorId);
          console.log("   studentId:", studentId);

          // Validate required data
          if (!matchId) {
            console.error("❌ No matchId found in response");
            return {
              success: true,
              match: result.match,
              type: "match_created_no_conversation",
              error: "No matchId found in response",
            };
          }

          if (!tutorId) {
            console.error("❌ No tutorId found in response");
            return {
              success: true,
              match: result.match,
              type: "match_created_no_conversation",
              error: "No tutorId found in response",
            };
          }

          // Prepare conversation data according to API specification
          // Now using GET request, we only need matchId
          const conversationData = {
            matchId: matchId,
          };

          console.log(
            "📤 Creating conversation with GET request, matchId:",
            matchId
          );

          const conversationResult = await createConversationFromMatch(
            conversationData
          );

          if (conversationResult.success) {
            console.log(
              "✅ Conversation created successfully:",
              conversationResult.conversation
            );

            // Call callback to refresh conversation list
            if (
              onConversationCreated &&
              typeof onConversationCreated === "function"
            ) {
              console.log("🔄 Triggering conversation list refresh...");
              onConversationCreated(conversationResult.conversation);
            }

            // Also trigger global conversation refresh
            triggerConversationRefresh();

            // Return success with conversation data for navigation
            return {
              success: true,
              match: result.match,
              conversation: conversationResult.conversation,
              type: "match_created_with_conversation",
            };
          } else {
            console.log(
              "⚠️ Match created but conversation failed:",
              conversationResult.error
            );
            return {
              success: true,
              match: result.match,
              type: "match_created_no_conversation",
            };
          }
        } else if (result.type === "already_accepted") {
          // Student already accepted, refresh list and show message
          console.log("✅ Student already accepted, refreshing list...");
          await fetchLikedStudents();
          return { success: true, type: "already_accepted" };
        } else if (result.type === "already_rejected") {
          // Student already rejected, refresh list and show message
          console.log("✅ Student already rejected, refreshing list...");
          await fetchLikedStudents();
          return { success: true, type: "already_rejected" };
        } else {
          await fetchLikedStudents(); // Refresh liked students list
          return { success: true, type: "processed" };
        }
      } catch (err) {
        console.error("❌ Tutor response error:", err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [
      userData?.id,
      fetchLikedStudents,
      createConversationFromMatch,
      triggerConversationRefresh,
    ]
  );

  // Get conversations by user ID
  const getConversationsByUserId = useCallback(async (userId) => {
    try {
      console.log("🔍 Getting conversations by user ID in hook:", userId);
      const result = await conversationService.getConversationsByUserId(userId);
      console.log("📥 Conversations by user ID result:", result);
      return result;
    } catch (error) {
      console.error("❌ Get conversations by user ID error:", error);
      return { success: false, error: error.message };
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
    preFetchLikedStudentsForTutor,
    handleTutorResponse,
    fetchMatches,
    // New conversation and messaging methods
    createConversationFromMatch,
    getConversationByUserId,
    getConversationById,
    sendMessage,
    getConversationMessages,
    handleTutorResponseWithConversation,
    getConversationsByUserId,
  };
};
