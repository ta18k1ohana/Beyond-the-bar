import { calculateProfileCompletion } from '../../services/user.service';
import type { User } from '../../types';

interface ProfileCompletionProps {
  user: User;
}

export const ProfileCompletion = ({ user }: ProfileCompletionProps) => {
  const completionPercent = calculateProfileCompletion(user);

  const getCompletionColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMissingItems = (user: User): string[] => {
    const missing: string[] = [];

    if (!user.location.city || !user.location.state) {
      missing.push('Location');
    }
    if (!user.bio || user.bio.length < 20) {
      missing.push('Bio (at least 20 characters)');
    }
    if (!user.coffeePhilosophy || user.coffeePhilosophy.length < 10) {
      missing.push('Coffee philosophy');
    }
    if (!user.profilePhoto) {
      missing.push('Profile photo');
    }
    if (!user.currentWorkplace) {
      missing.push('Current workplace');
    }
    if (user.workHistory.length === 0) {
      missing.push('Work history');
    }
    if (user.certifications.length === 0) {
      missing.push('Certifications');
    }
    if (user.portfolio.length === 0) {
      missing.push('Portfolio images');
    }

    return missing;
  };

  const missingItems = getMissingItems(user);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading">
          Profile Completion
        </h3>
        <span className="text-2xl font-bold text-[var(--color-coffee-primary)]">
          {completionPercent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${getCompletionColor(completionPercent)}`}
          style={{ width: `${completionPercent}%` }}
        />
      </div>

      {completionPercent < 100 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">To complete your profile, add:</p>
          <ul className="space-y-1">
            {missingItems.map((item, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="text-[var(--color-coffee-accent)]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {completionPercent === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm font-semibold flex items-center gap-2">
            <span className="text-xl">🎉</span>
            Your profile is complete! You're ready to start earning badges.
          </p>
        </div>
      )}
    </div>
  );
};
