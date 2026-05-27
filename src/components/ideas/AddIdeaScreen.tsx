import { useState, useEffect, type FormEvent } from 'react';
import { AppShell } from '../layout/AppShell';
import type { Category, IdeaStatus, SourceType } from '../../types';
import { MicIcon, ScanIcon } from '../icons/Icons';

interface AddIdeaScreenProps {
  categories: Category[];
  onCreateIdea: (input: {
    title: string;
    description: string;
    category_id: string;
    status: IdeaStatus;
    source_type: SourceType;
  }) => void;
  initialDescription?: string;
  initialSourceType?: SourceType;
  onClearDraft?: () => void;
}

export function AddIdeaScreen({
  categories,
  onCreateIdea,
  initialDescription = '',
  initialSourceType = 'manual',
  onClearDraft,
}: AddIdeaScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(initialDescription);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [status, setStatus] = useState<IdeaStatus>('in_progress');
  const [sourceType, setSourceType] = useState<SourceType>(initialSourceType);

  useEffect(() => {
    if (initialDescription) {
      setDescription(initialDescription);
      setSourceType(initialSourceType);
    }
  }, [initialDescription, initialSourceType]);

  const canSave = title.trim() && description.trim() && categoryId;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    onCreateIdea({
      title,
      description,
      category_id: categoryId,
      status,
      source_type: sourceType,
    });
    if (onClearDraft) onClearDraft();
  };

  return (
    <AppShell activeNav="ideas">
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
        {/* Back Link and Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="/ideas" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <svg style={{ flexShrink: 0 }} overflow="visible" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12l6 6M5 12l6-6" stroke="#4A4458" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div style={{ fontSize: '20px', letterSpacing: '-0.02em', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '24px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Tambah Ide
            </div>
          </div>
        </div>

        {/* Quick Capture Options */}
        <div style={{ display: 'flex', gap: '12px', paddingInline: '24px', paddingBottom: '16px' }}>
          <a
            href="/ideas/new/voice"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexGrow: 1,
              flexBasis: '0%',
              borderRadius: '12px',
              paddingBlock: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E4F0',
              color: '#4A4458',
              fontSize: '13px',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.02)',
              cursor: 'pointer',
            }}
          >
            <MicIcon style={{ width: '16px', height: '16px', color: '#7C5CFC' }} />
            <span>Voice</span>
          </a>
          <a
            href="/ideas/new/scan"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexGrow: 1,
              flexBasis: '0%',
              borderRadius: '12px',
              paddingBlock: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E4F0',
              color: '#4A4458',
              fontSize: '13px',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.02)',
              cursor: 'pointer',
            }}
          >
            <ScanIcon style={{ width: '16px', height: '16px', color: '#7C5CFC' }} />
            <span>Scan</span>
          </a>
        </div>

        {/* Title and Description Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingBlock: '8px', paddingInline: '24px', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '16px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Judul Ide
            </div>
            <div style={{ display: 'flex', alignItems: 'center', borderRadius: '12px', paddingBlock: '14px', paddingInline: '16px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0' }}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nama ide..."
                required
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
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '16px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                Deskripsi
              </div>
              {sourceType !== 'manual' && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: '#7C5CFC',
                  backgroundColor: '#F0EDFA',
                  padding: '3px 8px',
                  borderRadius: '8px',
                }}>
                  Diimpor dari {sourceType === 'voice' ? 'Suara' : 'Scan'}
                  <button
                    type="button"
                    onClick={() => setSourceType('manual')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#7C5CFC',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      padding: 0
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '80px', borderRadius: '12px', paddingBlock: '14px', paddingInline: '16px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0' }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tulis ringkasan ide..."
                required
                rows={4}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  color: '#4A4458',
                  background: 'transparent',
                  resize: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Category, Status and Source Selections */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingInline: '24px', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '16px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Kategori
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', paddingBlock: '14px', paddingInline: '16px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0' }}>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  appearance: 'none',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  color: '#4A4458',
                  background: 'transparent',
                  cursor: 'pointer',
                  paddingRight: '20px'
                }}
              >
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <svg style={{ position: 'absolute', right: '16px', pointerEvents: 'none', flexShrink: 0 }} overflow="visible" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="#8E8A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '13px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '16px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Status
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', paddingBlock: '14px', paddingInline: '16px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0' }}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                style={{
                  appearance: 'none',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                  color: '#4A4458',
                  background: 'transparent',
                  cursor: 'pointer',
                  paddingRight: '20px'
                }}
              >
                <option value="not_started">Belum Mulai</option>
                <option value="in_progress">Berjalan</option>
                <option value="completed">Selesai</option>
              </select>
              <svg style={{ position: 'absolute', right: '16px', pointerEvents: 'none', flexShrink: 0 }} overflow="visible" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="#8E8A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>


        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', paddingBlock: '32px', paddingInline: '24px' }}>
          <button
            type="submit"
            disabled={!canSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              borderRadius: '14px',
              padding: '16px',
              backgroundColor: '#7C5CFC',
              color: '#FFFFFF',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '20px',
              border: 'none',
              cursor: 'pointer',
              opacity: canSave ? 1 : 0.62
            }}
          >
            Simpan Ide
          </button>
        </div>
      </form>
    </AppShell>
  );
}
