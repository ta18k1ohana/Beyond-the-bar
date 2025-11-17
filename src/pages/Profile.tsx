import { useAuth } from '../contexts/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-[var(--color-coffee-accent)] rounded-full flex items-center justify-center text-3xl text-white">
            {user.displayName?.charAt(0).toUpperCase() || '👤'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-coffee-primary)] font-heading">
              {user.displayName || 'User'}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-coffee-primary)] font-heading">
            Your Badges
          </h2>
          <p className="text-gray-600">
            Start earning badges by getting reviews from colleagues and managers!
          </p>
          {/* Badge display will be implemented in later phases */}
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-coffee-primary)] font-heading">
            Work History
          </h2>
          <p className="text-gray-600">
            Add your work experience to showcase your journey in the coffee industry.
          </p>
          {/* Work history form will be implemented in later phases */}
        </div>
      </div>
    </div>
  );
};
