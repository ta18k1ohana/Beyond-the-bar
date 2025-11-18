import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStore } from '../../store/userStore';
import { signOut } from '../../services/auth.service';
import { NotificationBell } from '../notifications/NotificationBell';

export const Header = () => {
  const { user } = useAuth();
  const { userProfile } = useUserStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-[var(--color-coffee-primary)] text-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span className="text-xl font-bold font-heading">Beyond The Bar</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-[var(--color-coffee-accent)] transition-colors">
              Home
            </Link>
            <Link to="/badges" className="hover:text-[var(--color-coffee-accent)] transition-colors">
              Badges
            </Link>
            <Link to="/jobs" className="hover:text-[var(--color-coffee-accent)] transition-colors">
              Jobs
            </Link>

            {userProfile?.type === 'employer' && (
              <Link to="/analytics" className="hover:text-[var(--color-coffee-accent)] transition-colors">
                Analytics
              </Link>
            )}

            {user ? (
              <>
                <NotificationBell />
                <Link
                  to="/profile"
                  className="hover:text-[var(--color-coffee-accent)] transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-[var(--color-coffee-accent)] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
