import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types';

interface UsePostsOptions {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export const usePosts = (options: UsePostsOptions = {}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { status, category, limit = 10, offset = 0 } = options;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('posts_with_details')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category_id', category);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setPosts(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [status, category, limit, offset]);

  const createPost = async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...postData,
          published_at: postData.status === 'published' ? new Date().toISOString() : null
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchPosts(); // Refresh the list
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create post' };
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          ...updates,
          published_at: updates.status === 'published' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchPosts(); // Refresh the list
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update post' };
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPosts(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete post' };
    }
  };

  const incrementViews = async (id: string) => {
    try {
      // Simple increment without RPC function
      const { data: currentPost } = await supabase
        .from('posts')
        .select('views')
        .eq('id', id)
        .single();

      if (currentPost) {
        await supabase
          .from('posts')
          .update({ views: (currentPost.views || 0) + 1 })
          .eq('id', id);
      }
    } catch (err) {
      console.error('Failed to increment views:', err);
    }
  };

  return {
    posts,
    loading,
    error,
    total,
    createPost,
    updatePost,
    deletePost,
    incrementViews,
    refetch: fetchPosts
  };
};