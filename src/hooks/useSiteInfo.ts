import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteInfo } from '../types';

export const useSiteInfo = () => {
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('site_info')
        .select('*')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setSiteInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteInfo();
  }, []);

  const updateSiteInfo = async (updates: Partial<SiteInfo>) => {
    try {
      const { data, error } = await supabase
        .from('site_info')
        .upsert([{
          id: '1',
          ...updates
        }])
        .select()
        .single();

      if (error) throw error;

      setSiteInfo(data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update site info' };
    }
  };

  return {
    siteInfo,
    loading,
    error,
    updateSiteInfo,
    refetch: fetchSiteInfo
  };
};