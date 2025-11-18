import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export type NotificationType =
  | 'badge_earned'
  | 'badge_upgraded'
  | 'review_received'
  | 'review_verification_pending'
  | 'review_verified';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any; // Additional data like badge ID, review ID, etc.
  read: boolean;
  createdAt: Date;
}

/**
 * Create a notification for a user
 */
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: any
): Promise<string> => {
  try {
    const notificationId = doc(collection(db, 'notifications')).id;

    await setDoc(doc(db, 'notifications', notificationId), {
      id: notificationId,
      userId,
      type,
      title,
      message,
      data: data || null,
      read: false,
      createdAt: serverTimestamp()
    });

    return notificationId;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (userId: string, limit?: number): Promise<Notification[]> => {
  try {
    let q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const notifications = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as Notification));

    return limit ? notifications.slice(0, limit) : notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(doc =>
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error('Failed to mark all notifications as read');
  }
};

/**
 * Helper function to create badge earned notification
 */
export const notifyBadgeEarned = async (
  userId: string,
  badgeName: string,
  level: string,
  badgeEmoji: string
): Promise<void> => {
  await createNotification(
    userId,
    level === 'bronze' ? 'badge_earned' : 'badge_upgraded',
    `${badgeEmoji} Badge ${level === 'bronze' ? 'Earned' : 'Upgraded'}!`,
    `You've earned the ${level} ${badgeName} badge! ${level === 'gold' ? '🎉' : ''}`,
    { badgeName, level }
  );
};

/**
 * Helper function to create review received notification
 */
export const notifyReviewReceived = async (
  userId: string,
  reviewerName: string,
  starRating: number
): Promise<void> => {
  await createNotification(
    userId,
    'review_received',
    '⭐ New Review Received',
    `${reviewerName} left you a ${starRating}-star review!`,
    { reviewerName, starRating }
  );
};

/**
 * Helper function to create verification pending notification
 */
export const notifyVerificationPending = async (
  userId: string,
  reviewerName: string
): Promise<void> => {
  await createNotification(
    userId,
    'review_verification_pending',
    '🤝 Verification Needed',
    `${reviewerName} says you worked together. Please verify this review.`,
    { reviewerName }
  );
};

/**
 * Helper function to create verification completed notification
 */
export const notifyReviewVerified = async (
  userId: string,
  revieweeName: string,
  verified: boolean
): Promise<void> => {
  await createNotification(
    userId,
    'review_verified',
    verified ? '✅ Review Verified' : '❌ Review Rejected',
    verified
      ? `${revieweeName} confirmed your colleague relationship!`
      : `${revieweeName} did not confirm your colleague relationship.`,
    { revieweeName, verified }
  );
};
