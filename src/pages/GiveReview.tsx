import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, searchUsers } from '../services/user.service';
import { createReview } from '../services/review.service';
import { BadgeSelector } from '../components/reviews/BadgeSelector';
import type { User, ReviewTier, RelationshipType } from '../types';

const reviewSchema = z.object({
  revieweeId: z.string().min(1, 'Please select who you are reviewing'),
  relationshipType: z.enum(['colleague', 'manager', 'owner', 'industry_peer', 'customer']),
  workplace: z.string().min(2, 'Workplace name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  starRating: z.number().min(1).max(5),
  badgeTags: z.array(z.string()).min(1, 'Select at least one badge').max(5, 'Maximum 5 badges'),
  comment: z.string().max(500, 'Comment must be less than 500 characters').optional()
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export const GiveReview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // User search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searching, setSearching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      relationshipType: 'colleague',
      starRating: 5,
      badgeTags: [],
      endDate: ''
    }
  });

  const selectedBadges = watch('badgeTags') || [];
  const relationshipType = watch('relationshipType');
  const starRating = watch('starRating');

  // Load user from URL params if provided
  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId) {
      loadUser(userId);
    }
  }, [searchParams]);

  const loadUser = async (userId: string) => {
    try {
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        setSelectedUser(userProfile);
        setValue('revieweeId', userId);
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      // For now, search by name (you could enhance this with more fields)
      const results = await searchUsers({ type: 'barista' });
      const filtered = results.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setSearching(false);
    }
  };

  const selectUser = (selectedUser: User) => {
    setSelectedUser(selectedUser);
    setValue('revieweeId', selectedUser.id);
    setSearchResults([]);
    setSearchQuery('');
  };

  const determineTier = (relType: RelationshipType): ReviewTier => {
    if (relType === 'colleague' || relType === 'manager') return 'tier1';
    if (relType === 'customer') return 'tier3';
    return 'tier2';
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const tier = determineTier(data.relationshipType);

      await createReview({
        reviewerId: user.uid,
        revieweeId: data.revieweeId,
        tier,
        relationshipType: data.relationshipType,
        workplace: data.workplace,
        workplacePeriod: {
          start: new Date(data.startDate),
          end: data.endDate ? new Date(data.endDate) : undefined
        },
        starRating: data.starRating,
        badgeTags: data.badgeTags,
        comment: data.comment
      });

      setSuccess(true);

      if (tier === 'tier1') {
        setError('Review submitted! The barista will need to verify your colleague relationship before it counts toward their badges.');
      }

      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-[var(--color-coffee-primary)] font-heading">
          Give a Review
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Help a barista showcase their skills by highlighting what they do best
        </p>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            ✓ Review submitted successfully!
            {relationshipType === 'colleague' || relationshipType === 'manager'
              ? ' The barista will need to verify your colleague relationship.'
              : ''}
          </div>
        )}

        {error && !success && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Search */}
          {!selectedUser ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Who are you reviewing? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                  placeholder="Search by name or email..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={searching}
                  className="bg-[var(--color-coffee-accent)] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map(result => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => selectUser(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-600">
                        {result.currentWorkplace?.cafeName || 'No current workplace'} • {result.location.city}, {result.location.state}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {errors.revieweeId && (
                <p className="text-red-500 text-sm mt-1">{errors.revieweeId.message}</p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-[var(--color-coffee-text)]">{selectedUser.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedUser.currentWorkplace?.position} at {selectedUser.currentWorkplace?.cafeName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setValue('revieweeId', '');
                }}
                className="text-[var(--color-coffee-accent)] hover:underline text-sm font-semibold"
              >
                Change
              </button>
            </div>
          )}

          {selectedUser && (
            <>
              {/* Relationship Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  How do you know them? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('relationshipType')}
                      type="radio"
                      value="colleague"
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">We worked together (Colleague)</div>
                      <div className="text-xs text-gray-600">Highest trust - requires verification</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('relationshipType')}
                      type="radio"
                      value="manager"
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">I was their manager/supervisor</div>
                      <div className="text-xs text-gray-600">Highest trust - requires verification</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('relationshipType')}
                      type="radio"
                      value="industry_peer"
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Industry connection</div>
                      <div className="text-xs text-gray-600">Barista/owner from another shop</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('relationshipType')}
                      type="radio"
                      value="customer"
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">I'm a regular customer</div>
                      <div className="text-xs text-gray-600">Contributes to "Customer Love" badges only</div>
                    </div>
                  </label>
                </div>
                {errors.relationshipType && (
                  <p className="text-red-500 text-sm mt-1">{errors.relationshipType.message}</p>
                )}
              </div>

              {/* Workplace & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label htmlFor="workplace" className="block text-sm font-medium mb-1">
                    Workplace <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('workplace')}
                    type="text"
                    id="workplace"
                    placeholder="Café name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                  />
                  {errors.workplace && (
                    <p className="text-red-500 text-sm mt-1">{errors.workplace.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                    From <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('startDate')}
                    type="month"
                    id="startDate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                    To (leave blank if current)
                  </label>
                  <input
                    {...register('endDate')}
                    type="month"
                    id="endDate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Overall Experience <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setValue('starRating', rating)}
                      className={`text-4xl transition-all ${
                        rating <= starRating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:scale-110`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {starRating === 5 && 'Exceptional - One of the best!'}
                  {starRating === 4 && 'Great - Would highly recommend'}
                  {starRating === 3 && 'Good - Solid performance'}
                  {starRating === 2 && 'Fair - Room for improvement'}
                  {starRating === 1 && 'Needs improvement'}
                </p>
              </div>

              {/* Badge Tags */}
              <div>
                <BadgeSelector
                  selectedBadges={selectedBadges}
                  onChange={(badges) => setValue('badgeTags', badges)}
                  maxSelections={5}
                />
                {errors.badgeTags && (
                  <p className="text-red-500 text-sm mt-2">{errors.badgeTags.message}</p>
                )}
              </div>

              {/* Comment */}
              {starRating >= 4 && (
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium mb-1">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    {...register('comment')}
                    id="comment"
                    rows={4}
                    placeholder="Share specific examples of their excellence..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {watch('comment')?.length || 0}/500 characters
                  </p>
                  {errors.comment && (
                    <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Your comment will be visible to the barista since you rated them 4+ stars
                  </p>
                </div>
              )}

              {starRating < 4 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Reviews under 4 stars focus on badge tags only. Comments won't be shown to the barista to maintain our positive-first approach, but employers can see all feedback.
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Submitting...' : success ? 'Review Submitted!' : 'Submit Review'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
