import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/userStore';
import { updatePrivacySettings } from '../services/user.service';

export const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile, fetchUserProfile } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    showAverageRating: false,
    acceptTier3Reviews: true,
    showReviewCount: true
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.uid);
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    if (userProfile?.privacySettings) {
      setSettings(userProfile.privacySettings);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setSaved(false);
      await updatePrivacySettings(user.uid, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-coffee-primary)] font-heading">
            Privacy Settings
          </h1>
          <button
            onClick={() => navigate('/profile')}
            className="text-[var(--color-coffee-accent)] hover:underline font-semibold"
          >
            ← Back to Profile
          </button>
        </div>

        <p className="text-gray-600 mb-8">
          Control what information is visible to others and how you receive reviews.
        </p>

        <div className="space-y-6">
          {/* Show Average Rating */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-[var(--color-coffee-text)] mb-1">
                  Show Average Star Rating Publicly
                </h3>
                <p className="text-sm text-gray-600">
                  When enabled, other baristas can see your average star rating on your public profile.
                  Employers can always see all ratings. Default is OFF to maintain the positive-first
                  approach of the platform.
                </p>
              </div>
              <label className="ml-4 flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.showAverageRating}
                    onChange={(e) =>
                      setSettings({ ...settings, showAverageRating: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`block w-14 h-8 rounded-full transition ${
                      settings.showAverageRating
                        ? 'bg-[var(--color-coffee-accent)]'
                        : 'bg-gray-300'
                    }`}
                  />
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      settings.showAverageRating ? 'transform translate-x-6' : ''
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Accept Customer Reviews */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-[var(--color-coffee-text)] mb-1">
                  Accept Customer Reviews (Tier 3)
                </h3>
                <p className="text-sm text-gray-600">
                  When enabled, regular customers can leave "Customer Love" badges for you. These only
                  count toward customer-specific badges and don't affect employer-facing metrics.
                  Default is ON.
                </p>
              </div>
              <label className="ml-4 flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.acceptTier3Reviews}
                    onChange={(e) =>
                      setSettings({ ...settings, acceptTier3Reviews: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`block w-14 h-8 rounded-full transition ${
                      settings.acceptTier3Reviews
                        ? 'bg-[var(--color-coffee-accent)]'
                        : 'bg-gray-300'
                    }`}
                  />
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      settings.acceptTier3Reviews ? 'transform translate-x-6' : ''
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Show Review Count */}
          <div className="pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-[var(--color-coffee-text)] mb-1">
                  Show Total Review Count
                </h3>
                <p className="text-sm text-gray-600">
                  When enabled, your public profile shows how many reviews you've received. This helps
                  build credibility. Default is ON. Recommended to keep enabled.
                </p>
              </div>
              <label className="ml-4 flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings.showReviewCount}
                    onChange={(e) =>
                      setSettings({ ...settings, showReviewCount: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`block w-14 h-8 rounded-full transition ${
                      settings.showReviewCount
                        ? 'bg-[var(--color-coffee-accent)]'
                        : 'bg-gray-300'
                    }`}
                  />
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      settings.showReviewCount ? 'transform translate-x-6' : ''
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {saved && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              ✓ Settings saved successfully!
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-900 mb-2">👁️ Who Can See What?</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Other Baristas:</strong> See your badges, review count (if enabled), and average rating (if enabled)</p>
            <p><strong>Employers:</strong> See everything - all ratings, comments, and badge tags</p>
            <p><strong>You:</strong> See all badge tags and comments from 4+ star reviews only</p>
          </div>
        </div>
      </div>
    </div>
  );
};
