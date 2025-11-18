import { BADGES } from '../../constants/badges';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
  reviewerName?: string;
  showFullDetails?: boolean; // For employer view
  isOwner?: boolean; // If viewing own reviews
}

export const ReviewCard = ({
  review,
  reviewerName = 'Anonymous',
  showFullDetails = false,
  isOwner = false
}: ReviewCardProps) => {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'tier1':
        return (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Tier 1: Colleague
          </span>
        );
      case 'tier2':
        return (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Tier 2: Industry
          </span>
        );
      case 'tier3':
        return (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            Tier 3: Customer
          </span>
        );
      default:
        return null;
    }
  };

  const getRelationshipText = (type: string) => {
    const types: { [key: string]: string } = {
      colleague: 'Colleague',
      manager: 'Manager',
      owner: 'Owner',
      industry_peer: 'Industry Peer',
      customer: 'Customer'
    };
    return types[type] || type;
  };

  const shouldShowComment = () => {
    // Owner sees comments from 4+ stars only
    if (isOwner) {
      return review.starRating >= 4 && review.comment;
    }
    // Employers (showFullDetails) see all comments
    if (showFullDetails) {
      return review.comment;
    }
    // Public view doesn't see comments
    return false;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {showFullDetails && (
            <div className="font-medium text-[var(--color-coffee-text)] mb-1">
              {reviewerName}
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {getTierBadge(review.tier)}
            <span className="text-sm text-gray-600">
              {getRelationshipText(review.relationship.type)} at {review.relationship.workplace}
            </span>
            {!review.relationship.verified && review.tier === 'tier1' && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Pending Verification
              </span>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Star Rating */}
      {(showFullDetails || review.starRating >= 4) && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-400">
            {'⭐'.repeat(review.starRating)}
            <span className="text-gray-300">{'⭐'.repeat(5 - review.starRating)}</span>
          </span>
          <span className="text-sm text-gray-600">({review.starRating}/5)</span>
        </div>
      )}

      {/* Badge Tags */}
      <div className="mb-3">
        <h4 className="text-sm font-bold text-gray-700 mb-2">Strengths Highlighted:</h4>
        <div className="flex flex-wrap gap-2">
          {review.badgeTags.map(badgeId => {
            const badge = BADGES.find(b => b.id === badgeId);
            return badge ? (
              <div
                key={badgeId}
                className="bg-[var(--color-coffee-accent)] bg-opacity-10 border border-[var(--color-coffee-accent)] px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                <span>{badge.emoji}</span>
                <span className="font-medium text-[var(--color-coffee-text)]">{badge.name}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Comment */}
      {shouldShowComment() && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
        </div>
      )}

      {/* Review not visible to owner message */}
      {isOwner && review.starRating < 4 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          💡 This review rated you under 4 stars. You can see the badge tags, but comments are
          hidden to maintain our positive-first approach. Employers can see all feedback.
        </div>
      )}
    </div>
  );
};
