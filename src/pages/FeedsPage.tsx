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
          ← BACK
        </Link>
        <span className="font-display text-[11px] tracking-[0.15em] uppercase text-faded">
          My Grimoire
        </span>
        <Link
          to="/app/feeds/add"
          className="flex items-center gap-1 font-ui text-sm text-gold hover:text-parchment transition-colors tracking-[0.05em] uppercase"
        >
          <span className="text-base leading-none">+</span>
          <span>Add Feed</span>
        </Link>
      </nav>

      <FeedList feeds={feeds} onRemove={removeFeed} />
    </>
  );
}
