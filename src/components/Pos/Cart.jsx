import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, PauseCircle, Tag, Utensils, ShoppingBag, QrCode, User, Edit3, ChefHat, Coffee } from 'lucide-react';

export default function Cart() {
  const {
    cart, updateCartQty, updateCartNotes, removeFromCart, clearCart,
    cartDiscount, setCartDiscount,
    cartSubtotal, cartTax, cartTotal,
    holdCurrentCart, setShowPaymentModal,
    orderType, setOrderType,
    tables, selectedTable, setSelectedTable,
    customers, selectedCustomer, setSelectedCustomer,
    activeBranch
  } = usePos();

  const [discountInput, setDiscountInput] = useState('');
  const [showDiscountField, setShowDiscountField] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleApplyDiscount = () => {
    const val = parseFloat(discountInput) || 0;
    setCartDiscount(val);
    setShowDiscountField(false);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Filter available tables for the active branch
  const availableTables = tables.filter(t => activeBranch === 'all' || t.branchId === 'all' || t.branchId === activeBranch);

  return (
    <div className="pos-cart">
      {/* Order Mode & Details Bar (Dine In / Take Away) */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Order Mode Switcher */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-card)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn btn-sm ${orderType === 'Dine In' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, borderRadius: 'var(--radius-sm)', justifyContent: 'center' }}
            onClick={() => setOrderType('Dine In')}
          >
            <Utensils size={14} />
            <span>Dine In (Makan Sini)</span>
          </button>
          <button 
            className={`btn btn-sm ${orderType === 'Take Away' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, borderRadius: 'var(--radius-sm)', justifyContent: 'center' }}
            onClick={() => setOrderType('Take Away')}
          >
            <ShoppingBag size={14} />
            <span>Take Away (Bawa Pulang)</span>
          </button>
        </div>

        {/* Dine In Table Selector & Customer Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: orderType === 'Dine In' ? '1fr 1fr' : '1fr', gap: '8px' }}>
          {orderType === 'Dine In' && (
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <QrCode size={12} /> Pilih Meja:
              </label>
              <select 
                className="form-control" 
                style={{ fontSize: '0.8rem', padding: '4px 8px', height: '32px' }}
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                {availableTables.map(tbl => (
                  <option key={tbl.id} value={tbl.id}>
                    {tbl.number} ({tbl.type}) - {tbl.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={12} /> Nama Pelanggan:
            </label>
            <select 
              className="form-control" 
              style={{ fontSize: '0.8rem', padding: '4px 8px', height: '32px' }}
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone !== '-' ? `(${c.phone})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="cart-header">
        <div className="cart-title">
          <ShoppingCart size={18} style={{ color: 'var(--accent)' }} />
          <span>Pesanan Aktif</span>
          <span className="cart-badge">{totalItemsCount}</span>
        </div>
        {cart.length > 0 && (
          <button 
            className="btn btn-danger btn-sm"
            onClick={clearCart}
            title="Kosongkan Keranjang"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="cart-items-list">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <span style={{ fontSize: '3rem' }}>🛒</span>
            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Keranjang Masih Kosong</p>
            <span style={{ fontSize: '0.8rem' }}>Klik produk di sebelah kiri untuk menambah item ke pesanan.</span>
          </div>
        ) : (
          cart.map(item => {
            const isDapur = (item.station || 'Dapur') === 'Dapur';
            return (
              <div key={item.id} className="cart-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '1.4rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-input)', borderRadius: '6px' }}>
                    {item.emoji || '🍽️'}
                  </div>
                  <div className="cart-item-details" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="cart-item-title">{item.name}</span>
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '99px',
                        backgroundColor: isDapur ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isDapur ? 'var(--danger)' : 'var(--warning)'
                      }}>
                        {isDapur ? 'Dapur' : 'Bar'}
                      </span>
                    </div>
                    <div className="cart-item-price">{formatCurrency(item.price)}</div>
                  </div>
                  <div className="cart-qty-controls">
                    <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>
                      <Minus size={13} />
                    </button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Notes Input per item */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {editingNoteId === item.id ? (
                    <input 
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                      placeholder="Catatan pesanan (mis: Pedas/Less Ice)..."
                      value={item.notes || ''}
                      autoFocus
                      onBlur={() => setEditingNoteId(null)}
                      onChange={(e) => updateCartNotes(item.id, e.target.value)}
                    />
                  ) : (
                    <button 
                      onClick={() => setEditingNoteId(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: item.notes ? 'var(--accent)' : 'var(--text-muted)',
                        fontSize: '0.73rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        padding: '2px 4px'
                      }}
                    >
                      <Edit3 size={11} />
                      <span>{item.notes ? `Catatan: "${item.notes}"` : '+ Catatan khusus (level pedas, gula, dll)'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Footer Summary & Checkout */}
      {cart.length > 0 && (
        <div className="cart-footer">
          {/* Subtotal */}
          <div className="summary-row">
            <span>Subtotal</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(cartSubtotal)}</span>
          </div>

          {/* Tax PPN 10% */}
          <div className="summary-row">
            <span>PPN (10%)</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(cartTax)}</span>
          </div>

          {/* Discount Row */}
          <div className="summary-row">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--accent)' }} onClick={() => setShowDiscountField(!showDiscountField)}>
              <Tag size={14} />
              {cartDiscount > 0 ? `Diskon (-${formatCurrency(cartDiscount)})` : '+ Tambah Diskon'}
            </span>
            {cartDiscount > 0 && (
              <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                -{formatCurrency(cartDiscount)}
              </span>
            )}
          </div>

          {/* Discount Input Form */}
          {showDiscountField && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <input 
                type="number"
                className="form-control"
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                placeholder="Jumlah Diskon (Rp)"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" onClick={handleApplyDiscount}>Terapkan</button>
            </div>
          )}

          {/* Total Row */}
          <div className="summary-row total">
            <span>TOTAL BAYAR</span>
            <span className="total-amount">{formatCurrency(cartTotal)}</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1 }}
              onClick={() => holdCurrentCart()}
              title="Simpan sementara transaksi pelanggan"
            >
              <PauseCircle size={16} />
              <span>Simpan</span>
            </button>
            <button 
              className="btn btn-success" 
              style={{ flex: 2 }}
              onClick={() => setShowPaymentModal(true)}
            >
              <CreditCard size={18} />
              <span>PROSES BAYAR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
