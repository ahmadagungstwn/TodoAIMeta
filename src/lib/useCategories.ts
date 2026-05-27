import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Category } from '../types';

const defaultCategories = [
  { name: 'Produk', color: '#7C5CFC' },
  { name: 'Bisnis', color: '#F59E0B' },
  { name: 'Konten', color: '#22C55E' },
  { name: 'Edukasi', color: '#0EA5E9' },
];

export async function ensureDefaultCategories(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (error) {
    console.error('[useCategories] Check default categories error:', error);
    return;
  }

  if (data && data.length > 0) return;

  const { error: insertError } = await supabase.from('categories').insert(
    defaultCategories.map((category) => ({
      user_id: userId,
      ...category,
    })),
  );

  if (insertError) {
    console.error('[useCategories] Insert default categories error:', insertError);
  }
}

export function useCategories(userId: string | undefined) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!userId) {
      setCategories([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ensureDefaultCategories(userId);
      const { data, error: queryError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (queryError) throw queryError;
      setCategories(data ?? []);
    } catch (err: any) {
      console.error('[useCategories] Supabase query error:', err);
      setCategories([]);
      setError(err.message ?? 'Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}
