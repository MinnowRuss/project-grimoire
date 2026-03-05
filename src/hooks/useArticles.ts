import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Article } from '../lib/types';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('articles')
      .select('*, feed:feeds(*)')
      .order('published_at', { ascending: false, nullsFirst: false });

    setArticles(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const getArticle = async (id: string): Promise<Article | null> => {
    const { data } = await supabase
      .from('articles')
      .select('*, feed:feeds(*)')
      .eq('id', id)
      .single();

    return data;
  };

  const markAsRead = async (id: string) => {
    await supabase.from('articles').update({ is_read: true }).eq('id', id);
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
    );
  };

  return { articles, loading, fetchArticles, getArticle, markAsRead };
}
