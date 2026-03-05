import { Link } from 'react-router-dom';
import type { Article } from '../../lib/types';
import { formatArticleDate, truncateText } from '../../lib/utils';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const feedTitle = article.feed?.title ?? 'Unknown';
  const dateStr = formatArticleDate(article.published_at);
  const rawExcerpt = article.summary || article.content || '';
  const excerpt = rawExcerpt.replace(/<[^>]*>/g, '');

  return (
    <Link
      to={`/article/${article.id}`}
      className="group block bg-crypt border border-iron rounded-[2px] overflow-hidden transition-all duration-200 hover:border-gold hover:shadow-[0_4px_24px_rgba(200,168,75,0.12)] active:scale-[0.98] active:transition-transform active:duration-100"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {article.thumbnail_url ? (
          <img
            src={article.thumbnail_url}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-ash" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80" />
      </div>

      {/* Divider */}
      <hr className="border-iron m-0" />

      {/* Content */}
      <div className="p-4">
        {/* Source + Date */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-ui text-[11px] tracking-[0.12em] uppercase text-faded">
            {feedTitle}
          </span>
          <span className="text-faded text-[11px]">·</span>
          <span className="font-ui text-[11px] text-faded">
            {dateStr}
          </span>
        </div>

        {/* Headline */}
        <h2
          className={`font-display text-lg leading-snug mb-2 transition-opacity duration-200 ${
            article.is_read ? 'opacity-60' : 'text-parchment'
          }`}
        >
          {article.title}
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="font-body text-[13px] leading-relaxed text-faded line-clamp-2">
            {truncateText(excerpt, 140)}
          </p>
        )}

        {/* Unread indicator */}
        {!article.is_read && (
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="font-ui text-[11px] tracking-[0.08em] uppercase text-gold">
              Unread
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
