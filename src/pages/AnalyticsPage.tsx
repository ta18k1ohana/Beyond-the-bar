import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/userStore';
import { getTeamAnalytics, type TeamAnalytics } from '../services/analytics.service';
import {
  StatCard,
  RatingDistribution,
  TopBadges,
  TeamPerformance,
  ReviewTrends
} from '../components/analytics';

export const AnalyticsPage = () => {
  const { user } = useAuth();
  const { userProfile } = useUserStore();

  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch team member IDs from the employer's data
    // For now, we'll load analytics for the current user if they're an employer
    loadAnalytics();
  }, [user, userProfile]);

  const loadAnalytics = async () => {
    if (!user || userProfile?.type !== 'employer') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // TODO: In a real implementation, fetch actual team member IDs
      // For now, using the employer's own ID as a demo
      const memberIds = [user.uid];

      const data = await getTeamAnalytics(user.uid, memberIds);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Access control - only employers can view this page
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Please log in to view analytics.</p>
        </div>
      </div>
    );
  }

  if (userProfile?.type !== 'employer') {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Employer Access Only
          </h2>
          <p className="text-gray-600">
            Analytics dashboard is available for employer accounts only.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No analytics data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-coffee-primary)] font-heading mb-2">
          Team Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Track your team's performance and review insights
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Members"
          value={analytics.totalTeamMembers}
          icon="👥"
          subtitle="Total members tracked"
        />

        <StatCard
          title="Total Reviews"
          value={analytics.totalReviews}
          icon="⭐"
          subtitle="Across all team members"
        />

        <StatCard
          title="Average Rating"
          value={analytics.averageTeamRating.toFixed(1)}
          icon="📊"
          subtitle="Team-wide average"
        />

        <StatCard
          title="Top Performers"
          value={analytics.topPerformers.length}
          icon="🏆"
          subtitle="With 5+ reviews"
        />
      </div>

      {/* Tier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Tier 1 Reviews"
          value={analytics.tierBreakdown.tier1}
          icon="🤝"
          subtitle="Colleague reviews (2x weight)"
        />

        <StatCard
          title="Tier 2 Reviews"
          value={analytics.tierBreakdown.tier2}
          icon="☕"
          subtitle="Industry peer reviews"
        />

        <StatCard
          title="Tier 3 Reviews"
          value={analytics.tierBreakdown.tier3}
          icon="👤"
          subtitle="Customer reviews"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <RatingDistribution
          distribution={analytics.ratingDistribution}
          totalReviews={analytics.totalReviews}
        />

        {/* Top Badges */}
        <TopBadges
          badges={analytics.mostCommonBadges}
          title="Most Common Team Badges"
          limit={10}
        />
      </div>

      {/* Review Trends */}
      <ReviewTrends trends={analytics.reviewTrends} />

      {/* Top Performers */}
      <TeamPerformance
        teamMembers={analytics.topPerformers}
        title="Top Performers (5+ Reviews)"
      />

      {/* Empty State Help */}
      {analytics.totalReviews === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            Getting Started with Team Analytics
          </h3>
          <p className="text-blue-800 mb-4">
            Your analytics dashboard will populate as your team receives reviews. Here's how to get started:
          </p>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Encourage team members to create profiles on Beyond The Bar</li>
            <li>Ask colleagues to leave reviews for each other (Tier 1 reviews count 2x!)</li>
            <li>Share your cafe's profile with customers for Tier 3 reviews</li>
            <li>Track badge progression and identify top performers</li>
          </ul>
        </div>
      )}
    </div>
  );
};
