import { api } from "../api";

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
  async getLikedStudents(tutorId) {
    try {
      console.log("🎯 === GET LIKED STUDENTS API CALL ===");
      console.log("👤 Tutor ID:", tutorId);
      console.log("📊 Tutor ID type:", typeof tutorId);

      // Validate tutor ID
      const parsedTutorId = parseInt(tutorId);
      if (isNaN(parsedTutorId) || parsedTutorId <= 0) {
        console.error("❌ Invalid tutor ID:", tutorId);
        throw new Error("Invalid tutor ID");
      }

      console.log(
        "🌐 API URL:",
        `/SwipeAction/liked-students/${parsedTutorId}`
      );

      const response = await api.get(
        `/SwipeAction/liked-students/${parsedTutorId}`
      );
      console.log("📥 API Response:", JSON.stringify(response.data, null, 2));
      console.log("✅ === GET LIKED STUDENTS COMPLETED ===");

      return response.data;
    } catch (error) {
      console.error("❌ Get liked students error:", error);
      console.error("🔍 Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error.response?.data || error;
    }
  },

  // Step 3: Tutor accepts a student's like (creates match)
  async acceptMatch(tutorId, studentId) {
    try {
      const acceptData = {
        tutorId: parseInt(tutorId),
        studentId: parseInt(studentId),
        acceptedAt: new Date().toISOString(),
      };

      console.log("Tutor accepting match:", acceptData);
      const response = await api.post("/SwipeAction/accept-match", acceptData);
      return response.data;
    } catch (error) {
      console.error("Accept match error:", error);
      throw error.response?.data || error;
    }
  },

  // Additional SwipeAction utilities
  async rejectMatch(tutorId, studentId) {
    try {
      const rejectData = {
        tutorId: parseInt(tutorId),
        studentId: parseInt(studentId),
        rejectedAt: new Date().toISOString(),
      };

      console.log("Tutor rejecting match:", rejectData);
      const response = await api.post("/SwipeAction/reject-match", rejectData);
      return response.data;
    } catch (error) {
      console.error("Reject match error:", error);
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
  async tutorMatchWorkflow(tutorId) {
    try {
      console.log("🎯 === TUTOR MATCH WORKFLOW ===");
      console.log("👤 Tutor ID:", tutorId);

      // Get all students who liked this tutor
      const likedStudents = await this.getLikedStudents(tutorId);
      console.log("📋 Liked students result:", likedStudents);

      const result = {
        success: true,
        likedStudents: likedStudents,
        count: likedStudents.length,
      };

      console.log("✅ Workflow result:", JSON.stringify(result, null, 2));
      console.log("✅ === TUTOR MATCH WORKFLOW COMPLETED ===");

      return result;
    } catch (error) {
      console.error("❌ Tutor match workflow error:", error);
      throw error;
    }
  },

  // Handle tutor's response to student's like
  async tutorRespondToLike(tutorId, studentId, action = "accept") {
    try {
      if (action === "accept") {
        const match = await this.acceptMatch(tutorId, studentId);
        return {
          success: true,
          type: "match_created",
          match: match,
          message: "Match created successfully!",
        };
      } else if (action === "reject") {
        await this.rejectMatch(tutorId, studentId);
        return {
          success: true,
          type: "match_rejected",
          message: "Student request rejected",
        };
      }
    } catch (error) {
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
