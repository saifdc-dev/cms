import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Coupon } from '../types';

interface UseCouponsOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

export const useCoupons = (options: UseCouponsOptions = {}) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { status, limit = 10, offset = 0 } = options;

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('coupons')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setCoupons(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [status, limit, offset]);

  const createCoupon = async (couponData: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'used_count'>) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([couponData])
        .select()
        .single();

      if (error) throw error;

      await fetchCoupons();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create coupon' };
    }
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchCoupons();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update coupon' };
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCoupons();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete coupon' };
    }
  };

  const validateCoupon = async (code: string, orderAmount: number) => {
    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('status', 'active')
        .single();

      if (error || !coupon) {
        return { valid: false, error: 'Invalid coupon code' };
      }

      // Check expiration
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { valid: false, error: 'Coupon has expired' };
      }

      // Check minimum amount
      if (coupon.min_amount && orderAmount < coupon.min_amount) {
        return { valid: false, error: `Minimum order amount is $${coupon.min_amount}` };
      }

      // Check usage limit
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        return { valid: false, error: 'Coupon usage limit reached' };
      }

      // Calculate discount
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (orderAmount * coupon.amount) / 100;
      } else {
        discount = coupon.amount;
      }

      // Apply maximum discount if applicable
      if (coupon.maximum_amount && discount > coupon.maximum_amount) {
        discount = coupon.maximum_amount;
      }

      return { valid: true, coupon, discount };
    } catch (err) {
      return { valid: false, error: 'Error validating coupon' };
    }
  };

  return {
    coupons,
    loading,
    error,
    total,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    refetch: fetchCoupons
  };
};