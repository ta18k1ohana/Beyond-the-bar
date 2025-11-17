export const Jobs = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-[var(--color-coffee-primary)] font-heading">
        Job Board
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Location (city, state)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Position"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          />
          <button className="bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Search
          </button>
        </div>
      </div>

      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 text-lg">
          Job listings coming soon! Employers will be able to post positions and search for baristas by their badges and skills.
        </p>
      </div>
    </div>
  );
};
