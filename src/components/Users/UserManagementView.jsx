import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { UserCog, Plus, Search, Edit, Trash2, Shield, KeyRound, Building2 } from 'lucide-react';

export default function UserManagementView() {
  const { users, addUser, updateUser, deleteUser, branches, activeBranch } = usePos();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Kasir');
  const [branchId, setBranchId] = useState('cabang-01');

  const filteredUsers = users.filter(u => {
    const matchBranch = activeBranch === 'all' || u.branchId === 'all' || u.branchId === activeBranch;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.username.toLowerCase().includes(search.toLowerCase()) ||
                        u.role.toLowerCase().includes(search.toLowerCase());
    return matchBranch && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setUsername('');
    setPassword('123456');
    setRole('Kasir');
    setBranchId(activeBranch === 'all' ? 'cabang-01' : activeBranch);
    setShowModal(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setName(u.name);
    setUsername(u.username);
    setPassword('');
    setRole(u.role);
    setBranchId(u.branchId);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !username) return;

    if (editingUser) {
      updateUser({
        ...editingUser,
        name,
        username,
        role,
        branchId
      });
    } else {
      addUser({
        name,
        username,
        role,
        branchId
      });
    }
    setShowModal(false);
  };

  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'Owner': return { bg: 'rgba(236, 72, 153, 0.2)', color: '#ec4899', icon: '👑' };
      case 'Admin': return { bg: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', icon: '⚙️' };
      case 'Kasir': return { bg: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', icon: '💵' };
      case 'Dapur': return { bg: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', icon: '🍳' };
      case 'Bar': return { bg: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', icon: '☕' };
      default: return { bg: 'var(--bg-card)', color: 'var(--text-muted)', icon: '👤' };
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <UserCog size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Kelola Staf & Hak Akses Pengguna</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Manajemen Pengguna Aplikasi (Owner, Admin, Kasir, Dapur, Bar)
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
              placeholder="Cari Nama, Username, Role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '6px 12px 6px 36px' }}
            />
          </div>

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Tambah Staf</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>NAMA STAF</th>
              <th>USERNAME</th>
              <th>ROLE / PERAN</th>
              <th>CABANG PENEMPATAN</th>
              <th style={{ textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  Tidak ada data staf ditemukan
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const rBadge = getRoleBadge(u.role);
                const bName = branches.find(b => b.id === u.branchId)?.name || u.branchName || 'Semua Cabang';
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{u.name}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent)' }}>
                      @{u.username}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '99px',
                        backgroundColor: rBadge.bg,
                        color: rBadge.color
                      }}>
                        <span>{rBadge.icon}</span>
                        <span>{u.role}</span>
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                        <Building2 size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>{bName}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(u)} title="Edit User">
                          <Edit size={14} />
                        </button>
                        {users.length > 1 && u.role !== 'Owner' && (
                          <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)} title="Hapus User">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              {editingUser ? 'Edit Data Staf' : 'Tambah Staf Baru'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Nama Lengkap</label>
                <input 
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Rina Kasir Utama"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Username Login</label>
                <input 
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Contoh: rina_kasir"
                  required
                />
              </div>

              {!editingUser && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Password</label>
                  <input 
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Role / Peran</label>
                  <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                    <option value="Owner">👑 Owner</option>
                    <option value="Admin">⚙️ Admin</option>
                    <option value="Kasir">💵 Kasir</option>
                    <option value="Dapur">🍳 Dapur</option>
                    <option value="Bar">☕ Bar</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Cabang Penempatan</label>
                  <select className="form-control" value={branchId} onChange={e => setBranchId(e.target.value)}>
                    <option value="all">🌐 Semua Cabang</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Staf</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
