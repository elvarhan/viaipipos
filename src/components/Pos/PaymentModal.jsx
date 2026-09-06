import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { X, Banknote, QrCode, CreditCard, Building2, CheckCircle2, AlertCircle, ArrowRight, Printer } from 'lucide-react';

export default function PaymentModal() {
  const { 
    showPaymentModal, 
    setShowPaymentModal, 
    cart,
    cartTotal, 
    processPayment,
    activeUser,
    showToast
  } = usePos();

  const [paymentMethod, setPaymentMethod] = useState('TUNAI');
  const [amountPaid, setAmountPaid] = useState('');
  const [cashierName, setCashierName] = useState(activeUser?.name || 'Kasir Bertugas');
  const [shouldPrint, setShouldPrint] = useState(true);

  if (!showPaymentModal) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const parsedAmount = parseFloat(amountPaid) || (paymentMethod !== 'TUNAI' ? cartTotal : 0);
  const change = Math.max(0, parsedAmount - cartTotal);
  const isInsufficient = paymentMethod === 'TUNAI' && (parsedAmount < cartTotal || !amountPaid);

  const quickCashOptions = [
    { label: 'Uang Pas', value: cartTotal },
    { label: 'Rp 30.000', value: 30000 },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 200.000', value: 200000 }
  ];

  const handleCheckoutSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!cart || cart.length === 0) {
      showToast('Keranjang pesanan kosong! Silakan tambahkan menu terlebih dahulu.', 'warning');
      setShowPaymentModal(false);
      return;
    }

    // Auto-fill cash amount to exact total if left empty
    let finalAmountPaid = parsedAmount;
    if (paymentMethod === 'TUNAI' && (!amountPaid || parseFloat(amountPaid) <= 0)) {
      finalAmountPaid = cartTotal;
    } else if (paymentMethod === 'TUNAI' && finalAmountPaid < cartTotal) {
      const remaining = cartTotal - finalAmountPaid;
      showToast(`Uang pembayaran kurang ${formatCurrency(remaining)}! Silakan masukkan nominal yang cukup.`, 'danger');
      return;
    }

    processPayment({
      paymentMethod,
      amountPaid: finalAmountPaid,
      cashierName: cashierName || activeUser?.name || 'Kasir Bertugas',
      autoPrint: shouldPrint
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '14px' }}>
          <div className="modal-title" style={{ fontSize: '1.1rem', fontWeight: 500 }}>Pembayaran Kasir</div>
          <button className="modal-close" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setShowPaymentModal(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Total Tagihan Box */}
          <div style={{
            backgroundColor: 'var(--primary-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>TOTAL TAGIHAN</span>
            <div style={{ fontSize: '2.1rem', fontWeight: 500, color: 'var(--primary-dark)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {formatCurrency(cartTotal)}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="form-group">
            <label className="form-label">Pilih Metode Pembayaran</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                type="button"
                className={`btn ${paymentMethod === 'TUNAI' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  setPaymentMethod('TUNAI');
                  setAmountPaid('');
                }}
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <Banknote size={18} />
                <span>Tunai (Cash)</span>
              </button>

              <button 
                type="button"
                className={`btn ${paymentMethod === 'QRIS' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  setPaymentMethod('QRIS');
                  setAmountPaid(cartTotal.toString());
                }}
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <QrCode size={18} />
                <span>QRIS Instant</span>
              </button>

              <button 
                type="button"
                className={`btn ${paymentMethod === 'DEBIT' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  setPaymentMethod('DEBIT');
                  setAmountPaid(cartTotal.toString());
                }}
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <CreditCard size={18} />
                <span>Kartu Debit/Kredit</span>
              </button>

              <button 
                type="button"
                className={`btn ${paymentMethod === 'TRANSFER' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  setPaymentMethod('TRANSFER');
                  setAmountPaid(cartTotal.toString());
                }}
                style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
              >
                <Building2 size={18} />
                <span>Transfer Bank</span>
              </button>
            </div>
          </div>

          {/* Cash Payment Input & Real-Time Change Calculator */}
          {paymentMethod === 'TUNAI' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                  💵 Nominal Uang Diterima (Rp)
                </label>
                <input 
                  type="number" 
                  className="form-control"
                  style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 500, padding: '12px 14px' }}
                  placeholder={`Nominal uang (default: ${formatCurrency(cartTotal)})...`}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Quick Cash Buttons */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {quickCashOptions.map((opt, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setAmountPaid(opt.value.toString())}
                    style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* REALTIME AUTOMATIC CHANGE DISPLAY BOX */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: isInsufficient ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.12)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isInsufficient ? 'var(--danger)' : 'var(--primary)'}`,
                marginTop: '4px'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500, color: isInsufficient ? 'var(--danger)' : '#047857' }}>
                    {isInsufficient ? '⚠️ Uang Pembayaran Kurang' : '💰 KEMBALIAN OTOMATIS'}
                  </div>
                  {isInsufficient && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
                      Kurang {formatCurrency(cartTotal - (parsedAmount || 0))}
                    </span>
                  )}
                </div>

                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                  color: isInsufficient ? 'var(--danger)' : 'var(--primary-dark)'
                }}>
                  {isInsufficient ? `- ${formatCurrency(cartTotal - (parsedAmount || 0))}` : formatCurrency(change)}
                </div>
              </div>
            </div>
          )}

          {/* Cashier Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Nama Kasir Bertugas</label>
            <input 
              type="text" 
              className="form-control"
              value={cashierName}
              onChange={(e) => setCashierName(e.target.value)}
            />
          </div>

          {/* Option Checkbox / Toggle Cetak Struk */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              marginTop: '4px'
            }}
            onClick={() => setShouldPrint(!shouldPrint)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 500 }}>
              <Printer size={16} style={{ color: 'var(--primary)' }} />
              <span>Cetak Struk Otomatis setelah bayar</span>
            </div>
            <input 
              type="checkbox" 
              checked={shouldPrint} 
              onChange={(e) => setShouldPrint(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setShowPaymentModal(false)}
              style={{ flex: 1, padding: '12px 14px', fontWeight: 600 }}
            >
              Batal
            </button>

            <button 
              type="button" 
              className="btn btn-success"
              onClick={handleCheckoutSubmit}
              style={{ flex: 2, padding: '12px 14px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}
            >
              {shouldPrint ? <Printer size={18} /> : <CheckCircle2 size={18} />}
              <span>SELESAIKAN TRANSAKSI</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
