import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Idea, IdeaStatus, SourceType } from '../types';

export function useIdeas(userId: string | undefined) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    if (!userId) {
      setIdeas([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setIdeas(data ?? []);
    } catch (err: any) {
      console.error('[useIdeas] Supabase query error:', err);
      setIdeas([]);
      setError(err.message ?? 'Gagal memuat ide');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  return { ideas, loading, error, refetch: fetchIdeas };
}

export function useIdea(ideaId: string | undefined) {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdea = useCallback(async () => {
    if (!ideaId) {
      setIdea(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .maybeSingle();

      if (queryError) throw queryError;
      setIdea(data ?? null);
    } catch (err: any) {
      console.error('[useIdea] Supabase single query error:', err);
      setIdea(null);
      setError(err.message ?? 'Gagal memuat detail ide');
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  useEffect(() => {
    fetchIdea();
  }, [fetchIdea]);

  return { idea, loading, error, refetch: fetchIdea };
}

interface CreateIdeaInput {
  user_id: string;
  title: string;
  description: string;
  category_id: string;
  status: IdeaStatus;
  source_type: SourceType;
}

export async function createIdea(input: CreateIdeaInput): Promise<Idea | null> {
  const { data, error } = await supabase
    .from('ideas')
    .insert(input)
    .select()
    .single();
  if (error) {
    console.error('[createIdea] Supabase insert error:', error);
    throw error;
  }
  return data;
}

interface UpdateIdeaInput {
  title: string;
  description: string;
  category_id: string;
  status: IdeaStatus;
  source_type: SourceType;
}

export async function updateIdea(ideaId: string, input: UpdateIdeaInput): Promise<Idea | null> {
  const { data, error } = await supabase
    .from('ideas')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', ideaId)
    .select()
    .single();
  if (error) {
    console.error('[updateIdea] Supabase update error:', error);
    throw error;
  }
  return data;
}

export async function deleteIdea(ideaId: string): Promise<boolean> {
  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', ideaId);
  if (error) {
    console.error('[deleteIdea] Supabase delete error:', error);
  }
  return !error;
}
