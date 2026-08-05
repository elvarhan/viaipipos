import React from 'react';
import { usePos } from '../../context/PosContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export default function ToastNotification() {
  const { toasts } = usePos();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let bg = 'var(--bg-card)';
        let border = 'var(--border-color)';
        let Icon = Info;
        let iconColor = 'var(--primary)';

        if (toast.type === 'success') {
          bg = 'var(--bg-card)';
          border = 'var(--success)';
          Icon = CheckCircle2;
          iconColor = 'var(--success)';
        } else if (toast.type === 'danger') {
          bg = 'var(--bg-card)';
          border = 'var(--danger)';
          Icon = XCircle;
          iconColor = 'var(--danger)';
        } else if (toast.type === 'warning') {
          bg = 'var(--bg-card)';
          border = 'var(--warning)';
          Icon = AlertTriangle;
          iconColor = 'var(--warning)';
        }

        return (
          <div 
            key={toast.id}
            style={{
              padding: '12px 18px',
              backgroundColor: bg,
              borderLeft: `4px solid ${border}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(10px)',
              pointerEvents: 'auto',
              minWidth: '280px'
            }}
          >
            <Icon size={18} style={{ color: iconColor }} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
