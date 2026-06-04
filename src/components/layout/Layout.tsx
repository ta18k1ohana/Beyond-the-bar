import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Soft ambient wash behind the glass header */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] -z-10"
        style={{
          background:
            'radial-gradient(60% 80% at 50% 0%, rgba(122, 46, 42, 0.08) 0%, rgba(245, 241, 234, 0) 70%)',
        }}
      />
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};
