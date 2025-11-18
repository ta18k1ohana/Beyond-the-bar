import type { TeamMemberStats } from '../../services/analytics.service';

interface TeamPerformanceProps {
  teamMembers: TeamMemberStats[];
  title?: string;
}

export const TeamPerformance = ({ teamMembers, title = 'Top Performers' }: TeamPerformanceProps) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading mb-4">
        {title}
      </h3>

      {teamMembers.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No team members with sufficient reviews yet (minimum 5 reviews required)
        </p>
      ) : (
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div
              key={member.userId}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-700' :
                    index === 2 ? 'bg-orange-300 text-orange-900' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Name */}
                  <div>
                    <h4 className="font-bold text-gray-800">{member.name}</h4>
                    <p className="text-sm text-gray-500">{member.totalReviews} reviews</p>
                  </div>
                </div>

                {/* Rating and Trend */}
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[var(--color-coffee-accent)]">
                      {member.averageRating.toFixed(1)}
                    </span>
                    <span className="text-yellow-500 text-xl">⭐</span>
                  </div>
                  <span className={`text-sm font-medium ${getTrendColor(member.recentTrend)}`}>
                    {getTrendIcon(member.recentTrend)} {member.recentTrend}
                  </span>
                </div>
              </div>

              {/* Top Badges */}
              {member.topBadges.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Top Badges:</p>
                  <div className="flex flex-wrap gap-2">
                    {member.topBadges.slice(0, 5).map(badge => (
                      <div
                        key={badge.badgeId}
                        className="bg-[var(--color-coffee-accent)] bg-opacity-10 px-2 py-1 rounded text-xs"
                      >
                        <span className="font-medium">{badge.badgeName}</span>
                        <span className="text-gray-600 ml-1">({badge.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
