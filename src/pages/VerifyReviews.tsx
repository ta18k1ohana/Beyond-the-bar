import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPendingVerifications, verifyTier1Review } from '../services/review.service';
import { getUserProfile } from '../services/user.service';
import { BADGES } from '../constants/badges';
import type { Review, User } from '../types';

export const VerifyReviews = () => {
  const { user } = useAuth();
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [reviewers, setReviewers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPendingReviews();
    }
  }, [user]);

  const loadPendingReviews = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const reviews = await getPendingVerifications(user.uid);
      setPendingReviews(reviews);

      // Load reviewer profiles
      const reviewerIds = [...new Set(reviews.map(r => r.reviewerId))];
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
    } catch (error) {
      console.error('Error loading pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reviewId: string, verified: boolean) => {
    try {
      setProcessing(reviewId);
      await verifyTier1Review(reviewId, verified);

      // Remove from pending list
      setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error verifying review:', error);
      alert('Failed to verify review. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading pending verifications...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-[var(--color-coffee-primary)] font-heading">
          Verify Colleague Reviews
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Confirm these colleague relationships to help build trust in the community
        </p>

        {pendingReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">All caught up!</h3>
            <p className="text-gray-600">You have no pending review verifications.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingReviews.map(review => {
              const reviewer = reviewers[review.reviewerId];

              return (
                <div
                  key={review.id}
                  className="border border-gray-300 rounded-lg p-6 bg-gray-50"
                >
                  {/* Reviewer Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-[var(--color-coffee-accent)] rounded-full flex items-center justify-center text-2xl text-white flex-shrink-0">
                      {reviewer?.name.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[var(--color-coffee-text)]">
                        {reviewer?.name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {review.relationship.type === 'colleague'
                          ? 'Claims you worked together as colleagues'
                          : 'Claims to have been your manager/supervisor'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Workplace:</strong> {review.relationship.workplace}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Period:</strong>{' '}
                        {new Date(review.relationship.workplacePeriod.start).toLocaleDateString(
                          'en-US',
                          { month: 'short', year: 'numeric' }
                        )}{' '}
                        -{' '}
                        {review.relationship.workplacePeriod.end
                          ? new Date(review.relationship.workplacePeriod.end).toLocaleDateString(
                              'en-US',
                              { month: 'short', year: 'numeric' }
                            )
                          : 'Present'}
                      </p>
                    </div>
                  </div>

                  {/* Review Content Preview */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-400 text-xl">
                        {'⭐'.repeat(review.starRating)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({review.starRating}/5 stars)
                      </span>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">
                        Badges Tagged ({review.badgeTags.length}):
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {review.badgeTags.map(badgeId => {
                          const badge = BADGES.find(b => b.id === badgeId);
                          return badge ? (
                            <div
                              key={badgeId}
                              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                            >
                              <span>{badge.emoji}</span>
                              <span>{badge.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {review.comment && review.starRating >= 4 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-1">Comment:</h4>
                        <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
                      </div>
                    )}
                  </div>

                  {/* Verification Prompt */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800 mb-3">
                      <strong>Did you work with {reviewer?.name} at {review.relationship.workplace}?</strong>
                    </p>
                    <p className="text-xs text-blue-700">
                      Verifying this review means their feedback will count 2x toward your badges.
                      Only verify if you actually worked together as stated.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleVerify(review.id, true)}
                      disabled={processing === review.id}
                      className="flex-1 bg-[var(--color-coffee-success)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {processing === review.id ? 'Verifying...' : '✓ Yes, We Worked Together'}
                    </button>
                    <button
                      onClick={() => handleVerify(review.id, false)}
                      disabled={processing === review.id}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {processing === review.id ? 'Processing...' : '✗ No, This is Incorrect'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
