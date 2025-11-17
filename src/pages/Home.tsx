import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-[var(--color-coffee-primary)] mb-6 font-heading">
          Beyond The Bar
        </h1>
        <p className="text-xl text-[var(--color-coffee-text)] mb-8 max-w-2xl mx-auto">
          Showcase your barista skills, earn recognition through badges,
          and connect with opportunities in the coffee community.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Create Your Profile
          </Link>
          <Link
            to="/jobs"
            className="bg-[var(--color-coffee-primary)] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2 text-[var(--color-coffee-primary)] font-heading">
            Badge System
          </h3>
          <p className="text-[var(--color-coffee-text)]">
            Earn Bronze, Silver, Gold, and Legendary badges for your expertise.
            From Latte Art Wizard to Espresso Alchemist.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-xl font-bold mb-2 text-[var(--color-coffee-primary)] font-heading">
            Peer Recognition
          </h3>
          <p className="text-[var(--color-coffee-text)]">
            Get recognized by colleagues, managers, and industry professionals.
            Build your reputation through verified reviews.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-xl font-bold mb-2 text-[var(--color-coffee-primary)] font-heading">
            Job Matching
          </h3>
          <p className="text-[var(--color-coffee-text)]">
            Connect with cafés looking for baristas with your specific skills.
            Find opportunities that match your expertise.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-[var(--color-coffee-primary)] font-heading">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[var(--color-coffee-accent)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h4 className="font-bold mb-2 font-heading">Create Profile</h4>
            <p className="text-sm text-[var(--color-coffee-text)]">
              Sign up and showcase your work history and experience
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[var(--color-coffee-accent)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h4 className="font-bold mb-2 font-heading">Get Reviewed</h4>
            <p className="text-sm text-[var(--color-coffee-text)]">
              Receive reviews and badge tags from colleagues and managers
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[var(--color-coffee-accent)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h4 className="font-bold mb-2 font-heading">Earn Badges</h4>
            <p className="text-sm text-[var(--color-coffee-text)]">
              Unlock badges as you accumulate tags in different skills
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[var(--color-coffee-accent)] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              4
            </div>
            <h4 className="font-bold mb-2 font-heading">Get Hired</h4>
            <p className="text-sm text-[var(--color-coffee-text)]">
              Connect with cafés seeking baristas with your expertise
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
