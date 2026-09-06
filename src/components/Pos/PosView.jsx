import React, { useState } from 'react';
import { usePos } from '../../context/PosContext';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import PendingSelfOrdersModal from './PendingSelfOrdersModal';
import { QrCode, AlertCircle, ArrowRight } from 'lucide-react';

export default function PosView() {
  const { pendingSelfOrders } = usePos();
  const [showSelfOrdersModal, setShowSelfOrdersModal] = useState(false);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      {/* Banner Notice for Incoming Self-Orders from Customers */}
      {pendingSelfOrders.length > 0 && (
        <div style={{
          backgroundColor: '#ecfdf5',
          borderBottom: '2px solid var(--primary)',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '50%', display: 'flex' }}>
              <QrCode size={18} />
            </div>
            <div>
              <span style={{ fontWeight: 800, color: '#047857', fontSize: '0.9rem' }}>
                Ada {pendingSelfOrders.length} Pesanan Pelanggan (Scan QR Mandiri) Menunggu Konfirmasi Kasir!
              </span>
              <div style={{ fontSize: '0.78rem', color: '#065f46' }}>
                Klik tombol di sebelah kanan untuk meninjau rincian item & memproses pembayaran.
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowSelfOrdersModal(true)}
            style={{ fontWeight: 800, padding: '8px 16px' }}
          >
            <span>Tinjau Pesanan ({pendingSelfOrders.length})</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      <div className="pos-view">
        <ProductGrid />
        <Cart />
      </div>

      {/* Modals */}
      <PendingSelfOrdersModal 
        isOpen={showSelfOrdersModal} 
        onClose={() => setShowSelfOrdersModal(false)} 
      />
    </div>
  );
}

