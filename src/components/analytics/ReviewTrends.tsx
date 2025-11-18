interface ReviewTrendsProps {
  trends: Array<{ month: string; count: number; avgRating: number }>;
}

export const ReviewTrends = ({ trends }: ReviewTrendsProps) => {
  const maxCount = Math.max(...trends.map(t => t.count), 1);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading mb-4">
        Review Trends (Last 12 Months)
      </h3>

      <div className="space-y-4">
        {/* Chart */}
        <div className="flex items-end gap-2 h-48">
          {trends.map((trend, index) => {
            const heightPercentage = (trend.count / maxCount) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                {/* Bar */}
                <div className="w-full flex flex-col justify-end h-36">
                  <div
                    className="w-full bg-[var(--color-coffee-accent)] rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                    style={{ height: `${heightPercentage}%` }}
                    title={`${trend.count} reviews, avg ${trend.avgRating.toFixed(1)}⭐`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {trend.count} reviews<br />
                      Avg: {trend.avgRating.toFixed(1)}⭐
                    </div>

                    {/* Count label (for larger bars) */}
                    {heightPercentage > 30 && (
                      <span className="absolute top-2 left-0 right-0 text-center text-xs font-bold text-white">
                        {trend.count}
                      </span>
                    )}
                  </div>

                  {/* Count label below (for smaller bars) */}
                  {heightPercentage <= 30 && trend.count > 0 && (
                    <span className="text-xs font-bold text-gray-700 mt-1 text-center">
                      {trend.count}
                    </span>
                  )}
                </div>

                {/* Month label */}
                <p className="text-xs text-gray-600 transform -rotate-45 origin-top-left whitespace-nowrap">
                  {formatMonth(trend.month)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-semibold">Total: </span>
              {trends.reduce((sum, t) => sum + t.count, 0)} reviews
            </div>
            <div>
              <span className="font-semibold">Avg Rating: </span>
              {trends.filter(t => t.count > 0).length > 0
                ? (trends.reduce((sum, t) => sum + (t.avgRating * t.count), 0) /
                   trends.reduce((sum, t) => sum + t.count, 0)).toFixed(1)
                : '0.0'}
              ⭐
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
