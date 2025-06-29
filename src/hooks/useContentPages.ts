import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ContentPage } from '../types';

interface UseContentPagesOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

export const useContentPages = (options: UseContentPagesOptions = {}) => {
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { status, limit = 10, offset = 0 } = options;

  const fetchContentPages = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('content_pages')
        .select(`
          *,
          author:profiles(username),
          sections(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setContentPages(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentPages();
  }, [status, limit, offset]);

  const createContentPage = async (pageData: Omit<ContentPage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .insert([pageData])
        .select()
        .single();

      if (error) throw error;

      await fetchContentPages();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create content page' };
    }
  };

  const updateContentPage = async (id: string, updates: Partial<ContentPage>) => {
    try {
      const { data, error } = await supabase
        .from('content_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchContentPages();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update content page' };
    }
  };

  const deleteContentPage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchContentPages();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete content page' };
    }
  };

  return {
    contentPages,
    loading,
    error,
    total,
    createContentPage,
    updateContentPage,
    deleteContentPage,
    refetch: fetchContentPages
  };
};