import { useArticles } from '../hooks/useArticles';
import { useFeeds } from '../hooks/useFeeds';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { CardGrid } from '../components/cards/CardGrid';

export function HomePage() {
  const { articles, loading, fetchArticles } = useArticles();
  const { refreshFeeds } = useFeeds();

  const handleRefresh = async () => {
    await refreshFeeds();
    await fetchArticles();
  };

  const { pullDistance, refreshing, progress } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  return (
    <div>
      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || refreshing) && (
        <div
          className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
          style={{ height: refreshing ? 48 : pullDistance * 0.6 }}
        >
          <div
            className="w-6 h-6 border-2 border-gold rounded-full"
            style={{
              borderTopColor: 'transparent',
              transform: refreshing ? undefined : `rotate(${progress * 360}deg)`,
              animation: refreshing ? 'spin 0.8s linear infinite' : undefined,
              opacity: Math.min(1, progress * 1.5),
            }}
          />
        </div>
      )}
      <CardGrid articles={articles} loading={loading} />
    </div>
  );
}
