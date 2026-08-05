import React from 'react';
import { usePos } from '../../context/PosContext';
import { X, PlayCircle, Clock } from 'lucide-react';

export default function HoldCartModal() {
  const { 
    showHoldCartModal, 
    setShowHoldCartModal, 
    heldCarts, 
    restoreCart 
  } = usePos();

  if (!showHoldCartModal) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">Daftar Keranjang Tersimpan</div>
          <button className="modal-close" onClick={() => setShowHoldCartModal(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {heldCarts.length === 0 ? (
            <div style={{ textAlignment: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
              Tidak ada keranjang tersimpan saat ini.
            </div>
          ) : (
            heldCarts.map((item) => {
              const itemTotal = item.cart.reduce((s, i) => s + (i.price * i.qty), 0);
              return (
                <div 
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.note}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Clock size={12} />
                      <span>{item.time}</span>
                      <span>• {item.cart.length} Jenis Item</span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                      Total: {formatCurrency(itemTotal)}
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      restoreCart(item.id);
                      setShowHoldCartModal(false);
                    }}
                  >
                    <PlayCircle size={16} />
                    <span>Lanjutkan</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
