import type { Badge, BadgeLevel, UserBadge } from '../../types';

interface BadgeCardProps {
  badge: Badge;
  userBadge?: UserBadge; // If user has earned this badge
  tagCount?: number; // Current tag count toward this badge
  onClick?: () => void;
}

export const BadgeCard = ({ badge, userBadge, tagCount = 0, onClick }: BadgeCardProps) => {
  const earnedLevel = userBadge?.level;
  const currentCount = userBadge?.tagCount || tagCount;

  // Determine next level and progress
  const getNextLevel = (): { level: BadgeLevel; threshold: number } | null => {
    if (earnedLevel === 'gold' || earnedLevel === 'legendary') return null;
    if (earnedLevel === 'silver') return { level: 'gold', threshold: badge.levels.gold.threshold };
    if (earnedLevel === 'bronze') return { level: 'silver', threshold: badge.levels.silver.threshold };
    return { level: 'bronze', threshold: badge.levels.bronze.threshold };
  };

  const nextLevel = getNextLevel();
  const progress = nextLevel ? (currentCount / nextLevel.threshold) * 100 : 100;
  const tagsNeeded = nextLevel ? Math.max(0, nextLevel.threshold - currentCount) : 0;

  const getLevelColor = (level?: BadgeLevel) => {
    switch (level) {
      case 'legendary':
        return 'border-purple-500 bg-purple-50';
      case 'gold':
        return 'border-yellow-400 bg-yellow-50';
      case 'silver':
        return 'border-gray-400 bg-gray-50';
      case 'bronze':
        return 'border-orange-400 bg-orange-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getLevelEmoji = (level?: BadgeLevel) => {
    switch (level) {
      case 'legendary':
        return '👑';
      case 'gold':
        return '🥇';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-4 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-lg' : ''
      } ${getLevelColor(earnedLevel)}`}
    >
      {/* Badge Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-4xl">{badge.emoji}</span>
          {earnedLevel && (
            <span className="text-2xl">{getLevelEmoji(earnedLevel)}</span>
          )}
        </div>
        {earnedLevel && (
          <span className={`text-xs px-2 py-1 rounded capitalize font-bold ${
            earnedLevel === 'legendary' ? 'bg-purple-600 text-white' :
            earnedLevel === 'gold' ? 'bg-yellow-600 text-white' :
            earnedLevel === 'silver' ? 'bg-gray-600 text-white' :
            'bg-orange-600 text-white'
          }`}>
            {earnedLevel}
          </span>
        )}
      </div>

      {/* Badge Name & Description */}
      <h3 className="font-bold text-[var(--color-coffee-text)] mb-1">
        {badge.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {badge.description}
      </p>

      {/* Progress Bar */}
      {nextLevel && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>
              {currentCount}/{nextLevel.threshold} tags
            </span>
            <span className="font-semibold capitalize">
              Next: {nextLevel.level}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                nextLevel.level === 'gold' ? 'bg-yellow-500' :
                nextLevel.level === 'silver' ? 'bg-gray-500' :
                'bg-orange-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          {tagsNeeded > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              {tagsNeeded} more tag{tagsNeeded !== 1 ? 's' : ''} needed
            </p>
          )}
        </div>
      )}

      {!userBadge && currentCount === 0 && (
        <div className="text-xs text-gray-500 italic">
          Not earned yet - get {badge.levels.bronze.threshold} tags to unlock Bronze
        </div>
      )}

      {/* Category Badge */}
      <div className="mt-2">
        <span className="text-xs bg-[var(--color-coffee-accent)] bg-opacity-20 text-[var(--color-coffee-text)] px-2 py-1 rounded capitalize">
          {badge.category}
        </span>
      </div>
    </div>
  );
};
