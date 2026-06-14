import { useState, useEffect } from 'react';
import { getReviewsForUser } from '../../services/review.service';
import { getUserProfile } from '../../services/user.service';
import { ReviewCard } from './ReviewCard';
import type { Review, User } from '../../types';

interface ReviewListProps {
  userId: string;
  showFullDetails?: boolean;
  isOwner?: boolean;
  limit?: number;
}

export const ReviewList = ({ userId, showFullDetails = false, isOwner = false, limit }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewers, setReviewers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, [userId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError('');

      const allReviews = await getReviewsForUser(userId);
      const filteredReviews = showFullDetails
        ? allReviews
        : allReviews.filter(r => r.tier !== 'tier1' || r.relationship.verified);

      const displayedReviews = limit ? filteredReviews.slice(0, limit) : filteredReviews;
      setReviews(displayedReviews);

      if (showFullDetails) {
        const reviewerIds = [...new Set(displayedReviews.map(r => r.reviewerId))];
        const profiles: { [key: string]: User } = {};
        await Promise.all(
          reviewerIds.map(async (id) => {
            const profile = await getUserProfile(id);
            if (profile) profiles[id] = profile;
          })
        );
        setReviewers(profiles);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-sm text-[var(--color-ink-soft)]">Loading reviews…</div>;
  }

  if (error) {
    return <div className="alert-error">{error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-heading italic text-xl text-[var(--color-ink-soft)] mb-2" style={{ fontVariationSettings: '"opsz" 144' }}>
          The page is blank.
        </p>
        <p className="text-sm text-[var(--color-ink-soft)]">
          {isOwner
            ? 'Ask a colleague to write the first review.'
            : 'No reviews have been written yet.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y hairline">
        {reviews.map(review => (
          <li key={review.id} className="py-6 first:pt-0 last:pb-0">
            <ReviewCard
              review={review}
              reviewerName={reviewers[review.reviewerId]?.name}
              showFullDetails={showFullDetails}
              isOwner={isOwner}
            />
          </li>
        ))}
      </ul>

      {limit && reviews.length >= limit && (
        <div className="pt-5 mt-2 border-t hairline text-center">
          <button className="text-xs tracking-[0.18em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">
            Read all reviews
          </button>
        </div>
      )}
    </div>
  );
};
