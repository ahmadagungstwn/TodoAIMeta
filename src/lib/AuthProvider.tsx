import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile } from '../types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  notice: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  retry: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const REQUEST_TIMEOUT_MS = 8000;

class RequestTimeoutError extends Error {
  constructor(label: string) {
    super(`${label} timeout`);
    this.name = 'RequestTimeoutError';
  }
}

function withTimeout<T>(promise: Promise<T>, label: string, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new RequestTimeoutError(label)), timeoutMs);
    }),
  ]);
}

function isTimeoutError(err: unknown) {
  return err instanceof RequestTimeoutError || (err instanceof Error && err.message.toLowerCase().includes('timeout'));
}

function profileFromUser(user: User): Omit<Profile, 'created_at' | 'updated_at'> {
  return {
    id: user.id,
    full_name: (user.user_metadata?.full_name as string | undefined) || user.email?.split('@')[0] || 'User',
    email: user.email ?? '',
    avatar_url: '/user-avatar.png',
  };
}

async function ensureProfile(user: User): Promise<Profile | null> {
  const fallback = profileFromUser(user);
  const { data, error } = await supabase
    .from('profiles')
    .upsert(fallback, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) {
    console.error('Ensure profile error:', error);
    return {
      ...fallback,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return data;
}

async function fetchProfile(user: User): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Fetch profile error:', error);
    return null;
  }

  return data ?? ensureProfile(user);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const initializeAuth = useCallback(async () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setLoading(true);
    setError(null);
    setNotice(null);

    if (!url || !anonKey || !supabase) {
      setError('Variabel lingkungan Supabase (URL/Key) tidak ditemukan atau gagal terinisialisasi. Harap RESTART server pengembangan Anda (npm run dev) di terminal agar Vite dapat membaca berkas .env baru yang dibuat.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await withTimeout(supabase.auth.getSession(), 'Supabase auth session');
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      setProfile(currentUser ? await withTimeout(fetchProfile(currentUser), 'Fetch profile') : null);
    } catch (err: any) {
      console.error('Supabase auth initialization error:', err);
      setUser(null);
      setProfile(null);
      if (isTimeoutError(err)) {
        setNotice('Sesi belum bisa dicek, silakan masuk ulang.');
      } else {
        setNotice('Sesi belum bisa dicek, silakan masuk ulang.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();

    let subscription: any = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (_event: any, session: any) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            const p = await withTimeout(fetchProfile(currentUser), 'Auth profile refresh').catch((err) => {
              console.error('Auth profile refresh failed:', err);
              return null;
            });
            setProfile(p);
          } else {
            setProfile(null);
          }
        },
      );
      subscription = data.subscription;
    } catch (err: any) {
      console.error('onAuthStateChange failed:', err);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [initializeAuth]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setNotice(null);
    const { error: err } = await withTimeout(supabase.auth.signInWithPassword({ email, password }), 'Sign in').catch((error) => ({
      error: error as AuthError,
      data: null,
    }));
    if (err) setError(isTimeoutError(err) ? 'Koneksi login terlalu lama. Coba lagi.' : err.message);
    setLoading(false);
    return { error: err };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    setNotice(null);
    const { data, error: err } = await withTimeout(supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    }), 'Sign up').catch((error) => ({
      error: error as AuthError,
      data: { user: null, session: null },
    }));
    if (err) setError(isTimeoutError(err) ? 'Koneksi daftar terlalu lama. Coba lagi.' : err.message);
    if (data.user) {
      await ensureProfile(data.user);
    }
    setLoading(false);
    return { error: err };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const clearError = () => {
    setError(null);
    setNotice(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, notice, signIn, signUp, signOut, retry: initializeAuth, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}
