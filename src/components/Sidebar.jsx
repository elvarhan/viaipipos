import React from 'react';
import { usePos } from '../context/PosContext';
import { 
  BarChart3, 
  ShoppingCart, 
  ChefHat, 
  Coffee, 
  QrCode, 
  Users, 
  History, 
  UtensilsCrossed, 
  Layers, 
  Building2, 
  UserCog,
  Smartphone,
  AlertCircle
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, activeRole, products, transactions, pendingSelfOrders } = usePos();

  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const pendingKitchenCount = transactions.filter(t => t.items?.some(i => i.station === 'Dapur' && i.stationStatus !== 'Selesai')).length;
  const pendingBarCount = transactions.filter(t => t.items?.some(i => i.station === 'Bar' && i.stationStatus !== 'Selesai')).length;

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['Owner', 'Admin'] },
    { id: 'pos', label: 'Kasir POS', icon: ShoppingCart, badge: pendingSelfOrders.length > 0 ? `${pendingSelfOrders.length} QR` : null, roles: ['Owner', 'Admin', 'Kasir'] },
    { id: 'self-order', label: '📱 Self-Order Pelanggan', icon: Smartphone, roles: ['Owner', 'Admin', 'Kasir', 'Dapur', 'Bar'] },
    { id: 'dapur', label: 'Monitor Dapur', icon: ChefHat, badge: pendingKitchenCount > 0 ? pendingKitchenCount : null, roles: ['Owner', 'Admin', 'Dapur'] },
    { id: 'bar', label: 'Monitor Bar', icon: Coffee, badge: pendingBarCount > 0 ? pendingBarCount : null, roles: ['Owner', 'Admin', 'Bar'] },
    { id: 'meja', label: 'Kelola Meja & QR', icon: QrCode, roles: ['Owner', 'Admin', 'Kasir'] },
    { id: 'pelanggan', label: 'Data Pelanggan', icon: Users, roles: ['Owner', 'Admin', 'Kasir'] },
    { id: 'riwayat', label: 'Riwayat Transaksi', icon: History, roles: ['Owner', 'Admin', 'Kasir'] },
    { id: 'menu', label: 'Data Menu & Varian', icon: UtensilsCrossed, badge: lowStockCount > 0 ? `${lowStockCount} habis` : null, roles: ['Owner', 'Admin'] },
    { id: 'kategori', label: 'Manajemen Kategori', icon: Layers, roles: ['Owner', 'Admin'] },
    { id: 'cabang', label: 'Kelola Cabang', icon: Building2, roles: ['Owner'] },
    { id: 'user', label: 'Kelola Pengguna', icon: UserCog, roles: ['Owner', 'Admin'] }
  ];

  // Filter items based on active role
  const visibleNavItems = allNavItems.filter(item => item.roles.includes(activeRole));

  return (
    <aside className="app-sidebar">
      <div style={{ padding: '0 8px 12px 8px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          MODUL UTAMA ({activeRole})
        </span>
      </div>

      <ul className="nav-list">
        {visibleNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li 
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  backgroundColor: item.id === 'pos' ? 'var(--primary)' : item.id === 'dapur' ? 'var(--danger)' : item.id === 'bar' ? 'var(--warning)' : 'var(--accent)',
                  color: item.id === 'bar' ? '#000' : 'white',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  borderRadius: '99px',
                  padding: '2px 7px'
                }}>
                  {item.badge}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Role Notice Card */}
      <div style={{
        marginTop: 'auto',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Akses Peran Active</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Navigasi disesuaikan dengan izin role <strong>{activeRole}</strong>.
        </span>
      </div>
    </aside>
  );
}
