import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { Plus, Search, Edit, Trash2, AlertTriangle, PackageCheck, ChefHat, Coffee, Building2 } from 'lucide-react';

export default function InventoryView() {
  const { products, categories, addProduct, updateProduct, deleteProduct, activeBranch, branches } = usePos();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'makanan',
    station: 'Dapur',
    price: '',
    costPrice: '',
    stock: '',
    unit: 'porsi',
    emoji: '🍱',
    branchId: 'all',
    notes: ''
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filtered = products.filter(p => {
    const matchBranch = activeBranch === 'all' || p.branchId === 'all' || p.branchId === activeBranch;
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    return matchBranch && matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `NUSA-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'makanan',
      station: 'Dapur',
      price: '',
      costPrice: '',
      stock: '',
      unit: 'porsi',
      emoji: '🍱',
      branchId: activeBranch === 'all' ? 'all' : activeBranch,
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku || '',
      category: prod.category || 'makanan',
      station: prod.station || 'Dapur',
      price: prod.price || '',
      costPrice: prod.costPrice || 0,
      stock: prod.stock || 0,
      unit: prod.unit || 'porsi',
      emoji: prod.emoji || '🍱',
      branchId: prod.branchId || 'all',
      notes: prod.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      stock: parseInt(formData.stock, 10) || 0
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...payload });
    } else {
      addProduct(payload);
    }
    setShowModal(false);
  };

  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Data Menu & Varian Produk</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Katalog Menu Restoran, Penentuan Stasiun Dapur/Bar, & Manajemen Stok
          </span>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div className="search-input-wrap" style={{ flex: 1, minWidth: '240px' }}>
          <Search size={18} />
          <input 
            type="text"
            className="search-input"
            placeholder="Cari nama menu atau Kode SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          className="form-control" 
          style={{ width: '180px' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Semua Kategori</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ITEM MENU</th>
              <th>SKU</th>
              <th>KATEGORI</th>
              <th>STASIUN</th>
              <th>HARGA JUAL</th>
              <th>STOK</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  Tidak ada data menu ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map(prod => {
                const isZero = prod.status === 'Habis' || prod.stock <= 0;
                const isDapur = (prod.station || 'Dapur') === 'Dapur';
                return (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{prod.emoji || '🍽️'}</span>
                        <div>
                          <div style={{ fontWeight: 800 }}>{prod.name}</div>
                          {prod.notes && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{prod.notes}</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent)' }}>
                      {prod.sku}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{prod.category}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '99px',
                        backgroundColor: isDapur ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isDapur ? 'var(--danger)' : 'var(--warning)'
                      }}>
                        {isDapur ? <ChefHat size={12} /> : <Coffee size={12} />}
                        {isDapur ? 'Dapur (Makanan)' : 'Bar (Minuman)'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--success)' }}>
                      {formatCurrency(prod.price)}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      {prod.stock} {prod.unit || 'porsi'}
                    </td>
                    <td>
                      {isZero ? (
                        <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} /> HABIS
                        </span>
                      ) : (
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <PackageCheck size={12} /> TERSEDIA
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(prod)} title="Edit Menu">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(prod.id)} title="Hapus Menu">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              {editingProduct ? 'Edit Menu & Varian' : 'Tambah Menu Baru'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Nama Menu</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="Contoh: Nasi Goreng Spesial Nusa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>SKU Kode Menu</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Kategori Menu</label>
                  <select 
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const isBar = newCat === 'coffee' || newCat === 'milkshake' || newCat === 'minuman';
                      setFormData({ 
                        ...formData, 
                        category: newCat,
                        station: isBar ? 'Bar' : 'Dapur'
                      });
                    }}
                  >
                    <option value="makanan">Makanan</option>
                    <option value="snack">Snack</option>
                    <option value="coffee">Coffee</option>
                    <option value="milkshake">Milk Shake</option>
                    <option value="minuman">Minuman</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Stasiun Pengerjaan KDS/BDS</label>
                  <select 
                    className="form-control"
                    value={formData.station}
                    onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                  >
                    <option value="Dapur">🍳 Dapur (Makanan & Snack)</option>
                    <option value="Bar">☕ Bar (Kopi & Minuman)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Lokasi Cabang</label>
                  <select 
                    className="form-control"
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  >
                    <option value="all">🌐 Semua Cabang</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Harga Jual (Rp)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    required
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Jumlah Stok</label>
                  <input 
                    type="number" 
                    className="form-control"
                    required
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Ikon Emoji</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="🍳"
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Deskripsi Varian / Opsi Catatan</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Contoh: Pilihan Pedas: Sedang, Extra Pedas, Less Sugar"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Menu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
