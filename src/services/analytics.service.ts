/**
 * Analytics Service
 * Provides employer analytics and team performance insights
 */

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getReviewsForUser, getReviewStats } from './review.service';
import { BADGES } from '../constants/badges';
import type { Review } from '../types';

/**
 * Team member performance data
 */
export interface TeamMemberStats {
  userId: string;
  name: string;
  totalReviews: number;
  averageRating: number;
  topBadges: Array<{ badgeId: string; badgeName: string; count: number }>;
  recentTrend: 'up' | 'down' | 'stable';
}

/**
 * Aggregate team analytics
 */
export interface TeamAnalytics {
  totalTeamMembers: number;
  totalReviews: number;
  averageTeamRating: number;
  topPerformers: TeamMemberStats[];
  mostCommonBadges: Array<{ badgeId: string; badgeName: string; count: number }>;
  ratingDistribution: { [key: number]: number };
  tierBreakdown: { tier1: number; tier2: number; tier3: number };
  reviewTrends: Array<{ month: string; count: number; avgRating: number }>;
}

/**
 * Badge progression analytics
 */
export interface BadgeProgressionData {
  badgeId: string;
  badgeName: string;
  emoji: string;
  category: string;
  totalTags: number;
  achievementRate: number; // % of team with this badge
  levelDistribution: {
    bronze: number;
    silver: number;
    gold: number;
    legendary: number;
  };
}

/**
 * Get individual team member statistics
 */
export const getTeamMemberStats = async (userId: string, userName: string): Promise<TeamMemberStats> => {
  try {
    const stats = await getReviewStats(userId);
    const reviews = await getReviewsForUser(userId);

    // Calculate trend from recent reviews (last 3 months vs previous 3 months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentReviews = reviews.filter(r => new Date(r.createdAt) >= threeMonthsAgo);
    const previousReviews = reviews.filter(r => {
      const date = new Date(r.createdAt);
      return date >= sixMonthsAgo && date < threeMonthsAgo;
    });

    const recentAvg = recentReviews.length > 0
      ? recentReviews.reduce((sum, r) => sum + r.starRating, 0) / recentReviews.length
      : 0;
    const previousAvg = previousReviews.length > 0
      ? previousReviews.reduce((sum, r) => sum + r.starRating, 0) / previousReviews.length
      : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentAvg > previousAvg + 0.2) trend = 'up';
    else if (recentAvg < previousAvg - 0.2) trend = 'down';

    // Format top badges with names
    const topBadges = stats.topBadges.map(tb => {
      const badge = BADGES.find(b => b.id === tb.badgeId);
      return {
        badgeId: tb.badgeId,
        badgeName: badge?.name || tb.badgeId,
        count: tb.count
      };
    });

    return {
      userId,
      name: userName,
      totalReviews: stats.totalReviews,
      averageRating: stats.averageRating,
      topBadges,
      recentTrend: trend
    };
  } catch (error) {
    console.error('Error getting team member stats:', error);
    throw error;
  }
};

/**
 * Get aggregated team analytics for an employer
 */
