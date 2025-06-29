import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Gallery } from '../types';

export const useGalleries = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('galleries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setGalleries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const createGallery = async (galleryData: Omit<Gallery, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('galleries')
        .insert([galleryData])
        .select()
        .single();

      if (error) throw error;

      await fetchGalleries();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create gallery' };
    }
  };

  const updateGallery = async (id: string, updates: Partial<Gallery>) => {
    try {
      const { data, error } = await supabase
        .from('galleries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchGalleries();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update gallery' };
    }
  };

  const deleteGallery = async (id: string) => {
    try {
      const { error } = await supabase
        .from('galleries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchGalleries();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete gallery' };
    }
  };

  return {
    galleries,
    loading,
    error,
    createGallery,
    updateGallery,
    deleteGallery,
    refetch: fetchGalleries
  };
};