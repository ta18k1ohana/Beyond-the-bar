import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Review, ReviewTier, RelationshipType } from '../types';
import { updateUserProfile } from './user.service';
import { BADGES } from '../constants/badges';

/**
 * Review service for Firestore operations
 * Handles review CRUD, verification, and badge progression
 */

// Helper to convert Firestore timestamps
const convertReviewTimestamps = (data: any): Review => {
  return {
    ...data,
    relationship: {
      ...data.relationship,
      workplacePeriod: {
        start: data.relationship.workplacePeriod.start?.toDate?.() || data.relationship.workplacePeriod.start,
        end: data.relationship.workplacePeriod.end?.toDate?.() || data.relationship.workplacePeriod.end
      }
    },
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
  };
};

/**
 * Create a new review
 */
export const createReview = async (reviewData: {
  reviewerId: string;
  revieweeId: string;
  tier: ReviewTier;
  relationshipType: RelationshipType;
  workplace: string;
  workplacePeriod: { start: Date; end?: Date };
  starRating: number;
  badgeTags: string[];
  comment?: string;
}): Promise<string> => {
  try {
    const reviewId = doc(collection(db, 'reviews')).id;

    const review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> = {
      reviewerId: reviewData.reviewerId,
      revieweeId: reviewData.revieweeId,
      tier: reviewData.tier,
      relationship: {
        type: reviewData.relationshipType,
        workplace: reviewData.workplace,
        workplacePeriod: reviewData.workplacePeriod,
        verified: reviewData.tier !== 'tier1' // Tier 1 requires verification
      },
      starRating: reviewData.starRating,
      badgeTags: reviewData.badgeTags.slice(0, 5), // Max 5 tags
      comment: reviewData.comment || '',
      isVisible: true,
      flagCount: 0
    };

    // Create the review document
    await setDoc(doc(db, 'reviews', reviewId), {
      ...review,
      id: reviewId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update reviewee's review count and stats
    await updateRevieweeStats(reviewData.revieweeId);

    // Calculate and update badge progression
    await updateBadgeProgression(reviewData.revieweeId);

    return reviewId;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
};

/**
 * Verify a Tier 1 (colleague) review
 */
export const verifyTier1Review = async (reviewId: string, verified: boolean): Promise<void> => {
  try {
    const reviewDoc = doc(db, 'reviews', reviewId);
    await updateDoc(reviewDoc, {
      'relationship.verified': verified,
      updatedAt: serverTimestamp()
    });

    if (verified) {
      // Recalculate badge progression with verified review
      const reviewSnap = await getDoc(reviewDoc);
      if (reviewSnap.exists()) {
        const reviewData = reviewSnap.data();
        await updateBadgeProgression(reviewData.revieweeId);
      }
    }
  } catch (error) {
    console.error('Error verifying review:', error);
    throw new Error('Failed to verify review');
  }
};

/**
 * Get all reviews for a user (reviewee)
 */
export const getReviewsForUser = async (userId: string): Promise<Review[]> => {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('revieweeId', '==', userId),
      where('isVisible', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(reviewsQuery);
    return querySnapshot.docs.map(doc => convertReviewTimestamps(doc.data()));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }
};

/**
 * Get reviews given by a user (reviewer)
 */
export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('reviewerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(reviewsQuery);
    return querySnapshot.docs.map(doc => convertReviewTimestamps(doc.data()));
  } catch (error) {
    console.error('Error fetching reviews by user:', error);
    throw new Error('Failed to fetch reviews');
  }
};

/**
 * Get pending Tier 1 verifications for a user
 */
export const getPendingVerifications = async (userId: string): Promise<Review[]> => {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('revieweeId', '==', userId),
      where('tier', '==', 'tier1'),
      where('relationship.verified', '==', false)
    );

    const querySnapshot = await getDocs(reviewsQuery);
    return querySnapshot.docs.map(doc => convertReviewTimestamps(doc.data()));
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    throw new Error('Failed to fetch pending verifications');
  }
};

/**
 * Update reviewee's overall stats (review count, average rating)
 */
