import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Review } from '../types';

interface UseReviewsOptions {
  productId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export const useReviews = (options: UseReviewsOptions = {}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { productId, status, limit = 10, offset = 0 } = options;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(username),
          product:products(name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (productId) {
        query = query.eq('product_id', productId);
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setReviews(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, status, limit, offset]);

  const createReview = async (reviewData: Omit<Review, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;

      await fetchReviews();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create review' };
    }
  };

  const updateReview = async (id: string, updates: Partial<Review>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchReviews();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update review' };
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchReviews();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete review' };
    }
  };

  const approveReview = async (id: string) => {
    return updateReview(id, { status: 'approved' });
  };

  const rejectReview = async (id: string) => {
    return updateReview(id, { status: 'rejected' });
  };

  return {
    reviews,
    loading,
    error,
    total,
    createReview,
    updateReview,
    deleteReview,
    approveReview,
    rejectReview,
    refetch: fetchReviews
  };
};