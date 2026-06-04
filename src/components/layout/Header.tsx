import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStore } from '../../store/userStore';
import { signOut } from '../../services/auth.service';
import { NotificationBell } from '../notifications/NotificationBell';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'text-sm tracking-wide transition-colors',
    isActive ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]',
  ].join(' ');

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
    <header className="sticky top-0 z-40">
      <div className="glass-strong border-b hairline">
        <nav className="w-full max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2 group">
            <span
              className="font-heading text-xl tracking-tight"
              style={{ fontVariationSettings: '"opsz" 144' }}
            >
              Beyond the Bar
            </span>
            <span className="eyebrow hidden sm:inline">est. 2026</span>
          </Link>

          <div className="flex items-center gap-7">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/badges" className={navLinkClass}>Craft</NavLink>
            <NavLink to="/jobs" className={navLinkClass}>Positions</NavLink>

            {userProfile?.type === 'employer' && (
              <NavLink to="/analytics" className={navLinkClass}>Analytics</NavLink>
            )}

            {user ? (
              <>
                <NotificationBell />
                <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                <button onClick={handleSignOut} className="btn-ghost text-sm">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>Log in</NavLink>
                <Link to="/signup" className="btn-primary text-sm">
                  Join
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
