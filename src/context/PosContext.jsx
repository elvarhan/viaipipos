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

const PosContext = createContext();

export const PosProvider = ({ children }) => {
  // Theme State (Default: light clean white with emerald green)
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

  const [activeBranch, setActiveBranch] = useState('all'); // 'all' or branchId

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nusapos_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [activeUser, setActiveUser] = useState(() => {
    return users[0] || INITIAL_USERS[0];
  });

  const [activeRole, setActiveRole] = useState(() => activeUser?.role || 'Owner');

  // Categories State
  const [categories, setCategories] = useState(() => INITIAL_CATEGORIES);

  // Products State (Cafe Menu)
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
  const [orderType, setOrderType] = useState('Dine In'); // 'Dine In' | 'Take Away'
  const [selectedTable, setSelectedTable] = useState('tbl-01');
  const [selectedCustomer, setSelectedCustomer] = useState('cust-general');

  // Cart State
  const [cart, setCart] = useState([]);
  const [cartDiscount, setCartDiscount] = useState(0);
  const [heldCarts, setHeldCarts] = useState([]);

  // Self-Ordering Customer Queue (Pending Confirmation by Cashier)
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

  // Transactions History (Contains KDS / BDS Order Queue)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('nusapos_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Modals & Active Receipt
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHoldCartModal, setShowHoldCartModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  // Toast Feedback State
  const [toasts, setToasts] = useState([]);

  // Persistence to LocalStorage
  useEffect(() => {
    localStorage.setItem('nusapos_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('nusapos_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nusapos_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('nusapos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nusapos_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('nusapos_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('nusapos_self_orders', JSON.stringify(pendingSelfOrders));
  }, [pendingSelfOrders]);

  useEffect(() => {
    localStorage.setItem('nusapos_transactions', JSON.stringify(transactions));
  }, [transactions]);

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

  // Switch User Role helper
  const handleRoleChange = (role) => {
    setActiveRole(role);
    const matchedUser = users.find(u => u.role === role) || activeUser;
    setActiveUser(matchedUser);
    showToast(`Beralih ke Peran: ${role}`, 'info');
  };

  // Cart Actions
  const addToCart = (product) => {
    if (product.status === 'Habis' || product.stock <= 0) {
      showToast(`Stok ${product.name} sedang habis!`, 'danger');
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          showToast(`Jumlah melebihi stok yang tersedia (${product.stock})`, 'warning');
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, {
        ...product,
        qty: 1,
        notes: '',
        station: product.station || 'Dapur'
      }];
    });
    showToast(`${product.name} ditambahkan ke keranjang`, 'success');
  };

  const updateCartQty = (productId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQty = item.qty + delta;
          if (newQty <= 0) return null;
          const targetProd = products.find(p => p.id === productId);
          if (targetProd && newQty > targetProd.stock) {
            showToast(`Mencapai batas stok maksimum (${targetProd.stock})`, 'warning');
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const updateCartNotes = (productId, notes) => {
    setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, notes } : item));
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
  };

  // Hold Cart Functionality
  const holdCurrentCart = (note = '') => {
    if (cart.length === 0) return;
    const heldItem = {
      id: `HOLD-${Date.now()}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      cart: [...cart],
      orderType,
      selectedTable,
      selectedCustomer,
      note: note || `Pesanan ${heldCarts.length + 1}`
    };
    setHeldCarts(prev => [...prev, heldItem]);
    clearCart();
    showToast('Keranjang berhasil disimpan sementara!', 'info');
  };

  const restoreCart = (heldId) => {
    const target = heldCarts.find(h => h.id === heldId);
    if (target) {
      setCart(target.cart);
      if (target.orderType) setOrderType(target.orderType);
      if (target.selectedTable) setSelectedTable(target.selectedTable);
      if (target.selectedCustomer) setSelectedCustomer(target.selectedCustomer);
      setHeldCarts(prev => prev.filter(h => h.id !== heldId));
      showToast('Keranjang dipulihkan', 'success');
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartTax = Math.round(cartSubtotal * 0.1); // 10% PPN
  const cartTotal = Math.max(0, cartSubtotal + cartTax - cartDiscount);

  // Customer Self-Ordering Functions
  const submitCustomerOrder = ({ customerName, tableName, orderType, items, subtotal, tax, total }) => {
    const newSelfOrder = {
      id: `QR-ORD-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString(),
      customerName: customerName || 'Pelanggan QR',
      tableName: tableName || 'Meja 01',
      orderType: orderType || 'Dine In',
      branchId: activeBranch === 'all' ? 'cabang-01' : activeBranch,
      items: items.map(i => ({
        ...i,
        stationStatus: 'Pending'
      })),
      subtotal,
      tax,
      total,
      status: 'MENUNGGU_KONFIRMASI'
    };

    setPendingSelfOrders(prev => [newSelfOrder, ...prev]);
    showToast(`Pesanan ${newSelfOrder.id} berhasil dikirim ke Kasir! Menunggu konfirmasi...`, 'success');
    return newSelfOrder;
  };

  const approveCustomerOrder = (orderId, paymentMethod = 'TUNAI', amountPaid) => {
    const targetOrder = pendingSelfOrders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const currentBranchObj = branches.find(b => b.id === targetOrder.branchId) || branches[0];
    const now = new Date();
    const invoiceId = `TRX-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx = {
      id: invoiceId,
      date: now.toISOString(),
      branchId: currentBranchObj.id,
      branchName: currentBranchObj.name,
      cashierName: activeUser?.name || 'Kasir',
      customerName: targetOrder.customerName,
      tableName: targetOrder.tableName,
      orderType: targetOrder.orderType,
      items: targetOrder.items.map(item => ({
        id: item.id,
        sku: item.sku || 'SKU-NUSA',
        name: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty,
        station: item.station || 'Dapur',
        notes: item.notes || '',
        stationStatus: 'Pending'
      })),
      subtotal: targetOrder.subtotal,
      discount: 0,
      tax: targetOrder.tax,
      total: targetOrder.total,
      paymentMethod,
      amountPaid: amountPaid || targetOrder.total,
      change: (amountPaid || targetOrder.total) - targetOrder.total,
      status: 'PROSES',
      paymentStatus: 'LUNAS'
    };

    // Deduct stock
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const item = targetOrder.items.find(i => i.id === prod.id);
        if (item) {
          const updatedStock = Math.max(0, prod.stock - item.qty);
          return {
            ...prod,
            stock: updatedStock,
            status: updatedStock === 0 ? 'Habis' : prod.status
          };
        }
        return prod;
      });
    });

    // Update table status to Terisi
    const targetTableObj = tables.find(t => t.number === targetOrder.tableName);
    if (targetTableObj) {
      setTables(prev => prev.map(t => t.id === targetTableObj.id ? { ...t, status: 'Terisi' } : t));
    }

    setTransactions(prev => [newTx, ...prev]);
    setPendingSelfOrders(prev => prev.filter(o => o.id !== orderId));
    setActiveReceipt(newTx);
    showToast(`Pesanan QR ${orderId} Dikonfirmasi & Dituntaskan!`, 'success');
  };

  const rejectCustomerOrder = (orderId) => {
    setPendingSelfOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Pesanan QR ${orderId} ditolak oleh Kasir.`, 'warning');
  };

  // Process Transaction & Dispatch to KDS / BDS
  const processPayment = ({ paymentMethod, amountPaid }) => {
    if (cart.length === 0) return;

    const currentBranchObj = branches.find(b => b.id === (activeBranch === 'all' ? 'cabang-01' : activeBranch)) || branches[0];
    const currentCustObj = customers.find(c => c.id === selectedCustomer) || { name: 'Pelanggan Umum' };
    const currentTblObj = orderType === 'Dine In' ? (tables.find(t => t.id === selectedTable) || { number: 'Meja 01' }) : { number: 'Take Away' };

    const change = amountPaid >= cartTotal ? amountPaid - cartTotal : 0;
    const now = new Date();
    const invoiceId = `TRX-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTransaction = {
      id: invoiceId,
      date: now.toISOString(),
      branchId: currentBranchObj.id,
      branchName: currentBranchObj.name,
      cashierName: activeUser?.name || 'Kasir',
      customerName: currentCustObj.name,
      tableName: currentTblObj.number,
      orderType,
      items: cart.map(item => ({
        id: item.id,
        sku: item.sku || 'SKU-NUSA',
        name: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty,
        station: item.station || (item.category === 'makanan' || item.category === 'snack' ? 'Dapur' : 'Bar'),
        notes: item.notes || '',
        stationStatus: 'Pending'
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      tax: cartTax,
      total: cartTotal,
      paymentMethod,
      amountPaid,
      change,
      status: 'PROSES',
      paymentStatus: 'LUNAS'
    };

    // Deduct inventory stock
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const cartItem = cart.find(c => c.id === prod.id);
        if (cartItem) {
          const updatedStock = Math.max(0, prod.stock - cartItem.qty);
          return {
            ...prod,
            stock: updatedStock,
            status: updatedStock === 0 ? 'Habis' : prod.status
          };
        }
        return prod;
      });
    });

    // Update table status if Dine In
    if (orderType === 'Dine In' && selectedTable) {
      setTables(prev => prev.map(t => t.id === selectedTable ? { ...t, status: 'Terisi' } : t));
    }

    // Add to transaction log
    setTransactions(prev => [newTransaction, ...prev]);

    // Show thermal receipt modal
    setActiveReceipt(newTransaction);
    setShowPaymentModal(false);
    clearCart();
    showToast(`Transaksi ${invoiceId} Berhasil! Pesanan terkirim ke Dapur & Bar.`, 'success');
  };

  // KDS & BDS: Item Status Updater
  const updateOrderItemStatus = (transactionId, productId, newStatus) => {
    setTransactions(prevTransactions => {
      return prevTransactions.map(tx => {
        if (tx.id === transactionId) {
          const updatedItems = tx.items.map(item => {
            if (item.id === productId) {
              return { ...item, stationStatus: newStatus };
            }
            return item;
          });

          const allFinished = updatedItems.every(item => item.stationStatus === 'Selesai');

          return {
            ...tx,
            items: updatedItems,
            status: allFinished ? 'SELESAI' : 'PROSES'
          };
        }
        return tx;
      });
    });
    showToast(`Status pesanan diperbarui menjadi: ${newStatus}`, 'info');
  };

  // CRUD Functions: Branch
  const addBranch = (newBranch) => {
    const branchToAdd = {
      ...newBranch,
      id: `cabang-${Date.now()}`,
      status: 'Aktif'
    };
    setBranches(prev => [...prev, branchToAdd]);
    showToast(`Cabang ${newBranch.name} berhasil ditambahkan`, 'success');
  };

  const updateBranch = (updatedBranch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
    showToast(`Cabang ${updatedBranch.name} diperbarui`, 'info');
  };

  const deleteBranch = (branchId) => {
    setBranches(prev => prev.filter(b => b.id !== branchId));
    showToast(`Cabang berhasil dihapus`, 'warning');
  };

  // CRUD Functions: Category
  const addCategory = (newCat) => {
    const catToAdd = {
      ...newCat,
      id: newCat.name.toLowerCase().replace(/\s+/g, '-'),
      icon: newCat.station === 'Bar' ? 'Coffee' : 'Utensils'
    };
    setCategories(prev => [...prev, catToAdd]);
    showToast(`Kategori ${newCat.name} berhasil ditambahkan`, 'success');
  };

  const deleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    showToast(`Kategori berhasil dihapus`, 'warning');
  };

  // CRUD Functions: Products
  const addProduct = (newProd) => {
    const productToAdd = {
      ...newProd,
      id: `prod-${Date.now()}`,
      sku: newProd.sku || `NUSA-${Math.floor(100 + Math.random() * 900)}`,
      emoji: newProd.emoji || (newProd.station === 'Bar' ? '🥤' : '🍱'),
      status: Number(newProd.stock) > 0 ? 'Tersedia' : 'Habis',
      branchId: newProd.branchId || 'all'
    };
    setProducts(prev => [productToAdd, ...prev]);
    showToast(`Menu ${newProd.name} berhasil ditambahkan!`, 'success');
  };

  const updateProduct = (updatedProd) => {
    const formatted = {
      ...updatedProd,
      status: Number(updatedProd.stock) > 0 ? 'Tersedia' : 'Habis'
    };
    setProducts(prev => prev.map(p => p.id === formatted.id ? formatted : p));
    showToast(`Menu ${updatedProd.name} diperbarui`, 'info');
  };

  const deleteProduct = (productId) => {
    const target = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast(`Menu ${target ? target.name : ''} dihapus`, 'warning');
  };

  // CRUD Functions: Tables
  const addTable = (newTbl) => {
    const tableToAdd = {
      ...newTbl,
      id: `tbl-${Date.now()}`,
      status: 'Kosong',
      qrCode: `QR-${newTbl.number.toUpperCase().replace(/\s+/g, '-')}`
    };
    setTables(prev => [...prev, tableToAdd]);
    showToast(`${newTbl.number} berhasil ditambahkan!`, 'success');
  };

  const updateTable = (updatedTbl) => {
    setTables(prev => prev.map(t => t.id === updatedTbl.id ? updatedTbl : t));
    showToast(`Data ${updatedTbl.number} diperbarui`, 'info');
  };

  const deleteTable = (tableId) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
    showToast(`Meja dihapus`, 'warning');
  };

  // CRUD Functions: Customers
  const addCustomer = (newCust) => {
    const customerToAdd = {
      ...newCust,
      id: `cust-${Date.now()}`,
      ordersCount: 0
    };
    setCustomers(prev => [...prev, customerToAdd]);
    showToast(`Pelanggan ${newCust.name} berhasil ditambahkan`, 'success');
  };

  const updateCustomer = (updatedCust) => {
    setCustomers(prev => prev.map(c => c.id === updatedCust.id ? updatedCust : c));
    showToast(`Data pelanggan ${updatedCust.name} diperbarui`, 'info');
  };

  const deleteCustomer = (custId) => {
    setCustomers(prev => prev.filter(c => c.id !== custId));
    showToast(`Pelanggan dihapus`, 'warning');
  };

  // CRUD Functions: Users
  const addUser = (newUser) => {
    const userToAdd = {
      ...newUser,
      id: `user-${Date.now()}`,
      branchName: branches.find(b => b.id === newUser.branchId)?.name || 'Semua Cabang'
    };
    setUsers(prev => [...prev, userToAdd]);
    showToast(`Staf ${newUser.name} (${newUser.role}) berhasil ditambahkan`, 'success');
  };

  const updateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    showToast(`Staf ${updatedUser.name} diperbarui`, 'info');
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    showToast(`Pengguna dihapus`, 'warning');
  };

  // Refund / Reset Transactions
  const refundTransaction = (transactionId) => {
    const targetTx = transactions.find(t => t.id === transactionId);
    if (!targetTx || targetTx.paymentStatus === 'DIBATALKAN') return;

    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const txItem = targetTx.items.find(i => i.id === prod.id);
        if (txItem) {
          const restoredStock = prod.stock + txItem.qty;
          return { ...prod, stock: restoredStock, status: restoredStock > 0 ? 'Tersedia' : prod.status };
        }
        return prod;
      });
    });

    setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, paymentStatus: 'DIBATALKAN', status: 'BATAL' } : t));
    showToast(`Transaksi ${transactionId} dibatalkan & stok dipulihkan`, 'warning');
  };

  const resetBranchTransactions = (targetBranchId) => {
    if (targetBranchId === 'all') {
      setTransactions([]);
      showToast(`Seluruh data transaksi semua cabang berhasil di-reset`, 'warning');
    } else {
      setTransactions(prev => prev.filter(t => t.branchId !== targetBranchId));
      const targetB = branches.find(b => b.id === targetBranchId);
      showToast(`Data transaksi untuk ${targetB?.name || 'cabang'} di-reset`, 'warning');
    }
  };

  return (
    <PosContext.Provider value={{
      theme, setTheme,
      activeTab, setActiveTab,
      branches, activeBranch, setActiveBranch, addBranch, updateBranch, deleteBranch,
      users, activeUser, setActiveUser, activeRole, setActiveRole, handleRoleChange, addUser, updateUser, deleteUser,
      categories, addCategory, deleteCategory,
      products, setProducts, addProduct, updateProduct, deleteProduct,
      tables, addTable, updateTable, deleteTable,
      customers, addCustomer, updateCustomer, deleteCustomer,
      pendingSelfOrders, submitCustomerOrder, approveCustomerOrder, rejectCustomerOrder,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      orderType, setOrderType,
      selectedTable, setSelectedTable,
      selectedCustomer, setSelectedCustomer,
      cart, addToCart, updateCartQty, updateCartNotes, removeFromCart, clearCart,
      cartDiscount, setCartDiscount,
      cartSubtotal, cartTax, cartTotal,
      heldCarts, holdCurrentCart, restoreCart,
      transactions, processPayment, updateOrderItemStatus, refundTransaction, resetBranchTransactions,
      showPaymentModal, setShowPaymentModal,
      showHoldCartModal, setShowHoldCartModal,
      activeReceipt, setActiveReceipt,
      toasts, showToast
    }}>
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => useContext(PosContext);
