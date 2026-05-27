import { useState, type FormEvent } from 'react';
import { AppShell } from '../layout/AppShell';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, fullName: string) => Promise<void>;
  error: string | null;
  notice?: string | null;
  onRetry?: () => Promise<void>;
  onClearError: () => void;
}

export function LoginScreen({ onLogin, onRegister, error, notice, onRetry, onClearError }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim() && password.trim() && (mode === 'login' || name.trim()) && !submitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    onClearError();
    if (mode === 'login') {
      await onLogin(email.trim(), password);
    } else {
      await onRegister(email.trim(), password, name.trim());
    }
    setSubmitting(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    onClearError();
  };

  const updateName = (value: string) => {
    setName(value);
    onClearError();
  };

  const updateEmail = (value: string) => {
    setEmail(value);
    onClearError();
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    onClearError();
  };

  return (
    <AppShell hideNav>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#F8F7FA',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          fontSynthesis: 'none',
          height: '844px',
          MozOsxFontSmoothing: 'grayscale',
          overflow: 'clip',
          WebkitFontSmoothing: 'antialiased',
          width: '390px',
        }}
      >
        {/* Brand Header */}
        <div style={{ alignItems: 'center', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px', paddingLeft: '24px', paddingRight: '24px', paddingTop: '80px' }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <rect width="56" height="56" rx="16" fill="#7C5CFC" />
            <path d="M18 20c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2H20c-1.1 0-2-.9-2-2v-2zm0 8h20v2H18v-2zm0 6h14v2H18v-2z" fill="#FFFFFFE6" />
            <circle cx="38" cy="38" r="8" fill="#FFFFFF" />
            <path d="M36 38l2 2 4-4" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ boxSizing: 'border-box', color: '#4A4458', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '34px' }}>
            Ideaku AI
          </div>
          <div style={{ boxSizing: 'border-box', color: '#8E8A9A', display: 'flex', flexWrap: 'wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: '14px', justifyContent: 'center', lineHeight: '18px', textAlign: 'center' }}>
            Catat ide brilian, kelola dengan mudah
          </div>
        </div>

        {/* Inputs */}
        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px', paddingInline: '24px' }}>
          {mode === 'register' && (
            <div style={{ alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E8E4F0', borderRadius: '14px', borderStyle: 'solid', borderWidth: '1px', boxSizing: 'border-box', display: 'flex', gap: '12px', padding: '16px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#8E8A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#8E8A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                value={name}
                onChange={(e) => updateName(e.target.value)}
                placeholder="Nama Lengkap"
                required
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '15px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  color: '#4A4458',
                  background: 'transparent'
                }}
              />
            </div>
          )}

          <div style={{ alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E8E4F0', borderRadius: '14px', borderStyle: 'solid', borderWidth: '1px', boxSizing: 'border-box', display: 'flex', gap: '12px', padding: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M3 5l7 5 7-5M3 5v10h14V5H3z" stroke="#8E8A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              placeholder="Email"
              required
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                color: '#4A4458',
                background: 'transparent'
              }}
            />
          </div>

          <div style={{ alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E8E4F0', borderRadius: '14px', borderStyle: 'solid', borderWidth: '1px', boxSizing: 'border-box', display: 'flex', gap: '12px', padding: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" overflow="visible" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <rect x="4" y="9" width="12" height="8" rx="2" stroke="#8E8A9A" strokeWidth="1.5" />
              <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="#8E8A9A" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="13" r="1.5" fill="#8E8A9A" />
            </svg>
            <input
              type="password"
              value={password}
              onChange={(e) => updatePassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                color: '#4A4458',
                background: 'transparent'
              }}
            />
          </div>
        </div>

        {/* Error Notification */}
        {(error || notice) && (
          <div style={{
            color: error ? '#E74C3C' : '#8E8A9A',
            fontSize: '13px',
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            paddingInline: '24px',
            textAlign: 'center',
            marginTop: '12px'
          }}>
            {error || notice}
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                style={{
                  display: 'block',
                  margin: '10px auto 0',
                  border: 'none',
                  background: 'transparent',
                  color: '#7C5CFC',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Coba hubungkan ulang
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px' }}>
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              alignItems: 'center',
              backgroundColor: '#7C5CFC',
              borderRadius: '14px',
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'center',
              padding: '16px',
              border: 'none',
              cursor: 'pointer',
              color: '#FFFFFF',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '20px',
              opacity: canSubmit ? 1 : 0.62
            }}
          >
            {submitting ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>

          <button
            type="button"
            onClick={switchMode}
            style={{
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderColor: '#E8E4F0',
              borderRadius: '14px',
              borderStyle: 'solid',
              borderWidth: '1px',
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'center',
              padding: '16px',
              cursor: 'pointer',
              color: '#7C5CFC',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '20px'
            }}
          >
            {mode === 'login' ? 'Daftar Akun Baru' : 'Masuk ke Akun Lama'}
          </button>
        </div>

        {/* Bottom Switch text */}
        <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'center', paddingBlock: '20px', paddingInline: '24px' }}>
          <button
            type="button"
            onClick={switchMode}
            style={{
              boxSizing: 'border-box',
              color: '#8E8A9A',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '13px',
              lineHeight: '16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
