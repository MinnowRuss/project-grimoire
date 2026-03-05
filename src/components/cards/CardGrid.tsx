import type { Article } from '../../lib/types';
import { ArticleCard } from './ArticleCard';
import { SkeletonCard } from './SkeletonCard';

interface CardGridProps {
  articles: Article[];
  loading: boolean;
}

export function CardGrid({ articles, loading }: CardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="font-display text-xl text-parchment mb-2">No Articles Yet</p>
        <p className="font-body text-faded text-sm">
          Subscribe to feeds to start reading.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
