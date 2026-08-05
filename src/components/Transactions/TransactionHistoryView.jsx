import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { Search, Printer, RotateCcw, CheckCircle2, XCircle, Trash2, Building2, AlertTriangle, Eye } from 'lucide-react';

export default function TransactionHistoryView() {
  const { transactions, setActiveReceipt, refundTransaction, resetBranchTransactions, activeBranch, branches, activeRole } = usePos();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showResetModal, setShowResetModal] = useState(false);
  const [detailTx, setDetailTx] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredTx = transactions.filter(t => {
    const matchBranch = activeBranch === 'all' || t.branchId === activeBranch;
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || 
                        (t.cashierName && t.cashierName.toLowerCase().includes(search.toLowerCase())) ||
                        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(search.toLowerCase())) ||
                        (t.customerName && t.customerName.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || (t.paymentStatus || t.status) === statusFilter;
    return matchBranch && matchSearch && matchStatus;
  });

  const activeBranchName = activeBranch === 'all' 
    ? 'Semua Cabang' 
    : (branches.find(b => b.id === activeBranch)?.name || 'Cabang Terpilih');

  const handleConfirmReset = () => {
    resetBranchTransactions(activeBranch);
    setShowResetModal(false);
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Riwayat Transaksi Penjualan</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Menampilkan transaksi untuk <strong>{activeBranchName}</strong> ({filteredTx.length} Transaksi)
          </span>
        </div>

        {/* Reset Branch Transactions Button for Owner/Admin */}
        {(activeRole === 'Owner' || activeRole === 'Admin') && (
          <button className="btn btn-danger" onClick={() => setShowResetModal(true)}>
            <Trash2 size={16} />
            <span>Reset Data Transaksi</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div className="search-input-wrap" style={{ flex: 1, minWidth: '240px' }}>
          <Search size={18} />
          <input 
            type="text"
            className="search-input"
            placeholder="Cari No Invoice, Kasir, Pelanggan, atau Metode Pembayaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          className="form-control" 
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Semua Status</option>
          <option value="LUNAS">Lunas</option>
          <option value="DIBATALKAN">Dibatalkan / Refund</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>NO INVOICE</th>
              <th>WAKTU & TANGGAL</th>
              <th>CABANG</th>
              <th>KASIR</th>
              <th>PELANGGAN & MEJA</th>
              <th>METODE</th>
              <th>TOTAL TAGIHAN</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  Tidak ada riwayat transaksi ditemukan.
                </td>
              </tr>
            ) : (
              filteredTx.map(tx => {
                const isRefunded = tx.paymentStatus === 'DIBATALKAN' || tx.status === 'BATAL';
                const dateFormatted = new Date(tx.date).toLocaleString('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                return (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>
                      {tx.id}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{dateFormatted}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{tx.branchName || 'Cabang Utama'}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{tx.cashierName}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      <div style={{ fontWeight: 700 }}>{tx.customerName || 'Pelanggan Umum'}</div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{tx.tableName || tx.orderType}</span>
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-color)'
                      }}>
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: isRefunded ? 'var(--text-muted)' : 'var(--success)' }}>
                      {formatCurrency(tx.total)}
                    </td>
                    <td>
                      {isRefunded ? (
                        <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={12} /> DIBATALKAN
                        </span>
                      ) : (
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> LUNAS
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setDetailTx(tx)}
                          title="Lihat Detail Item"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setActiveReceipt(tx)}
                          title="Cetak Ulang Struk Thermal"
                        >
                          <Printer size={14} />
                        </button>

                        {!isRefunded && (
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (confirm(`Yakin batalkan transaksi ${tx.id}? Stok barang akan dikembalikan ke inventaris.`)) {
                                refundTransaction(tx.id);
                              }
                            }}
                            title="Batalkan Transaksi / Refund"
                          >
                            <RotateCcw size={14} />
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

      {/* Transaction Details Modal */}
      {detailTx && (
        <div className="modal-backdrop" onClick={() => setDetailTx(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Detail Transaksi</h3>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--accent)' }}>{detailTx.id}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetailTx(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                <div><strong>Kasir:</strong> {detailTx.cashierName}</div>
                <div><strong>Cabang:</strong> {detailTx.branchName || 'Cabang Utama'}</div>
                <div><strong>Pelanggan:</strong> {detailTx.customerName || 'Pelanggan Umum'}</div>
                <div><strong>Tipe / Meja:</strong> {detailTx.orderType} ({detailTx.tableName || '-'})</div>
                <div><strong>Metode Bayar:</strong> {detailTx.paymentMethod}</div>
                <div><strong>Waktu:</strong> {new Date(detailTx.date).toLocaleString('id-ID')}</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>DAFTAR ITEM PESANAN:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {detailTx.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', backgroundColor: 'var(--bg-card)', padding: '8px', borderRadius: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.qty}x {item.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Stasiun: <strong>{item.station || 'Dapur'}</strong> • Status KDS: <strong style={{ color: item.stationStatus === 'Selesai' ? 'var(--success)' : 'var(--warning)' }}>{item.stationStatus || 'Selesai'}</strong>
                          {item.notes && <div>Catatan: "{item.notes}"</div>}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, fontFamily: 'monospace' }}>{formatCurrency(item.subtotal || item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span> <span>{formatCurrency(detailTx.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>PPN (10%):</span> <span>{formatCurrency(detailTx.tax)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: 'var(--success)', marginTop: '4px' }}>
                  <span>Total Tagihan:</span> <span>{formatCurrency(detailTx.total)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDetailTx(null)}>Tutup</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setActiveReceipt(detailTx); setDetailTx(null); }}>
                <Printer size={16} /> Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset Branch Transactions */}
      {showResetModal && (
        <div className="modal-backdrop" onClick={() => setShowResetModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', border: '2px solid var(--danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)', marginBottom: '12px' }}>
              <AlertTriangle size={28} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Konfirmasi Reset Data Transaksi</h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Apakah anda yakin ingin menghapus/menghapus <strong>seluruh data transaksi</strong> untuk <strong>{activeBranchName}</strong>?
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '8px', fontWeight: 700 }}>
              ⚠️ Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Fitur ini khusus role Owner/Admin.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowResetModal(false)}>Batal</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleConfirmReset}>
                Ya, Reset Seluruh Transaksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