const updateRevieweeStats = async (userId: string): Promise<void> => {
  try {
    const reviews = await getReviewsForUser(userId);

    // Only count verified reviews for Tier 1
    const verifiedReviews = reviews.filter(r =>
      r.tier !== 'tier1' || r.relationship.verified
    );

    const tier1Reviews = verifiedReviews.filter(r => r.tier === 'tier1');

    const totalRating = verifiedReviews.reduce((sum, r) => sum + r.starRating, 0);
    const averageRating = verifiedReviews.length > 0 ? totalRating / verifiedReviews.length : 0;

    await updateUserProfile(userId, {
      reviewCount: verifiedReviews.length,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      tier1ReviewCount: tier1Reviews.length
    });
  } catch (error) {
    console.error('Error updating reviewee stats:', error);
  }
};

/**
 * Calculate badge progression from reviews and update user profile
 */
export const updateBadgeProgression = async (userId: string): Promise<void> => {
  try {
    const reviews = await getReviewsForUser(userId);

    // Only count verified reviews
    const verifiedReviews = reviews.filter(r =>
      r.tier !== 'tier1' || r.relationship.verified
    );

    // Count badge tags with tier weighting
    const badgeTagCounts: { [badgeId: string]: number } = {};

    verifiedReviews.forEach(review => {
      const weight = review.tier === 'tier1' ? 2.0 : 1.0; // Tier 1 counts 2x

      review.badgeTags.forEach(badgeId => {
        badgeTagCounts[badgeId] = (badgeTagCounts[badgeId] || 0) + weight;
      });
    });

    // Calculate badge levels
    const earnedBadges = Object.entries(badgeTagCounts).map(([badgeId, count]) => {
      const badge = BADGES.find(b => b.id === badgeId);
      if (!badge) return null;

      let level: 'bronze' | 'silver' | 'gold' | 'legendary' | null = null;

      if (count >= badge.levels.gold.threshold) {
        level = 'gold';
      } else if (count >= badge.levels.silver.threshold) {
        level = 'silver';
      } else if (count >= badge.levels.bronze.threshold) {
        level = 'bronze';
      }

      if (level) {
        return {
          badgeId,
          level,
          tagCount: Math.floor(count),
          earnedDate: new Date()
        };
      }

      return null;
    }).filter(Boolean);

    // Update user's badges
    await updateUserProfile(userId, {
      badges: earnedBadges as any[]
    });
  } catch (error) {
    console.error('Error updating badge progression:', error);
  }
};

/**
 * Flag a review for inappropriate content
 */
export const flagReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewDoc = doc(db, 'reviews', reviewId);
    await updateDoc(reviewDoc, {
      flagCount: increment(1),
      updatedAt: serverTimestamp()
    });

    // Auto-hide if flagged 3+ times
    const reviewSnap = await getDoc(reviewDoc);
    if (reviewSnap.exists()) {
      const data = reviewSnap.data();
      if (data.flagCount >= 3) {
        await updateDoc(reviewDoc, {
          isVisible: false
        });
      }
    }
  } catch (error) {
    console.error('Error flagging review:', error);
    throw new Error('Failed to flag review');
  }
};

/**
 * Get review statistics for employer view
 */
export const getReviewStats = async (userId: string): Promise<{
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  topBadges: { badgeId: string; count: number }[];
  tierBreakdown: { tier1: number; tier2: number; tier3: number };
}> => {
  try {
    const reviews = await getReviewsForUser(userId);
    const verifiedReviews = reviews.filter(r =>
      r.tier !== 'tier1' || r.relationship.verified
    );

    // Rating distribution
    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    verifiedReviews.forEach(r => {
      ratingDistribution[r.starRating]++;
    });

    // Average rating
    const totalRating = verifiedReviews.reduce((sum, r) => sum + r.starRating, 0);
    const averageRating = verifiedReviews.length > 0 ? totalRating / verifiedReviews.length : 0;

    // Top badges (by raw tag count, not weighted)
    const badgeTagCounts: { [badgeId: string]: number } = {};
    verifiedReviews.forEach(review => {
      review.badgeTags.forEach(badgeId => {
        badgeTagCounts[badgeId] = (badgeTagCounts[badgeId] || 0) + 1;
      });
    });

    const topBadges = Object.entries(badgeTagCounts)
      .map(([badgeId, count]) => ({ badgeId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Tier breakdown
    const tierBreakdown = {
      tier1: verifiedReviews.filter(r => r.tier === 'tier1').length,
      tier2: verifiedReviews.filter(r => r.tier === 'tier2').length,
      tier3: verifiedReviews.filter(r => r.tier === 'tier3').length
    };

    return {
      totalReviews: verifiedReviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      topBadges,
      tierBreakdown
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw new Error('Failed to get review stats');
  }
};
