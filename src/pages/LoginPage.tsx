import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { session, loading, signInWithMagicLink, signInWithGoogle } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/app';

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to app (or intended destination)
  if (!loading && session) {
    return <Navigate to={from} replace />;
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    const result = await signInWithMagicLink(trimmed);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setMagicLinkSent(true);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center px-4">
      {/* Title */}
      <h1 className="font-ornament text-3xl text-parchment tracking-[0.15em] mb-2">
        Grimoire
      </h1>

      {/* Tagline */}
      <p className="font-body text-sm text-faded mb-10 text-center italic">
        A dark, beautiful RSS reader. Yours alone.
      </p>

      <div className="w-full max-w-sm">
        {magicLinkSent ? (
          /* Success state after magic link sent */
          <div className="text-center">
            <p className="font-display text-lg text-gold mb-2">Check Your Email</p>
            <p className="font-body text-sm text-faded">
              We sent a magic link to{' '}
              <span className="text-parchment">{email}</span>. Click it to enter.
            </p>
            <button
              onClick={() => setMagicLinkSent(false)}
              className="mt-6 font-ui text-sm text-gold hover:text-parchment transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            {/* Magic link form */}
            <form onSubmit={handleMagicLink}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 bg-crypt border rounded-[2px] font-ui text-sm text-parchment placeholder:text-faded/50 transition-colors duration-150 focus:outline-none ${
                  error
                    ? 'border-blood bg-[rgba(107,17,17,0.15)]'
                    : 'border-iron focus:border-gold'
                }`}
                disabled={submitting}
                autoFocus
              />

              {/* Error callout */}
              {error && (
                <div className="mt-2">
                  <p className="font-ui text-[13px] text-crimson-text flex items-start gap-1.5">
                    <span className="mt-px">⚠</span>
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3 bg-gold text-void font-display text-sm font-semibold tracking-[0.08em] uppercase rounded-[2px] hover:bg-gold-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <hr className="flex-1 border-iron" />
              <span className="font-ui text-[11px] tracking-[0.12em] uppercase text-faded">
                or
              </span>
              <hr className="flex-1 border-iron" />
            </div>

            {/* Google OAuth button */}
            <button
              onClick={handleGoogle}
              className="w-full py-3 bg-crypt border border-iron text-parchment font-ui text-sm tracking-[0.05em] rounded-[2px] hover:border-gold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
