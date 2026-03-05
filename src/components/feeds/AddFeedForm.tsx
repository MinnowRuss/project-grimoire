import { useState } from 'react';

interface AddFeedFormProps {
  onSubmit: (url: string) => Promise<{ success: boolean; error?: string }>;
}

export function AddFeedForm({ onSubmit }: AddFeedFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL.');
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      setError("That doesn't look like a valid URL.");
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(trimmed);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Something went wrong.');
    } else {
      setUrl('');
    }
  };

  const hasError = error !== null;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="font-display text-xl font-semibold text-gold mb-1">
        Add Feed
      </h2>
      <p className="font-body text-sm text-faded mb-4">
        Paste an RSS or Atom feed URL below.
      </p>

      <input
        type="text"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) setError(null);
        }}
        placeholder="https://example.com/feed.xml"
        className={`w-full px-4 py-3 bg-crypt border rounded-[2px] font-ui text-sm text-parchment placeholder:text-faded/50 transition-colors duration-150 focus:outline-none ${
          hasError
            ? 'border-blood bg-[rgba(107,17,17,0.15)]'
            : 'border-iron focus:border-gold'
        }`}
        disabled={submitting}
      />

      {/* Error callout */}
      {hasError && (
        <div className="mt-2">
          <p className="font-ui text-[13px] text-crimson-text flex items-start gap-1.5">
            <span className="mt-px">⚠</span>
            <span>{error}</span>
          </p>
          <p className="font-body text-[13px] text-faded mt-1 ml-5">
            Try a feed URL like:{' '}
            <span className="text-faded/80">https://example.com/feed.xml</span>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-4 py-3 bg-gold text-void font-display text-sm font-semibold tracking-[0.08em] uppercase rounded-[2px] hover:bg-gold-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
