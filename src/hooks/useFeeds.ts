import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Feed } from '../lib/types';

export function useFeeds() {
  const { user } = useAuth();
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = useCallback(async () => {
    if (!user?.id) {
      setFeeds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error: err } = await supabase
      .from('feeds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setFeeds(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const addFeed = async (feedUrl: string): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: 'You must be logged in to add feeds.' };
    }

    try {
      // Call the Edge Function to fetch and parse the feed
      const { data: fnData, error: fnError } = await supabase.functions.invoke('fetch-feed', {
        body: { url: feedUrl },
      });

      if (fnError) {
        return { success: false, error: fnError.message };
      }

      if (!fnData?.feed) {
        return { success: false, error: 'Could not parse feed. Check the URL and try again.' };
      }

      // Insert the feed
      const { data: feedData, error: feedError } = await supabase
        .from('feeds')
        .insert({
          url: feedUrl,
          title: fnData.feed.title,
          description: fnData.feed.description || null,
          favicon_url: fnData.feed.favicon_url || null,
          user_id: user.id,
          last_fetched_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (feedError) {
        if (feedError.code === '23505') {
          return { success: false, error: 'You are already subscribed to this feed.' };
        }
        return { success: false, error: feedError.message };
      }

      // Insert articles
      if (fnData.articles?.length > 0) {
        const articles = fnData.articles.map((article: Record<string, unknown>) => ({
          feed_id: feedData.id,
          guid: article.guid || article.url || article.title,
          title: article.title || 'Untitled',
          url: article.url || null,
          author: article.author || null,
          published_at: article.published_at || null,
          thumbnail_url: article.thumbnail_url || null,
          summary: article.summary || null,
          content: article.content || null,
          is_summary_only: !article.content || (article.content as string).length < 200,
        }));

        await supabase.from('articles').insert(articles);
      }

      await fetchFeeds();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Check your connection and try again.' };
    }
  };

  const removeFeed = async (feedId: string) => {
    const { error: err } = await supabase.from('feeds').delete().eq('id', feedId);
    if (!err) {
      setFeeds((prev) => prev.filter((f) => f.id !== feedId));
    }
  };

  const refreshFeeds = async () => {
    setLoading(true);
    for (const feed of feeds) {
      try {
        const { data: fnData } = await supabase.functions.invoke('fetch-feed', {
          body: { url: feed.url },
        });

        if (fnData?.articles?.length > 0) {
          const articles = fnData.articles.map((article: Record<string, unknown>) => ({
            feed_id: feed.id,
            guid: article.guid || article.url || article.title,
            title: article.title || 'Untitled',
            url: article.url || null,
            author: article.author || null,
            published_at: article.published_at || null,
            thumbnail_url: article.thumbnail_url || null,
            summary: article.summary || null,
            content: article.content || null,
            is_summary_only: !article.content || (article.content as string).length < 200,
          }));

          await supabase.from('articles').upsert(articles, {
            onConflict: 'feed_id,guid',
            ignoreDuplicates: true,
          });
        }

        await supabase
          .from('feeds')
          .update({ last_fetched_at: new Date().toISOString() })
          .eq('id', feed.id);
      } catch {
        // Skip failed feeds silently during refresh
      }
    }
    setLoading(false);
  };

  return { feeds, loading, error, addFeed, removeFeed, refreshFeeds, refetch: fetchFeeds };
}
