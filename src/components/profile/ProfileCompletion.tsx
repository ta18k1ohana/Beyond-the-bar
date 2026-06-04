import { calculateProfileCompletion } from '../../services/user.service';
import type { User } from '../../types';

interface ProfileCompletionProps {
  user: User;
}

const getMissingItems = (user: User): string[] => {
  const missing: string[] = [];
  if (!user.location.city || !user.location.state) missing.push('Location');
  if (!user.bio || user.bio.length < 20) missing.push('A short bio');
  if (!user.coffeePhilosophy || user.coffeePhilosophy.length < 10) missing.push('A line of philosophy');
  if (!user.profilePhoto) missing.push('A portrait');
  if (!user.currentWorkplace) missing.push('Current café');
  if (user.workHistory.length === 0) missing.push('Past bars');
  if (user.certifications.length === 0) missing.push('Certifications');
  if (user.portfolio.length === 0) missing.push('A few photographs');
  return missing;
};

export const ProfileCompletion = ({ user }: ProfileCompletionProps) => {
  const percent = calculateProfileCompletion(user);
  const missing = getMissingItems(user);
  const complete = percent === 100;

  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <p className="eyebrow">Completion</p>
        <span
          className="font-heading text-3xl leading-none"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          {percent}
          <span className="text-base text-[var(--color-ink-soft)]">%</span>
        </span>
      </div>

      {/* Progress bar — single-accent, no traffic-light colors */}
      <div className="relative h-[3px] bg-[var(--color-hairline)] rounded-full overflow-hidden mb-5">
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-ink)] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {!complete ? (
        <>
          <p className="text-xs text-[var(--color-ink-soft)] mb-3">Still to add</p>
          <ul className="space-y-1.5">
            {missing.map((item) => (
              <li
                key={item}
                className="text-sm text-[var(--color-ink)] flex items-center gap-2.5"
              >
                <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm text-[var(--color-ink)] leading-relaxed">
          The page is set. Now you wait for the first review.
        </p>
      )}
    </div>
  );
};
