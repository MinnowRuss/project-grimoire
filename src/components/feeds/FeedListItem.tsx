import type { Feed } from '../../lib/types';
import { getFeedInitial } from '../../lib/utils';

interface FeedListItemProps {
  feed: Feed;
  onRemove: (id: string) => void;
}

export function FeedListItem({ feed, onRemove }: FeedListItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-iron">
      <div className="flex items-center gap-3">
        {/* Avatar initial */}
        <div className="w-8 h-8 rounded-[2px] bg-ash border border-iron flex items-center justify-center">
          <span className="font-display text-xs text-gold">
            {getFeedInitial(feed.title)}
          </span>
        </div>
        <span className="font-ui text-sm text-parchment">{feed.title}</span>
      </div>

      <button
        onClick={() => onRemove(feed.id)}
        className="text-faded hover:text-crimson-text transition-colors duration-200 p-1"
        aria-label={`Remove ${feed.title}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
