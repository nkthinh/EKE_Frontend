import { create } from "zustand";
import { isTutor } from "../utils/navigation";

const useGlobalState = create((set, get) => ({
  // User data
  userData: null,
  setUserData: (userData) => set({ userData }),

  // Liked students
  likedStudents: [],
  updateLikedStudents: (students) => set({ likedStudents: students }),

  // Pre-fetch liked students for tutor
  preFetchLikedStudents: async (userData) => {
    if (!isTutor(userData?.role) || !userData?.id) {
      console.log("⚠️ Not a tutor or no user ID, skipping pre-fetch");
      return;
    }

    try {
      console.log("🚀 Pre-fetching liked students for tutor...");
      const { default: matchService } = await import(
        "../services/features/matchService"
      );
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

      set({ likedStudents: likedStudentsData });
      console.log(
        "✅ Liked students pre-fetched and stored globally:",
        likedStudentsData.length
      );

      return likedStudentsData;
    } catch (error) {
      console.log("⚠️ Failed to pre-fetch liked students:", error.message);
      return [];
    }
  },

  // Conversation refresh trigger
  conversationRefreshTrigger: 0,
  triggerConversationRefresh: () =>
    set((state) => ({
      conversationRefreshTrigger: state.conversationRefreshTrigger + 1,
    })),

  // Clear all data
  clearAll: () =>
    set({
      userData: null,
      likedStudents: [],
      conversationRefreshTrigger: 0,
    }),
}));

export { useGlobalState };
