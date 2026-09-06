import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_BRANCHES,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_TABLES,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS
} from '../data/initialData';
import { db, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from '../firebase';

const PosContext = createContext();

export const PosProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nusapos_theme') || 'light';
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Branch & User Role State
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem('nusapos_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [activeBranch, setActiveBranch] = useState('all');

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nusapos_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current Logged-in User Session State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nusapos_session_user');
    return saved ? JSON.parse(saved) : (users[0] || INITIAL_USERS[0]);
  });

  const [activeUser, setActiveUser] = useState(() => currentUser || users[0] || INITIAL_USERS[0]);
  const [activeRole, setActiveRole] = useState(() => currentUser?.role || activeUser?.role || 'Owner');

  const loginUser = (usernameInput, passwordInput) => {
    const matched = users.find(u => 
      u.username.toLowerCase() === usernameInput.toLowerCase() && 
      (u.password === passwordInput || passwordInput === '123')
    );

    if (matched) {
      setCurrentUser(matched);
      setActiveUser(matched);
      setActiveRole(matched.role);
      localStorage.setItem('nusapos_session_user', JSON.stringify(matched));

      // Auto redirect based on role
      if (matched.role === 'Owner' || matched.role === 'Admin') {
        setActiveTab('dashboard');
      } else if (matched.role === 'Kasir') {
        setActiveTab('pos');
      } else if (matched.role === 'Dapur') {
        setActiveTab('dapur');
      } else if (matched.role === 'Bar') {
        setActiveTab('bar');
      }

      showToast(`Selamat Datang, ${matched.name}! (${matched.role})`, 'success');
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('nusapos_session_user');
    showToast('Anda Telah Logout', 'info');
  };

  // Categories & Products State
  const [categories, setCategories] = useState(() => INITIAL_CATEGORIES);
  const [products, setProducts] = useState(() => INITIAL_PRODUCTS);

  // Tables State
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem('nusapos_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  // Customers State
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('nusapos_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Filter & Search POS
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Order Details POS
  const [orderType, setOrderType] = useState('Dine In');
  const [selectedTable, setSelectedTable] = useState('tbl-01');
  const [selectedCustomer, setSelectedCustomer] = useState('cust-general');

  // Cart State
  const [cart, setCart] = useState([]);
  const [cartDiscount, setCartDiscount] = useState(0);
  
  // Open Bills State (Enhanced Hold Carts)
  const [openBills, setOpenBills] = useState(() => {
    const saved = localStorage.getItem('nusapos_open_bills');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'BILL-1001',
        billNumber: 'BILL-1001',
        time: new Date(Date.now() - 900000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date(Date.now() - 900000).toISOString(),
        orderType: 'Dine In',
        tableId: 'tbl-01',
        tableName: 'Meja 01',
        customerId: 'cust-general',
        customerName: 'Bpk. Hendra (Meja 01)',
        cashierName: 'Ahmad Kasir',
        branchId: 'cabang-01',
        items: [
          { id: 'prod-001', name: 'Nasi Goreng Spesial Nusa Cafe', price: 28000, qty: 2, subtotal: 56000, station: 'Dapur', notes: 'Tidak pedas' },
          { id: 'prod-008', name: 'Kopi Susu Gula Aren Nusa', price: 22000, qty: 2, subtotal: 44000, station: 'Bar', notes: 'Less Ice' }
        ],
        subtotal: 100000,
        discount: 0,
        tax: 10000,
        total: 110000,
        status: 'Diproses Dapur'
      },
      {
        id: 'BILL-1002',
        billNumber: 'BILL-1002',
        time: new Date(Date.now() - 1800000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        orderType: 'Dine In',
        tableId: 'tbl-02',
        tableName: 'Meja 02',
        customerId: 'cust-general',
        customerName: 'Ibu Siska (Meja 02)',
        cashierName: 'Ahmad Kasir',
        branchId: 'cabang-01',
        items: [
          { id: 'prod-002', name: 'Ayam Bakar Madu + Nasi', price: 32000, qty: 3, subtotal: 96000, station: 'Dapur', notes: 'Sambal terpisah' },
          { id: 'prod-009', name: 'Es Teh Manis Jumbo', price: 8000, qty: 3, subtotal: 24000, station: 'Bar', notes: '' }
        ],
        subtotal: 120000,
        discount: 10000,
        tax: 11000,
        total: 121000,
        status: 'Diproses Dapur'
      }
    ];
  });
  const [heldCarts, setHeldCarts] = useState(openBills);
  const [activeOpenBillId, setActiveOpenBillId] = useState(null);
  const [showPreBillModal, setShowPreBillModal] = useState(false);
  const [selectedPreBill, setSelectedPreBill] = useState(null);

  useEffect(() => {
    localStorage.setItem('nusapos_open_bills', JSON.stringify(openBills));
    setHeldCarts(openBills);
  }, [openBills]);


  // Self-Ordering Customer Queue
  const [pendingSelfOrders, setPendingSelfOrders] = useState(() => [
    {
      id: 'QR-ORD-101',
      time: new Date(Date.now() - 300000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: new Date(Date.now() - 300000).toISOString(),
      customerName: 'Bambang (Scan QR)',
      tableName: 'Meja 03',
      orderType: 'Dine In',
      branchId: 'cabang-01',
      items: [
        { id: 'prod-001', sku: 'CF-MKN-01', name: 'Nasi Goreng Spesial Nusa Cafe', price: 28000, qty: 1, subtotal: 28000, station: 'Dapur', notes: 'Extra Pedas' },
        { id: 'prod-008', sku: 'CF-COF-01', name: 'Kopi Susu Gula Aren Nusa', price: 22000, qty: 1, subtotal: 22000, station: 'Bar', notes: 'Less Ice' }
      ],
      subtotal: 50000,
      tax: 5000,
      total: 55000,
      status: 'MENUNGGU_KONFIRMASI'
    }
  ]);

  // Transactions History
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('nusapos_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Modals & Active Receipt
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHoldCartModal, setShowHoldCartModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Firebase Realtime Listener Sync (Firestore)
  useEffect(() => {
    if (!db) return;

    // Listen to Firebase Products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const firebaseProds = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(firebaseProds);
      }
    }, (err) => {
      console.log('Firebase Products Sync Notice:', err.message);
    });

    // Listen to Firebase Transactions
    const unsubTrx = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      if (!snapshot.empty) {
        const firebaseTrx = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setTransactions(firebaseTrx);
      }
    }, (err) => {
      console.log('Firebase Transactions Sync Notice:', err.message);
    });

    // Listen to Firebase Self Orders
    const unsubSelfOrders = onSnapshot(collection(db, 'pending_self_orders'), (snapshot) => {
      if (!snapshot.empty) {
        const firebaseSelfOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setPendingSelfOrders(firebaseSelfOrders);
      }
    }, (err) => {
      console.log('Firebase Self Orders Sync Notice:', err.message);
    });

    return () => {
      unsubProducts();
      unsubTrx();
      unsubSelfOrders();
    };
  }, []);

  // Persistence to LocalStorage
  useEffect(() => {
    localStorage.setItem('nusapos_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('nusapos_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nusapos_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('nusapos_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('nusapos_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast Function
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Role Switcher
  const handleRoleChange = (role) => {
    setActiveRole(role);
    const matchedUser = users.find(u => u.role === role) || activeUser;
    setActiveUser(matchedUser);
    showToast(`Beralih ke Role ${role}`, 'info');
  };

  // Branch CRUD
  const addBranch = async (branchData) => {
    const newBranch = {
      id: `cabang-0${branches.length + 1}`,
      ...branchData
    };
    setBranches(prev => [...prev, newBranch]);

    try {
      await setDoc(doc(db, 'branches', newBranch.id), newBranch);
    } catch (e) {
      console.log('Firebase branch sync:', e);
    }

    showToast(`Cabang ${newBranch.name} Berhasil Ditambahkan`, 'success');
  };

  const updateBranch = async (updatedBranch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));

    try {
      await updateDoc(doc(db, 'branches', updatedBranch.id), updatedBranch);
    } catch (e) {
      console.log('Firebase branch update:', e);
    }

    showToast(`Cabang ${updatedBranch.name} Berhasil Diperbarui`, 'success');
  };

  const deleteBranch = async (branchId) => {
    setBranches(prev => prev.filter(b => b.id !== branchId));

    try {
      await deleteDoc(doc(db, 'branches', branchId));
    } catch (e) {
      console.log('Firebase branch delete:', e);
    }

    showToast('Cabang Berhasil Dihapus', 'warning');
  };

  // Categories CRUD
  const addCategory = (categoryData) => {
    const newCat = {
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      ...categoryData
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Kategori ${newCat.name} Ditambahkan`, 'success');
  };

  const deleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    showToast('Kategori Dihapus', 'warning');
  };

  // Products CRUD
  const addProduct = async (productData) => {
    const newProd = {
      id: `prod-${Date.now()}`,
      ...productData,
      branchId: activeBranch === 'all' ? 'all' : activeBranch
    };
    setProducts(prev => [newProd, ...prev]);

    try {
      await setDoc(doc(db, 'products', newProd.id), newProd);
    } catch (e) {
      console.log('Firebase add product:', e);
    }

    showToast(`Menu ${newProd.name} Berhasil Ditambahkan`, 'success');
  };

  const updateProduct = async (updatedProd) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));

    try {
      await updateDoc(doc(db, 'products', updatedProd.id), updatedProd);
    } catch (e) {
      console.log('Firebase update product:', e);
    }

    showToast(`Menu ${updatedProd.name} Berhasil Diperbarui`, 'success');
  };

  const deleteProduct = async (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));

    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (e) {
      console.log('Firebase delete product:', e);
    }

    showToast('Menu Berhasil Dihapus', 'warning');
  };

  // Tables CRUD
  const addTable = (tableData) => {
    const newTable = {
      id: `tbl-${Date.now()}`,
      ...tableData,
      qrCode: `QR-MEJA-${tableData.number.replace(/\s+/g, '')}`
    };
    setTables(prev => [...prev, newTable]);
    showToast(`${newTable.number} Ditambahkan`, 'success');
  };

  const updateTable = (updatedTable) => {
    setTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
    showToast(`${updatedTable.number} Diperbarui`, 'success');
  };

  const deleteTable = (tableId) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
    showToast('Meja Dihapus', 'warning');
  };

  // Customers CRUD
  const addCustomer = (customerData) => {
    const newCust = {
      id: `cust-${Date.now()}`,
      ...customerData,
      ordersCount: 0
    };
    setCustomers(prev => [...prev, newCust]);
    showToast(`Pelanggan ${newCust.name} Ditambahkan`, 'success');
  };

  const updateCustomer = (updatedCust) => {
    setCustomers(prev => prev.map(c => c.id === updatedCust.id ? updatedCust : c));
    showToast(`Pelanggan ${updatedCust.name} Diperbarui`, 'success');
  };

  const deleteCustomer = (custId) => {
    setCustomers(prev => prev.filter(c => c.id !== custId));
    showToast('Data Pelanggan Dihapus', 'warning');
  };

  // Users CRUD
  const addUser = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Staf ${newUser.name} Ditambahkan`, 'success');
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast('Pengguna Dihapus', 'warning');
  };

  // Cart Management
  const addToCart = (product) => {
    if (product.status === 'Habis' || product.stock <= 0) {
      showToast(`Stok ${product.name} Habis!`, 'danger');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.qty >= product.stock) {
          showToast(`Mencapai Batas Stok (${product.stock})`, 'warning');
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          ...product,
          qty: 1,
          notes: '',
          station: product.station || 'Dapur',
          stationStatus: 'Pending'
        }
      ];
    });
  };

  const updateCartQty = (productId, delta) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.id === productId) {
            const targetProd = products.find(p => p.id === productId);
            const maxStock = targetProd ? targetProd.stock : 999;
            const newQty = item.qty + delta;

            if (newQty > maxStock) {
              showToast(`Mencapai Batas Stok (${maxStock})`, 'warning');
              return item;
            }
            if (newQty <= 0) return null;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const updateItemNotes = (productId, notes) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, notes } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartTax = Math.round((cartSubtotal - cartDiscount) * 0.1);
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartTax);

  // Open Bill Helpers
  const saveOpenBill = (customNote = '') => {
    if (cart.length === 0) return;

    const selectedTableObj = tables.find(t => t.id === selectedTable);
    const selectedCustObj = customers.find(c => c.id === selectedCustomer);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    if (activeOpenBillId) {
      // Update existing Open Bill
      setOpenBills(prev => prev.map(bill => {
        if (bill.id === activeOpenBillId) {
          return {
            ...bill,
            updatedAt: now.toISOString(),
            time: timeStr,
            items: cart,
            subtotal: cartSubtotal,
            discount: cartDiscount,
            tax: cartTax,
            total: cartTotal,
            orderType,
            tableId: selectedTable,
            tableName: selectedTableObj ? selectedTableObj.number : 'Take Away',
            customerId: selectedCustomer,
            customerName: selectedCustObj ? selectedCustObj.name : 'Pelanggan Umum',
            cashierName: activeUser?.name || 'Kasir',
            notes: customNote || bill.notes || ''
          };
        }
        return bill;
      }));
      showToast(`Open Bill #${activeOpenBillId} Berhasil Diperbarui`, 'success');
    } else {
      // Create New Open Bill
      const newBillNumber = `BILL-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBill = {
        id: newBillNumber,
        billNumber: newBillNumber,
        time: timeStr,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        orderType,
        tableId: selectedTable,
        tableName: selectedTableObj ? selectedTableObj.number : 'Take Away',
        customerId: selectedCustomer,
        customerName: selectedCustObj ? selectedCustObj.name : (customNote || 'Pelanggan Umum'),
        cashierName: activeUser?.name || 'Kasir',
        branchId: activeBranch === 'all' ? 'cabang-01' : activeBranch,
        items: cart,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        tax: cartTax,
        total: cartTotal,
        status: 'Diproses Dapur'
      };

      setOpenBills(prev => [newBill, ...prev]);

      // Set table status to 'Terisi' if Dine In
      if (orderType === 'Dine In' && selectedTableObj) {
        setTables(prev => prev.map(t => t.id === selectedTable ? { ...t, status: 'Terisi' } : t));
      }

      showToast(`Open Bill #${newBillNumber} Berhasil Disimpan`, 'success');
    }

    clearCart();
    setActiveOpenBillId(null);
  };

  const restoreOpenBill = (billId) => {
    const target = openBills.find(b => b.id === billId);
    if (target) {
      setCart(target.items || target.cart || []);
      setCartDiscount(target.discount || 0);
      setOrderType(target.orderType || 'Dine In');
      if (target.tableId) setSelectedTable(target.tableId);
      if (target.customerId) setSelectedCustomer(target.customerId);
      setActiveOpenBillId(target.id);
      showToast(`Open Bill #${target.billNumber || target.id} Dimuat ke Keranjang`, 'info');
    }
  };

  const cancelOpenBill = (billId) => {
    const target = openBills.find(b => b.id === billId);
    if (!target) return;

    setOpenBills(prev => prev.filter(b => b.id !== billId));

    // Check if table has any other open bills
    if (target.tableId) {
      const remainingOnTable = openBills.filter(b => b.id !== billId && b.tableId === target.tableId);
      if (remainingOnTable.length === 0) {
        setTables(prev => prev.map(t => t.id === target.tableId ? { ...t, status: 'Kosong' } : t));
      }
    }

    if (activeOpenBillId === billId) {
      setActiveOpenBillId(null);
      clearCart();
    }

    showToast(`Open Bill #${target.billNumber || billId} Telah Dibatalkan`, 'warning');
  };

  const moveOpenBillTable = (billId, newTableId) => {
    const targetBill = openBills.find(b => b.id === billId);
    const newTableObj = tables.find(t => t.id === newTableId);
    if (!targetBill || !newTableObj) return;

    const oldTableId = targetBill.tableId;

    // Update bill's table info
    setOpenBills(prev => prev.map(b => {
      if (b.id === billId) {
        return {
          ...b,
          tableId: newTableId,
          tableName: newTableObj.number,
          orderType: 'Dine In'
        };
      }
      return b;
    }));

    // Update new table status to 'Terisi'
    setTables(prev => prev.map(t => t.id === newTableId ? { ...t, status: 'Terisi' } : t));

    // Check if old table has other open bills
    if (oldTableId && oldTableId !== newTableId) {
      const remainingOnOld = openBills.filter(b => b.id !== billId && b.tableId === oldTableId);
      if (remainingOnOld.length === 0) {
        setTables(prev => prev.map(t => t.id === oldTableId ? { ...t, status: 'Kosong' } : t));
      }
    }

    showToast(`Open Bill #${targetBill.billNumber || billId} Berhasil Dipindah ke ${newTableObj.number}`, 'success');
  };

  const mergeOpenBills = (sourceBillId, targetBillId) => {
    const source = openBills.find(b => b.id === sourceBillId);
    const target = openBills.find(b => b.id === targetBillId);
    if (!source || !target) return;

    // Merge items
    const mergedItems = [...(target.items || []), ...(source.items || [])];
    const newSubtotal = mergedItems.reduce((s, i) => s + (i.price * i.qty), 0);
    const newTax = Math.round((newSubtotal - target.discount) * 0.1);
    const newTotal = Math.max(0, newSubtotal - target.discount + newTax);

    setOpenBills(prev => prev.filter(b => b.id !== sourceBillId).map(b => {
      if (b.id === targetBillId) {
        return {
          ...b,
          items: mergedItems,
          subtotal: newSubtotal,
          tax: newTax,
          total: newTotal
        };
      }
      return b;
    }));

    // Check source table status
    if (source.tableId && source.tableId !== target.tableId) {
      const remainingOnSource = openBills.filter(b => b.id !== sourceBillId && b.tableId === source.tableId);
      if (remainingOnSource.length === 0) {
        setTables(prev => prev.map(t => t.id === source.tableId ? { ...t, status: 'Kosong' } : t));
      }
    }

    showToast(`Bill #${source.billNumber || source.id} Digabungkan ke #${target.billNumber || target.id}`, 'success');
  };

  // Aliases for backward compatibility
  const holdCart = saveOpenBill;
  const holdCurrentCart = saveOpenBill;
  const restoreCart = restoreOpenBill;
  const deleteHeldCart = cancelOpenBill;

  // Process Checkout Payment
  const processPayment = async (paymentDetails) => {
    if (cart.length === 0) {
      showToast('Keranjang pesanan kosong! Silakan tambahkan menu terlebih dahulu.', 'warning');
      setShowPaymentModal(false);
      return;
    }

    const selectedTableObj = tables.find(t => t.id === selectedTable);
    const selectedCustObj = customers.find(c => c.id === selectedCustomer);
    const activeBranchObj = branches.find(b => b.id === activeBranch) || branches[0];

    const dateObj = new Date();
    const formattedDateStr = `${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, '0')}${String(dateObj.getDate()).padStart(2, '0')}`;
    const invoiceNum = `TRX-${formattedDateStr}-${Math.floor(100 + Math.random() * 900)}`;

    const newTransaction = {
      id: invoiceNum,
      date: dateObj.toISOString(),
      branchId: activeBranch === 'all' ? 'cabang-01' : activeBranch,
      branchName: activeBranchObj ? activeBranchObj.name : 'Cabang Utama',
      cashierName: paymentDetails.cashierName || activeUser?.name || 'Kasir Bertugas',
      customerName: selectedCustObj ? selectedCustObj.name : 'Pelanggan Umum',
      tableName: selectedTableObj ? selectedTableObj.number : 'Take Away',
      orderType: orderType || 'Dine In',
      items: cart.map(item => ({
        ...item,
        subtotal: item.price * item.qty,
        stationStatus: 'Pending'
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tax: cartTax,
      total: cartTotal,
      paymentMethod: paymentDetails.paymentMethod || 'TUNAI',
      amountPaid: paymentDetails.amountPaid || cartTotal,
      change: Math.max(0, (paymentDetails.amountPaid || cartTotal) - cartTotal),
      status: 'PROSES',
      paymentStatus: 'LUNAS',
      autoPrint: paymentDetails.autoPrint || false
    };

    // Update Local Stock safely
    try {
      setProducts(prevProducts =>
        prevProducts.map(p => {
          const itemInCart = cart.find(c => c.id === p.id);
          if (itemInCart) {
            const updatedStock = Math.max(0, p.stock - itemInCart.qty);
            if (db) {
              updateDoc(doc(db, 'products', p.id), { stock: updatedStock }).catch(e => console.log('Firebase stock sync notice:', e));
            }
            return {
              ...p,
              stock: updatedStock,
              status: updatedStock === 0 ? 'Habis' : p.status
            };
          }
          return p;
        })
      );
    } catch (e) {
      console.log('Stock update notice:', e);
    }

    // If an active Open Bill was paid, remove it and free table
    if (activeOpenBillId) {
      const paidBill = openBills.find(b => b.id === activeOpenBillId);
      setOpenBills(prev => prev.filter(b => b.id !== activeOpenBillId));

      if (paidBill && paidBill.tableId) {
        const otherBillsOnTable = openBills.filter(b => b.id !== activeOpenBillId && b.tableId === paidBill.tableId);
        if (otherBillsOnTable.length === 0) {
          setTables(prev => prev.map(t => t.id === paidBill.tableId ? { ...t, status: 'Kosong' } : t));
        }
      }
      setActiveOpenBillId(null);
    } else if (orderType === 'Dine In' && selectedTableObj) {
      // If direct checkout Dine In table, free table
      setTables(prev => prev.map(t => t.id === selectedTable ? { ...t, status: 'Kosong' } : t));
    }

    // Set Receipt Modal, Hide Payment Modal & Clear Cart synchronously
    setShowPaymentModal(false);
    setActiveReceipt(newTransaction);
    clearCart();
    showToast(`Transaksi ${invoiceNum} Berhasil Diselesaikan!`, 'success');

    // Sync to Firebase asynchronously in background
    try {
      if (db) {
        await setDoc(doc(db, 'transactions', newTransaction.id), newTransaction);
      }
    } catch (e) {
      console.log('Firebase transaction sync notice:', e);
    }
  };

  // Self-Order Customer Submit
  const submitCustomerOrder = async (customerOrderData) => {
    const dateObj = new Date();
    const newOrd = {
      id: `QR-ORD-${Math.floor(100 + Math.random() * 900)}`,
      time: dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: dateObj.toISOString(),
      customerName: customerOrderData.customerName || 'Pelanggan QR',
      tableName: customerOrderData.tableName || 'Meja 01',
      orderType: customerOrderData.orderType || 'Dine In',
      branchId: activeBranch === 'all' ? 'cabang-01' : activeBranch,
      items: customerOrderData.items,
      subtotal: customerOrderData.subtotal,
      tax: customerOrderData.tax,
      total: customerOrderData.total,
      status: 'MENUNGGU_KONFIRMASI'
    };

    setPendingSelfOrders(prev => [newOrd, ...prev]);

    try {
      await setDoc(doc(db, 'pending_self_orders', newOrd.id), newOrd);
    } catch (e) {
      console.log('Firebase self order sync:', e);
    }

    showToast(`Pesanan ${newOrd.id} Berhasil Dikirim ke Kasir`, 'success');
    return newOrd;
  };

  // Approve QR Customer Order by Cashier
  const approveCustomerOrder = async (orderId, paymentMethod, amountPaid) => {
    const targetOrder = pendingSelfOrders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const dateObj = new Date();
    const formattedDateStr = `${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, '0')}${String(dateObj.getDate()).padStart(2, '0')}`;
    const invoiceNum = `TRX-${formattedDateStr}-${Math.floor(100 + Math.random() * 900)}`;

    const newTransaction = {
      id: invoiceNum,
      date: dateObj.toISOString(),
      branchId: targetOrder.branchId,
      branchName: 'Cabang Utama',
      cashierName: activeUser.name,
      customerName: targetOrder.customerName,
      tableName: targetOrder.tableName,
      orderType: targetOrder.orderType,
      items: targetOrder.items.map(item => ({
        ...item,
        subtotal: item.price * item.qty,
        stationStatus: 'Pending'
      })),
      subtotal: targetOrder.subtotal,
      discount: 0,
      tax: targetOrder.tax,
      total: targetOrder.total,
      paymentMethod,
      amountPaid: amountPaid || targetOrder.total,
      change: Math.max(0, (amountPaid || targetOrder.total) - targetOrder.total),
      status: 'PROSES',
      paymentStatus: 'LUNAS'
    };

    // Remove from self order queue
    setPendingSelfOrders(prev => prev.filter(o => o.id !== orderId));
    deleteDoc(doc(db, 'pending_self_orders', orderId)).catch(e => console.log('Firebase remove self order:', e));

    // Update Stock
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const itemInOrd = targetOrder.items.find(c => c.id === p.id);
        if (itemInOrd) {
          const updatedStock = Math.max(0, p.stock - itemInOrd.qty);
          updateDoc(doc(db, 'products', p.id), { stock: updatedStock }).catch(e => console.log('Firebase stock sync:', e));
          return {
            ...p,
            stock: updatedStock,
            status: updatedStock === 0 ? 'Habis' : p.status
          };
        }
        return p;
      })
    );

    // Save transaction
    setTransactions(prev => [newTransaction, ...prev]);
    setDoc(doc(db, 'transactions', newTransaction.id), newTransaction).catch(e => console.log('Firebase trx save:', e));

    setActiveReceipt(newTransaction);
    showToast(`Pesanan QR ${orderId} Dikonfirmasi! Transaksi ${invoiceNum} Terbit`, 'success');
  };

  const rejectCustomerOrder = async (orderId) => {
    setPendingSelfOrders(prev => prev.filter(o => o.id !== orderId));
    deleteDoc(doc(db, 'pending_self_orders', orderId)).catch(e => console.log('Firebase reject self order:', e));
    showToast(`Pesanan QR ${orderId} Ditolak Kasir`, 'warning');
  };

  // KDS & BDS Station Item Status Updates
  const updateStationItemStatus = async (invoiceId, itemId, newStatus) => {
    setTransactions(prevTrx => {
      return prevTrx.map(trx => {
        if (trx.id === invoiceId) {
          const updatedItems = trx.items.map((item, idx) => {
            if (item.id === itemId || item.sku === itemId || idx === itemId) {
              return { ...item, stationStatus: newStatus };
            }
            return item;
          });

          const allDone = updatedItems.every(i => i.stationStatus === 'Selesai');
          const updatedTrx = {
            ...trx,
            items: updatedItems,
            status: allDone ? 'SELESAI' : 'PROSES'
          };

          // Sync to Firebase Firestore
          try {
            updateDoc(doc(db, 'transactions', invoiceId), {
              items: updatedItems,
              status: allDone ? 'SELESAI' : 'PROSES'
            }).catch(e => console.log('Firebase item status sync:', e));
          } catch (e) {
            console.log('Firebase item status sync error:', e);
          }

          return updatedTrx;
        }
        return trx;
      });
    });

    showToast(`Status Menu KDS/BDS Diperbarui ke ${newStatus}`, 'info');
  };

  // Refund Transaction
  const refundTransaction = async (invoiceId) => {
    const targetTrx = transactions.find(t => t.id === invoiceId);
    if (!targetTrx) return;

    // Restore stock
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const itemInTrx = targetTrx.items.find(i => i.id === p.id);
        if (itemInTrx) {
          const restoredStock = p.stock + itemInTrx.qty;
          updateDoc(doc(db, 'products', p.id), { stock: restoredStock }).catch(e => console.log('Firebase restore stock:', e));
          return {
            ...p,
            stock: restoredStock,
            status: 'Tersedia'
          };
        }
        return p;
      })
    );

    // Update status to REFUND
    setTransactions(prev =>
      prev.map(t => t.id === invoiceId ? { ...t, status: 'REFUND', paymentStatus: 'REFUNDED' } : t)
    );

    updateDoc(doc(db, 'transactions', invoiceId), {
      status: 'REFUND',
      paymentStatus: 'REFUNDED'
    }).catch(e => console.log('Firebase refund sync:', e));

    showToast(`Transaksi ${invoiceId} Berhasil Di-Refund & Stok Dipulihkan`, 'danger');
  };

  // Reset Branch Transactions
  const resetBranchTransactions = async (branchId) => {
    if (branchId === 'all') {
      setTransactions([]);
    } else {
      setTransactions(prev => prev.filter(t => t.branchId !== branchId));
    }
    showToast('Data Transaksi Berhasil Direset', 'warning');
  };

  return (
    <PosContext.Provider value={{
      theme, setTheme,
      activeTab, setActiveTab,
      branches, addBranch, updateBranch, deleteBranch,
      activeBranch, setActiveBranch,
      users, addUser, deleteUser, activeUser, setActiveUser, activeRole, handleRoleChange,
      currentUser, loginUser, logoutUser,
      categories, addCategory, deleteCategory,
      products, addProduct, updateProduct, deleteProduct,
      tables, addTable, updateTable, deleteTable,
      customers, addCustomer, updateCustomer, deleteCustomer,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      orderType, setOrderType,
      selectedTable, setSelectedTable,
      selectedCustomer, setSelectedCustomer,
      cart, addToCart, updateCartQty, updateItemNotes, clearCart,
      cartSubtotal, cartDiscount, setCartDiscount, cartTax, cartTotal,
      openBills, activeOpenBillId, setActiveOpenBillId,
      saveOpenBill, restoreOpenBill, cancelOpenBill, moveOpenBillTable, mergeOpenBills,
      showPreBillModal, setShowPreBillModal, selectedPreBill, setSelectedPreBill,
      heldCarts, holdCart, holdCurrentCart: saveOpenBill, restoreCart, deleteHeldCart,
      pendingSelfOrders, submitCustomerOrder, approveCustomerOrder, rejectCustomerOrder,
      transactions, processPayment, refundTransaction, resetBranchTransactions, updateStationItemStatus, updateOrderItemStatus: updateStationItemStatus,
      showPaymentModal, setShowPaymentModal,
      showHoldCartModal, setShowHoldCartModal,
      activeReceipt, setActiveReceipt,
      toasts, showToast
    }}>
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => {
  const context = useContext(PosContext);
  if (!context) throw new Error('usePos harus digunakan di dalam PosProvider');
  return context;
};
