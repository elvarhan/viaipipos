import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { ShoppingBag, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, QrCode } from 'lucide-react';

export default function LoginView() {
  const { loginUser, setActiveTab } = usePos();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: '👑 Owner', user: 'owner', pass: '123', bg: 'rgba(16, 185, 129, 0.1)', color: '#047857' },
    { role: '⚙️ Admin', user: 'admin', pass: '123', bg: 'rgba(59, 130, 246, 0.1)', color: '#1d4ed8' },
    { role: '💵 Kasir', user: 'kasir', pass: '123', bg: 'rgba(245, 158, 11, 0.1)', color: '#b45309' },
    { role: '🍳 Dapur', user: 'dapur', pass: '123', bg: 'rgba(239, 68, 68, 0.1)', color: '#b91c1c' },
    { role: '☕ Bar', user: 'bar', pass: '123', bg: 'rgba(139, 92, 246, 0.1)', color: '#6d28d9' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const success = loginUser(username, password);
    if (!success) {
      setError('Username atau Password salah! (Default Password: 123)');
    }
  };

  const fillDemoAccount = (acc) => {
    setUsername(acc.user);
    setPassword(acc.pass);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="modal-card" style={{
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 28px'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 12px auto',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <ShoppingBag size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-main)' }}>Masuk ke NusaPOS</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sistem Kasir & Restoran Multi Role</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            fontSize: '0.82rem',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: 400
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="search-input-wrap">
              <User size={18} />
              <input 
                type="text"
                className="search-input"
                placeholder="Masukkan username (misal: owner / kasir)..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="search-input-wrap" style={{ position: 'relative' }}>
              <Lock size={18} />
              <input 
                type={showPassword ? 'text' : 'password'}
                className="search-input"
                placeholder="Masukkan password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '6px', fontSize: '0.92rem' }}>
            <ShieldCheck size={18} />
            <span>Masuk ke Sistem</span>
          </button>
        </form>

        {/* Demo Accounts Quick Chips */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textAlign: 'center' }}>
            Pilih Akun Demo (Klik 1-Kali untuk Masuk):
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            {demoAccounts.map((acc, idx) => (
              <button 
                key={idx}
                type="button"
                onClick={() => fillDemoAccount(acc)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '99px',
                  border: 'none',
                  backgroundColor: acc.bg,
                  color: acc.color,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                {acc.role} (pass: 123)
              </button>
            ))}
          </div>
        </div>

        {/* Customer Self-Order Direct Access */}
        <div style={{ marginTop: '18px', textAlign: 'center' }}>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('self-order')}
            style={{ fontSize: '0.8rem', gap: '6px', width: '100%' }}
          >
            <QrCode size={14} style={{ color: 'var(--primary)' }} />
            <span>Tampilan Pelanggan Self-Order (Tanpa Login)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
