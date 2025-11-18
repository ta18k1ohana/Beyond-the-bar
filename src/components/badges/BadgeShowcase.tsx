import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStore } from '../../store/userStore';
import { getReviewsForUser } from '../../services/review.service';
import { BADGES, getBadgesByCategory } from '../../constants/badges';
import { BadgeCard } from './BadgeCard';
import type { BadgeCategory } from '../../types';

export const BadgeShowcase = () => {
  const { user } = useAuth();
  const { userProfile } = useUserStore();
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all' | 'earned'>('all');
  const [badgeTagCounts, setBadgeTagCounts] = useState<{ [badgeId: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const categories: Array<{ id: BadgeCategory | 'all' | 'earned'; name: string; emoji: string }> = [
    { id: 'all', name: 'All Badges', emoji: '🏆' },
    { id: 'earned', name: 'My Badges', emoji: '⭐' },
    { id: 'technique', name: 'Technique', emoji: '🎨' },
    { id: 'speed', name: 'Speed', emoji: '⚡' },
    { id: 'service', name: 'Service', emoji: '💬' },
    { id: 'teamwork', name: 'Teamwork', emoji: '🤝' },
    { id: 'knowledge', name: 'Knowledge', emoji: '🧠' },
    { id: 'special', name: 'Special', emoji: '🌟' },
    { id: 'personality', name: 'Personality', emoji: '🎭' },
    { id: 'legendary', name: 'Legendary', emoji: '👑' }
  ];

  useEffect(() => {
    if (user) {
      loadBadgeProgress();
    }
  }, [user]);

  const loadBadgeProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const reviews = await getReviewsForUser(user.uid);

      // Count tags with tier weighting (same as badge progression calculation)
      const verifiedReviews = reviews.filter(r =>
        r.tier !== 'tier1' || r.relationship.verified
      );

      const counts: { [badgeId: string]: number } = {};
      verifiedReviews.forEach(review => {
        const weight = review.tier === 'tier1' ? 2.0 : 1.0;
        review.badgeTags.forEach(badgeId => {
          counts[badgeId] = (counts[badgeId] || 0) + weight;
        });
      });

      setBadgeTagCounts(counts);
    } catch (error) {
      console.error('Error loading badge progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBadges = () => {
    if (activeCategory === 'earned') {
      const earnedBadgeIds = userProfile?.badges.map(b => b.badgeId) || [];
      return BADGES.filter(b => earnedBadgeIds.includes(b.id));
    }

    if (activeCategory === 'all') {
      return BADGES;
    }

    return getBadgesByCategory(activeCategory);
  };

  const filteredBadges = getFilteredBadges();

  // Sort badges: earned first, then by progress, then by name
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    const aEarned = userProfile?.badges.find(ub => ub.badgeId === a.id);
    const bEarned = userProfile?.badges.find(ub => ub.badgeId === b.id);

    if (aEarned && !bEarned) return -1;
    if (!aEarned && bEarned) return 1;

    const aCount = badgeTagCounts[a.id] || 0;
    const bCount = badgeTagCounts[b.id] || 0;

    if (aCount !== bCount) return bCount - aCount;

    return a.name.localeCompare(b.name);
  });

  const earnedCount = userProfile?.badges.length || 0;
  const totalBadges = BADGES.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-coffee-primary)] font-heading mb-2">
          Badge Showcase
        </h1>
        <p className="text-gray-600 mb-4">
          Discover all {totalBadges} badges and track your progress
        </p>
        {user && userProfile && (
          <div className="inline-block bg-[var(--color-coffee-accent)] bg-opacity-10 px-6 py-3 rounded-lg">
            <span className="text-2xl font-bold text-[var(--color-coffee-primary)]">
              {earnedCount}/{totalBadges}
            </span>
            <span className="text-gray-700 ml-2">Badges Earned</span>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-[var(--color-coffee-accent)] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.emoji} {category.name}
            {category.id === 'earned' && earnedCount > 0 && ` (${earnedCount})`}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Loading badges...</div>
        </div>
      ) : sortedBadges.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No badges in this category yet</h3>
          <p className="text-gray-600">
            {activeCategory === 'earned'
              ? 'Start earning badges by asking colleagues for reviews!'
              : 'Check back soon for more badges.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedBadges.map(badge => {
            const userBadge = userProfile?.badges.find(ub => ub.badgeId === badge.id);
            const tagCount = badgeTagCounts[badge.id] || 0;

            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                userBadge={userBadge}
                tagCount={tagCount}
              />
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold text-[var(--color-coffee-primary)] font-heading mb-4">
          How Badge Levels Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥉</span>
            <div>
              <div className="font-bold text-orange-700">Bronze</div>
              <div className="text-sm text-gray-600">3 tags</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥈</span>
            <div>
              <div className="font-bold text-gray-700">Silver</div>
              <div className="text-sm text-gray-600">8 tags</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🥇</span>
            <div>
              <div className="font-bold text-yellow-700">Gold</div>
              <div className="text-sm text-gray-600">20 tags</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <div>
              <div className="font-bold text-purple-700">Legendary</div>
              <div className="text-sm text-gray-600">30+ tags + special criteria</div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>💡 Tip:</strong> Reviews from colleagues (Tier 1) count 2x toward badges!
            Get verified reviews from people you've worked with for faster progression.
          </p>
        </div>
      </div>
    </div>
  );
};
