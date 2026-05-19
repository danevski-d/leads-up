import { useState } from 'react'

export default function ChatWidget() {
  const [open, setOpen]   = useState(false)
  const [seen, setSeen]   = useState(false)

  const handleOpen = () => {
    setOpen(o => !o)
    if (!seen) setSeen(true)
  }

  return (
    <>
      <style>{`
        @keyframes cw-slidein {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes cw-slideout {
          from { opacity: 1; transform: translateY(0)    scale(1);    }
          to   { opacity: 0; transform: translateY(16px) scale(0.97); }
        }
        .cw-panel-open  { animation: cw-slidein  0.22s cubic-bezier(0.22,1,0.36,1) forwards; }
        .cw-panel-close { animation: cw-slideout 0.18s ease-in          forwards; }

        @media (max-width: 767px) {
          .cw-iframe { width: 100vw !important; height: 580px !important; border-radius: 16px 16px 0 0 !important; }
          .cw-panel  { right: 0 !important; left: 0 !important; bottom: 84px !important; width: 100vw !important; }
        }
      `}</style>

      {/* Floating panel */}
      {open && (
        <div
          className="cw-panel cw-panel-open"
          style={{
            position: 'fixed',
            bottom: 92,
            right: 24,
            zIndex: 9999,
            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <iframe
            className="cw-iframe"
            src="/chatbot.html"
            title="Leads Up Chat"
            style={{
              display: 'block',
              width: 440,
              height: 680,
              border: 'none',
              borderRadius: 16,
            }}
          />
        </div>
      )}

      {/* Launcher bubble */}
      <button
        onClick={handleOpen}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 10000,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#7c6ef7',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(124,110,247,0.5)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,110,247,0.65)' }}
        onMouseOut={e  => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,110,247,0.5)'  }}
      >
        {/* Icon toggles between chat and X */}
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}

        {/* Notification badge */}
        {!seen && (
          <span style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid #080A0F',
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
            1
          </span>
        )}
      </button>
    </>
  )
}
