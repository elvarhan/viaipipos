import React from 'react';
import { usePos } from '../../context/PosContext';
import { DollarSign, ShoppingCart, TrendingUp, Package, Building2, ArrowUpRight } from 'lucide-react';

export default function DashboardView() {
  const { transactions, activeBranch, branches, setActiveTab } = usePos();

  // Filter transactions based on active branch selection
  const filteredTx = transactions.filter(t => {
    if (t.paymentStatus === 'DIBATALKAN') return false;
    if (activeBranch === 'all') return true;
    return t.branchId === activeBranch;
  });

  const totalRevenue = filteredTx.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = filteredTx.length;
  const totalItemsSold = filteredTx.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.qty, 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const activeBranchName = activeBranch === 'all' 
    ? 'Semua Cabang (Pusat)' 
    : (branches.find(b => b.id === activeBranch)?.name || 'Cabang Terpilih');

  // Top Selling Items Calculation
  const itemMap = {};
  filteredTx.forEach(t => {
    t.items.forEach(item => {
      if (!itemMap[item.name]) {
        itemMap[item.name] = 0;
      }
      itemMap[item.name] += item.qty;
    });
  });

  const topItems = Object.entries(itemMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const maxQty = topItems.length > 0 ? topItems[0].qty : 1;

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Dashboard Analitik Nusapos</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ringkasan Performa Operasional Harian
          </span>
        </div>

        {/* Current Active Branch Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)'
        }}>
          <Building2 size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Filter: {activeBranchName}</span>
        </div>
      </div>

      {/* Stats Metric Cards (4 Utama per spesifikasi 3.1) */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL PENDAPATAN</span>
            <div className="stat-val" style={{ color: 'var(--success)' }}>{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL TRANSAKSI</span>
            <div className="stat-val" style={{ color: 'var(--primary)' }}>{totalOrders}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>
            <ShoppingCart size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRODUK TERJUAL</span>
            <div className="stat-val" style={{ color: '#a855f7' }}>{totalItemsSold} pcs</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <Package size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>RATA-RATA ORDER</span>
            <div className="stat-val" style={{ color: 'var(--warning)' }}>{formatCurrency(avgOrderValue)}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Top 5 Selling Products Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>🔥 Top 5 Menu Terlaris</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Volume Terjual</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topItems.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Belum ada data penjualan pada cabang ini
              </div>
            ) : (
              topItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>{idx + 1}. {item.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{item.qty} porsi</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '99px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(item.qty / maxQty) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--accent), #a855f7)',
                      borderRadius: '99px'
                    }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions Widget */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>📋 Transaksi Terakhir</h3>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setActiveTab('riwayat')}
              style={{ fontSize: '0.75rem' }}
            >
              <span>Riwayat Lengkap</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTx.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Tidak ada transaksi terbaru
              </div>
            ) : (
              filteredTx.slice(0, 5).map(tx => (
                <div key={tx.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{tx.id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span>{tx.cashierName}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--accent)' }}>{tx.paymentMethod}</span>
                      <span>•</span>
                      <span>{tx.orderType}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(tx.total)}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
