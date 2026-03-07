import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-void text-parchment flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <h1 className="font-ornament font-bold text-[40px] text-parchment tracking-[0.15em] mb-3">
          Grimoire
        </h1>
        <p className="font-body text-[24px] text-faded italic mb-12 text-center max-w-md">
          A dark, beautiful RSS reader. Yours alone.
        </p>

        {/* Feature bullets */}
        <div className="w-full max-w-md space-y-8 mb-14">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-gold text-2xl leading-none">⊛</span>
            <div>
              <p className="font-display text-sm tracking-wide text-parchment">
                Subscribe to Any Feed
              </p>
              <p className="font-body text-sm text-faded mt-1">
                Add RSS or Atom feeds from your favorite sites. Your reading
                list, curated by you.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-gold text-2xl leading-none">⊛</span>
            <div>
              <p className="font-display text-sm tracking-wide text-parchment">
                Private &amp; Personal
              </p>
              <p className="font-body text-sm text-faded mt-1">
                Your subscriptions are yours alone. No algorithms, no tracking,
                no ads.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/login"
          className="px-10 py-3 bg-gold text-void font-display text-sm font-semibold tracking-[0.08em] uppercase rounded-[2px] hover:bg-gold-dark transition-colors duration-200"
        >
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="border-t border-iron px-4 py-6 flex flex-col items-center gap-2">
        <p className="font-ui text-xs text-faded">
          &copy; {new Date().getFullYear()} Grimoire
        </p>
        <Link
          to="/privacy"
          className="font-ui text-xs text-faded hover:text-gold transition-colors"
        >
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
