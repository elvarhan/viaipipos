import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { QrCode, X, Check, XCircle, CreditCard, Clock, Utensils, AlertCircle } from 'lucide-react';

export default function PendingSelfOrdersModal({ isOpen, onClose }) {
  const { pendingSelfOrders, approveCustomerOrder, rejectCustomerOrder } = usePos();
  const [selectedPayment, setSelectedPayment] = useState('TUNAI');

  if (!isOpen) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', width: '90%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <QrCode size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Konfirmasi Pesanan Pelanggan (QR Mandiri)</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {pendingSelfOrders.length} Pesanan Menunggu Konfirmasi Kasir
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        {/* List of Pending Self Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
          {pendingSelfOrders.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Check size={40} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>Tidak ada antrean pesanan pelanggan</div>
              <span style={{ fontSize: '0.8rem' }}>Pesanan baru yang dikirim oleh pelanggan dari scan QR akan muncul di sini.</span>
            </div>
          ) : (
            pendingSelfOrders.map(ord => (
              <div key={ord.id} style={{
                backgroundColor: 'var(--bg-surface)',
                border: '2px solid var(--primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {/* Order Meta Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--primary)', fontSize: '0.95rem' }}>{ord.id}</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.82rem', fontWeight: 700, marginTop: '2px' }}>
                      <span>👤 {ord.customerName}</span>
                      <span>•</span>
                      <span style={{ color: '#047857' }}>📍 {ord.tableName}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', fontWeight: 800, padding: '2px 8px', borderRadius: '99px' }}>
                      MENUNGGU KASIR
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} /> {ord.time}
                    </div>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ord.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{item.qty}x {item.name}</div>
                        {item.notes && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', fontStyle: 'italic' }}>Catatan: "{item.notes}"</div>}
                      </div>
                      <div style={{ fontWeight: 800, fontFamily: 'monospace' }}>{formatCurrency(item.subtotal || item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>

                {/* Total & Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Tagihan:</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#047857', fontFamily: 'monospace' }}>{formatCurrency(ord.total)}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select 
                      value={selectedPayment} 
                      onChange={e => setSelectedPayment(e.target.value)}
                      style={{ padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      <option value="TUNAI">💵 Tunai</option>
                      <option value="QRIS">📱 QRIS</option>
                      <option value="DEBIT">💳 Kartu Debit</option>
                    </select>

                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectCustomerOrder(ord.id)}
                    >
                      <XCircle size={14} /> Tolak
                    </button>

                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => approveCustomerOrder(ord.id, selectedPayment, ord.total)}
                    >
                      <Check size={14} /> Konfirmasi & Bayar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
