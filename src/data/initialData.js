// Data Awal NusaPOS Cafe & Resto (Branches, Users, Categories, Products, Tables, Customers & Transactions)

export const INITIAL_BRANCHES = [
  {
    id: 'cabang-01',
    code: 'CBG-JKT-01',
    name: 'Cabang Utama Jakarta',
    address: 'Jl. Jend. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan',
    status: 'Aktif',
    phone: '021-5551234',
    email: 'jakarta@nusapos.com',
    manager: 'Andi Admin',
    openingHours: '08:00 - 22:00 WIB',
    totalTables: 7,
    totalStaff: 4
  },
  {
    id: 'cabang-02',
    code: 'CBG-BDG-02',
    name: 'Cabang Bandung Dago',
    address: 'Jl. Ir. H. Juanda No. 88, Dago, Bandung',
    status: 'Aktif',
    phone: '022-7775678',
    email: 'bandung@nusapos.com',
    manager: 'Siti Rahma',
    openingHours: '09:00 - 23:00 WIB',
    totalTables: 5,
    totalStaff: 3
  },
  {
    id: 'cabang-03',
    code: 'CBG-SBY-03',
    name: 'Cabang Surabaya Gubeng',
    address: 'Jl. Pemuda No. 12, Gubeng, Surabaya',
    status: 'Aktif',
    phone: '031-8889900',
    email: 'surabaya@nusapos.com',
    manager: 'Budi Santoso',
    openingHours: '08:00 - 22:00 WIB',
    totalTables: 6,
    totalStaff: 3
  },
  {
    id: 'cabang-04',
    code: 'CBG-BAL-04',
    name: 'Cabang Bali Kuta',
    address: 'Jl. Pantai Kuta No. 101, Badung, Bali',
    status: 'Renovasi',
    phone: '0361-9998877',
    email: 'bali@nusapos.com',
    manager: 'I Wayan Gede',
    openingHours: '10:00 - 00:00 WITA',
    totalTables: 8,
    totalStaff: 2
  }
];

export const INITIAL_CATEGORIES = [
  { id: 'makanan', name: 'Makanan', icon: 'Utensils', station: 'Dapur', description: 'Hidangan utama cafe, pasta, & rice bowl' },
  { id: 'snack', name: 'Snack & Dessert', icon: 'Cookie', station: 'Dapur', description: 'Camilan ringan, pastry, & kudapan manis' },
  { id: 'coffee', name: 'Coffee', icon: 'Coffee', station: 'Bar', description: 'Kopi espresso, latte, & racikan khas barista' },
  { id: 'milkshake', name: 'Milk Shake', icon: 'CupSoda', station: 'Bar', description: 'Minuman blender susu, matcha & gelato' },
  { id: 'minuman', name: 'Minuman', icon: 'GlassWater', station: 'Bar', description: 'Es teh artisan, jus segar, & mocktail' }
];

export const INITIAL_USERS = [
  { id: 'user-01', name: 'Hendra Owner', username: 'owner', role: 'Owner', branchId: 'all', branchName: 'Semua Cabang' },
  { id: 'user-02', name: 'Andi Admin', username: 'admin', role: 'Admin', branchId: 'cabang-01', branchName: 'Cabang Utama (Jakarta)' },
  { id: 'user-03', name: 'Rina Kasir', username: 'kasir', role: 'Kasir', branchId: 'cabang-01', branchName: 'Cabang Utama (Jakarta)' },
  { id: 'user-04', name: 'Chef Jaka', username: 'dapur', role: 'Dapur', branchId: 'cabang-01', branchName: 'Cabang Utama (Jakarta)' },
  { id: 'user-05', name: 'Barista Doni', username: 'bar', role: 'Bar', branchId: 'cabang-01', branchName: 'Cabang Utama (Jakarta)' }
];

export const INITIAL_TABLES = [
  { id: 'tbl-01', number: 'Meja 01', type: 'Reguler', capacity: 4, status: 'Kosong', branchId: 'cabang-01', qrCode: 'QR-MEJA-01' },
  { id: 'tbl-02', number: 'Meja 02', type: 'Reguler', capacity: 2, status: 'Terisi', branchId: 'cabang-01', qrCode: 'QR-MEJA-02' },
  { id: 'tbl-03', number: 'Meja 03', type: 'Reguler', capacity: 4, status: 'Kosong', branchId: 'cabang-01', qrCode: 'QR-MEJA-03' },
  { id: 'tbl-04', number: 'Meja 04', type: 'Reguler', capacity: 6, status: 'Reserved', branchId: 'cabang-01', qrCode: 'QR-MEJA-04' },
  { id: 'tbl-05', number: 'Meja 05', type: 'Reguler', capacity: 2, status: 'Kosong', branchId: 'cabang-01', qrCode: 'QR-MEJA-05' },
  { id: 'tbl-vip-01', number: 'Meja VIP 01', type: 'VIP', capacity: 8, status: 'Kosong', branchId: 'cabang-01', qrCode: 'QR-MEJA-VIP01' },
  { id: 'tbl-vip-02', number: 'Meja VIP 02', type: 'VIP', capacity: 10, status: 'Terisi', branchId: 'cabang-01', qrCode: 'QR-MEJA-VIP02' }
];

