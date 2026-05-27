import { useEffect, useState, type FormEvent } from 'react';
import type { Category, Idea, IdeaStatus, IdeaTask } from '../../types';
import { AppShell } from '../layout/AppShell';

interface IdeaDetailScreenProps {
  idea?: Idea;
  isResolving?: boolean;
  categories: Category[];
  tasks: IdeaTask[];
  onAddTask: (ideaId: string, title: string) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateIdea: (ideaId: string, input: {
    title: string;
    description: string;
    category_id: string;
    status: import('../../types').IdeaStatus;
    source_type: import('../../types').SourceType;
  }) => void;
  onDeleteIdea: (ideaId: string) => void;
}

export function IdeaDetailScreen({
  idea,
  isResolving = false,
  categories,
  tasks,
  onAddTask,
  onToggleTask,
  onUpdateIdea,
  onDeleteIdea,
}: IdeaDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [title, setTitle] = useState(idea?.title ?? '');
  const [description, setDescription] = useState(idea?.description ?? '');
  const [categoryId, setCategoryId] = useState(idea?.category_id ?? categories[0]?.id ?? '');
  const [status, setStatus] = useState<IdeaStatus>(idea?.status ?? 'in_progress');

  useEffect(() => {
    setIsEditing(false);
    setTaskTitle('');
    setTitle(idea?.title ?? '');
    setDescription(idea?.description ?? '');
    setCategoryId(idea?.category_id ?? categories[0]?.id ?? '');
    setStatus(idea?.status ?? 'in_progress');
  }, [categories, idea]);

  if (!idea && isResolving) {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px 24px 12px' }}>
            <a href="/ideas" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <svg style={{ flexShrink: 0 }} overflow="visible" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12l6 6M5 12l6-6" stroke="#4A4458" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div style={{ fontSize: '20px', letterSpacing: '-0.02em', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '24px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Detail Ide
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!idea) {
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
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px'
          }}
        >
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#4A4458', marginBottom: '8px' }}>Ide tidak ditemukan</div>
          <div style={{ fontSize: '14px', color: '#8E8A9A', marginBottom: '24px', textAlign: 'center' }}>Ide ini mungkin sudah dihapus atau belum tersimpan.</div>
          <a
            href="/ideas"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              paddingBlock: '12px',
              paddingInline: '24px',
              backgroundColor: '#7C5CFC',
              color: '#FFFFFF',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Kembali ke daftar
          </a>
        </div>
      </AppShell>
    );
  }

  const category = categories.find((item) => item.id === idea.category_id);

  const handleAddTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask(idea.id, taskTitle.trim());
    setTaskTitle('');
  };

  const handleSaveEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onUpdateIdea(idea.id, {
      title: title.trim(),
      description: description.trim(),
      category_id: categoryId,
      status,
      source_type: idea.source_type,
    });
    setIsEditing(false);
  };

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

  const statusText = statusLabels[idea.status] || 'Berjalan';
  const sourceText = sourceLabels[idea.source_type] || 'Manual';

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
        {/* Back Link and Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="/ideas" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <svg style={{ flexShrink: 0 }} overflow="visible" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12l6 6M5 12l6-6" stroke="#4A4458" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div style={{ fontSize: '20px', letterSpacing: '-0.02em', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '24px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
              Detail Ide
            </div>
          </div>
          {!isEditing && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <svg style={{ flexShrink: 0 }} overflow="visible" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onDeleteIdea(idea.id)}
                style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <svg style={{ flexShrink: 0 }} overflow="visible" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="#E74C3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic content card or Editing view */}
        <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '80px' }} className="hide-scrollbar">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', paddingBlock: '8px', paddingInline: '24px', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '13px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#4A4458' }}>Judul Ide</div>
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '12px', paddingBlock: '14px', paddingInline: '16px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0' }}>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nama ide..."
                    required
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#4A4458', background: 'transparent' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '13px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#4A4458' }}>Deskripsi</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '80px', borderRadius: '12px', paddingBlock: '14px', paddingInline: '16px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0' }}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tulis ringkasan ide..."
                    required
                    rows={4}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#4A4458', background: 'transparent', resize: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  <div style={{ fontSize: '13px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#4A4458' }}>Kategori</div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', paddingBlock: '12px', paddingInline: '16px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0' }}>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      style={{ appearance: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#4A4458', background: 'transparent', cursor: 'pointer' }}
                    >
                      {categories.map((item) => (
                        <option value={item.id} key={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  <div style={{ fontSize: '13px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#4A4458' }}>Status</div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', paddingBlock: '12px', paddingInline: '16px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0' }}>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                      style={{ appearance: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: '#4A4458', background: 'transparent', cursor: 'pointer' }}
                    >
                      <option value="not_started">Belum Mulai</option>
                      <option value="in_progress">Berjalan</option>
                      <option value="completed">Selesai</option>
                      <option value="paused">Ditunda</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
                <button
                  type="submit"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, borderRadius: '12px', padding: '14px', backgroundColor: '#7C5CFC', color: '#FFFFFF', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, borderRadius: '12px', padding: '14px', backgroundColor: '#FFFFFF', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E8E4F0', color: '#8E8A9A', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Content Detail */}
              <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 24px 16px', gap: '12px' }}>
                <div style={{ fontSize: '22px', letterSpacing: '-0.02em', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '28px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                  {idea.title}
                </div>
                <div style={{ fontSize: '14px', lineHeight: '22px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 400, color: '#8E8A9A', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                  {idea.description}
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
                      {sourceText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator line */}
              <div style={{ height: '1px', marginLeft: '24px', marginRight: '24px', flexShrink: 0, backgroundColor: '#E8E4F0' }} />

              {/* Checklist Title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px 10px' }}>
                <div style={{ fontSize: '16px', whiteSpace: 'pre-wrap', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, lineHeight: '20px', color: '#4A4458', width: 'auto', minWidth: 'auto', maxWidth: '100%' }}>
                  Checklist
                </div>
              </div>

              {/* Add Checklist Form inline */}
              <form
                onSubmit={handleAddTask}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '24px',
                  marginRight: '24px',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  paddingBlock: '8px',
                  paddingInline: '12px',
                  backgroundColor: '#FFFFFF',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#E8E4F0',
                  gap: '8px'
                }}
              >
                <input
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="Tambah checklist..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '13px',
                    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                    color: '#4A4458',
                    background: 'transparent'
                  }}
                />
                <button
                  type="submit"
                  disabled={!taskTitle.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '10px',
                    paddingBlock: '6px',
                    paddingInline: '12px',
                    gap: '6px',
                    backgroundColor: '#F0EDFA',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: taskTitle.trim() ? 1 : 0.5
                  }}
                >
                  <svg style={{ flexShrink: 0 }} overflow="visible" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 3v8M3 7h8" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div style={{ fontSize: '12px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 600, color: '#7C5CFC' }}>
                    Tambah
                  </div>
                </button>
              </form>

              {/* Checklist Items list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {tasks.length > 0 ? (
                  tasks.map((task) => {
                    return (
                      <div
                        key={task.id}
                        onClick={() => onToggleTask(task.id)}
                        style={{ display: 'flex', alignItems: 'center', paddingBlock: '12px', paddingInline: '24px', gap: '12px', cursor: 'pointer' }}
                      >
                        {task.is_done ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', flexShrink: 0, borderRadius: '6px', backgroundColor: '#7C5CFC' }}>
                            <svg style={{ flexShrink: 0 }} overflow="visible" width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M3 6l2.5 2.5L9 4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', flexShrink: 0, borderRadius: '6px', borderWidth: '2px', borderStyle: 'solid', borderColor: '#E8E4F0' }} />
                        )}
                        <div style={{
                          fontSize: '14px',
                          whiteSpace: 'pre-wrap',
                          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                          fontWeight: 400,
                          lineHeight: '18px',
                          textDecoration: task.is_done ? 'line-through 1px' : 'none',
                          color: task.is_done ? '#8E8A9A' : '#4A4458',
                        }}>
                          {task.title}
                        </div>
                      </div>
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
                    Belum ada checklist.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
