export interface Feed {
  id: string;
  url: string;
  title: string;
  description: string | null;
  favicon_url: string | null;
  last_fetched_at: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  feed_id: string;
  guid: string;
  title: string;
  url: string | null;
  author: string | null;
  published_at: string | null;
  thumbnail_url: string | null;
  summary: string | null;
  content: string | null;
  is_summary_only: boolean;
  is_read: boolean;
  created_at: string;
  // Joined from feeds table
  feed?: Feed;
}
