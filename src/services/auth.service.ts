import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Authentication service for Beyond The Bar
 * Handles user registration, login, logout, and profile management
 */

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  userType: 'barista' | 'employer';
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export const signUp = async ({ email, password, name }: SignUpData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: name
    });

    // Note: Additional user data (userType, etc.) should be stored in Firestore
    // This will be handled by the user service when we implement user profiles

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
};

/**
 * Sign in an existing user
 */
export const signIn = async ({ email, password }: SignInData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
