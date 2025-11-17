export const Footer = () => {
  return (
    <footer className="bg-[var(--color-coffee-text)] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Beyond The Bar</h3>
            <p className="text-sm text-gray-300">
              Empowering baristas to showcase their skills and connect with opportunities.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 font-heading">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/about" className="hover:text-[var(--color-coffee-accent)] transition-colors">About</a></li>
              <li><a href="/jobs" className="hover:text-[var(--color-coffee-accent)] transition-colors">Job Board</a></li>
              <li><a href="/badges" className="hover:text-[var(--color-coffee-accent)] transition-colors">Badge System</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 font-heading">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/privacy" className="hover:text-[var(--color-coffee-accent)] transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[var(--color-coffee-accent)] transition-colors">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-[var(--color-coffee-accent)] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Beyond The Bar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
