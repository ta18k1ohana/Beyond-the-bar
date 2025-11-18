import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/userStore';
import { ProfileCompletion } from '../components/profile/ProfileCompletion';
import { EditBasicInfo } from '../components/profile/EditBasicInfo';
import { WorkHistoryManager } from '../components/profile/WorkHistoryManager';
import { CertificationManager } from '../components/profile/CertificationManager';
import { ProfilePhotoUpload } from '../components/profile/ProfilePhotoUpload';
import { ReviewList } from '../components/reviews/ReviewList';
import { getPendingVerifications } from '../services/review.service';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { userProfile, fetchUserProfile, loading } = useUserStore();
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [pendingVerificationCount, setPendingVerificationCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.uid);
      loadPendingVerifications();
    }
  }, [user, fetchUserProfile]);

  const loadPendingVerifications = async () => {
    if (!user) return;
    try {
      const pending = await getPendingVerifications(user.uid);
      setPendingVerificationCount(pending.length);
    } catch (error) {
      console.error('Error loading pending verifications:', error);
    }
  };

  const handleRefresh = () => {
    if (user) {
      fetchUserProfile(user.uid);
      loadPendingVerifications();
    }
  };

  const handlePhotoUpdate = (_newPhotoURL: string) => {
    // Refresh profile to show new photo
    if (user) {
      fetchUserProfile(user.uid);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Profile Photo Upload */}
            <div className="mb-6">
              <ProfilePhotoUpload
                userId={user.uid}
                currentPhotoURL={userProfile.profilePhoto}
                onPhotoUpdate={handlePhotoUpdate}
              />
            </div>

            <div className="flex items-start gap-6">
              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[var(--color-coffee-primary)] font-heading">
                  {userProfile.name}
                </h1>
                {userProfile.currentWorkplace && (
                  <p className="text-lg text-gray-700 mt-1">
                    {userProfile.currentWorkplace.position} at {userProfile.currentWorkplace.cafeName}
                  </p>
                )}
                <p className="text-gray-600 mt-1">
                  📍 {userProfile.location.city}, {userProfile.location.state}
                </p>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div>
                    <span className="font-bold text-[var(--color-coffee-primary)]">
                      {userProfile.badges.length}
                    </span>
                    <span className="text-gray-600 text-sm ml-1">Badges</span>
                  </div>
                  <div>
                    <span className="font-bold text-[var(--color-coffee-primary)]">
                      {userProfile.reviewCount}
                    </span>
                    <span className="text-gray-600 text-sm ml-1">Reviews</span>
                  </div>
                  {userProfile.privacySettings.showAverageRating && userProfile.averageRating > 0 && (
                    <div>
                      <span className="font-bold text-[var(--color-coffee-primary)]">
                        {userProfile.averageRating.toFixed(1)} ⭐
                      </span>
                      <span className="text-gray-600 text-sm ml-1">Rating</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditingBasicInfo(!editingBasicInfo)}
                className="text-[var(--color-coffee-accent)] hover:underline font-semibold"
              >
                {editingBasicInfo ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Bio & Philosophy */}
            {!editingBasicInfo ? (
              <div className="mt-6 space-y-4">
                {userProfile.bio && (
                  <div>
                    <h3 className="font-bold text-[var(--color-coffee-text)] mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
                  </div>
                )}

                {userProfile.coffeePhilosophy && (
                  <div>
                    <h3 className="font-bold text-[var(--color-coffee-text)] mb-2">Coffee Philosophy</h3>
                    <p className="text-gray-700 italic leading-relaxed">"{userProfile.coffeePhilosophy}"</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6">
                <EditBasicInfo
                  userId={user.uid}
                  initialData={{
                    bio: userProfile.bio || '',
                    coffeePhilosophy: userProfile.coffeePhilosophy || '',
                    location: userProfile.location
                  }}
                  onSave={() => {
                    setEditingBasicInfo(false);
                    handleRefresh();
                  }}
                  onCancel={() => setEditingBasicInfo(false)}
                />
              </div>
            )}
          </div>

          {/* Badges Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[var(--color-coffee-primary)] font-heading">
                Your Badges
              </h2>
              {userProfile.badges.length > 0 && (
                <Link
                  to="/badges"
                  className="text-[var(--color-coffee-accent)] hover:underline text-sm font-semibold"
                >
                  View All Badges →
                </Link>
              )}
            </div>

            {userProfile.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userProfile.badges.slice(0, 6).map((badge) => (
                  <div
                    key={badge.badgeId}
                    className={`p-4 rounded-lg border-2 text-center ${
                      badge.level === 'gold'
                        ? 'border-yellow-400 bg-yellow-50'
                        : badge.level === 'silver'
                        ? 'border-gray-400 bg-gray-50'
                        : badge.level === 'bronze'
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-purple-400 bg-purple-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs font-semibold text-gray-700">{badge.badgeId}</div>
                    <div className="text-xs text-gray-600 capitalize mt-1">{badge.level}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  You haven't earned any badges yet. Start by asking colleagues for reviews!
                </p>
                <Link
                  to="/badges"
                  className="inline-block bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Explore Badges
                </Link>
              </div>
            )}
          </div>

          {/* Work History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <WorkHistoryManager
              userId={user.uid}
              workHistory={userProfile.workHistory}
              currentWorkplace={userProfile.currentWorkplace}
              onUpdate={handleRefresh}
            />
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <CertificationManager
              userId={user.uid}
              certifications={userProfile.certifications}
              onUpdate={handleRefresh}
            />
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[var(--color-coffee-primary)] font-heading">
                Reviews
              </h2>
              <Link
                to="/give-review"
                className="text-[var(--color-coffee-accent)] hover:underline text-sm font-semibold"
              >
                + Add Review for Someone
              </Link>
            </div>
            <ReviewList userId={user.uid} isOwner={true} limit={5} />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <ProfileCompletion user={userProfile} />

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/give-review"
                className="block w-full bg-[var(--color-coffee-primary)] text-white text-center px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Give a Review
              </Link>
              {pendingVerificationCount > 0 && (
                <Link
                  to="/verify-reviews"
                  className="block w-full bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] text-center px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity relative"
                >
                  Verify Reviews
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingVerificationCount}
                  </span>
                </Link>
              )}
              <Link
                to="/settings"
                className="block w-full bg-gray-200 text-gray-700 text-center px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Privacy Settings
              </Link>
            </div>
          </div>

          {/* Profile Views (Future) */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading mb-2">
              Profile Insights
            </h3>
            <p className="text-gray-600 text-sm">
              Coming soon: See who's viewed your profile and track your visibility in the community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
