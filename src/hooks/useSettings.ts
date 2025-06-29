import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSettings = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      const settingsObject = (data || []).reduce((acc: any, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      setSettings(settingsObject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: any) => {
    try {
      const settingsToUpsert = Object.entries(newSettings).map(([key, value]) => ({
        key,
        value,
        type: typeof value === 'boolean' ? 'boolean' : 'string'
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(settingsToUpsert);

      if (error) throw error;

      await fetchSettings();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update settings' };
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};