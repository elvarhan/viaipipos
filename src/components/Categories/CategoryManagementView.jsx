import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { Layers, Plus, Trash2, ChefHat, Coffee, Tag } from 'lucide-react';

export default function CategoryManagementView() {
  const { categories, addCategory, deleteCategory } = usePos();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [station, setStation] = useState('Dapur');
  const [description, setDescription] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) return;

    addCategory({
      name,
      station,
      description
    });

    setName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Layers size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Manajemen Kategori Menu</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Pengelompokan Produk & Stasiun Pengerjaan Default (Dapur / Bar)
              </span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {categories.map(cat => {
          const isDapur = cat.station === 'Dapur';
          return (
            <div key={cat.id} style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={18} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{cat.name}</h3>
                </div>

                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '99px',
                  backgroundColor: isDapur ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isDapur ? 'var(--danger)' : 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {isDapur ? <ChefHat size={11} /> : <Coffee size={11} />}
                  Stasiun {cat.station || 'Dapur'}
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {cat.description || 'Kategori menu hidangan restoran Nusapos'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                {cat.id !== 'all' && (
                  <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(cat.id)}>
                    <Trash2 size={14} /> Hapus Kategori
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', width: '90%' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              Tambah Kategori Menu Baru
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Nama Kategori</label>
                <input 
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Milk Shake / Dessert / Dimsum"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stasiun Pengerjaan Default</label>
                <select className="form-control" value={station} onChange={e => setStation(e.target.value)}>
                  <option value="Dapur">🍳 Dapur (Makanan & Snack)</option>
                  <option value="Bar">☕ Bar (Kopi & Minuman)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea 
                  className="form-control"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Keterangan singkat..."
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Kategori</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
