import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export function formatArticleDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);

  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: false }) + ' ago';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMM d');
}

export function estimateReadTime(content: string | null): string {
  if (!content) return '1 min read';
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 238));
  return `${minutes} min read`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function getFeedInitial(title: string): string {
  return title.charAt(0).toUpperCase();
}
