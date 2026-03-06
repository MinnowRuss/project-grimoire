import { Link } from 'react-router-dom';
import { useFeeds } from '../hooks/useFeeds';
import { FeedList } from '../components/feeds/FeedList';

export function FeedsPage() {
  const { feeds, removeFeed } = useFeeds();

  return (
    <>
      {/* Feeds nav bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 h-12 bg-crypt border-b border-iron">
        <Link to="/app" className="font-ui text-sm text-gold hover:text-parchment transition-colors">
          ← Back
        </Link>
        <span className="font-ui text-[11px] tracking-[0.12em] uppercase text-faded">
          My Feeds
        </span>
        <Link
          to="/app/feeds/add"
          className="font-ui text-sm text-gold hover:text-parchment transition-colors tracking-[0.05em] uppercase"
        >
          Add Feed
        </Link>
      </nav>

      <FeedList feeds={feeds} onRemove={removeFeed} />
    </>
  );
}
