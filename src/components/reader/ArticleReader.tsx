import DOMPurify from 'dompurify';
import type { Article } from '../../lib/types';
import { formatArticleDate, estimateReadTime } from '../../lib/utils';
import { SummaryCallout } from './SummaryCallout';

interface ArticleReaderProps {
  article: Article;
}

export function ArticleReader({ article }: ArticleReaderProps) {
  const feedTitle = article.feed?.title ?? 'Unknown';
  const dateStr = formatArticleDate(article.published_at);
  const readTime = estimateReadTime(article.content || article.summary);
  const htmlContent = article.content || article.summary || '';

  // Sanitize HTML content with DOMPurify to prevent XSS attacks.
  // This is required because RSS feeds contain raw HTML from external sources.
  const sanitizedContent = DOMPurify.sanitize(htmlContent, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'allowfullscreen', 'frameborder'],
  });

  return (
    <article className="min-h-screen bg-void">
      {/* Hero image */}
      {article.thumbnail_url && (
        <div className="relative w-full max-h-[480px] overflow-hidden">
          <img
            src={article.thumbnail_url}
            alt=""
            className="w-full h-full object-cover max-h-[480px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
        </div>
      )}

      {/* Content column */}
      <div className="max-w-[680px] mx-auto px-4 py-8">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-ui text-[11px] tracking-[0.12em] uppercase text-faded">
            {feedTitle}
          </span>
          <span className="text-faded text-[11px]">·</span>
          <span className="font-ui text-[11px] text-faded">{dateStr}</span>
          <span className="text-faded text-[11px]">·</span>
          <span className="font-ui text-[11px] text-faded">{readTime}</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-[34px] leading-[1.2] font-bold text-parchment mb-6">
          {article.title}
        </h1>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-iron" />
          <span className="text-iron text-sm">✦</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-iron" />
        </div>

        {/* Summary callout */}
        {article.is_summary_only && (
          <SummaryCallout articleUrl={article.url} />
        )}

        {/* Article body — sanitized with DOMPurify */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </article>
  );
}
