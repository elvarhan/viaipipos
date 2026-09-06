import React from 'react';
import { usePos } from '../../context/PosContext';
import { X, Printer, Receipt, Utensils, Clock, User, ShieldAlert } from 'lucide-react';

export default function PreBillModal({ isOpen, onClose, billData }) {
  const { activeUser, branches, activeBranch } = usePos();

  if (!isOpen || !billData) return null;

  const currentBranchObj = branches.find(b => b.id === (billData.branchId || activeBranch)) || branches[0];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content" style={{ maxWidth: '420px', padding: '0', overflow: 'hidden' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '14px 20px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
            <Receipt size={18} style={{ color: 'var(--accent)' }} />
            <span>Struk Tagihan Sementara (Pre-Bill)</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Thermal Receipt View */}
        <div className="modal-body" style={{ padding: '20px', backgroundColor: '#f8fafc', overflowY: 'auto', maxHeight: '75vh' }}>
          <div id="printable-prebill" style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            border: '1px border-dashed #cbd5e1',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '0.85rem',
            color: '#1e293b'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '14px', borderBottom: '2px dashed #94a3b8', paddingBottom: '12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {currentBranchObj ? currentBranchObj.name : 'NusaPOS Resto & Cafe'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {currentBranchObj ? currentBranchObj.address : 'Jl. Utama Nusa No. 88'}
              </div>
              <div style={{
                marginTop: '8px',
                padding: '4px 8px',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                *** TAGIHAN SEMENTARA (PRE-BILL) ***
              </div>
            </div>

            {/* Meta Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '10px', marginBottom: '10px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>No. Bill:</span>
                <span style={{ fontWeight: 'bold' }}>{billData.billNumber || billData.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Waktu:</span>
                <span>{billData.time || new Date().toLocaleTimeString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Meja / Tipe:</span>
                <span style={{ fontWeight: 'bold' }}>{billData.tableName || 'Take Away'} ({billData.orderType})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Pelanggan:</span>
                <span>{billData.customerName || 'Pelanggan Umum'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Kasir/Waiter:</span>
                <span>{billData.cashierName || activeUser?.name || 'Staf Kasir'}</span>
              </div>
            </div>

            {/* Item List Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr', fontWeight: 'bold', borderBottom: '1px dashed #94a3b8', paddingBottom: '4px', marginBottom: '6px' }}>
              <span>Item</span>
              <span style={{ textAlign: 'center' }}>Qty</span>
              <span style={{ textAlign: 'right' }}>Total</span>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '10px', marginBottom: '10px' }}>
              {billData.items && billData.items.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr' }}>
                    <span style={{ fontWeight: '500' }}>{item.name}</span>
                    <span style={{ textAlign: 'center' }}>x{item.qty}</span>
                    <span style={{ textAlign: 'right' }}>{formatCurrency(item.price * item.qty)}</span>
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', marginLeft: '6px' }}>
                      * {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '2px dashed #94a3b8', paddingBottom: '10px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(billData.subtotal)}</span>
              </div>
              {billData.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                  <span>Diskon:</span>
                  <span>-{formatCurrency(billData.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>PPN (10%):</span>
                <span>{formatCurrency(billData.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #cbd5e1' }}>
                <span>TOTAL TAGIHAN:</span>
                <span>{formatCurrency(billData.total)}</span>
              </div>
            </div>

            {/* Notice Footer */}
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontWeight: 'bold', color: '#0f172a' }}>TERIMA KASIH ATAS KUNJUNGAN ANDA</div>
              <div>* Ini adalah struk tagihan sementara sebelum pembayaran lunas *</div>
              <div>Mohon serahkan struk ini ke kasir saat melakukan pembayaran.</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{ padding: '14px 20px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Tutup</button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={15} />
            <span>Cetak Struk Pre-Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}
