import { useNavigate, Link } from 'react-router-dom';
import { useFeeds } from '../hooks/useFeeds';
import { AddFeedForm } from '../components/feeds/AddFeedForm';

export function AddFeedPage() {
  const navigate = useNavigate();
  const { addFeed } = useFeeds();

  const handleSubmit = async (url: string) => {
    const result = await addFeed(url);
    if (result.success) {
      navigate('/app/feeds');
    }
    return result;
  };

  return (
    <>
      {/* Add feed nav bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 h-12 bg-crypt border-b border-iron">
        <Link to="/app/feeds" className="font-ui text-sm text-gold hover:text-parchment transition-colors">
          ← Back
        </Link>
        <span className="font-display text-[11px] tracking-[0.12em] uppercase text-faded">
          Add Feed
        </span>
        <div className="w-12" />
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8">
        <AddFeedForm onSubmit={handleSubmit} />
      </div>
    </>
  );
}
