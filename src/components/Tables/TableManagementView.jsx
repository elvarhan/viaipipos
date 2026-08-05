import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { QrCode, Plus, Edit, Trash2, Printer, CheckCircle, AlertTriangle, Users, Sparkles, ExternalLink } from 'lucide-react';

export default function TableManagementView() {
  const { tables, addTable, updateTable, deleteTable, activeBranch, branches, setActiveTab } = usePos();
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Reguler' | 'VIP'
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [qrModalTable, setQrModalTable] = useState(null);

  // Form State
  const [number, setNumber] = useState('');
  const [type, setType] = useState('Reguler');
  const [capacity, setCapacity] = useState(4);
  const [status, setStatus] = useState('Kosong');

  const filteredTables = tables.filter(t => {
    const matchesBranch = activeBranch === 'all' || t.branchId === 'all' || t.branchId === activeBranch;
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesBranch && matchesType;
  });

  const handleOpenAdd = () => {
    setEditingTable(null);
    setNumber(`Meja ${tables.length + 1}`);
    setType('Reguler');
    setCapacity(4);
    setStatus('Kosong');
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTable(t);
    setNumber(t.number);
    setType(t.type);
    setCapacity(t.capacity);
    setStatus(t.status);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!number) return;

    if (editingTable) {
      updateTable({
        ...editingTable,
        number,
        type,
        capacity: Number(capacity),
        status
      });
    } else {
      addTable({
        number,
        type,
        capacity: Number(capacity),
        status,
        branchId: activeBranch === 'all' ? 'cabang-01' : activeBranch
      });
    }
    setShowModal(false);
  };

  const handlePrintQR = () => {
    window.print();
  };

  // Generate real scannable QR Code URL
  const getQrImageUrl = (tableNum) => {
    const targetUrl = `${window.location.origin}/?table=${encodeURIComponent(tableNum)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl)}`;
  };

  const getDirectLink = (tableNum) => {
    return `${window.location.origin}/?table=${encodeURIComponent(tableNum)}`;
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <QrCode size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Kelola Meja & QR Code</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Manajemen Visual Meja Restoran Reguler, VIP & Cetak QR Pemesanan
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilterType('ALL')}>
              Semua Meja
            </button>
            <button className={`btn btn-sm ${filterType === 'Reguler' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilterType('Reguler')}>
              Reguler
            </button>
            <button className={`btn btn-sm ${filterType === 'VIP' ? 'btn-warning' : 'btn-ghost'}`} onClick={() => setFilterType('VIP')}>
              ⭐ VIP
            </button>
          </div>

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            <span>Tambah Meja</span>
          </button>
        </div>
      </div>

      {/* Visual Table Grid Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {filteredTables.map(t => {
          const isOccupied = t.status === 'Terisi';
          const isReserved = t.status === 'Reserved';
          const isVip = t.type === 'VIP';

          return (
            <div key={t.id} style={{
              backgroundColor: 'var(--bg-surface)',
              border: `2px solid ${isOccupied ? 'var(--danger)' : isReserved ? 'var(--warning)' : isVip ? 'var(--warning)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t.number}</span>
                    {isVip && (
                      <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Sparkles size={10} /> VIP
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Users size={12} /> Kapasitas: {t.capacity} Orang
                  </div>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '99px',
                  backgroundColor: isOccupied ? 'rgba(239, 68, 68, 0.2)' : isReserved ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isOccupied ? 'var(--danger)' : isReserved ? 'var(--warning)' : 'var(--success)'
                }}>
                  {t.status}
                </span>
              </div>

              {/* Real Scannable QR Code Mini Banner */}
              <div 
                onClick={() => setQrModalTable(t)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <img 
                  src={getQrImageUrl(t.number)} 
                  alt={`QR ${t.number}`} 
                  style={{ width: '50px', height: '50px', borderRadius: '4px' }} 
                />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>QR Pemesanan Scannable</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{t.qrCode || 'QR-NUSA'}</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800 }}>Klik untuk cetak QR ➔</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleOpenEdit(t)}
                >
                  <Edit size={14} /> Edit
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setQrModalTable(t)}
                  title="Cetak QR Code Scannable"
                >
                  <Printer size={14} />
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTable(t.id)}
                  title="Hapus Meja"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Table Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', width: '90%' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>
              {editingTable ? 'Edit Data Meja' : 'Tambah Meja Baru'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Nomor / Nama Meja</label>
                <input 
                  type="text"
                  className="form-control"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  placeholder="Contoh: Meja 06 / VIP Room A"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tipe Meja</label>
                  <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                    <option value="Reguler">Reguler</option>
                    <option value="VIP">⭐ VIP</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Kapasitas (Orang)</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    min={1}
                    max={20}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status Meja Saat Ini</label>
                <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="Kosong">🟢 Kosong</option>
                  <option value="Terisi">🔴 Terisi</option>
                  <option value="Reserved">🟡 Reserved (Dipesan)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable REAL Scannable QR Code Modal */}
      {qrModalTable && (
        <div className="modal-backdrop" onClick={() => setQrModalTable(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', width: '90%', textAlign: 'center' }}>
            <div style={{
              backgroundColor: '#fff',
              color: '#000',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid #000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '8px', width: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>NusaPOS</h2>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555' }}>SCAN TO ORDER / PESAN MANDIRI</span>
              </div>

              <div style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                backgroundColor: qrModalTable.type === 'VIP' ? '#fef3c7' : '#e0f2fe',
                color: qrModalTable.type === 'VIP' ? '#d97706' : '#0369a1',
                padding: '6px 20px',
                borderRadius: '99px',
                border: '2px solid #000'
              }}>
                {qrModalTable.number}
              </div>

              {/* REAL SCANNABLE 2D BARCODE QR IMAGE */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                border: '2px dashed #000',
                display: 'inline-block'
              }}>
                <img 
                  src={getQrImageUrl(qrModalTable.number)} 
                  alt={`Scannable QR ${qrModalTable.number}`} 
                  style={{ width: '180px', height: '180px', display: 'block' }}
                />
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>
                📷 Pindai QR Code ini dengan Kamera HP (iPhone / Android) untuk membuka menu digital {qrModalTable.number}.
              </div>

              {/* Direct Simulation Link for Testing on PC */}
              <button 
                className="btn btn-sm"
                onClick={() => {
                  setActiveTab('self-order');
                  setQrModalTable(null);
                }}
                style={{
                  backgroundColor: '#047857',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  width: '100%',
                  marginTop: '4px'
                }}
              >
                <ExternalLink size={14} />
                <span>Uji Coba Buka Halaman Self-Order Meja Ini</span>
              </button>

              <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#666' }}>
                URL: {getDirectLink(qrModalTable.number)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setQrModalTable(null)}>Tutup</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePrintQR}>
                <Printer size={16} /> Cetak QR (A4)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
