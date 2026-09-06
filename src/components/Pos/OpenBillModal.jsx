import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import { 
  X, PlayCircle, Clock, Utensils, ShoppingBag, Receipt, Printer, 
  Trash2, MoveRight, Layers, PlusCircle, Search, CreditCard, ChevronRight 
} from 'lucide-react';

export default function OpenBillModal() {
  const { 
    showHoldCartModal, 
    setShowHoldCartModal, 
    openBills, 
    restoreOpenBill, 
    cancelOpenBill,
    moveOpenBillTable,
    mergeOpenBills,
    tables,
    activeBranch,
    setShowPaymentModal,
    setSelectedPreBill,
    setShowPreBillModal
  } = usePos();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'Dine In' | 'Take Away'
  const [searchQuery, setSearchQuery] = useState('');
  const [movingBillId, setMovingBillId] = useState(null);
  const [targetTableId, setTargetTableId] = useState('');
  const [mergingSourceBillId, setMergingSourceBillId] = useState(null);
  const [targetMergeBillId, setTargetMergeBillId] = useState('');

  if (!showHoldCartModal) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const getElapsedTime = (isoDateStr) => {
    if (!isoDateStr) return '';
    const diffMs = Date.now() - new Date(isoDateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} jam ${diffMins % 60}m lalu`;
  };

  // Available empty/active tables for move table
  const availableTablesForMove = tables.filter(t => 
    (activeBranch === 'all' || t.branchId === 'all' || t.branchId === activeBranch)
  );

  const filteredBills = openBills.filter(bill => {
    const matchesTab = activeTab === 'ALL' || bill.orderType === activeTab;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      (bill.billNumber && bill.billNumber.toLowerCase().includes(query)) ||
      (bill.tableName && bill.tableName.toLowerCase().includes(query)) ||
      (bill.customerName && bill.customerName.toLowerCase().includes(query));
    return matchesTab && matchesSearch;
  });

  const handlePrintPreBill = (bill) => {
    setSelectedPreBill(bill);
    setShowPreBillModal(true);
  };

  const handleConfirmMoveTable = (billId) => {
    if (!targetTableId) return;
    moveOpenBillTable(billId, targetTableId);
    setMovingBillId(null);
    setTargetTableId('');
  };

  const handleConfirmMergeBill = (sourceBillId) => {
    if (!targetMergeBillId) return;
    mergeOpenBills(sourceBillId, targetMergeBillId);
    setMergingSourceBillId(null);
    setTargetMergeBillId('');
  };

  const handleCheckoutDirect = (bill) => {
    restoreOpenBill(bill.id);
    setShowHoldCartModal(false);
    setShowPaymentModal(true);
  };

  const handleAddItems = (bill) => {
    restoreOpenBill(bill.id);
    setShowHoldCartModal(false);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }}>
      <div className="modal-content" style={{ maxWidth: '820px', width: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Receipt size={22} style={{ color: 'var(--accent)' }} />
              <span>Daftar Open Bill / Tagihan Terbuka ({openBills.length})</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Kelola pesanan gantung, cetak struk sementara, tambah item, pindah meja & gabung bill
            </span>
          </div>
          <button className="modal-close" onClick={() => setShowHoldCartModal(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-card)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn btn-sm ${activeTab === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('ALL')}
            >
              Semua ({openBills.length})
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'Dine In' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('Dine In')}
            >
              <Utensils size={13} />
              <span>Dine In ({openBills.filter(b => b.orderType === 'Dine In').length})</span>
            </button>
            <button 
              className={`btn btn-sm ${activeTab === 'Take Away' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('Take Away')}
            >
              <ShoppingBag size={13} />
              <span>Take Away ({openBills.filter(b => b.orderType === 'Take Away').length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '300px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control"
              style={{ paddingLeft: '30px', fontSize: '0.82rem', height: '34px' }}
              placeholder="Cari Meja, Bill #, Pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Body / Bills List */}
        <div className="modal-body" style={{ padding: '20px', overflowY: 'auto', flex: 1, backgroundColor: 'var(--bg-body)' }}>
          {filteredBills.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px' }}>
              <Receipt size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>Tidak Ada Open Bill Yang Sesuai</p>
              <span style={{ fontSize: '0.82rem' }}>Semua transaksi di meja atau takeaway sudah lunas atau belum dibuat.</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
              {filteredBills.map((bill) => {
                const totalItemsCount = bill.items ? bill.items.reduce((s, i) => s + i.qty, 0) : 0;
                const elapsedTime = getElapsedTime(bill.createdAt);
                const isDineIn = bill.orderType === 'Dine In';

                return (
                  <div 
                    key={bill.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: 'var(--shadow-sm)',
                      position: 'relative'
                    }}
                  >
                    {/* Bill Header Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            backgroundColor: isDineIn ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: isDineIn ? 'var(--primary)' : 'var(--warning)',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '99px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {isDineIn ? <Utensils size={12} /> : <ShoppingBag size={12} />}
                            {bill.tableName || 'Take Away'}
                          </span>
                          <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
                            #{bill.billNumber || bill.id}
                          </span>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '6px', color: 'var(--text-main)' }}>
                          👤 {bill.customerName || 'Pelanggan Umum'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                          <Clock size={12} />
                          <span>{elapsedTime}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Jam {bill.time}
                        </div>
                      </div>
                    </div>

                    {/* Item List Brief Preview */}
                    <div style={{
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      border: '1px solid var(--border-color)',
                      maxHeight: '110px',
                      overflowY: 'auto'
                    }}>
                      {bill.items && bill.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                            {item.qty}x {item.name}
                            {item.notes ? <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: '4px' }}>({item.notes})</span> : ''}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600 }}>
                            {formatCurrency(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Summary Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {totalItemsCount} item • PPN 10%
                      </span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Total Tagihan</span>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                          {formatCurrency(bill.total)}
                        </span>
                      </div>
                    </div>

                    {/* Inline Form: Move Table */}
                    {movingBillId === bill.id && (
                      <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <select 
                          className="form-control" 
                          style={{ fontSize: '0.78rem', height: '32px', flex: 1 }}
                          value={targetTableId}
                          onChange={(e) => setTargetTableId(e.target.value)}
                        >
                          <option value="">Pilih Meja Tujuan...</option>
                          {availableTablesForMove.map(tbl => (
                            <option key={tbl.id} value={tbl.id}>
                              {tbl.number} ({tbl.type}) - Status: {tbl.status}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-primary btn-sm" onClick={() => handleConfirmMoveTable(bill.id)}>Pindah</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setMovingBillId(null)}>Batal</button>
                      </div>
                    )}

                    {/* Inline Form: Merge Bill */}
                    {mergingSourceBillId === bill.id && (
                      <div style={{ backgroundColor: 'var(--bg-card)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--warning)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <select 
                          className="form-control" 
                          style={{ fontSize: '0.78rem', height: '32px', flex: 1 }}
                          value={targetMergeBillId}
                          onChange={(e) => setTargetMergeBillId(e.target.value)}
                        >
                          <option value="">Gabung ke Bill Mana...</option>
                          {openBills.filter(b => b.id !== bill.id).map(tb => (
                            <option key={tb.id} value={tb.id}>
                              {tb.tableName} - #{tb.billNumber} ({tb.customerName})
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-warning btn-sm" onClick={() => handleConfirmMergeBill(bill.id)}>Gabungkan</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setMergingSourceBillId(null)}>Batal</button>
                      </div>
                    )}

                    {/* Action Toolbar */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                      {/* Sub Tools Row 1 */}
                      <button 
                        className="btn btn-ghost btn-sm" 
                        style={{ fontSize: '0.75rem', justifyContent: 'center' }}
                        onClick={() => handlePrintPreBill(bill)}
                      >
                        <Printer size={13} />
                        <span>Struk Pre-Bill</span>
                      </button>

                      <button 
                        className="btn btn-ghost btn-sm" 
                        style={{ fontSize: '0.75rem', justifyContent: 'center' }}
                        onClick={() => handleAddItems(bill)}
                      >
                        <PlusCircle size={13} />
                        <span>+ Tambah Item</span>
                      </button>

                      {/* Sub Tools Row 2 */}
                      <button 
                        className="btn btn-ghost btn-sm" 
                        style={{ fontSize: '0.75rem', justifyContent: 'center' }}
                        onClick={() => {
                          setMovingBillId(movingBillId === bill.id ? null : bill.id);
                          setMergingSourceBillId(null);
                        }}
                      >
                        <MoveRight size={13} />
                        <span>Pindah Meja</span>
                      </button>

                      <button 
                        className="btn btn-ghost btn-sm" 
                        style={{ fontSize: '0.75rem', justifyContent: 'center' }}
                        onClick={() => {
                          setMergingSourceBillId(mergingSourceBillId === bill.id ? null : bill.id);
                          setMovingBillId(null);
                        }}
                      >
                        <Layers size={13} />
                        <span>Gabung Bill</span>
                      </button>
                    </div>

                    {/* Primary Pay & Cancel Buttons */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <button 
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 10px' }}
                        onClick={() => cancelOpenBill(bill.id)}
                        title="Batalkan Open Bill ini"
                      >
                        <Trash2 size={14} />
                      </button>

                      <button 
                        className="btn btn-success btn-sm"
                        style={{ flex: 1, fontWeight: 700, justifyContent: 'center' }}
                        onClick={() => handleCheckoutDirect(bill)}
                      >
                        <CreditCard size={15} />
                        <span>PROSES BAYAR</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 Kasir dapat mencetak struk sementara sebelum pelanggan melakukan pembayaran di meja.
          </span>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowHoldCartModal(false)}>
            Tutup Window
          </button>
        </div>
      </div>
    </div>
  );
}
