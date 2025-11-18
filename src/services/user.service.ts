import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User, Location, Workplace, WorkHistory, Certification, PrivacySettings } from '../types';

/**
 * User service for Firestore operations
 * Handles user profile CRUD operations
 */

// Convert Firestore timestamps to Date objects
const convertTimestamps = (data: any): any => {
  const converted = { ...data };
  if (converted.createdAt?.toDate) {
    converted.createdAt = converted.createdAt.toDate();
  }
  if (converted.updatedAt?.toDate) {
    converted.updatedAt = converted.updatedAt.toDate();
  }
  if (converted.workHistory) {
    converted.workHistory = converted.workHistory.map((wh: any) => ({
      ...wh,
      startDate: wh.startDate?.toDate?.() || wh.startDate,
      endDate: wh.endDate?.toDate?.() || wh.endDate
    }));
  }
  if (converted.currentWorkplace?.startDate?.toDate) {
    converted.currentWorkplace.startDate = converted.currentWorkplace.startDate.toDate();
  }
  if (converted.certifications) {
    converted.certifications = converted.certifications.map((cert: any) => ({
      ...cert,
      issueDate: cert.issueDate?.toDate?.() || cert.issueDate,
      expiryDate: cert.expiryDate?.toDate?.() || cert.expiryDate
    }));
  }
  if (converted.badges) {
    converted.badges = converted.badges.map((badge: any) => ({
      ...badge,
      earnedDate: badge.earnedDate?.toDate?.() || badge.earnedDate
    }));
  }
  return converted;
};

/**
 * Create a new user profile in Firestore
 */
export const createUserProfile = async (
  userId: string,
  data: {
    name: string;
    email: string;
    type: 'barista' | 'employer';
    location?: Location;
    bio?: string;
  }
): Promise<User> => {
  const defaultPrivacySettings: PrivacySettings = {
    showAverageRating: false,
    acceptTier3Reviews: true,
    showReviewCount: true
  };

  const userProfile: Omit<User, 'createdAt' | 'updatedAt'> = {
    id: userId,
    type: data.type,
    name: data.name,
    email: data.email,
    location: data.location || { city: '', state: '', country: '' },
    workHistory: [],
    badges: [],
    certifications: [],
    reviewCount: 0,
    averageRating: 0,
    tier1ReviewCount: 0,
    privacySettings: defaultPrivacySettings,
    portfolio: [],
    bio: data.bio || '',
    coffeePhilosophy: ''
  };

  const userDoc = doc(db, 'users', userId);
  await setDoc(userDoc, {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return {
    ...userProfile,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return convertTimestamps(data) as User;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

/**
 * Add work history entry
 */
export const addWorkHistory = async (
  userId: string,
  workplace: WorkHistory
): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();
    const workHistory = userData.workHistory || [];

    await updateDoc(userDoc, {
      workHistory: [...workHistory, workplace],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding work history:', error);
    throw new Error('Failed to add work history');
  }
};

/**
 * Update work history entry
 */
export const updateWorkHistory = async (
  userId: string,
  index: number,
  workplace: WorkHistory
): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();
    const workHistory = [...(userData.workHistory || [])];
    workHistory[index] = workplace;

    await updateDoc(userDoc, {
      workHistory,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating work history:', error);
    throw new Error('Failed to update work history');
  }
};

/**
 * Remove work history entry
 */
export const removeWorkHistory = async (
  userId: string,
  index: number
): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();
    const workHistory = [...(userData.workHistory || [])];
    workHistory.splice(index, 1);

    await updateDoc(userDoc, {
      workHistory,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error removing work history:', error);
    throw new Error('Failed to remove work history');
  }
};

/**
 * Update current workplace
 */
export const updateCurrentWorkplace = async (
  userId: string,
  workplace: Workplace | null
): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      currentWorkplace: workplace,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating current workplace:', error);
    throw new Error('Failed to update current workplace');
  }
};

/**
 * Add certification
 */
export const addCertification = async (
  userId: string,
  certification: Certification
): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();
    const certifications = userData.certifications || [];

    await updateDoc(userDoc, {
      certifications: [...certifications, certification],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding certification:', error);
    throw new Error('Failed to add certification');
  }
};

/**
 * Remove certification
 */
export const removeCertification = async (
  userId: string,
  index: number
): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();
    const certifications = [...(userData.certifications || [])];
    certifications.splice(index, 1);

    await updateDoc(userDoc, {
      certifications,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error removing certification:', error);
    throw new Error('Failed to remove certification');
  }
};

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (
  userId: string,
  settings: Partial<PrivacySettings>
): Promise<void> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data();
    const currentSettings = userData.privacySettings || {};

    await updateDoc(userDoc, {
      privacySettings: { ...currentSettings, ...settings },
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    throw new Error('Failed to update privacy settings');
  }
};

/**
 * Search users by location and other criteria
 */
export const searchUsers = async (filters: {
  city?: string;
  state?: string;
  type?: 'barista' | 'employer';
}): Promise<User[]> => {
  try {
    let q = query(collection(db, 'users'));

    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.city) {
      q = query(q, where('location.city', '==', filters.city));
    }
    if (filters.state) {
      q = query(q, where('location.state', '==', filters.state));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => convertTimestamps(doc.data()) as User);
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
};

/**
 * Calculate profile completion percentage
 */
export const calculateProfileCompletion = (user: User): number => {
  let completed = 0;
  const total = 10;

  // Basic info (always counted as they're required)
  completed += 2; // name, email

  // Location
  if (user.location.city && user.location.state) completed += 1;

  // Bio
  if (user.bio && user.bio.length > 20) completed += 1;

  // Coffee philosophy
  if (user.coffeePhilosophy && user.coffeePhilosophy.length > 10) completed += 1;

  // Profile photo
  if (user.profilePhoto) completed += 1;

  // Current workplace
  if (user.currentWorkplace) completed += 1;

  // Work history
  if (user.workHistory.length > 0) completed += 1;

  // Certifications
  if (user.certifications.length > 0) completed += 1;

  // Portfolio
  if (user.portfolio.length > 0) completed += 1;

  return Math.round((completed / total) * 100);
};
