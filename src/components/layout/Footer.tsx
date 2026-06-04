export const Footer = () => {
  return (
    <footer className="mt-24 border-t hairline">
      <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-heading text-lg mb-3">Beyond the Bar</h3>
          <p className="text-sm text-[var(--color-ink-soft)] max-w-xs">
            A quiet record of the craft — for the people behind the espresso machine.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
            <li><a href="/about" className="hover:text-[var(--color-ink)] transition-colors">About</a></li>
            <li><a href="/jobs" className="hover:text-[var(--color-ink)] transition-colors">Positions</a></li>
            <li><a href="/badges" className="hover:text-[var(--color-ink)] transition-colors">The Craft</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Legal</p>
          <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
            <li><a href="/privacy" className="hover:text-[var(--color-ink)] transition-colors">Privacy</a></li>
            <li><a href="/terms" className="hover:text-[var(--color-ink)] transition-colors">Terms</a></li>
            <li><a href="/contact" className="hover:text-[var(--color-ink)] transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t hairline">
        <div className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-xs text-[var(--color-ink-soft)]">
          <span>&copy; {new Date().getFullYear()} Beyond the Bar</span>
          <span className="eyebrow">No.&nbsp;001</span>
        </div>
      </div>
    </footer>
  );
};
