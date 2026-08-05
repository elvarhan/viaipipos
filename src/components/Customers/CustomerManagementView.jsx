import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { Users, Plus, Search, Edit, Trash2, Phone, MapPin, ShoppingBag } from 'lucide-react';

export default function CustomerManagementView() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = usePos();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCust, setEditingCust] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCust(null);
    setName('');
    setPhone('');
    setAddress('');
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCust(c);
    setName(c.name);
    setPhone(c.phone);
    setAddress(c.address);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) return;

    if (editingCust) {
      updateCustomer({
        ...editingCust,
        name,
        phone: phone || '-',
        address: address || '-'
      });
    } else {
      addCustomer({
        name,
        phone: phone || '-',
        address: address || '-'
      });
    }
    setShowModal(false);
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Users size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Data Pelanggan (Buku Tamu)</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Direktori Pelanggan Setia & Profil Kontak Restoran Nusapos
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-input-wrap" style={{ minWidth: '240px' }}>
            <Search size={16} />
            <input 
              type="text"
              className="search-input"
              placeholder="Cari Nama, No HP, Alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '6px 12px 6px 36px' }}
            />
          </div>

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Tambah Pelanggan</span>
          </button>
        </div>
      </div>

      {/* Customers Table / Cards */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>NAMA PELANGGAN</th>
                <th>NOMOR TELEPON</th>
                <th>ALAMAT</th>
                <th>TOTAL PESANAN</th>
                <th style={{ textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Tidak ada pelanggan ditemukan
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => {
                  const isGeneral = c.id === 'cust-general';
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: isGeneral ? 'var(--bg-card)' : 'rgba(168, 85, 247, 0.15)', color: isGeneral ? 'var(--text-muted)' : '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800 }}>{c.name}</div>
                            {isGeneral && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Default Kasir</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                          <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>{c.phone}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <MapPin size={14} />
                          <span>{c.address}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ShoppingBag size={12} /> {c.ordersCount || 0} Trx
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {!isGeneral && (
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(c)}>
                              <Edit size={14} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteCustomer(c.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              {editingCust ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Nama Lengkap</label>
                <input 
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Nomor Telepon / WA</label>
                <input 
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Alamat</label>
                <textarea 
                  className="form-control"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Alamat domisili pelanggan..."
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Pelanggan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