export const INITIAL_CUSTOMERS = [
  { id: 'cust-general', name: 'Pelanggan Umum', phone: '-', address: '-', ordersCount: 154 },
  { id: 'cust-01', name: 'Ahmad Wijaya', phone: '081234567890', address: 'Kebayoran Baru, Jakarta', ordersCount: 12 },
  { id: 'cust-02', name: 'Siti Rahma', phone: '085678901234', address: 'Dago, Bandung', ordersCount: 8 },
  { id: 'cust-03', name: 'Budi Santoso', phone: '087890123456', address: 'Gubeng, Surabaya', ordersCount: 5 }
];

export const INITIAL_PRODUCTS = [
  // --- STASIUN DAPUR (Makanan & Snack Cafe) ---
  {
    id: 'prod-001',
    sku: 'CF-MKN-01',
    name: 'Nasi Goreng Spesial Nusa Cafe',
    category: 'makanan',
    station: 'Dapur',
    price: 28000,
    costPrice: 14000,
    stock: 45,
    unit: 'porsi',
    emoji: '🍳',
    status: 'Tersedia',
    branchId: 'all',
    notes: 'Pilihan pedas: Sedang, Pedas, Extra Pedas'
  },
  {
    id: 'prod-002',
    sku: 'CF-MKN-02',
    name: 'Spaghetti Carbonara Creamy',
    category: 'makanan',
    station: 'Dapur',
    price: 35000,
    costPrice: 18000,
    stock: 30,
    unit: 'porsi',
    emoji: '🍝',
    status: 'Tersedia',
    branchId: 'all',
    notes: 'Extra Smoked Beef & Parmesan Cheese'
  },
  {
    id: 'prod-003',
    sku: 'CF-MKN-03',
    name: 'Chicken Rice Bowl Teriyaki',
    category: 'makanan',
    station: 'Dapur',
    price: 32000,
    costPrice: 16000,
    stock: 25,
    unit: 'porsi',
    emoji: '🍲',
    status: 'Tersedia',
    branchId: 'all'
  },
  {
    id: 'prod-004',
    sku: 'CF-MKN-04',
    name: 'Club Sandwich Supreme + Fries',
    category: 'makanan',
    station: 'Dapur',
    price: 30000,
    costPrice: 15000,
    stock: 0,
    unit: 'porsi',
    emoji: '🥪',
    status: 'Habis',
    branchId: 'all'
  },
  {
    id: 'prod-005',
    sku: 'CF-SNK-01',
    name: 'French Fries Extra Crispy',
    category: 'snack',
    station: 'Dapur',
    price: 18000,
    costPrice: 8000,
    stock: 50,
    unit: 'porsi',
    emoji: '🍟',
    status: 'Tersedia',
    branchId: 'all'
  },
  {
    id: 'prod-006',
    sku: 'CF-SNK-02',
    name: 'Roti Bakar Cokelat Keju Melt',
    category: 'snack',
    station: 'Dapur',
    price: 20000,
    costPrice: 9000,
    stock: 15,
    unit: 'porsi',
    emoji: '🍞',
    status: 'Tersedia',
    branchId: 'all'
  },
  {
    id: 'prod-007',
    sku: 'CF-SNK-03',
    name: 'Butter Croissant Warm',
    category: 'snack',
    station: 'Dapur',
    price: 22000,
    costPrice: 10000,
    stock: 20,
    unit: 'pcs',
    emoji: '🥐',
    status: 'Tersedia',
    branchId: 'all'
  },

  // --- STASIUN BAR (Kopi, Milk Shake & Minuman Barista) ---
  {
    id: 'prod-008',
    sku: 'CF-COF-01',
    name: 'Kopi Susu Gula Aren Nusa',
    category: 'coffee',
    station: 'Bar',
    price: 22000,
    costPrice: 9000,
    stock: 80,
    unit: 'gelas',
    emoji: '☕',
    status: 'Tersedia',
    branchId: 'all',
    notes: 'Pilihan: Less Ice / Normal Ice, Normal Sugar / Less Sugar'
  },
  {
    id: 'prod-009',
    sku: 'CF-COF-02',
    name: 'Americano Ice Espresso',
    category: 'coffee',
    station: 'Bar',
    price: 18000,
    costPrice: 6000,
    stock: 60,
    unit: 'gelas',
    emoji: '🧊',
    status: 'Tersedia',
    branchId: 'all'
  },
  {
    id: 'prod-010',
    sku: 'CF-COF-03',
    name: 'Caramel Macchiato Blend',
    category: 'coffee',
    station: 'Bar',
    price: 26000,
    costPrice: 11000,
    stock: 35,
    unit: 'gelas',
    emoji: '🏺',
    status: 'Tersedia',
    branchId: 'all'
  },
  {
    id: 'prod-011',
    sku: 'CF-MLK-01',
    name: 'Chocolate Milkshake Supreme',
    category: 'milkshake',
    station: 'Bar',
    price: 24000,
    costPrice: 10000,
    stock: 40,
    unit: 'gelas',
    emoji: '🥤',
    status: 'Tersedia',
    branchId: 'all'
  },
  {
    id: 'prod-012',
    sku: 'CF-MLK-02',
    name: 'Matcha Green Tea Latte Shake',
    category: 'milkshake',
    station: 'Bar',
    price: 25000,
    costPrice: 11000,
    stock: 25,
    unit: 'gelas',
    emoji: '🍵',
    status: 'Tersedia',
    branchId: 'all'
  },
  {
    id: 'prod-013',
    sku: 'CF-MNM-01',
    name: 'Es Teh Artisan Lychee Tea',
    category: 'minuman',
    station: 'Bar',
    price: 15000,
    costPrice: 5000,
    stock: 120,
    unit: 'gelas',
    emoji: '🍹',
    status: 'Tersedia',
    branchId: 'all'
  },
  {
    id: 'prod-014',
    sku: 'CF-MNM-02',
    name: 'Jus Alpukat Kocok Creamy',
    category: 'minuman',
    station: 'Bar',
    price: 18000,
    costPrice: 8000,
    stock: 30,
    unit: 'gelas',
    emoji: '🥑',
    status: 'Tersedia',
    branchId: 'all'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'TRX-20260805-001',
    date: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    branchId: 'cabang-01',
    branchName: 'Cabang Utama Jakarta',
    cashierName: 'Rina Kasir',
    customerName: 'Ahmad Wijaya',
    tableName: 'Meja 02',
    orderType: 'Dine In',
    items: [
      { id: 'prod-001', sku: 'CF-MKN-01', name: 'Nasi Goreng Spesial Nusa Cafe', price: 28000, qty: 2, subtotal: 56000, station: 'Dapur', notes: 'Pedas Sedang', stationStatus: 'Selesai' },
      { id: 'prod-008', sku: 'CF-COF-01', name: 'Kopi Susu Gula Aren Nusa', price: 22000, qty: 2, subtotal: 44000, station: 'Bar', notes: 'Less Ice', stationStatus: 'Sedang Dikerjakan' }
    ],
    subtotal: 100000,
    discount: 0,
    tax: 10000,
    total: 110000,
    paymentMethod: 'QRIS',
    amountPaid: 110000,
    change: 0,
    status: 'PROSES',
    paymentStatus: 'LUNAS'
  },
  {
    id: 'TRX-20260805-002',
    date: new Date(Date.now() - 3600000 * 3.5).toISOString(),
    branchId: 'cabang-01',
    branchName: 'Cabang Utama Jakarta',
    cashierName: 'Rina Kasir',
    customerName: 'Pelanggan Umum',
    tableName: 'Take Away',
    orderType: 'Take Away',
    items: [
      { id: 'prod-002', sku: 'CF-MKN-02', name: 'Spaghetti Carbonara Creamy', price: 35000, qty: 1, subtotal: 35000, station: 'Dapur', notes: '', stationStatus: 'Selesai' },
      { id: 'prod-013', sku: 'CF-MNM-01', name: 'Es Teh Artisan Lychee Tea', price: 15000, qty: 1, subtotal: 15000, station: 'Bar', notes: '', stationStatus: 'Selesai' }
    ],
    subtotal: 50000,
    discount: 0,
    tax: 5000,
    total: 55000,
    paymentMethod: 'TUNAI',
    amountPaid: 60000,
    change: 5000,
    status: 'SELESAI',
    paymentStatus: 'LUNAS'
  }
];
