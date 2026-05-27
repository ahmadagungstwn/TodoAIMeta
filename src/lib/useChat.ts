import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';
import type { AiChat, AiMessage } from '../types';

const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const openRouterModel = import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free';
const isOpenRouterConfigured = Boolean(openRouterApiKey) && !openRouterApiKey.includes('your_');

const welcomeMessage: AiMessage = {
  id: 'local-welcome',
  chat_id: 'local',
  user_id: 'local',
  role: 'assistant',
  content: 'Halo, aku bisa bantu menyusun ide, stack, MVP, atau user flow secara umum.',
  created_at: new Date(0).toISOString(),
};

type OpenRouterMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function withTimeout<T>(promise: Promise<T>, timeoutMs = 45_000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('Koneksi AI terlalu lama merespons. Coba lagi.')), timeoutMs);
    promise
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timer));
  });
}

async function callOpenRouter(history: AiMessage[], userContent: string, signal: AbortSignal) {
  if (!isOpenRouterConfigured) {
    throw new Error('API key OpenRouter belum dikonfigurasi di .env.');
  }

  const recentMessages: OpenRouterMessage[] = history
    .filter((message) => message.id !== welcomeMessage.id && (message.role === 'user' || message.role === 'assistant'))
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content:
        'Kamu adalah asisten AI umum untuk aplikasi Ideaku AI. Bantu user mengembangkan ide, stack, MVP, user flow, dan analisis ide secara ringkas, jelas, dan praktis. Jangan membahas fitur berbayar, upload file, reminder, kalender, team, marketplace, atau chat per ide.',
    },
    ...recentMessages,
    { role: 'user', content: userContent },
  ];

  const response = await withTimeout(
    fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal,
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Ideaku AI',
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages,
        temperature: 0.7,
      }),
    })
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Gagal menghubungi AI.');
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('Respons AI kosong.');
  }

  return content.trim();
}

export function useChat(userId: string | undefined) {
  const [chat, setChat] = useState<AiChat | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([welcomeMessage]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const ensureChat = useCallback(async () => {
    if (!userId) return null;

    const { data: existingChats, error: selectError } = await supabase
      .from('ai_chats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (selectError) throw selectError;
    if (existingChats?.[0]) {
      setChat(existingChats[0]);
      return existingChats[0] as AiChat;
    }

    const { data: createdChat, error: insertError } = await supabase
      .from('ai_chats')
      .insert({ user_id: userId, title: 'Chat umum' })
      .select()
      .single();

    if (insertError) throw insertError;
    setChat(createdChat);
    return createdChat as AiChat;
  }, [userId]);

  const fetchMessages = useCallback(async () => {
    if (!userId) {
      setChat(null);
      setMessages([welcomeMessage]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const activeChat = await ensureChat();
      if (!activeChat) return;

      const { data, error: queryError } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('chat_id', activeChat.id)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (queryError) throw queryError;
      setMessages(data?.length ? data : [welcomeMessage]);
    } catch (err: any) {
      console.error('[useChat] Supabase query error:', err);
      setMessages([welcomeMessage]);
      setError(err.message ?? 'Gagal memuat chat AI');
    } finally {
      setLoading(false);
    }
  }, [ensureChat, userId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim();
      if (!userId || !trimmedContent || sending) return;

      setSending(true);
      setError(null);
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const activeChat = chat ?? (await ensureChat());
        if (!activeChat) throw new Error('Chat belum siap.');

        const { data: userMessage, error: userInsertError } = await supabase
          .from('ai_messages')
          .insert({
            chat_id: activeChat.id,
            user_id: userId,
            role: 'user',
            content: trimmedContent,
          })
          .select()
          .single();

        if (userInsertError) throw userInsertError;

        const previousMessages = messages.filter((message) => message.id !== welcomeMessage.id);
        const nextMessages = [...previousMessages, userMessage as AiMessage];
        setMessages(nextMessages);

        const assistantContent = await callOpenRouter(previousMessages, trimmedContent, abortController.signal);

        const { data: assistantMessage, error: assistantInsertError } = await supabase
          .from('ai_messages')
          .insert({
            chat_id: activeChat.id,
            user_id: userId,
            role: 'assistant',
            content: assistantContent,
          })
          .select()
          .single();

        if (assistantInsertError) throw assistantInsertError;
        setMessages((currentMessages) => [...currentMessages, assistantMessage as AiMessage]);

        await supabase.from('ai_chats').update({ updated_at: new Date().toISOString() }).eq('id', activeChat.id);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
        console.error('[useChat] Send message error:', err);
        setError(err.message ?? 'Gagal mengirim pesan ke AI');
      } finally {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
          setSending(false);
        }
      }
    },
    [chat, ensureChat, messages, sending, userId]
  );

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setSending(false);
  }, []);

  return {
    chat,
    messages,
    loading,
    sending,
    error,
    isConfigured: isOpenRouterConfigured,
    sendMessage,
    stopGeneration,
    refetch: fetchMessages,
  };
}
