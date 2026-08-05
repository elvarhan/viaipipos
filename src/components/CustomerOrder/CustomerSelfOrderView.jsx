import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { QrCode, Search, Plus, Minus, Utensils, Coffee, CheckCircle2, ShoppingBag, Send, Edit3, ArrowRight, User, ShoppingCart, LogOut, ShieldCheck } from 'lucide-react';

export default function CustomerSelfOrderView() {
  const { 
    products, 
    categories, 
    tables, 
    submitCustomerOrder, 
    activeBranch,
    branches,
    setActiveTab
  } = usePos();

  const [customerName, setCustomerName] = useState('Pelanggan Mandiri');
  const [selectedTableNum, setSelectedTableNum] = useState('Meja 01');
  const [orderType, setOrderType] = useState('Dine In');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Local Customer Cart State
  const [custCart, setCustCart] = useState([]);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredProducts = products.filter(p => {
    const matchBranch = activeBranch === 'all' || p.branchId === 'all' || p.branchId === activeBranch;
    const matchCat = category === 'all' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    return matchBranch && matchCat && matchSearch;
  });

  const addToCustCart = (product) => {
    if (product.status === 'Habis' || product.stock <= 0) return;
    setCustCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        ...product,
        qty: 1,
        notes: '',
        station: product.station || 'Dapur'
      }];
    });
  };

  const updateQty = (id, delta) => {
    setCustCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty <= 0) return null;
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const updateNotes = (id, notes) => {
    setCustCart(prev => prev.map(item => item.id === id ? { ...item, notes } : item));
  };

  const subtotal = custCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (custCart.length === 0) return;

    const newOrd = submitCustomerOrder({
      customerName,
      tableName: selectedTableNum,
      orderType,
      items: custCart,
      subtotal,
      tax,
      total
    });

    setSubmittedOrder(newOrd);
    setCustCart([]);
  };

  const activeBranchName = activeBranch === 'all' 
    ? 'Cabang Utama Jakarta' 
    : (branches.find(b => b.id === activeBranch)?.name || 'NusaPOS Resto');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Customer Header Bar */}
      <header style={{
        height: '60px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900
          }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>NusaPOS Digital Menu</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{activeBranchName}</span>
          </div>
        </div>

        {/* Discrete Admin Panel Access Switcher */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('pos')}
          style={{ fontSize: '0.78rem', gap: '6px' }}
          title="Beralih ke Tampilan Admin / Kasir POS"
        >
          <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
          <span>Kembali ke Admin Kasir</span>
        </button>
      </header>

      {/* Main Customer Order Area */}
      <div style={{ flex: 1, padding: '24px', maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Banner & Customer Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #047857)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          color: 'white',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={22} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '2px 10px', borderRadius: '99px' }}>
                  Self-Ordering Menu Digital
                </span>
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '4px' }}>Selamat Datang di {activeBranchName}</h1>
              <span style={{ fontSize: '0.88rem', opacity: 0.9 }}>Pilih menu favorit anda & pesan langsung dari meja</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
              <User size={18} />
              <input 
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nama Pemesan..."
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 800, outline: 'none', width: '150px' }}
              />
            </div>
          </div>

          {/* Table Selector & Order Type */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Nomor Meja:</span>
              <select 
                value={selectedTableNum} 
                onChange={e => setSelectedTableNum(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}
              >
                {tables.map(t => (
                  <option key={t.id} value={t.number}>{t.number} ({t.type})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              <button 
                className={`btn btn-sm ${orderType === 'Dine In' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setOrderType('Dine In')}
                style={{ color: '#fff' }}
              >
                <Utensils size={14} /> Dine In
              </button>
              <button 
                className={`btn btn-sm ${orderType === 'Take Away' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setOrderType('Take Away')}
                style={{ color: '#fff' }}
              >
                <ShoppingBag size={14} /> Take Away
              </button>
            </div>
          </div>
        </div>

        {/* Submitted Order Status Banner */}
        {submittedOrder && (
          <div style={{
            backgroundColor: '#ecfdf5',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={32} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontWeight: 900, color: '#047857', fontSize: '1rem' }}>
                  Pesanan {submittedOrder.id} Berhasil Dikirim ke Kasir!
                </div>
                <span style={{ fontSize: '0.82rem', color: '#065f46' }}>
                  Silakan menuju kasir atau tunggu staf kami menghampiri {submittedOrder.tableName} untuk melakukan konfirmasi & pembayaran sebesar <strong>{formatCurrency(submittedOrder.total)}</strong>.
                </span>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setSubmittedOrder(null)}>Tutup Info</button>
          </div>
        )}

        {/* Main Order Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
          {/* Catalog */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search & Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="search-input-wrap">
                <Search size={18} />
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Cari menu makanan, kopi, atau cemilan..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="categories-pills">
                <button className={`pill-btn ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>Semua Menu</button>
                {categories.map(c => (
                  <button key={c.id} className={`pill-btn ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="products-grid">
              {filteredProducts.map(p => {
                const isOutOfStock = p.status === 'Habis' || p.stock <= 0;
                return (
                  <div 
                    key={p.id} 
                    className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
                    onClick={() => !isOutOfStock && addToCustCart(p)}
                  >
                    <div className="product-image-box">
                      <span>{p.emoji || '🍽️'}</span>
                      <span className={`product-stock-badge ${isOutOfStock ? 'low' : ''}`}>
                        {isOutOfStock ? 'Habis' : `Tersedia (${p.stock})`}
                      </span>
                    </div>
                    <div className="product-info">
                      <div className="product-name">{p.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div className="product-price">{formatCurrency(p.price)}</div>
                        {!isOutOfStock && (
                          <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Cart Summary Side Panel */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            height: 'fit-content',
            gap: '16px',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '80px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Keranjang Saya</h3>
              <span className="cart-badge">{custCart.reduce((s, i) => s + i.qty, 0)} item</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '340px', overflowY: 'auto' }}>
              {custCart.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '2.5rem' }}>🛍️</span>
                  <div style={{ fontWeight: 700, marginTop: '8px' }}>Belum Ada Pilihan</div>
                  <span style={{ fontSize: '0.8rem' }}>Klik menu di samping untuk memilih hidangan</span>
                </div>
              ) : (
                custCart.map(item => (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: 'var(--bg-input)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 800 }}>{formatCurrency(item.price)}</div>
                      </div>

                      <div className="cart-qty-controls">
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)}><Minus size={12} /></button>
                        <span className="qty-val">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><Plus size={12} /></button>
                      </div>
                    </div>

                    {/* Notes */}
                    {editingNoteId === item.id ? (
                      <input 
                        type="text"
                        className="form-control"
                        style={{ fontSize: '0.75rem', padding: '3px 6px' }}
                        placeholder="Catatan (mis: Pedas/Less Ice)..."
                        value={item.notes || ''}
                        autoFocus
                        onBlur={() => setEditingNoteId(null)}
                        onChange={e => updateNotes(item.id, e.target.value)}
                      />
                    ) : (
                      <button 
                        onClick={() => setEditingNoteId(item.id)}
                        style={{ background: 'transparent', border: 'none', color: item.notes ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <Edit3 size={10} />
                        <span>{item.notes ? `Catatan: "${item.notes}"` : '+ Tambah catatan khusus'}</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {custCart.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="summary-row"><span>Subtotal:</span><span style={{ fontFamily: 'monospace' }}>{formatCurrency(subtotal)}</span></div>
                <div className="summary-row"><span>PPN (10%):</span><span style={{ fontFamily: 'monospace' }}>{formatCurrency(tax)}</span></div>
                <div className="summary-row total"><span>TOTAL:</span><span className="total-amount">{formatCurrency(total)}</span></div>

                <button className="btn btn-primary btn-block" style={{ marginTop: '8px', padding: '12px' }} onClick={handleSubmitOrder}>
                  <Send size={16} />
                  <span>Kirim Pesanan ke Kasir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
