import { Link } from 'react-router-dom';

const Icon = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={d} />
  </svg>
);

// Thin line icons — restrained, no emoji.
const ICON_SEAL =
  'M12 3l2.4 2.1 3.1-.5.9 3 2.6 1.8-1 3 1 3-2.6 1.8-.9 3-3.1-.5L12 21l-2.4-2.1-3.1.5-.9-3L3 14.6l1-3-1-3 2.6-1.8.9-3 3.1.5L12 3z M9.5 12.2l2 2 3.5-4';
const ICON_QUILL =
  'M4 20l8-8 M12 12l6-6a3 3 0 10-4-4l-6 6 M14 6l4 4';
const ICON_DOOR =
  'M5 21V5a2 2 0 012-2h7a2 2 0 012 2v16 M5 21h12 M13 12h.5';

export const Home = () => {
  return (
    <div className="space-y-28">
      {/* Hero */}
      <section className="pt-12 pb-8">
        <p className="eyebrow mb-6">A professional record · for baristas</p>
        <h1
          className="font-heading text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] max-w-4xl"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          The craft behind
          <span className="italic text-[var(--color-accent)]"> the cup</span>,
          <br />
          quietly kept.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-[var(--color-ink-soft)] leading-relaxed">
          Build a profile that travels with you — your stations, your training, the
          people who&rsquo;ve worked beside you. Designed to sit gracefully alongside
          whichever café you call home.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/signup" className="btn-primary">
            Begin your profile
          </Link>
          <Link to="/jobs" className="btn-ghost">
            Browse positions
          </Link>
        </div>
      </section>

      {/* Three pillars */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-heading text-3xl">What it holds</h2>
          <span className="eyebrow hidden sm:inline">Three pillars</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: ICON_SEAL,
              label: 'Marks of craft',
              body:
                'Quiet badges earned over time — latte work, sourcing, training others — never loud, always specific.',
            },
            {
              icon: ICON_QUILL,
              label: 'Words from peers',
              body:
                'Reviews from the people who actually worked the bar with you. Tiered for credibility, not vanity.',
            },
            {
              icon: ICON_DOOR,
              label: 'Open doors',
              body:
                'A neutral place for cafés to find baristas whose skills fit the room — without the noise of a job board.',
            },
          ].map((card) => (
            <article key={card.label} className="glass p-7 transition-transform hover:-translate-y-0.5">
              <div className="text-[var(--color-ink)] mb-6">
                <Icon d={card.icon} />
              </div>
              <h3 className="font-heading text-xl mb-2">{card.label}</h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works — editorial numbered list */}
      <section>
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-heading text-3xl">How it works</h2>
          <span className="eyebrow hidden sm:inline">Four steps</span>
        </div>

        <ol className="grid md:grid-cols-4 gap-x-8 gap-y-10">
          {[
            { n: 'I', t: 'Set the page', b: 'Sign in and lay out your stations, history, and the way you take coffee seriously.' },
            { n: 'II', t: 'Be seen', b: 'Colleagues and managers leave reviews — weighted by who they are.' },
            { n: 'III', t: 'Earn marks', b: 'Patterns in your reviews surface as quiet, specific badges over time.' },
            { n: 'IV', t: 'Find a room', b: 'Cafés discover you when your craft matches what their bar needs.' },
          ].map((s) => (
            <li key={s.n} className="border-t hairline pt-5">
              <div
                className="font-heading text-[var(--color-accent)] text-2xl mb-3 italic"
                style={{ fontVariationSettings: '"opsz" 144' }}
              >
                {s.n}
              </div>
              <h4 className="font-heading text-lg mb-2">{s.t}</h4>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Closing line */}
      <section className="glass-strong rounded-[14px] px-10 py-14 text-center">
        <p
          className="font-heading italic text-3xl md:text-4xl max-w-3xl mx-auto leading-tight"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          &ldquo;A good barista is remembered. We just gave the memory a place to live.&rdquo;
        </p>
        <p className="eyebrow mt-6">Beyond the Bar · No. 001</p>
      </section>
    </div>
  );
};
