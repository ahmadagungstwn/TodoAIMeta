import type { Category, Idea, Profile } from '../../types';
import { AppShell } from '../layout/AppShell';
import { WeeklyChart } from './WeeklyChart';
import { BulbIcon } from '../icons/Icons';

export function DashboardScreen({ profile, ideas, categories }: { profile: Profile | null; ideas: Idea[]; categories: Category[] }) {
  const latestIdeas = ideas.slice(0, 2);
  const activeIdeas = ideas.filter((idea) => idea.status === 'in_progress').length;
  const completedIdeas = ideas.filter((idea) => idea.status === 'completed').length;
  const displayName = profile?.full_name ?? 'User';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <AppShell activeNav="dashboard">
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
        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 400, lineHeight: '18px', color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Selamat datang,
            </div>
            <div style={{ fontSize: '24px', letterSpacing: '-0.02em', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '30px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              {displayName}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0, backgroundColor: '#7C5CFC' }}>
            <div style={{ fontSize: '18px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '22px', color: '#FFFFFF', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              {initials}
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div style={{ display: 'flex', paddingInline: '24px', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, flexBasis: '0%', borderRadius: '16px', padding: '16px', gap: '6px', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 500, lineHeight: '16px', color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Total Ide
            </div>
            <div style={{ fontSize: '28px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '34px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              {ideas.length}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, flexBasis: '0%', borderRadius: '16px', padding: '16px', gap: '6px', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 500, lineHeight: '16px', color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Berjalan
            </div>
            <div style={{ fontSize: '28px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '34px', color: '#F59E0B', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              {activeIdeas}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, flexBasis: '0%', borderRadius: '16px', padding: '16px', gap: '6px', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 500, lineHeight: '16px', color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Selesai
            </div>
            <div style={{ fontSize: '28px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '34px', color: '#22C55E', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              {completedIdeas}
            </div>
          </div>
        </div>

        {/* Weekly Chart Card */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '20px', paddingRight: '24px', paddingLeft: '24px', gap: '12px' }}>
          <div style={{ fontSize: '16px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '20px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
            Ide per Minggu
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '140px', borderRadius: '16px', paddingBlock: '16px', paddingInline: '20px', gap: '12px', flexShrink: 0, backgroundColor: '#FFFFFF' }}>
            <WeeklyChart />
          </div>
        </div>

        {/* Latest Ideas List Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 12px' }}>
          <div style={{ fontSize: '16px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '20px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
            Ide Terbaru
          </div>
          <a href="/ideas" style={{ fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 500, lineHeight: '16px', color: '#7C5CFC', width: 'auto', minWidth: 'auto', textDecoration: 'none' }}>
            Lihat semua
          </a>
        </div>

        {/* Latest Ideas list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {latestIdeas.length > 0 ? (
            latestIdeas.map((idea) => {
              const category = categories.find((c) => c.id === idea.category_id);
              const isCompleted = idea.status === 'completed';
              return (
                <a
                  href={`/ideas/${idea.id}`}
                  key={idea.id}
                  style={{ display: 'flex', alignItems: 'center', marginLeft: '24px', marginRight: '24px', borderRadius: '14px', paddingBlock: '14px', paddingInline: '16px', gap: '14px', backgroundColor: '#FFFFFF', textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', flexShrink: 0, borderRadius: '12px', backgroundColor: '#F0EDFA' }}>
                    <BulbIcon style={{ width: '20px', height: '20px', color: '#7C5CFC' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, flexBasis: '0%', gap: '4px' }}>
                    <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '18px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                      {idea.title}
                    </div>
                    <div style={{ fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 400, lineHeight: '16px', color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                      {category?.name ?? 'Tanpa kategori'} · {isCompleted ? 'Selesai' : 'Berjalan'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', paddingBlock: '4px', paddingInline: '10px', backgroundColor: isCompleted ? '#DCFCE7' : '#FEF3C7' }}>
                    <div style={{ fontSize: '11px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '14px', color: isCompleted ? '#22C55E' : '#F59E0B', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                      {isCompleted ? 'Selesai' : 'Berjalan'}
                    </div>
                  </div>
                </a>
              );
            })
          ) : (
            <p style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#8E8A9A',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              paddingBlock: '12px'
            }}>
              Belum ada ide. Tambahkan ide pertama kamu.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
