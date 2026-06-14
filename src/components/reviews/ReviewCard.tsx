import { BADGES } from '../../constants/badges';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
  reviewerName?: string;
  showFullDetails?: boolean;
  isOwner?: boolean;
}

const TIER_LABEL: Record<string, string> = {
  tier1: 'Colleague',
  tier2: 'Industry',
  tier3: 'Customer',
};

const RELATIONSHIP_LABEL: Record<string, string> = {
  colleague: 'Colleague',
  manager: 'Manager',
  owner: 'Owner',
  industry_peer: 'Industry peer',
  customer: 'Customer',
};

// Five small line-icon stars — restrained, no emoji.
const Stars = ({ value }: { value: number }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${value} of 5`}>
    {[0, 1, 2, 3, 4].map((i) => {
      const filled = i < value;
      return (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
          className={filled ? 'text-[var(--color-ink)]' : 'text-[var(--color-hairline)]'}
          aria-hidden
        >
          <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.8 6.7 19.4l1.2-6L3.4 9.3l6-.7L12 3z" />
        </svg>
      );
    })}
  </span>
);

export const ReviewCard = ({
  review,
  reviewerName = 'Anonymous',
  showFullDetails = false,
  isOwner = false,
}: ReviewCardProps) => {
  const tier = TIER_LABEL[review.tier] ?? review.tier;
  const relationship = RELATIONSHIP_LABEL[review.relationship.type] ?? review.relationship.type;
  const pending = review.tier === 'tier1' && !review.relationship.verified;

  const shouldShowComment = () => {
    if (isOwner) return review.starRating >= 4 && review.comment;
    if (showFullDetails) return review.comment;
    return false;
  };

  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <article>
      {/* Header line — quietly editorial */}
      <header className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <p className="eyebrow text-[var(--color-accent)]">{tier}</p>
          {showFullDetails && reviewerName && (
            <span className="font-heading text-base">{reviewerName}</span>
          )}
          <span className="text-sm text-[var(--color-ink-soft)]">
            {relationship} · {review.relationship.workplace}
          </span>
          {pending && (
            <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink-soft)] border hairline rounded-full px-2 py-0.5">
              Pending
            </span>
          )}
        </div>
        <time className="text-xs text-[var(--color-ink-soft)] tracking-wide">{date}</time>
      </header>

      {/* Stars */}
      {(showFullDetails || review.starRating >= 4) && (
        <div className="flex items-center gap-2 mb-4">
          <Stars value={review.starRating} />
          <span className="text-xs text-[var(--color-ink-soft)]">{review.starRating}/5</span>
        </div>
      )}

      {/* Badge tags — pill chips, hairline outline only */}
      {review.badgeTags.length > 0 && (
        <div className="mb-4">
          <p className="eyebrow mb-2">Strengths</p>
          <div className="flex flex-wrap gap-1.5">
            {review.badgeTags.map((badgeId) => {
              const badge = BADGES.find((b) => b.id === badgeId);
              if (!badge) return null;
              return (
                <span
                  key={badgeId}
                  className="text-xs px-2.5 py-1 rounded-full border hairline text-[var(--color-ink)] bg-white"
                >
                  {badge.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Pull quote — only when shown */}
      {shouldShowComment() && (
        <blockquote className="pl-4 border-l-2 border-[var(--color-accent)] mt-2">
          <p
            className="font-heading italic text-lg leading-snug text-[var(--color-ink)]"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            &ldquo;{review.comment}&rdquo;
          </p>
        </blockquote>
      )}

      {/* Owner-only hidden-comment note */}
      {isOwner && review.starRating < 4 && (
        <p className="text-xs text-[var(--color-ink-soft)] mt-3 leading-relaxed">
          Comments on reviews below four stars are kept private — only the strengths are shown here.
          Hiring cafés see the full text.
        </p>
      )}
    </article>
  );
};
