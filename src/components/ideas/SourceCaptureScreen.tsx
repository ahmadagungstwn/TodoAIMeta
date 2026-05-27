import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { Category, IdeaStatus, SourceType } from '../../types';
import { MicIcon, ScanIcon } from '../icons/Icons';
import { AppShell } from '../layout/AppShell';

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
    };
  }>;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechErrorMessage(error?: string) {
  if (error === 'network') {
    return 'Layanan voice browser tidak tersambung. Web Speech API gratis memakai layanan speech dari browser, jadi bisa gagal jika layanan/koneksi speech tidak tersedia. Kamu tetap bisa menulis teks ide manual di bawah.';
  }
  if (error === 'not-allowed' || error === 'service-not-allowed') {
    return 'Izin mikrofon ditolak. Aktifkan izin mikrofon di browser lalu coba lagi.';
  }
  if (error === 'no-speech') {
    return 'Suara belum terdeteksi. Coba bicara lebih dekat ke mikrofon.';
  }
  if (error === 'audio-capture') {
    return 'Mikrofon tidak terdeteksi. Cek perangkat mikrofon lalu coba lagi.';
  }
  return 'Voice input berhenti. Kamu tetap bisa menulis teks ide manual di bawah.';
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface CaptureScreenProps {
  categories: Category[];
  onCreateIdea: (input: {
    title: string;
    description: string;
    category_id: string;
    status: IdeaStatus;
    source_type: SourceType;
  }) => void;
}

interface CaptureFormProps extends CaptureScreenProps {
  sourceType: 'voice' | 'scan';
  title: string;
  description: string;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
}

export function VoiceIdeaScreen({ categories, onCreateIdea }: CaptureScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTranscriptRef = useRef('');

  const isSupported = useMemo(() => {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = () => {
    if (!isSupported) {
      setError('Browser ini belum mendukung voice input. Kamu tetap bisa menulis teks ide manual di bawah.');
      return;
    }

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) return;

    recognitionRef.current?.abort();
    const recognition = new Recognition();
    baseTranscriptRef.current = description.trim();
    recognition.lang = navigator.language?.toLowerCase().startsWith('id') ? navigator.language : 'id-ID';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;
    setError(null);
    setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      setDescription([baseTranscriptRef.current, transcript.trim()].filter(Boolean).join(' '));
    };

    recognition.onerror = (event) => {
      setError(getSpeechErrorMessage(event.error));
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch {
      setError('Voice input belum bisa dimulai. Coba reload halaman atau tulis teks ide manual di bawah.');
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  return (
    <CaptureLayout
      backHref="/ideas/new"
      badge="Voice"
      icon={<MicIcon style={{ width: '28px', height: '28px' }} />}
      title="Ide dari suara"
      subtitle="Ubah ucapan menjadi teks. Audio tidak disimpan, hanya teks ide yang masuk ke database."
    >
      <button
        type="button"
        onPointerDown={startListening}
        onPointerUp={stopListening}
        onPointerLeave={stopListening}
        onPointerCancel={stopListening}
        onTouchEnd={stopListening}
        style={{
          minHeight: '76px',
          borderRadius: '24px',
          backgroundColor: isListening ? '#F8ECE9' : '#7C5CFC',
          color: isListening ? '#9B4B3D' : '#FFFFFF',
          border: 'none',
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          fontSize: '15px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        <MicIcon style={{ width: '22px', height: '22px' }} />
        {isListening ? 'Lepas untuk berhenti' : 'Tekan dan tahan mic'}
      </button>

      {!isSupported && (
        <p style={{ margin: 0, color: '#B45309', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '10px 12px', fontSize: '12px', lineHeight: '18px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
          Browser ini belum mendukung Web Speech API. Kamu tetap bisa menulis teks ide manual di bawah.
        </p>
      )}

      {error && (
        <p style={{ margin: 0, color: '#B45309', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '10px 12px', fontSize: '12px', lineHeight: '18px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
          {error}
        </p>
      )}

      <CaptureForm
        categories={categories}
        onCreateIdea={onCreateIdea}
        sourceType="voice"
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
      />
    </CaptureLayout>
  );
}

export function ScanIdeaScreen({ categories, onCreateIdea }: CaptureScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Browser ini belum mendukung kamera langsung. Kamu bisa pakai pilihan foto sebagai fallback.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (err) {
        console.error('[ScanIdeaScreen] Camera failed:', err);
        setError('Kamera tidak bisa dibuka. Izinkan akses kamera atau pakai pilihan foto sebagai fallback.');
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const runOcr = async (image: CanvasImageSource | File) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const tesseract = await import('tesseract.js');
      const result = await tesseract.recognize(image, 'ind+eng', {
        logger: (message) => {
          if (message.status === 'recognizing text' && typeof message.progress === 'number') {
            setProgress(Math.round(message.progress * 100));
          }
        },
      });

      const text = result.data.text.trim();
      if (!text) {
        setError('Teks tidak terbaca. Kamu bisa mengetik hasilnya manual di bawah.');
        return;
      }
      setDescription(text);
    } catch (err: any) {
      console.error('[ScanIdeaScreen] OCR failed:', err);
      setError('OCR gagal membaca gambar. Kamu tetap bisa menulis teks ide manual di bawah.');
    } finally {
      setIsProcessing(false);
    }
  };

  const scanCurrentFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !cameraReady) {
      setError('Kamera belum siap. Tunggu sebentar lalu coba scan lagi.');
      return;
    }

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, width, height);
    await runOcr(canvas);
  };

  const handleFileFallback = async (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (file) await runOcr(file);
  };

  return (
    <CaptureLayout
      backHref="/ideas/new"
      badge="Scan"
      icon={<ScanIcon style={{ width: '28px', height: '28px' }} />}
      title="Scan ide"
      subtitle="Ambil foto catatan untuk diubah jadi teks. Foto tidak disimpan, hanya teks ide yang masuk ke database."
    >
      <div
        style={{
          position: 'relative',
          height: '220px',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#1E2523',
          border: '1px solid #E8E4F0',
        }}
      >
        <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: '18px', border: '2px solid rgba(255, 255, 255, 0.72)', borderRadius: '18px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '28px', right: '28px', top: '50%', height: '2px', borderRadius: '999px', backgroundColor: '#7C5CFC', boxShadow: '0 0 18px rgba(124, 92, 252, 0.85)' }} />
        {!cameraReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: '13px', fontWeight: 700, backgroundColor: 'rgba(30, 37, 35, 0.62)' }}>
            Menyiapkan kamera...
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <button
        type="button"
        onClick={scanCurrentFrame}
        disabled={!cameraReady || isProcessing}
        style={{
          minHeight: '54px',
          borderRadius: '18px',
          backgroundColor: '#7C5CFC',
          color: '#FFFFFF',
          border: 'none',
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          fontSize: '15px',
          fontWeight: 800,
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: !cameraReady || isProcessing ? 0.72 : 1,
        }}
      >
        {isProcessing ? `Membaca teks ${progress}%` : 'Scan teks sekarang'}
      </button>

      <label style={{ minHeight: '42px', borderRadius: '14px', backgroundColor: '#FFFFFF', border: '1px solid #E8E4F0', color: '#7C5CFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: '13px', fontWeight: 800, cursor: isProcessing ? 'not-allowed' : 'pointer' }}>
        Pakai foto dari galeri
        <input type="file" accept="image/*" disabled={isProcessing} onChange={handleFileFallback} style={{ display: 'none' }} />
      </label>

      {isProcessing && (
        <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#E8E4F0', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: '999px', backgroundColor: '#7C5CFC', transition: 'width 180ms ease' }} />
        </div>
      )}

      {error && (
        <p style={{ margin: 0, color: '#B45309', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '10px 12px', fontSize: '12px', lineHeight: '18px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
          {error}
        </p>
      )}

      <CaptureForm
        categories={categories}
        onCreateIdea={onCreateIdea}
        sourceType="scan"
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
      />
    </CaptureLayout>
  );
}

function CaptureLayout({
  backHref,
  badge,
  icon,
  title,
  subtitle,
  children,
}: {
  backHref: string;
  badge: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <AppShell activeNav="add">
      <div
        className="hide-scrollbar"
        style={{
          backgroundColor: '#F8F7FA',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          fontSynthesis: 'none',
          minHeight: '844px',
          MozOsxFontSmoothing: 'grayscale',
          overflowY: 'auto',
          WebkitFontSmoothing: 'antialiased',
          width: '390px',
          paddingBottom: '96px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '24px 24px 12px' }}>
          <a href={backHref} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="Kembali ke tambah ide">
            <svg style={{ flexShrink: 0 }} overflow="visible" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12l6 6M5 12l6-6" stroke="#4A4458" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingInline: '24px' }}>
          <div style={{ padding: '22px', borderRadius: '24px', backgroundColor: '#FFFFFF', border: '1px solid #E8E4F0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F0EDFA',
                  color: '#7C5CFC',
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <span style={{ padding: '7px 11px', borderRadius: '999px', color: '#7C5CFC', backgroundColor: '#F0EDFA', fontSize: '12px', fontWeight: 800, fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
                {badge}
              </span>
            </div>
            <div>
              <h1 style={{ margin: 0, color: '#4A4458', fontSize: '24px', lineHeight: '30px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 800 }}>
                {title}
              </h1>
              <p style={{ margin: '8px 0 0', color: '#8E8A9A', fontSize: '14px', lineHeight: '21px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
                {subtitle}
              </p>
            </div>
          </div>

          {children}
        </section>
      </div>
    </AppShell>
  );
}

function CaptureForm({ categories, onCreateIdea, sourceType, title, description, setTitle, setDescription }: CaptureFormProps) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [status, setStatus] = useState<IdeaStatus>('in_progress');

  useEffect(() => {
    if (!categoryId && categories[0]?.id) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const canSave = title.trim() && description.trim() && categoryId;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    onCreateIdea({
      title: title.trim(),
      description: description.trim(),
      category_id: categoryId,
      status,
      source_type: sourceType,
    });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={labelStyle}>Judul Ide</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nama ide..." style={inputStyle} />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={labelStyle}>Teks hasil {sourceType === 'voice' ? 'suara' : 'scan'}</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Teks akan muncul di sini dan bisa diedit..." rows={5} style={{ ...inputStyle, minHeight: '118px', resize: 'none', paddingBlock: '14px' }} />
      </label>

      <div style={{ display: 'flex', gap: '12px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
          <span style={labelStyle}>Kategori</span>
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} style={inputStyle}>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
          <span style={labelStyle}>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as IdeaStatus)} style={inputStyle}>
            <option value="not_started">Belum Mulai</option>
            <option value="in_progress">Berjalan</option>
            <option value="completed">Selesai</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={!canSave}
        style={{
          minHeight: '54px',
          borderRadius: '18px',
          backgroundColor: '#7C5CFC',
          color: '#FFFFFF',
          border: 'none',
          opacity: canSave ? 1 : 0.62,
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          fontSize: '15px',
          fontWeight: 800,
          cursor: canSave ? 'pointer' : 'not-allowed',
        }}
      >
        Simpan teks ide
      </button>
    </form>
  );
}

const labelStyle = {
  fontSize: '13px',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontWeight: 700,
  color: '#4A4458',
} as const;

const inputStyle = {
  width: '100%',
  minHeight: '50px',
  border: '1px solid #E8E4F0',
  borderRadius: '14px',
  backgroundColor: '#FFFFFF',
  color: '#4A4458',
  outline: 'none',
  padding: '0 14px',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontSize: '14px',
  boxSizing: 'border-box',
} as const;
