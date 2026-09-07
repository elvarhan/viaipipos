import React, { useState, useEffect } from 'react';
import { usePos } from '../context/PosContext';
import { ShoppingBag, Sun, Moon, Clock, UserCheck, PauseCircle, Building2, ShieldAlert, QrCode, LogOut, Receipt, Cloud } from 'lucide-react';

export default function Navbar() {
  const { 
    theme, setTheme, 
    openBills, 
    setShowHoldCartModal,
    branches, activeBranch, setActiveBranch,
    activeRole, handleRoleChange,
    activeUser,
    logoutUser,
    pendingSelfOrders,
    setActiveTab,
    seedAllDataToFirebase
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
          <ShoppingBag size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-name">NusaPOS</span>
            <span className="brand-badge">v2.0</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Sistem Restoran Multi Role & Cabang</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Firebase Sync Button */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => seedAllDataToFirebase(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}
          title="Upload / Sync Data ke Firebase Firestore"
        >
          <Cloud size={15} />
          <span style={{ fontWeight: 600 }}>Sync Firebase</span>
        </button>

        {/* Open Bills Quick Access */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setActiveTab('pos');
            setShowHoldCartModal(true);
          }}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          title="Kelola Tagihan Terbuka (Open Bill)"
        >
          <Receipt size={15} style={{ color: 'var(--accent)' }} />
          <span style={{ fontWeight: 600 }}>Open Bill</span>
          <span style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: '99px',
            padding: '1px 7px',
            fontSize: '0.7rem'
          }}>
            {openBills ? openBills.length : 0}
          </span>
        </button>

        {/* Pending Customer Self Orders Notification */}
        {pendingSelfOrders.length > 0 && (
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('pos')}
            style={{ position: 'relative', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
          >
            <QrCode size={15} />
            <span>Pesanan QR</span>
            <span style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              fontWeight: 500,
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
          <Building2 size={15} style={{ color: 'var(--accent)' }} />
          <select 
            value={activeBranch} 
            onChange={(e) => setActiveBranch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all" style={{ backgroundColor: 'var(--bg-card)' }}>🌐 Semua Cabang</option>
            {branches.map(b => (
              <option key={b.id} value={b.id} style={{ backgroundColor: 'var(--bg-card)' }}>📍 {b.name}</option>
            ))}
          </select>
        </div>

        {/* Active User Badge & Logout */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '0.8rem', 
          padding: '4px 10px', 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '99px' 
        }}>
          <UserCheck size={14} style={{ color: 'var(--success)' }} />
          <span>{activeUser?.name || 'Staf Kasir'} ({activeRole})</span>
          <button 
            onClick={logoutUser} 
            style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
            title="Keluar / Logout"
          >
            <LogOut size={14} />
          </button>
        </div>

        {/* Realtime Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <Clock size={14} />
          <span>{time}</span>
        </div>

        {/* Theme Toggle */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Ganti Tema Warna"
        >
          {theme === 'dark' ? <Sun size={16} style={{ color: '#f59e0b' }} /> : <Moon size={16} style={{ color: '#3b82f6' }} />}
        </button>
      </div>
    </header>
  );
}
