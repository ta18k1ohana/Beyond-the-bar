import { useState, useEffect } from 'react';
import { getReviewsForUser } from '../../services/review.service';
import { getUserProfile } from '../../services/user.service';
import { ReviewCard } from './ReviewCard';
import type { Review, User } from '../../types';

interface ReviewListProps {
  userId: string;
  showFullDetails?: boolean; // Employer view
  isOwner?: boolean; // Viewing own reviews
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

      // Filter out unverified Tier 1 reviews unless in employer view
      const filteredReviews = showFullDetails
        ? allReviews
        : allReviews.filter(r => r.tier !== 'tier1' || r.relationship.verified);

      const displayedReviews = limit ? filteredReviews.slice(0, limit) : filteredReviews;
      setReviews(displayedReviews);

      // Load reviewer profiles if showing full details
      if (showFullDetails) {
        const reviewerIds = [...new Set(displayedReviews.map(r => r.reviewerId))];
        const profiles: { [key: string]: User } = {};

        await Promise.all(
          reviewerIds.map(async (id) => {
            const profile = await getUserProfile(id);
            if (profile) {
              profiles[id] = profile;
            }
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
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <div className="text-5xl mb-3">📋</div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">No reviews yet</h3>
        <p className="text-gray-600">
          {isOwner
            ? 'Start building your reputation by asking colleagues for reviews!'
            : 'This barista hasn\'t received any reviews yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <ReviewCard
          key={review.id}
          review={review}
          reviewerName={reviewers[review.reviewerId]?.name}
          showFullDetails={showFullDetails}
          isOwner={isOwner}
        />
      ))}

      {limit && reviews.length >= limit && (
        <div className="text-center">
          <button className="text-[var(--color-coffee-accent)] hover:underline font-semibold">
            View All Reviews →
          </button>
        </div>
      )}
    </div>
  );
};
