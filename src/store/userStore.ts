import { create } from 'zustand';
import type { User } from '../types';
import { getUserProfile, updateUserProfile } from '../services/user.service';

interface UserStore {
  // State
  userProfile: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUserProfile: (user: User | null) => void;
  fetchUserProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  clearUserProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // Initial state
  userProfile: null,
  loading: false,
  error: null,

  // Set user profile directly
  setUserProfile: (user) => set({ userProfile: user, error: null }),

  // Fetch user profile from Firestore
  fetchUserProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const profile = await getUserProfile(userId);
      set({ userProfile: profile, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<User>) => {
    set({ loading: true, error: null });
    try {
      await updateUserProfile(userId, updates);
      set((state) => ({
        userProfile: state.userProfile ? { ...state.userProfile, ...updates } : null,
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  // Clear user profile (on logout)
  clearUserProfile: () => set({ userProfile: null, error: null })
}));