export const getTeamAnalytics = async (_employerId: string, teamMemberIds: string[]): Promise<TeamAnalytics> => {
  try {
    // Get all reviews for team members
    const allReviews: Review[] = [];
    const memberStats: TeamMemberStats[] = [];

    for (const memberId of teamMemberIds) {
      const reviews = await getReviewsForUser(memberId);
      allReviews.push(...reviews);

      // Get member info from their first review or user profile
      // For now, using memberId as placeholder name
      const stats = await getTeamMemberStats(memberId, `Team Member ${memberId.slice(0, 6)}`);
      memberStats.push(stats);
    }

    // Filter to verified reviews
    const verifiedReviews = allReviews.filter(r =>
      r.tier !== 'tier1' || r.relationship.verified
    );

    // Calculate aggregate metrics
    const totalReviews = verifiedReviews.length;
    const totalRating = verifiedReviews.reduce((sum, r) => sum + r.starRating, 0);
    const averageTeamRating = totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;

    // Rating distribution
    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    verifiedReviews.forEach(r => {
      ratingDistribution[r.starRating]++;
    });

    // Tier breakdown
    const tierBreakdown = {
      tier1: verifiedReviews.filter(r => r.tier === 'tier1').length,
      tier2: verifiedReviews.filter(r => r.tier === 'tier2').length,
      tier3: verifiedReviews.filter(r => r.tier === 'tier3').length
    };

    // Most common badges across team
    const badgeTagCounts: { [badgeId: string]: number } = {};
    verifiedReviews.forEach(review => {
      review.badgeTags.forEach(badgeId => {
        badgeTagCounts[badgeId] = (badgeTagCounts[badgeId] || 0) + 1;
      });
    });

    const mostCommonBadges = Object.entries(badgeTagCounts)
      .map(([badgeId, count]) => {
        const badge = BADGES.find(b => b.id === badgeId);
        return {
          badgeId,
          badgeName: badge?.name || badgeId,
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Review trends by month (last 12 months)
    const monthlyTrends: { [key: string]: { count: number; totalRating: number } } = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyTrends[monthKey] = { count: 0, totalRating: 0 };
    }

    verifiedReviews.forEach(review => {
      const date = new Date(review.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyTrends[monthKey]) {
        monthlyTrends[monthKey].count++;
        monthlyTrends[monthKey].totalRating += review.starRating;
      }
    });

    const reviewTrends = Object.entries(monthlyTrends).map(([month, data]) => ({
      month,
      count: data.count,
      avgRating: data.count > 0 ? Math.round((data.totalRating / data.count) * 10) / 10 : 0
    }));

    // Top performers (by average rating, minimum 5 reviews)
    const topPerformers = memberStats
      .filter(m => m.totalReviews >= 5)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    return {
      totalTeamMembers: teamMemberIds.length,
      totalReviews,
      averageTeamRating,
      topPerformers,
      mostCommonBadges,
      ratingDistribution,
      tierBreakdown,
      reviewTrends
    };
  } catch (error) {
    console.error('Error getting team analytics:', error);
    throw error;
  }
};

/**
 * Get badge progression analytics across team
 */
export const getBadgeProgressionAnalytics = async (teamMemberIds: string[]): Promise<BadgeProgressionData[]> => {
  try {
    // Get all users' badge data
    const totalMembers = teamMemberIds.length;

    // This would need to fetch user profiles to get their badges
    // For now, analyzing from reviews
    const badgeTagCounts: { [badgeId: string]: number } = {};

    for (const memberId of teamMemberIds) {
      const reviews = await getReviewsForUser(memberId);
      const verifiedReviews = reviews.filter(r =>
        r.tier !== 'tier1' || r.relationship.verified
      );

      verifiedReviews.forEach(review => {
        review.badgeTags.forEach(badgeId => {
          badgeTagCounts[badgeId] = (badgeTagCounts[badgeId] || 0) + 1;
        });
      });
    }

    // Convert to badge progression data
    const progressionData: BadgeProgressionData[] = BADGES.map(badge => {
      const totalTags = badgeTagCounts[badge.id] || 0;
      const achievementRate = totalMembers > 0 ? (totalTags > 0 ? 1 : 0) * 100 / totalMembers : 0;

      return {
        badgeId: badge.id,
        badgeName: badge.name,
        emoji: badge.emoji,
        category: badge.category,
        totalTags,
        achievementRate: Math.round(achievementRate),
        levelDistribution: {
          bronze: 0,  // Would need user badge data
          silver: 0,
          gold: 0,
          legendary: 0
        }
      };
    })
    .filter(b => b.totalTags > 0)
    .sort((a, b) => b.totalTags - a.totalTags);

    return progressionData;
  } catch (error) {
    console.error('Error getting badge progression analytics:', error);
    throw error;
  }
};

/**
 * Get reviews by workplace (for employer to see reviews of their cafe)
 */
export const getWorkplaceReviews = async (workplaceName: string): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('relationship.workplace', '==', workplaceName),
      where('isVisible', '==', true)
    );

    const snapshot = await getDocs(q);
    const reviews: Review[] = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
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
      } as Review);
    });

    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting workplace reviews:', error);
    throw error;
  }
};
