import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useChat } from '../../lib/useChat';
import { SendIcon, StopIcon } from '../icons/Icons';
import { AppShell } from '../layout/AppShell';
import { ChatMessage } from './ChatMessage';

const suggestions = ['Saran stack', 'Buat MVP', 'Buat user flow', 'Analisis ide'];

interface ChatScreenProps {
  userId?: string;
}

export function ChatScreen({ userId }: ChatScreenProps) {
  const { messages, loading, sending, error, isConfigured, sendMessage, stopGeneration } = useChat(userId);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, sending]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) {
      stopGeneration();
      return;
    }
    const nextMessage = message.trim();
    if (!nextMessage) return;
    setMessage('');
    await sendMessage(nextMessage);
  };

  const handleSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <AppShell activeNav="chat">
      <div
        style={{
          backgroundColor: '#F8F7FA',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          fontSynthesis: 'none',
          height: '100%',
          MozOsxFontSmoothing: 'grayscale',
          overflow: 'clip',
          WebkitFontSmoothing: 'antialiased',
          width: '390px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 12px', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '20px', letterSpacing: '-0.02em', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 700, lineHeight: '24px', color: '#4A4458', margin: 0 }}>
              AI Chat Umum
            </h1>
            <p style={{ fontSize: '13px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontWeight: 400, color: '#8E8A9A', margin: 0, marginTop: '2px' }}>
              Tidak terhubung ke ide tertentu.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '15px',
              backgroundColor: '#7C5CFC',
              color: '#FFFFFF',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: 800,
            }}
          >
            AI
          </div>
        </div>

        <div className="hide-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingInline: '24px', paddingBlock: '8px', flexShrink: 0 }}>
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              style={{
                flexShrink: 0,
                paddingBlock: '8px',
                paddingInline: '16px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                color: '#7C5CFC',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                border: '1px solid #E8E4F0',
                cursor: 'pointer',
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <section
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingInline: '24px',
            paddingBlock: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((chatMessage) => (
            <ChatMessage key={chatMessage.id} message={chatMessage} />
          ))}

          {sending && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '82%' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '10px',
                  backgroundColor: '#7C5CFC',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  height: '28px',
                  paddingInline: '14px',
                  boxSizing: 'border-box',
                  borderRadius: '18px 18px 18px 6px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E4F0',
                }}
                aria-label="AI sedang memproses"
              >
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            </div>
          )}

          {loading && messages.length <= 1 && (
            <p style={{ margin: 0, color: '#8E8A9A', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: '13px', textAlign: 'center', paddingTop: '16px' }}>
              Menyiapkan chat...
            </p>
          )}

          {error && (
            <p style={{ margin: 0, color: '#B45309', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '10px 12px', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', fontSize: '12px', lineHeight: '18px' }}>
              {error}
            </p>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingBlock: '6px',
            paddingInline: '12px',
            marginInline: '24px',
            marginBottom: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E8E4F0',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={isConfigured ? 'Tulis pesan...' : 'API key OpenRouter belum siap...'}
            disabled={sending || !isConfigured}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              color: '#4A4458',
              background: 'transparent',
              paddingLeft: '4px',
            }}
          />
          <button
            type={sending ? 'button' : 'submit'}
            onClick={sending ? stopGeneration : undefined}
            disabled={(!message.trim() && !sending) || !isConfigured}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: sending || (message.trim() && isConfigured) ? '#7C5CFC' : '#F0EDFA',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: sending || (message.trim() && isConfigured) ? '#FFFFFF' : '#8E8A9A',
              cursor: sending || (message.trim() && isConfigured) ? 'pointer' : 'not-allowed',
            }}
            aria-label={sending ? 'Hentikan respons AI' : 'Kirim pesan'}
          >
            {sending ? <StopIcon style={{ width: '17px', height: '17px' }} /> : <SendIcon style={{ width: '16px', height: '16px' }} />}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
