import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Grid, 
  List, 
  CheckSquare, 
  SlidersHorizontal,
  Building
} from 'lucide-react';

export default function BranchManagementView() {
  const { branches, addBranch, updateBranch, deleteBranch, activeBranch, setActiveBranch, users, tables } = usePos();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // Form State Master Cabang
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [manager, setManager] = useState('');
  const [openingHours, setOpeningHours] = useState('08:00 - 22:00 WIB');
  const [status, setStatus] = useState('Aktif');

  const filteredBranches = branches.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
                        (b.code && b.code.toLowerCase().includes(search.toLowerCase())) ||
                        (b.address && b.address.toLowerCase().includes(search.toLowerCase())) ||
                        (b.manager && b.manager.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = branches.filter(b => b.status === 'Aktif').length;
  const nonActiveCount = branches.length - activeCount;

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setCode(`CBG-NUSA-${Math.floor(10 + Math.random() * 90)}`);
    setName('');
    setAddress('');
    setPhone('');
    setEmail('');
    setManager('');
    setOpeningHours('08:00 - 22:00 WIB');
    setStatus('Aktif');
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBranch(b);
    setCode(b.code || `CBG-${b.id}`);
    setName(b.name);
    setAddress(b.address);
    setPhone(b.phone || '');
    setEmail(b.email || '');
    setManager(b.manager || '');
    setOpeningHours(b.openingHours || '08:00 - 22:00 WIB');
    setStatus(b.status || 'Aktif');
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) return;

    if (editingBranch) {
      updateBranch({
        ...editingBranch,
        code,
        name,
        address,
        phone,
        email,
        manager,
        openingHours,
        status
      });
    } else {
      addBranch({
        code,
        name,
        address,
        phone,
        email,
        manager,
        openingHours,
        status
      });
    }
    setShowModal(false);
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Building2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Master Data Cabang</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Direktori Profil Cabang, Manager PJ, Alamat Operasional & Pengaturan Multi-Lokasi
              </span>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Tambah Cabang Baru</span>
        </button>
      </div>

      {/* Metric Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL CABANG</span>
            <div className="stat-val" style={{ color: 'var(--primary)' }}>{branches.length} Lokasi</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)' }}>
            <Building size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>CABANG AKTIF</span>
            <div className="stat-val" style={{ color: 'var(--success)' }}>{activeCount} Aktif</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TUTUP / RENOVASI</span>
            <div className="stat-val" style={{ color: 'var(--warning)' }}>{nonActiveCount} Cabang</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <Search size={16} />
            <input 
              type="text"
              className="search-input"
              placeholder="Cari Kode Cabang, Nama, Alamat, atau Penanggung Jawab..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          <select 
            className="form-control" 
            style={{ width: '160px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="Aktif">🟢 Aktif</option>
            <option value="Non-Aktif">🔴 Non-Aktif</option>
            <option value="Renovasi">🟡 Renovasi</option>
          </select>
        </div>

        {/* Grid vs Table View Mode Switcher */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('grid')}
            title="Tampilan Kartu Grid"
          >
            <Grid size={16} />
          </button>
          <button 
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setViewMode('table')}
            title="Tampilan Tabel Master Data"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Master Data Grid View */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {filteredBranches.map(b => {
            const isActive = b.status === 'Aktif';
            const isSelectedGlobal = activeBranch === b.id;
            const staffCount = users.filter(u => u.branchId === b.id || u.branchId === 'all').length;
            const tableCount = tables.filter(t => t.branchId === b.id || t.branchId === 'all').length;

            return (
              <div key={b.id} style={{
                backgroundColor: 'var(--bg-surface)',
                border: `2px solid ${isSelectedGlobal ? 'var(--primary)' : isActive ? 'var(--border-color)' : 'var(--danger)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: isSelectedGlobal ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                position: 'relative'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 800, backgroundColor: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                      {b.code || `CBG-${b.id}`}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginTop: '4px' }}>{b.name}</h3>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '99px',
                    backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : b.status === 'Renovasi' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: isActive ? 'var(--success)' : b.status === 'Renovasi' ? 'var(--warning)' : 'var(--danger)'
                  }}>
                    {b.status}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--primary)' }} />
                    <span style={{ lineHeight: '1.4' }}>{b.address}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} style={{ color: 'var(--text-subtle)' }} />
                      <span>PJ: <strong>{b.manager || 'Admin'}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} style={{ color: 'var(--text-subtle)' }} />
                      <span>{b.phone || '-'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} style={{ color: 'var(--text-subtle)' }} />
                      <span style={{ fontSize: '0.78rem' }}>{b.email || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} style={{ color: 'var(--text-subtle)' }} />
                      <span style={{ fontSize: '0.78rem' }}>{b.openingHours || '08:00-22:00'}</span>
                    </div>
                  </div>
                </div>

                {/* Operational Counts */}
                <div style={{ display: 'flex', gap: '10px', backgroundColor: 'var(--bg-input)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                  <span>🪑 Meja: <strong>{b.totalTables || tableCount} Meja</strong></span>
                  <span>•</span>
                  <span>👥 Staf: <strong>{b.totalStaff || staffCount} Orang</strong></span>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    className={`btn btn-sm ${isSelectedGlobal ? 'btn-success' : 'btn-secondary'}`}
                    style={{ flex: 2 }} 
                    onClick={() => setActiveBranch(b.id)}
                  >
                    <CheckSquare size={14} />
                    <span>{isSelectedGlobal ? 'Cabang Aktif' : 'Pilih Cabang Ini'}</span>
                  </button>

                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(b)} title="Edit Master Cabang">
                    <Edit size={14} />
                  </button>

                  {branches.length > 1 && (
                    <button className="btn btn-danger btn-sm" onClick={() => deleteBranch(b.id)} title="Hapus Cabang">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Master Data Table View */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>KODE</th>
                <th>NAMA CABANG</th>
                <th>MANAGER / PJ</th>
                <th>KONTAK & EMAIL</th>
                <th>ALAMAT OPERASIONAL</th>
                <th>JAM OPERASIONAL</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--primary)' }}>
                    {b.code || `CBG-${b.id}`}
                  </td>
                  <td style={{ fontWeight: 800 }}>{b.name}</td>
                  <td>{b.manager || 'Admin Cabang'}</td>
                  <td style={{ fontSize: '0.82rem' }}>
                    <div>📞 {b.phone || '-'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>✉️ {b.email || '-'}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', maxWidth: '240px' }}>{b.address}</td>
                  <td style={{ fontSize: '0.82rem' }}>{b.openingHours || '08:00 - 22:00'}</td>
                  <td>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '99px',
                      backgroundColor: b.status === 'Aktif' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: b.status === 'Aktif' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(b)}>
                        <Edit size={14} />
                      </button>
                      {branches.length > 1 && (
                        <button className="btn btn-danger btn-sm" onClick={() => deleteBranch(b.id)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Master Cabang Modal Form */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>
              {editingBranch ? 'Edit Master Data Cabang' : 'Tambah Master Data Cabang Baru'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Kode Cabang</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Cabang</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Cabang Bali Kuta"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Penanggung Jawab (PJ / Manager)</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={manager}
                    onChange={e => setManager(e.target.value)}
                    placeholder="Nama Manager Cabang..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status Operasional</label>
                  <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Aktif">🟢 Aktif</option>
                    <option value="Non-Aktif">🔴 Non-Aktif (Tutup)</option>
                    <option value="Renovasi">🟡 Renovasi</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Nomor Telepon / WA</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="021-5551234 / 0812..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Cabang</label>
                  <input 
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="bali@nusapos.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Jam Operasional</label>
                <input 
                  type="text"
                  className="form-control"
                  value={openingHours}
                  onChange={e => setOpeningHours(e.target.value)}
                  placeholder="Contoh: 08:00 - 22:00 WIB"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Lengkap</label>
                <textarea 
                  className="form-control"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Alamat fisik cabang..."
                  rows={3}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Master Cabang</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
