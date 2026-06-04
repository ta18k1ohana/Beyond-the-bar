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

const levelTone: Record<string, string> = {
  gold: 'text-[var(--color-badge-gold)]',
  silver: 'text-[var(--color-badge-silver)]',
  bronze: 'text-[var(--color-badge-bronze)]',
  legendary: 'text-[var(--color-badge-legendary)]',
};

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
    if (user) fetchUserProfile(user.uid);
  };

  if (!user) {
    return (
      <div className="text-center py-16 text-[var(--color-ink-soft)]">
        Please sign in to view your profile.
      </div>
    );
  }

  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-ink-soft)]">
        Loading profile…
      </div>
    );
  }

  const Stat = ({ value, label }: { value: React.ReactNode; label: string }) => (
    <div className="border-t hairline pt-3 min-w-[5rem]">
      <div
        className="font-heading text-2xl"
        style={{ fontVariationSettings: '"opsz" 144' }}
      >
        {value}
      </div>
      <div className="eyebrow mt-1">{label}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Masthead */}
      <header className="mb-10 pb-10 border-b hairline">
        <div className="flex items-start gap-8 flex-wrap">
          <div className="shrink-0">
            <ProfilePhotoUpload
              userId={user.uid}
              currentPhotoURL={userProfile.profilePhoto}
              onPhotoUpdate={handlePhotoUpdate}
            />
          </div>

          <div className="flex-1 min-w-[260px]">
            <p className="eyebrow mb-2">Profile · No. 001</p>
            <h1
              className="font-heading text-5xl leading-none"
              style={{ fontVariationSettings: '"opsz" 144' }}
            >
              {userProfile.name}
            </h1>

            {userProfile.currentWorkplace && (
              <p className="font-heading italic text-lg text-[var(--color-ink-soft)] mt-3">
                {userProfile.currentWorkplace.position} · {userProfile.currentWorkplace.cafeName}
              </p>
            )}
            <p className="text-sm text-[var(--color-ink-soft)] mt-1">
              {userProfile.location.city}, {userProfile.location.state}
            </p>

            <div className="flex gap-8 mt-6">
              <Stat value={userProfile.badges.length} label="Marks" />
              <Stat value={userProfile.reviewCount} label="Reviews" />
              {userProfile.privacySettings.showAverageRating && userProfile.averageRating > 0 && (
                <Stat value={userProfile.averageRating.toFixed(1)} label="Rating" />
              )}
            </div>
          </div>

          <button
            onClick={() => setEditingBasicInfo(!editingBasicInfo)}
            className="btn-ghost text-sm"
          >
            {editingBasicInfo ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Bio + Philosophy */}
        {!editingBasicInfo ? (
          <div className="mt-10 grid md:grid-cols-2 gap-10">
            {userProfile.bio && (
              <div>
                <p className="eyebrow mb-3">About</p>
                <p className="text-[var(--color-ink)] leading-relaxed">{userProfile.bio}</p>
              </div>
            )}
            {userProfile.coffeePhilosophy && (
              <div>
                <p className="eyebrow mb-3">Philosophy</p>
                <p
                  className="font-heading italic text-xl leading-snug text-[var(--color-ink)]"
                  style={{ fontVariationSettings: '"opsz" 144' }}
                >
                  &ldquo;{userProfile.coffeePhilosophy}&rdquo;
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8">
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-14">
          {/* Marks of craft */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="eyebrow mb-1">Section I</p>
                <h2 className="font-heading text-2xl">Marks of craft</h2>
              </div>
              {userProfile.badges.length > 0 && (
                <Link
                  to="/badges"
                  className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-accent)]"
                >
                  All marks
                </Link>
              )}
            </div>

            {userProfile.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {userProfile.badges.slice(0, 6).map((badge) => (
                  <div key={badge.badgeId} className="card p-5">
                    <p className={`eyebrow ${levelTone[badge.level] ?? ''}`}>{badge.level}</p>
                    <p className="font-heading text-base mt-1.5">{badge.badgeId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <p className="text-[var(--color-ink-soft)] mb-5">
                  No marks yet. Ask a colleague for a review.
                </p>
                <Link to="/badges" className="btn-ghost text-sm">Browse the catalogue</Link>
              </div>
            )}
          </section>

          {/* Work history */}
          <section>
            <p className="eyebrow mb-1">Section II</p>
            <h2 className="font-heading text-2xl mb-6">Where you&rsquo;ve poured</h2>
            <div className="card p-6">
              <WorkHistoryManager
                userId={user.uid}
                workHistory={userProfile.workHistory}
                currentWorkplace={userProfile.currentWorkplace}
                onUpdate={handleRefresh}
              />
            </div>
          </section>

          {/* Certifications */}
          <section>
            <p className="eyebrow mb-1">Section III</p>
            <h2 className="font-heading text-2xl mb-6">Training & papers</h2>
            <div className="card p-6">
              <CertificationManager
                userId={user.uid}
                certifications={userProfile.certifications}
                onUpdate={handleRefresh}
              />
            </div>
          </section>

          {/* Reviews */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="eyebrow mb-1">Section IV</p>
                <h2 className="font-heading text-2xl">Words from peers</h2>
              </div>
              <Link
                to="/give-review"
                className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-accent)]"
              >
                Write one
              </Link>
            </div>
            <div className="card p-6">
              <ReviewList userId={user.uid} isOwner={true} limit={5} />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <ProfileCompletion user={userProfile} />

          <div className="card p-6">
            <p className="eyebrow mb-4">Do</p>
            <div className="space-y-2.5">
              <Link to="/give-review" className="btn-primary w-full block text-center">
                Give a review
              </Link>
              {pendingVerificationCount > 0 && (
                <Link to="/verify-reviews" className="btn-ghost w-full block text-center relative">
                  Verify reviews
                  <span className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-[var(--color-paper)] text-[10px] tracking-wider px-1.5 py-0.5 rounded-full">
                    {pendingVerificationCount}
                  </span>
                </Link>
              )}
              <Link to="/settings" className="btn-ghost w-full block text-center">
                Privacy
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <p className="eyebrow mb-3">Coming</p>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              A quiet record of who&rsquo;s read your page — soon.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
