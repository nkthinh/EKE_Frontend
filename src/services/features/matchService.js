import { api } from "../api";
import tutorService from "./tutorService";

const matchService = {
  // ==================== SWIPE ACTION FLOW ====================

  // Step 1: Student swipes/likes a tutor
  async studentSwipe(tutorId, action = "like") {
    try {
      console.log("🔍 studentSwipe called with:");
      console.log("👨‍🏫 Tutor ID:", tutorId);
      console.log("🎯 Action:", action);
      console.log("📊 Tutor ID type:", typeof tutorId);

      const actionValue = action === "like" ? 1 : 0;

      // Validate tutor ID
      const parsedTutorId = parseInt(tutorId);
      if (isNaN(parsedTutorId) || parsedTutorId <= 0) {
        console.error("❌ Invalid tutor ID:", tutorId);
        throw new Error("Invalid tutor ID");
      }

      const swipeData = {
        tutorId: parsedTutorId,
        action: actionValue,
      };
      console.log(
        "📤 Student swiping tutor with data:",
        JSON.stringify(swipeData, null, 2)
      );
      const response = await api.post("/SwipeAction/swipe", swipeData);
      console.log(
        "📥 Swipe API response:",
        JSON.stringify(response.data, null, 2)
      );
      return response.data;
    } catch (error) {
      console.error("Swipe error:", error);
      throw error.response?.data || error;
    }
  },

  // Step 2: Tutor gets list of students who liked them
  async getLikedStudents(userId) {
    try {
      console.log("🎯 === GET LIKED STUDENTS API CALL ===");
      console.log("👤 User ID:", userId);
      console.log("👤 User ID type:", typeof userId);

      // Step 1: Get all tutors from tutor/search API
      console.log("🔍 Step 1: Getting all tutors...");
      const tutorsResponse = await tutorService.searchTutors();
      console.log("📥 Tutors response:", tutorsResponse);

      // Step 2: Find tutor with matching userId
      const tutors = tutorsResponse?.data || [];
      console.log("📋 All tutors count:", tutors.length);

      // Log each tutor for debugging
      tutors.forEach((tutor, index) => {
        console.log(`📋 Tutor ${index}:`, {
          id: tutor.id,
          userId: tutor.userId,
          userIdType: typeof tutor.userId,
          fullName: tutor.fullName,
          email: tutor.email,
        });
      });

      const matchingTutor = tutors.find((tutor) => {
        console.log(
          `🔍 Comparing tutor.userId (${
            tutor.userId
          }, type: ${typeof tutor.userId}) with userId (${userId}, type: ${typeof userId})`
        );
        return tutor.userId === userId;
      });

      if (!matchingTutor) {
        console.log("❌ No tutor found with userId:", userId);
        console.log(
          "❌ Available tutor userIds:",
          tutors.map((t) => ({
            id: t.id,
            userId: t.userId,
            userIdType: typeof t.userId,
          }))
        );
        return [];
      }

      const tutorId = matchingTutor.id;
      console.log("✅ Found tutor ID:", tutorId, "for user ID:", userId);
      console.log("✅ Tutor details:", matchingTutor);

      // Step 3: Get liked students using tutor ID
      console.log("🔍 Step 3: Getting liked students for tutor ID:", tutorId);
      const response = await api.get(`/SwipeAction/liked-students/${tutorId}`);
      console.log("📥 API Response:", response.data);

      const likedStudents = response.data?.data || [];
      console.log("📋 Liked students count:", likedStudents.length);

      // Log each liked student for debugging
      likedStudents.forEach((student, index) => {
        console.log(`📋 Liked Student ${index}:`, {
          id: student.id,
          studentId: student.studentId,
          userId: student.userId,
          fullName: student.fullName || student.student?.fullName,
          email: student.email || student.student?.email,
          student: student.student,
        });
      });

      return likedStudents;
    } catch (error) {
      console.error("❌ Get liked students error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      throw error.response?.data || error;
    }
  },

  // Step 3: Tutor accepts a student's like (creates match)
  async acceptMatch(tutorId, studentId) {
    try {
      console.log("🔍 === ACCEPT MATCH DEBUG ===");
      console.log("📥 Input parameters:");
      console.log("   tutorId (type):", typeof tutorId, "value:", tutorId);
      console.log(
        "   studentId (type):",
        typeof studentId,
        "value:",
        studentId
      );

      // Convert to numbers as required by API
      const tutorIdNum = parseInt(tutorId);
      const studentIdNum = parseInt(studentId);

      console.log("🔄 After conversion to numbers:");
      console.log(
        "   tutorId (type):",
        typeof tutorIdNum,
        "value:",
        tutorIdNum
      );
      console.log(
        "   studentId (type):",
        typeof studentIdNum,
        "value:",
        studentIdNum
      );

      const acceptData = {
        tutorId: tutorIdNum,
        studentId: studentIdNum,
        acceptedAt: new Date().toISOString(),
      };

      console.log(
        "📤 Request data being sent:",
        JSON.stringify(acceptData, null, 2)
      );
      console.log("🌐 API endpoint: /SwipeAction/accept-match");

      const response = await api.post("/SwipeAction/accept-match", acceptData);

      console.log("📥 API response:", JSON.stringify(response.data, null, 2));
      console.log("✅ Accept match successful");

      // Add tutorId to the response for conversation creation
      const responseWithTutorId = {
        ...response.data,
        tutorId: tutorIdNum,
      };

      return responseWithTutorId;
    } catch (error) {
      console.error("❌ Accept match error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      // Check if it's a 400 error (already accepted)
      if (error.response?.status === 400) {
        console.log(
          "⚠️ Student already accepted (400 error), treating as success"
        );
        return {
          success: true,
          type: "already_accepted",
          tutorId: tutorIdNum, // Include tutorId for consistency
          message: "Student already accepted successfully!",
        };
      }

      throw error.response?.data || error;
    }
  },

  // Additional SwipeAction utilities
  async rejectMatch(tutorId, studentId) {
    try {
      console.log("🔍 === REJECT MATCH DEBUG ===");
      console.log("📥 Input parameters:");
      console.log("   tutorId (type):", typeof tutorId, "value:", tutorId);
      console.log(
        "   studentId (type):",
        typeof studentId,
        "value:",
        studentId
      );

      // Convert to numbers as required by API
      const tutorIdNum = parseInt(tutorId);
      const studentIdNum = parseInt(studentId);

      console.log("🔄 After conversion to numbers:");
      console.log(
        "   tutorId (type):",
        typeof tutorIdNum,
        "value:",
        tutorIdNum
      );
      console.log(
        "   studentId (type):",
        typeof studentIdNum,
        "value:",
        studentIdNum
      );

      const rejectData = {
        tutorId: tutorIdNum,
        studentId: studentIdNum,
        rejectedAt: new Date().toISOString(),
      };

      console.log(
        "📤 Request data being sent:",
        JSON.stringify(rejectData, null, 2)
      );
      console.log("🌐 API endpoint: /SwipeAction/reject-match");

      const response = await api.post("/SwipeAction/reject-match", rejectData);

      console.log("📥 API response:", JSON.stringify(response.data, null, 2));
      console.log("✅ Reject match successful");

      // Add tutorId to the response for consistency
      const responseWithTutorId = {
        ...response.data,
        tutorId: tutorIdNum,
      };

      return responseWithTutorId;
    } catch (error) {
      console.error("❌ Reject match error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);

      // Check if it's a 400 error (already rejected)
      if (error.response?.status === 400) {
        console.log(
          "⚠️ Student already rejected (400 error), treating as success"
        );
        return {
          success: true,
          type: "already_rejected",
          tutorId: tutorIdNum, // Include tutorId for consistency
          message: "Student already rejected successfully!",
        };
      }

      throw error.response?.data || error;
    }
  },

  async getSwipeHistory(userId, userType = "student") {
    try {
      const response = await api.get(
        `/SwipeAction/history/${userType}/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Get swipe history error:", error);
      throw error.response?.data || error;
    }
  },

  // ==================== COMPLETE MATCHING WORKFLOW ====================

  // Complete workflow for student
  async studentMatchWorkflow(studentId, tutorId) {
    try {
      console.log("🔍 studentMatchWorkflow called with:");
      console.log("👤 Student ID:", studentId);
      console.log("👨‍🏫 Tutor ID:", tutorId);

      // 1. Student swipes tutor
      const swipeResult = await this.studentSwipe(tutorId, "like");

      // 2. Check if tutor has already liked this student (instant match)
      const instantMatch = swipeResult.instantMatch;

      if (instantMatch) {
        console.log("Instant match created!");
        return {
          success: true,
          type: "instant_match",
          match: swipeResult.match,
          message: "Congratulations! You have a new match!",
        };
      } else {
        return {
          success: true,
          type: "swipe_sent",
          message: "Your interest has been sent to the tutor!",
        };
      }
    } catch (error) {
      throw error;
    }
  },

  // Complete workflow for tutor
  async tutorMatchWorkflow(userId) {
    try {
      console.log("🎯 === TUTOR MATCH WORKFLOW ===");
      console.log("👤 User ID:", userId);

      // Get all students who liked this tutor
      const likedStudents = await this.getLikedStudents(userId);
      console.log("📋 Liked students result:", likedStudents);

      const result = {
        success: true,
        likedStudents: likedStudents,
        count: likedStudents.length,
      };

      return result;
    } catch (error) {
      console.error("❌ Tutor match workflow error:", error);
      throw error;
    }
  },

  // Handle tutor's response to student's like
  async tutorRespondToLike(tutorUserId, studentId, action = "accept") {
    try {
      console.log("🔍 === TUTOR RESPOND TO LIKE DEBUG ===");
      console.log("📥 Input parameters:");
      console.log(
        "   tutorUserId:",
        tutorUserId,
        "(type:",
        typeof tutorUserId,
        ")"
      );
      console.log("   studentId:", studentId, "(type:", typeof studentId, ")");
      console.log("   action:", action);

      // Step 1: Get all tutors to find the matching tutorId
      console.log("🔍 Step 1: Getting all tutors to find tutorId...");
      const tutorsResponse = await tutorService.searchTutors();
      const tutors = tutorsResponse?.data || [];

      console.log("📋 All tutors count:", tutors.length);

      // Find tutor with matching userId
      const matchingTutor = tutors.find((tutor) => {
        console.log(
          `🔍 Comparing tutor.userId (${
            tutor.userId
          }, type: ${typeof tutor.userId}) with tutorUserId (${tutorUserId}, type: ${typeof tutorUserId})`
        );
        return tutor.userId === tutorUserId;
      });

      if (!matchingTutor) {
        console.log("❌ No tutor found with userId:", tutorUserId);
        throw new Error("Tutor not found");
      }

      const tutorId = matchingTutor.id;
      console.log("✅ Found tutor ID:", tutorId, "for user ID:", tutorUserId);
      console.log("✅ Tutor details:", matchingTutor);

      // Step 2: Call acceptMatch or rejectMatch with the correct tutorId
      if (action === "accept") {
        console.log("🔍 Step 2: Calling acceptMatch with tutorId:", tutorId);
        const match = await this.acceptMatch(tutorId, studentId);

        // Check if it's already accepted
        if (match.type === "already_accepted") {
          return {
            success: true,
            type: "already_accepted",
            message: "Student already accepted successfully!",
          };
        }

        return {
          success: true,
          type: "match_created",
          match: match,
          tutorId: tutorId, // Include tutorId for conversation creation
          message: "Match created successfully!",
        };
      } else if (action === "reject") {
        console.log("🔍 Step 2: Calling rejectMatch with tutorId:", tutorId);
        const result = await this.rejectMatch(tutorId, studentId);

        // Check if it's already rejected
        if (result.type === "already_rejected") {
          return {
            success: true,
            type: "already_rejected",
            message: "Student already rejected successfully!",
          };
        }

        return {
          success: true,
          type: "match_rejected",
          tutorId: tutorId, // Include tutorId for consistency
          message: "Student request rejected",
        };
      }
    } catch (error) {
      console.error("❌ Tutor respond to like error:", error);
      throw error;
    }
  },

  // ==================== MATCH MANAGEMENT APIs ====================

  // Get active matches for student
  async getStudentMatches(studentId) {
    try {
      const response = await api.get(`/Match/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Get student matches error:", error);
      throw error.response?.data || error;
    }
  },

  // Get active matches for tutor
  async getTutorMatches(tutorId) {
    try {
      const response = await api.get(`/Match/tutor/${tutorId}`);
      return response.data;
    } catch (error) {
      console.error("Get tutor matches error:", error);
      throw error.response?.data || error;
    }
  },

  // Get detailed information about a specific match
  async getMatchDetails(matchId) {
    try {
      const response = await api.get(`/Match/${matchId}`);
      return response.data;
    } catch (error) {
      console.error("Get match details error:", error);
      throw error.response?.data || error;
    }
  },

  // Update match status (active, paused, completed, etc.)
  async updateMatchStatus(matchId, status) {
    try {
      const updateData = {
        status: status,
        updatedAt: new Date().toISOString(),
      };

      const response = await api.put(`/Match/${matchId}/status`, updateData);
      return response.data;
    } catch (error) {
      console.error("Update match status error:", error);
      throw error.response?.data || error;
    }
  },

  // End/close a match
  async endMatch(matchId, reason = "completed") {
    try {
      const endData = {
        reason: reason,
        endedAt: new Date().toISOString(),
      };

      const response = await api.post(`/Match/${matchId}/end`, endData);
      return response.data;
    } catch (error) {
      console.error("End match error:", error);
      throw error.response?.data || error;
    }
  },

  // ==================== UTILITY & STATISTICS ====================

  // Check if match exists between student and tutor
  async checkMatchExists(studentId, tutorId) {
    try {
      const response = await api.get(`/Match/check/${studentId}/${tutorId}`);
      return response.data;
    } catch (error) {
      console.error("Check match exists error:", error);
      throw error.response?.data || error;
    }
  },

  // Get match statistics
  async getMatchStatistics(userId, userType = "student") {
    try {
      const response = await api.get(`/Match/statistics/${userType}/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Get match statistics error:", error);
      throw error.response?.data || error;
    }
  },

  // Update match activity (last seen, etc.)
  async updateMatchActivity(matchId) {
    try {
      const response = await api.patch(`/Match/${matchId}/activity`);
      return response.data;
    } catch (error) {
      console.error("Update match activity error:", error);
      throw error.response?.data || error;
    }
  },

  // ==================== LEGACY METHODS (Backward Compatibility) ====================

  // Legacy create match method
  async createMatch(matchData) {
    try {
      // Format data according to API specification
      const formattedData = {
        studentId: parseInt(matchData.studentId),
        tutorId: parseInt(matchData.tutorId),
        status: 1, // Default status for new match
      };

      console.log("Creating match with formatted data:", formattedData);
      console.log("API base URL:", api.defaults.baseURL);
      const response = await api.post("/Match", formattedData);
      return response.data;
    } catch (error) {
      console.error("Match service error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      throw error.response?.data || error;
    }
  },

  // Legacy get all matches
  async getAllMatches() {
    try {
      const response = await api.get("/Match");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Legacy update match
  async updateMatch(id, matchData) {
    try {
      const response = await api.put(`/Match/${id}`, matchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Legacy delete match
  async deleteMatch(id) {
    try {
      const response = await api.delete(`/Match/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Legacy aliases
  async getMatchesByStudent(studentId) {
    return this.getStudentMatches(studentId);
  },

  async getMatchesByTutor(tutorId) {
    return this.getTutorMatches(tutorId);
  },
};

export default matchService;
