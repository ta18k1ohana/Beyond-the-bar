import { BADGES } from '../../constants/badges';

interface TopBadgesProps {
  badges: Array<{ badgeId: string; badgeName: string; count: number }>;
  title?: string;
  limit?: number;
}

export const TopBadges = ({ badges, title = 'Top Badges', limit = 10 }: TopBadgesProps) => {
  const displayBadges = badges.slice(0, limit);

  const getBadgeInfo = (badgeId: string) => {
    return BADGES.find(b => b.id === badgeId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading mb-4">
        {title}
      </h3>

      {displayBadges.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No badge data yet</p>
      ) : (
        <div className="space-y-3">
          {displayBadges.map((badge, index) => {
            const badgeInfo = getBadgeInfo(badge.badgeId);

            return (
              <div
                key={badge.badgeId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-300 text-orange-900' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Badge */}
                  {badgeInfo && (
                    <span className="text-2xl">{badgeInfo.emoji}</span>
                  )}

                  {/* Name and Category */}
                  <div>
                    <p className="font-semibold text-gray-800">{badge.badgeName}</p>
                    {badgeInfo && (
                      <p className="text-xs text-gray-500 capitalize">{badgeInfo.category}</p>
                    )}
                  </div>
                </div>

                {/* Count */}
                <div className="text-right">
                  <p className="text-xl font-bold text-[var(--color-coffee-accent)]">
                    {badge.count}
                  </p>
                  <p className="text-xs text-gray-500">tags</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
