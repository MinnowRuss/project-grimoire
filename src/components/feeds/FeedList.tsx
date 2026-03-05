import type { Feed } from '../../lib/types';
import { FeedListItem } from './FeedListItem';

interface FeedListProps {
  feeds: Feed[];
  onRemove: (id: string) => void;
}

export function FeedList({ feeds, onRemove }: FeedListProps) {
  if (feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 text-center">
        <p className="font-display text-lg text-parchment mb-2">No Feeds Yet</p>
        <p className="font-body text-sm text-faded">
          Add your first feed to start reading.
        </p>
      </div>
    );
  }

  return (
    <div>
      {feeds.map((feed) => (
        <FeedListItem key={feed.id} feed={feed} onRemove={onRemove} />
      ))}
    </div>
  );
}
