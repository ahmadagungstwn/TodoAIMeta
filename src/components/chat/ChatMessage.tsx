import type { AiMessage } from '../../types';

export function ChatMessage({ message }: { message: AiMessage }) {
  const isUser = message.role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {!isUser && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '10px',
            backgroundColor: '#7C5CFC',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        </div>
      )}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '16px',
          borderBottomRightRadius: isUser ? '4px' : '16px',
          borderTopLeftRadius: !isUser ? '4px' : '16px',
          backgroundColor: isUser ? '#7C5CFC' : '#FFFFFF',
          backgroundImage: isUser ? 'linear-gradient(135deg, #7C5CFC, #6342E7)' : 'none',
          border: isUser ? 'none' : '1px solid #E8E4F0',
          color: isUser ? '#FFFFFF' : '#4A4458',
          fontSize: '14px',
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          lineHeight: '20px',
          whiteSpace: 'pre-wrap',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.01)',
        }}
      >
        {message.content}
      </div>
    </div>
  );
}
