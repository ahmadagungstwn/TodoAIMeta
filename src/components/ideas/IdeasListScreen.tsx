import { useMemo, useState } from 'react';
import type { Category, Idea, IdeaStatus } from '../../types';
import { AppShell } from '../layout/AppShell';

export function IdeasListScreen({ ideas, categories }: { ideas: Idea[]; categories: Category[] }) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [status, setStatus] = useState<IdeaStatus | 'all'>('all');

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesQuery = `${idea.title} ${idea.description}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryId === 'all' || idea.category_id === categoryId;
      const matchesStatus = status === 'all' || idea.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [categoryId, ideas, query, status]);

  const sourceLabels = {
    manual: 'Manual',
    voice: 'Voice',
    scan: 'Scan',
  };

  const statusLabels = {
    not_started: 'Belum Mulai',
    in_progress: 'Berjalan',
    completed: 'Selesai',
    paused: 'Ditunda',
  };

  return (
    <AppShell activeNav="ideas">
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
        {/* Ideas List Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px' }}>
          <div style={{ fontSize: '24px', letterSpacing: '-0.02em', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '30px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
            Daftar Ide
          </div>
          <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 500, lineHeight: '16px', color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
            {filteredIdeas.length} ide
          </div>
        </div>

        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '24px', marginRight: '24px', borderRadius: '14px', paddingBlock: '12px', paddingInline: '16px', gap: '10px', backgroundColor: '#FFFFFF' }}>
          <svg style={{ flexShrink: 0 }} overflow="visible" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="#8E8A9A" strokeWidth="1.5" />
            <path d="M12.5 12.5l3 3" stroke="#8E8A9A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari ide..."
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '14px',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              color: '#4A4458',
              background: 'transparent'
            }}
          />
        </div>

        {/* Category Filter Tags */}
        <div style={{ display: 'flex', paddingBlock: '12px', paddingInline: '24px', overflowX: 'auto', gap: '8px', scrollbarWidth: 'none' }} className="hide-scrollbar">
          <button
            type="button"
            onClick={() => setCategoryId('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '20px',
              paddingBlock: '8px',
              paddingInline: '16px',
              backgroundColor: categoryId === 'all' ? '#7C5CFC' : '#FFFFFF',
              border: categoryId === 'all' ? 'none' : '1px solid #E8E4F0',
              color: categoryId === 'all' ? '#FFFFFF' : '#8E8A9A',
              fontSize: '12px',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontWeight: categoryId === 'all' ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '20px',
                paddingBlock: '8px',
                paddingInline: '16px',
                backgroundColor: categoryId === category.id ? '#7C5CFC' : '#FFFFFF',
                border: categoryId === category.id ? 'none' : '1px solid #E8E4F0',
                color: categoryId === category.id ? '#FFFFFF' : '#8E8A9A',
                fontSize: '12px',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontWeight: categoryId === category.id ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Status Filter Tags */}
        <div style={{ display: 'flex', paddingRight: '24px', paddingBottom: '8px', paddingLeft: '24px', overflowX: 'auto', gap: '8px', scrollbarWidth: 'none' }} className="hide-scrollbar">
          {[
            { value: 'all', label: 'Semua Status' },
            { value: 'not_started', label: 'Belum Mulai' },
            { value: 'in_progress', label: 'Berjalan' },
            { value: 'completed', label: 'Selesai' },
            { value: 'paused', label: 'Ditunda' }
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatus(item.value as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '20px',
                paddingBlock: '6px',
                paddingInline: '14px',
                backgroundColor: status === item.value ? '#F0EDFA' : '#FFFFFF',
                border: status === item.value ? 'none' : '1px solid #E8E4F0',
                color: status === item.value ? '#7C5CFC' : '#8E8A9A',
                fontSize: '12px',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontWeight: status === item.value ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Ideas List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingBottom: '100px' }} className="hide-scrollbar">
          {filteredIdeas.length > 0 ? (
            filteredIdeas.map((idea) => {
              const category = categories.find((c) => c.id === idea.category_id);
              const sourceLabel = sourceLabels[idea.source_type] || 'Manual';
              const statusText = statusLabels[idea.status] || 'Berjalan';
              
              // Status Badge Styles
              let statusBg = '#FEF3C7';
              let statusColor = '#F59E0B';
              if (idea.status === 'completed') {
                statusBg = '#DCFCE7';
                statusColor = '#22C55E';
              } else if (idea.status === 'not_started') {
                statusBg = '#E8E4F0';
                statusColor = '#8E8A9A';
              } else if (idea.status === 'paused') {
                statusBg = '#FEE2E2';
                statusColor = '#EF4444';
              }

              return (
                <a
                  href={`/ideas/${idea.id}`}
                  key={idea.id}
                  style={{ display: 'flex', flexDirection: 'column', marginLeft: '24px', marginRight: '24px', marginTop: '4px', borderRadius: '16px', padding: '16px', gap: '10px', backgroundColor: '#FFFFFF', textDecoration: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, flexBasis: '0%', gap: '4px' }}>
                      <div style={{ fontSize: '15px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '18px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                        {idea.title}
                      </div>
                      <div style={{ fontSize: '13px', lineHeight: '18px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 400, color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                        {idea.description}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '8px', paddingBlock: '4px', paddingInline: '10px', backgroundColor: '#F0EDFA' }}>
                      <div style={{ fontSize: '11px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 500, lineHeight: '14px', color: '#7C5CFC', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                        {category?.name ?? 'Tanpa Kategori'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '8px', paddingBlock: '4px', paddingInline: '10px', backgroundColor: statusBg }}>
                      <div style={{ fontSize: '11px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '14px', color: statusColor, width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                        {statusText}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '8px', paddingBlock: '4px', paddingInline: '10px', gap: '4px', backgroundColor: '#F8F7FA' }}>
                      {idea.source_type === 'voice' ? (
                        <svg style={{ flexShrink: 0 }} overflow="visible" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 2v3l2 1.5" stroke="#8E8A9A" strokeWidth="1.2" strokeLinecap="round" />
                          <circle cx="6" cy="6" r="4.5" stroke="#8E8A9A" strokeWidth="1.2" />
                        </svg>
                      ) : idea.source_type === 'scan' ? (
                        <svg style={{ flexShrink: 0 }} overflow="visible" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <rect x="2" y="2" width="8" height="8" rx="1" stroke="#8E8A9A" strokeWidth="1.2" />
                          <path d="M4 5h4M4 7h2" stroke="#8E8A9A" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg style={{ flexShrink: 0 }} overflow="visible" width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M6 2v8" stroke="#8E8A9A" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      )}
                      <div style={{ fontSize: '11px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 500, lineHeight: '14px', color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                        {sourceLabel}
                      </div>
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
              Tidak ada ide yang cocok.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
