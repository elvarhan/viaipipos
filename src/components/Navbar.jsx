import React, { useState, useEffect } from 'react';
import { usePos } from '../context/PosContext';
import { ShoppingBag, Sun, Moon, Clock, UserCheck, PauseCircle, Building2, ShieldAlert, QrCode } from 'lucide-react';

export default function Navbar() {
  const { 
    theme, setTheme, 
    heldCarts, 
    setShowHoldCartModal,
    branches, activeBranch, setActiveBranch,
    activeRole, handleRoleChange,
    activeUser,
    pendingSelfOrders,
    setActiveTab
  } = usePos();

  const [time, setTime] = useState(new Date().toLocaleTimeString('id-ID'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="app-header">
      <div className="brand-container">
        <div className="brand-icon">
          <ShoppingBag size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-name">NusaPOS</span>
            <span className="brand-badge">ULTIMATE v2.0</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sistem Kasir & Restoran Multi Cabang</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Pending Customer Self Orders Notification */}
        {pendingSelfOrders.length > 0 && (
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('pos')}
            style={{ position: 'relative', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
          >
            <QrCode size={16} />
            <span>Pesanan QR Masuk</span>
            <span style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              fontWeight: 900,
              borderRadius: '99px',
              padding: '1px 6px',
              fontSize: '0.7rem'
            }}>
              {pendingSelfOrders.length}
            </span>
          </button>
        )}

        {/* Branch Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-card)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Building2 size={16} style={{ color: 'var(--accent)' }} />
          <select 
            value={activeBranch} 
            onChange={(e) => setActiveBranch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all" style={{ backgroundColor: 'var(--bg-card)' }}>🌐 Semua Cabang (Pusat)</option>
            {branches.map(b => (
              <option key={b.id} value={b.id} style={{ backgroundColor: 'var(--bg-card)' }}>📍 {b.name}</option>
            ))}
          </select>
        </div>

        {/* Role Switcher Demo Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-card)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <ShieldAlert size={16} style={{ color: 'var(--warning)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Role:</span>
          <select 
            value={activeRole} 
            onChange={(e) => handleRoleChange(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', outline: 'none' }}
          >
            <option value="Owner" style={{ backgroundColor: 'var(--bg-card)' }}>👑 Owner (Akses Penuh)</option>
            <option value="Admin" style={{ backgroundColor: 'var(--bg-card)' }}>⚙️ Admin Cabang</option>
            <option value="Kasir" style={{ backgroundColor: 'var(--bg-card)' }}>💵 Kasir</option>
            <option value="Dapur" style={{ backgroundColor: 'var(--bg-card)' }}>🍳 Staf Dapur (KDS)</option>
            <option value="Bar" style={{ backgroundColor: 'var(--bg-card)' }}>☕ Staf Bar (BDS)</option>
          </select>
        </div>

        {/* Active User Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          fontSize: '0.8rem', 
          padding: '6px 12px', 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '99px' 
        }}>
          <UserCheck size={14} style={{ color: 'var(--success)' }} />
          <span style={{ fontWeight: '700' }}>{activeUser?.name || 'Staf NusaPOS'}</span>
        </div>

        {/* Realtime Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Clock size={15} />
          <span>{time}</span>
        </div>

        {/* Hold Cart Badge & Trigger */}
        {heldCarts.length > 0 && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowHoldCartModal(true)}
            style={{ position: 'relative' }}
          >
            <PauseCircle size={16} style={{ color: 'var(--warning)' }} />
            <span>Tersimpan</span>
            <span style={{
              backgroundColor: 'var(--warning)',
              color: '#000',
              fontWeight: 800,
              borderRadius: '99px',
              padding: '1px 6px',
              fontSize: '0.7rem'
            }}>
              {heldCarts.length}
            </span>
          </button>
        )}

        {/* Theme Toggle */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Ganti Tema Warna"
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#3b82f6' }} />}
        </button>
      </div>
    </header>
  );
}
