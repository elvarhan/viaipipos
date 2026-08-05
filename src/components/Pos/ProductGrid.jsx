import React from 'react';
import { usePos } from '../../context/PosContext';
import { Search, Plus, ChefHat, Coffee } from 'lucide-react';

export default function ProductGrid() {
  const { 
    products, 
    categories, 
    searchQuery, setSearchQuery, 
    selectedCategory, setSelectedCategory,
    addToCart,
    activeBranch
  } = usePos();

  // Filter products by branch, category and search query
  const filteredProducts = products.filter(product => {
    const matchesBranch = activeBranch === 'all' || product.branchId === 'all' || product.branchId === activeBranch;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBranch && matchesCategory && matchesSearch;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="pos-catalog">
      {/* Top Filter & Search */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} />
          <input 
            type="text"
            className="search-input"
            placeholder="Cari nama menu, SKU, atau varian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="categories-pills">
          <button
            className={`pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Semua Menu
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
          gap: '12px'
        }}>
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <p style={{ fontWeight: 700 }}>Menu tidak ditemukan</p>
          <span style={{ fontSize: '0.85rem' }}>Coba ubah kata kunci pencarian atau kategori</span>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => {
            const isOutOfStock = product.status === 'Habis' || product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 5;
            const isDapur = (product.station || 'Dapur') === 'Dapur';

            return (
              <div 
                key={product.id}
                className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
                onClick={() => !isOutOfStock && addToCart(product)}
              >
                <div className="product-image-box">
                  <span>{product.emoji || '🍽️'}</span>

                  {/* Station Badge (Dapur vs Bar) */}
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: isDapur ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isDapur ? 'var(--danger)' : 'var(--warning)',
                    border: `1px solid ${isDapur ? 'var(--danger)' : 'var(--warning)'}`,
                    borderRadius: '99px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isDapur ? <ChefHat size={11} /> : <Coffee size={11} />}
                    {isDapur ? 'Dapur' : 'Bar'}
                  </span>

                  {/* Stock Status Badge */}
                  <span className={`product-stock-badge ${isOutOfStock ? 'low' : isLowStock ? 'low' : ''}`}>
                    {isOutOfStock ? 'Habis' : `Stok: ${product.stock}`}
                  </span>
                </div>

                <div className="product-info">
                  <div className="product-sku">{product.sku}</div>
                  <div className="product-name">{product.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div className="product-price">{formatCurrency(product.price)}</div>
                    {!isOutOfStock && (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Plus size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
