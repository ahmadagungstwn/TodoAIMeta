import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { IdeaTask } from '../types';

export function useTasks(ideaId: string | undefined) {
  const [tasks, setTasks] = useState<IdeaTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!ideaId) {
      setTasks([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('idea_tasks')
        .select('*')
        .eq('idea_id', ideaId)
        .order('sort_order', { ascending: true });

      if (queryError) throw queryError;
      setTasks(data ?? []);
    } catch (err: any) {
      console.error('[useTasks] Supabase query error:', err);
      setTasks([]);
      setError(err.message ?? 'Gagal memuat checklist');
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}

export async function addTask(
  userId: string,
  ideaId: string,
  title: string,
  sortOrder: number,
): Promise<IdeaTask | null> {
  const { data, error } = await supabase
    .from('idea_tasks')
    .insert({ user_id: userId, idea_id: ideaId, title, sort_order: sortOrder })
    .select()
    .single();
  if (error) {
    console.error('[addTask] Supabase insert error:', error);
    throw error;
  }
  return data;
}

export async function toggleTask(taskId: string, currentDone: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('idea_tasks')
    .update({ is_done: !currentDone, updated_at: new Date().toISOString() })
    .eq('id', taskId);
  if (error) {
    console.error('[toggleTask] Supabase update error:', error);
  }
  return !error;
}
