import React, { useState, useEffect } from 'react';
import { usePos } from '../../context/PosContext';
import { Coffee, Clock, Search, CheckCircle2, CupSoda } from 'lucide-react';

export default function BarDisplayView() {
  const { transactions, updateOrderItemStatus, activeBranch } = usePos();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter transactions containing items for station 'Bar' (Hanya transaksi yang SUDAH LUNAS / diselesaikan Kasir)
  const barOrders = transactions.filter(t => {
    const isPaid = t.paymentStatus === 'LUNAS' || t.status === 'PROSES' || t.status === 'SELESAI';
    const matchesBranch = activeBranch === 'all' || t.branchId === activeBranch;
    const hasBarItems = t.items && t.items.some(i => i.station === 'Bar');
    if (!isPaid || !matchesBranch || !hasBarItems) return false;

    const matchesSearch = 
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (t.tableName && t.tableName.toLowerCase().includes(search.toLowerCase())) ||
      (t.customerName && t.customerName.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    const barItems = t.items.filter(i => i.station === 'Bar');
    const isAllDone = barItems.every(i => i.stationStatus === 'Selesai');
    const isAnyWorking = barItems.some(i => i.stationStatus === 'Sedang Dikerjakan');

    if (statusFilter === 'PENDING') return !isAllDone && !isAnyWorking;
    if (statusFilter === 'PROSES') return isAnyWorking;
    if (statusFilter === 'SELESAI') return isAllDone;

    return true;
  });

  const getElapsedTime = (isoDate) => {
    const minutes = Math.floor((now - new Date(isoDate).getTime()) / 60000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} mnt yang lalu`;
    return `${Math.floor(minutes / 60)} jam yang lalu`;
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Coffee size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Monitor Bar (Bar Display System)</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Antrean Pesanan Masuk Stasiun Kopi, Milk Shake & Minuman (Telah Lunas Dikasir)
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-input-wrap" style={{ minWidth: '240px' }}>
            <Search size={16} />
            <input 
              type="text"
              className="search-input"
              placeholder="Cari Invoice, Meja, atau Pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.82rem', padding: '6px 12px 6px 36px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('ALL')}
            >
              Semua ({barOrders.length})
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'PENDING' ? 'btn-danger' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('PENDING')}
            >
              Pending
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'PROSES' ? 'btn-warning' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('PROSES')}
            >
              Dikerjakan
            </button>
            <button 
              className={`btn btn-sm ${statusFilter === 'SELESAI' ? 'btn-success' : 'btn-ghost'}`}
              onClick={() => setStatusFilter('SELESAI')}
            >
              Selesai
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid Cards */}
      {barOrders.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px border var(--border-color)',
          gap: '12px'
        }}>
          <CupSoda size={48} style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontWeight: 800 }}>Tidak ada pesanan antrean bar</h3>
          <span style={{ fontSize: '0.85rem' }}>Pesanan minuman dan kopi baru akan otomatis tampil di layar ini.</span>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {barOrders.map(order => {
            const bItems = order.items.filter(i => i.station === 'Bar');
            const allItemsDone = bItems.every(i => i.stationStatus === 'Selesai');
            const anyItemWorking = bItems.some(i => i.stationStatus === 'Sedang Dikerjakan');

            return (
              <div key={order.id} style={{
                backgroundColor: 'var(--bg-surface)',
                border: `2px solid ${allItemsDone ? 'var(--success)' : anyItemWorking ? 'var(--warning)' : 'var(--accent)'}`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-md)'
              }}>
                {/* Order Header */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: allItemsDone ? 'rgba(16, 185, 129, 0.15)' : anyItemWorking ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>{order.id}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                      <span style={{ color: 'var(--warning)' }}>📍 {order.tableName}</span>
                      <span>•</span>
                      <span>👤 {order.customerName}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '99px',
                      backgroundColor: allItemsDone ? 'var(--success)' : anyItemWorking ? 'var(--warning)' : 'var(--accent)',
                      color: anyItemWorking ? '#000' : '#fff'
                    }}>
                      {allItemsDone ? 'SELESAI' : anyItemWorking ? 'PROSES' : 'PENDING'}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Clock size={12} /> {getElapsedTime(order.date)}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {bItems.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '10px',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ backgroundColor: 'var(--warning)', color: '#000', fontSize: '0.75rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            {item.qty}x
                          </span>
                          <span>{item.name}</span>
                        </div>
                        {item.notes && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--warning)', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ☕ Catatan: {item.notes}
                          </div>
                        )}
                      </div>

                      {/* Status Action Buttons */}
                      <div>
                        {item.stationStatus === 'Pending' && (
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => updateOrderItemStatus(order.id, item.id, 'Sedang Dikerjakan')}
                            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                          >
                            Racik
                          </button>
                        )}
                        {item.stationStatus === 'Sedang Dikerjakan' && (
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => updateOrderItemStatus(order.id, item.id, 'Selesai')}
                            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                          >
                            Siap Servis
                          </button>
                        )}
                        {item.stationStatus === 'Selesai' && (
                          <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <CheckCircle2 size={16} /> Selesai
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
