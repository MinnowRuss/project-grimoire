import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { ArticleReader } from '../components/reader/ArticleReader';
import { ReadingProgress } from '../components/reader/ReadingProgress';
import type { Article } from '../lib/types';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { getArticle, markAsRead } = useArticles();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      const data = await getArticle(id!);
      if (!cancelled) {
        setArticle(data);
        setLoading(false);
        if (data && !data.is_read) {
          markAsRead(data.id);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-ui text-sm text-faded">Loading...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="font-display text-lg text-parchment mb-2">Article Not Found</p>
        <Link to="/app" className="font-ui text-sm text-gold hover:underline">
          ← Back to feed
        </Link>
      </div>
    );
  }

  const feedTitle = article.feed?.title ?? 'Unknown';

  return (
    <>
      <ReadingProgress />
      {/* Reader nav bar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 h-12 bg-crypt border-b border-iron">
        <Link to="/app" className="font-ui text-sm text-gold hover:text-parchment transition-colors">
          ← Back
        </Link>
        <span className="font-ui text-[11px] tracking-[0.12em] uppercase text-faded">
          {feedTitle}
        </span>
        {article.url ? (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-sm text-gold hover:text-parchment transition-colors"
          >
            Open ↗
          </a>
        ) : (
          <div className="w-12" />
        )}
      </nav>
      <ArticleReader article={article} />
    </>
  );
}
