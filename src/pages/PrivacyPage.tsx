import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-void text-parchment">
      {/* Header */}
      <header className="border-b border-iron px-4 py-4 flex items-center justify-between max-w-2xl mx-auto">
        <Link
          to="/"
          className="font-ornament text-lg text-parchment tracking-[0.12em] hover:text-gold transition-colors"
        >
          Grimoire
        </Link>
        <Link
          to="/login"
          className="font-ui text-sm text-gold hover:text-parchment transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-display text-2xl tracking-wide mb-2">
          Privacy Policy
        </h1>
        <p className="font-ui text-xs text-faded mb-10">
          Last updated: March 6, 2026
        </p>

        <div className="space-y-8 font-body text-[15px] leading-relaxed text-parchment/90">
          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Overview
            </h2>
            <p>
              Grimoire is a personal RSS reader. We are committed to protecting
              your privacy and handling your data responsibly. This policy
              explains what information we collect, how we use it, and your
              rights regarding that information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Information We Collect
            </h2>
            <p className="mb-3">
              When you create an account and use Grimoire, we collect the
              following information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-parchment/80">
              <li>
                <strong className="text-parchment">Account information:</strong>{' '}
                Your email address, and if you sign in with Google, your name
                and profile picture as provided by Google.
              </li>
              <li>
                <strong className="text-parchment">Feed subscriptions:</strong>{' '}
                The URLs of RSS and Atom feeds you subscribe to, and the
                articles fetched from those feeds.
              </li>
              <li>
                <strong className="text-parchment">Usage data:</strong> Basic
                information such as when you last accessed the service, used
                solely to maintain your account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              How We Use Your Information
            </h2>
            <p>
              Your information is used exclusively to provide and maintain the
              Grimoire service. Specifically, we use your email address for
              authentication, your feed subscriptions to fetch and display
              articles, and basic usage data to maintain the service. We do not
              use your data for advertising, analytics profiling, or any
              purpose beyond operating the service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Data Storage &amp; Security
            </h2>
            <p>
              Your data is stored securely using{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                Supabase
              </a>
              , a trusted cloud database platform. All data is transmitted over
              encrypted connections (HTTPS/TLS). Access to your data is
              restricted to your authenticated account through row-level
              security policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Third-Party Services
            </h2>
            <p className="mb-3">Grimoire uses the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 text-parchment/80">
              <li>
                <strong className="text-parchment">Google OAuth:</strong> If
                you choose to sign in with Google, we receive your name, email
                address, and profile picture from Google. We do not access any
                other Google account data.
              </li>
              <li>
                <strong className="text-parchment">Supabase:</strong> Provides
                our database and authentication infrastructure.
              </li>
              <li>
                <strong className="text-parchment">Vercel:</strong> Hosts the
                Grimoire web application.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Data Sharing
            </h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties. Your feed subscriptions and reading
              data are private and visible only to you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Your Rights
            </h2>
            <p>
              You may request deletion of your account and all associated data
              at any time by contacting us. You can also remove individual feed
              subscriptions and their associated articles directly within the
              application.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Cookies
            </h2>
            <p>
              Grimoire uses only essential cookies and local storage required
              for authentication and maintaining your session. We do not use
              tracking cookies or third-party analytics.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Any changes
              will be reflected on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg tracking-wide text-parchment mb-3">
              Contact
            </h2>
            <p>
              If you have questions about this privacy policy or your data,
              please contact us at{' '}
              <a
                href="mailto:privacy@russrenshaw.com"
                className="text-gold hover:underline"
              >
                privacy@russrenshaw.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-iron px-4 py-6 flex flex-col items-center gap-2 max-w-2xl mx-auto">
        <p className="font-ui text-xs text-faded">
          &copy; {new Date().getFullYear()} Grimoire
        </p>
        <Link
          to="/"
          className="font-ui text-xs text-faded hover:text-gold transition-colors"
        >
          Back to Home
        </Link>
      </footer>
    </div>
  );
}
