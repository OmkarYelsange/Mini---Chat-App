import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,

  // ✅ Allows App.jsx to manually set loading state
  setLoading: (loading) => set({ isLoading: loading }),

  // ✅ Allows App.jsx to reset user state
  setCurrentUser: (user) => set({ currentUser: user }),

  // ✅ Fetch user info from Firestore
  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }

    try {
      // 🔹 Change "users" to your actual Firestore collection name
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
