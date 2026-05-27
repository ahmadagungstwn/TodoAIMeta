import type { Profile } from '../../types';
import { AppShell } from '../layout/AppShell';

interface ProfileScreenProps {
  profile: Profile | null;
  onLogout: () => void;
}

export function ProfileScreen({ profile, onLogout }: ProfileScreenProps) {
  const displayName = profile?.full_name ?? 'User';
  const displayEmail = profile?.email ?? '';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <AppShell activeNav="profile">
      <div
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
        {/* Scrollable Content Container */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }} className="hide-scrollbar">
          {/* Header Area */}
          <div style={{ padding: '24px 24px 16px' }}>
            <h1 style={{ fontSize: '24px', letterSpacing: '-0.02em', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 800, color: '#4A4458', margin: 0 }}>
              Profil Pengguna
            </h1>
            <p style={{ fontSize: '14px', lineHeight: '20px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 400, color: '#8E8A9A', marginTop: '6px', margin: 0 }}>
              Informasi detail akun pribadi Anda.
            </p>
          </div>

          {/* Profile Hero Avatar Card */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E4F0',
              borderRadius: '24px',
              marginInline: '24px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0px 10px 30px rgba(124, 92, 252, 0.04)',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '24px',
                backgroundColor: '#7C5CFC',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: '24px',
                fontWeight: 800,
                boxShadow: '0px 8px 24px rgba(124, 92, 252, 0.2)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  fontWeight: 700,
                  color: '#4A4458',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  color: '#8E8A9A',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayEmail}
              </p>
            </div>
          </section>

          {/* User Details List */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E4F0',
              borderRadius: '24px',
              marginInline: '24px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 10px 30px rgba(124, 92, 252, 0.02)',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#8E8A9A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nama Lengkap
              </span>
              <strong style={{ fontSize: '15px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#4A4458', marginTop: '6px' }}>
                {displayName}
              </strong>
            </div>

            {/* Separator line */}
            <div style={{ height: '1px', backgroundColor: '#E8E4F0', width: '100%' }} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#8E8A9A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Alamat Email
              </span>
              <strong style={{ fontSize: '15px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#4A4458', marginTop: '6px' }}>
                {displayEmail}
              </strong>
            </div>
          </div>

          {/* Action Log Out Button */}
          <div style={{ paddingInline: '24px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onLogout}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '16px',
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                fontSize: '15px',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 12px rgba(239, 68, 68, 0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              Keluar dari Akun (Logout)
            </button>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
