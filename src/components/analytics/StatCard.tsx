interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

export const StatCard = ({ title, value, subtitle, icon, trend, trendValue }: StatCardProps) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-600 uppercase">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>

      <div className="mb-2">
        <p className="text-3xl font-bold text-[var(--color-coffee-primary)]">{value}</p>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 text-sm">
          {subtitle && <span className="text-gray-600">{subtitle}</span>}
          {trend && trendValue && (
            <span className={`font-medium ${getTrendColor()}`}>
              {getTrendIcon()} {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
