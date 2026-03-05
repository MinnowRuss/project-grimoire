interface SummaryCalloutProps {
  articleUrl: string | null;
}

export function SummaryCallout({ articleUrl }: SummaryCalloutProps) {
  return (
    <div className="bg-callout border-l-[3px] border-callout-border p-4 my-6">
      <p className="font-ui text-[11px] tracking-[0.15em] uppercase text-callout-border mb-3">
        Excerpt Only
      </p>
      <p className="font-body text-sm text-faded mb-4">
        This article shows only a summary from the original publisher's feed.
        The full content is available at the source.
      </p>
      {articleUrl && (
        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 bg-gold text-void font-display text-sm font-semibold tracking-[0.08em] rounded-[2px] hover:bg-gold-dark transition-colors duration-200"
        >
          Read Full Article ↗
        </a>
      )}
    </div>
  );
}
