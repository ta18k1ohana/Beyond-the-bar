interface RatingDistributionProps {
  distribution: { [key: number]: number };
  totalReviews: number;
}

export const RatingDistribution = ({ distribution, totalReviews }: RatingDistributionProps) => {
  const maxCount = Math.max(...Object.values(distribution));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading mb-4">
        Rating Distribution
      </h3>

      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = distribution[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              {/* Stars */}
              <div className="flex items-center gap-1 w-16">
                <span className="font-medium text-gray-700">{rating}</span>
                <span className="text-yellow-500">⭐</span>
              </div>

              {/* Bar */}
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    rating >= 4 ? 'bg-green-500' :
                    rating === 3 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {totalReviews === 0 && (
        <p className="text-center text-gray-500 mt-4">No reviews yet</p>
      )}
    </div>
  );
};
