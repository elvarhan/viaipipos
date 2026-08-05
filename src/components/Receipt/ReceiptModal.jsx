import React from 'react';
import { usePos } from '../../context/PosContext';
import { X, Printer, CheckCircle2 } from 'lucide-react';

export default function ReceiptModal() {
  const { activeReceipt, setActiveReceipt } = usePos();

  if (!activeReceipt) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const txDate = new Date(activeReceipt.date).toLocaleString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
            <span>Struk Bukti Pembayaran</span>
          </div>
          <button className="modal-close" onClick={() => setActiveReceipt(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ backgroundColor: 'var(--bg-main)', padding: '20px' }}>
          {/* Thermal Receipt Paper */}
          <div className="receipt-paper">
            <div className="receipt-header">
              <div className="receipt-title">NUSAPOS RESTO</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: '2px' }}>{activeReceipt.branchName || 'Cabang Utama Jakarta'}</div>
              <div style={{ fontSize: '0.7rem', color: '#666' }}>Sistem Kasir & KDS Realtime</div>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-row">
              <span>No. TRX:</span>
              <span>{activeReceipt.id}</span>
            </div>
            <div className="receipt-row">
              <span>Waktu:</span>
              <span>{txDate}</span>
            </div>
            <div className="receipt-row">
              <span>Kasir:</span>
              <span>{activeReceipt.cashierName}</span>
            </div>
            <div className="receipt-row">
              <span>Pelanggan:</span>
              <span>{activeReceipt.customerName || 'Pelanggan Umum'}</span>
            </div>
            <div className="receipt-row">
              <span>Tipe Order:</span>
              <span>{activeReceipt.orderType} ({activeReceipt.tableName || '-'})</span>
            </div>

            <div className="receipt-divider" />

            {/* Items */}
            {activeReceipt.items.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '6px' }}>
                <div style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name}</span>
                  <span style={{ fontSize: '0.68rem', color: '#666' }}>[{item.station || 'Dapur'}]</span>
                </div>
                {item.notes && (
                  <div style={{ fontSize: '0.7rem', color: '#c53030', fontStyle: 'italic' }}>
                    * {item.notes}
                  </div>
                )}
                <div className="receipt-row" style={{ fontSize: '0.75rem', color: '#444' }}>
                  <span>{item.qty} x {formatCurrency(item.price)}</span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              </div>
            ))}

            <div className="receipt-divider" />

            <div className="receipt-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(activeReceipt.subtotal)}</span>
            </div>

            <div className="receipt-row">
              <span>PPN (10%):</span>
              <span>{formatCurrency(activeReceipt.tax)}</span>
            </div>

            {activeReceipt.discount > 0 && (
              <div className="receipt-row">
                <span>Diskon:</span>
                <span>-{formatCurrency(activeReceipt.discount)}</span>
              </div>
            )}

            <div className="receipt-divider" />

            <div className="receipt-row bold" style={{ fontSize: '0.95rem' }}>
              <span>TOTAL:</span>
              <span>{formatCurrency(activeReceipt.total)}</span>
            </div>

            <div className="receipt-row">
              <span>BAYAR ({activeReceipt.paymentMethod}):</span>
              <span>{formatCurrency(activeReceipt.amountPaid)}</span>
            </div>

            <div className="receipt-row">
              <span>KEMBALIAN:</span>
              <span>{formatCurrency(activeReceipt.change)}</span>
            </div>

            <div className="receipt-divider" />

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: '#555' }}>
              <div>Pesanan telah dikirim ke Monitor Dapur & Bar!</div>
              <div style={{ fontSize: '0.65rem', marginTop: '4px' }}>Terima kasih atas kunjungan Anda</div>
              <div style={{ marginTop: '8px', fontWeight: 700 }}>=== NUSAPOS VERIFIED ===</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setActiveReceipt(null)}>
            Tutup
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
}
