import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { format } from 'date-fns';
import logo from '../../assets/logo.webp';

// Components
import AdminLayout from '../../layouts/AdminLayout';
import Login from './Login';
import Dashboard from './Dashboard';
import POS from './POS';
import History from './History';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [salesHistory, setSalesHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // POS State
  const [cart, setCart] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // App State
  const [message, setMessage] = useState('');

  const isAdmin = user?.email === 'admin@desh.lk';

  // 1. Title, Auth Listener, and PWA Registration
  useEffect(() => {
    document.title = "Admin - DESH Digital Hub";

    // Register Service Worker for PWA only in Admin portal
    if ('serviceWorker' in navigator) {
      import('virtual:pwa-register').then(({ registerSW }) => {
        registerSW({ immediate: true });
      }).catch((err) => console.log('PWA registration error', err));
    }

    return () => {
      document.title = "DESH Digital Hub";
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchSales();
        if (currentUser.email === 'admin@desh.lk') {
          setActiveTab('dashboard');
        } else {
          setActiveTab('pos');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Sales Data
  const fetchSales = async () => {
    try {
      const q = query(collection(db, 'daily_sales'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const sales = [];
      const aggregatedData = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sales.push({ id: doc.id, ...data });

        // Prepare chart data (Group by date)
        if (data.timestamp) {
          const dateStr = format(data.timestamp.toDate(), 'MMM dd');
          if (!aggregatedData[dateStr]) aggregatedData[dateStr] = 0;
          aggregatedData[dateStr] += Number(data.amount);
        }
      });

      setSalesHistory(sales);

      // Format chart data for recharts
      const formattedChartData = Object.keys(aggregatedData).map(date => ({
        date,
        revenue: aggregatedData[date]
      })).reverse(); // Oldest to newest for the chart

      setChartData(formattedChartData);
    } catch (error) {
      console.error("Error fetching sales: ", error);
    }
  };

  // 3. Auth Methods
  const handleLogin = async (e, rememberMe) => {
    e.preventDefault();
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // 4. POS Cart Methods
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateCartItem = (id, field, value) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        let newVal;
        if (field === 'qty') {
          newVal = value === '' ? '' : Math.max(1, Number(value));
        } else {
          newVal = value === '' ? '' : Math.max(0, Number(value));
        }
        return { ...item, [field]: newVal };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async (posCustomerName = '') => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);

    const description = cart.map(item => `${item.qty}x ${item.name}`).join(', ');

    let finalCustomerName = posCustomerName.trim();
    if (!finalCustomerName) {
      const todaySalesCount = salesHistory.filter(s => s.timestamp && new Date(s.timestamp.toDate()).toDateString() === new Date().toDateString()).length;
      finalCustomerName = `Customer ${todaySalesCount + 1}`;
    }

    try {
      const cleanCartItems = cart.map(item => {
        const { CatIcon, catColor, ...cleanItem } = item;
        return cleanItem;
      });

      await addDoc(collection(db, 'daily_sales'), {
        amount: cartTotal,
        description: description,
        cartItems: cleanCartItems,
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        customerName: finalCustomerName
      });
      setCart([]);
      setMessage('Checkout successful!');
      setTimeout(() => setMessage(''), 3000);
      fetchSales(); 
      return true;
    } catch (error) {
      console.error("Error adding sale: ", error);
      alert("Checkout failed. Please try again.");
      return false;
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleDeleteSale = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDoc(doc(db, 'daily_sales', id));
        fetchSales(); // Refresh the list
      } catch (error) {
        console.error("Error deleting sale: ", error);
        alert("Failed to delete record.");
      }
    }
  };

  const sendWhatsAppBill = () => {
    if (!whatsappNumber) {
      setMessage('Please enter a WhatsApp number.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    let text = '*DESH Digital Hub*\n';
    text += 'Thank you for your business!\n\n';
    text += '*Your Order:*\n';

    cart.forEach(item => {
      text += `- ${item.name} x${item.qty} (Rs. ${(item.price * item.qty).toFixed(2)})\n`;
    });

    text += `\n*Total Amount:* Rs. ${cartTotal.toFixed(2)}\n\n`;
    text += 'For inquiries, call +94(71) 998 9000.';

    const encodedMessage = encodeURIComponent(text);

    let formattedNumber = whatsappNumber.trim();
    if (formattedNumber.startsWith('0')) {
      formattedNumber = formattedNumber.substring(1);
    }

    window.open(`https://wa.me/94${formattedNumber}?text=${encodedMessage}`, '_blank');
  };

  if (!user) {
    return (
      <Login 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        message={message}
      />
    );
  }

  return (
    <>
      {/* Printable Receipt */}
      <div className="hidden print:block text-black bg-white p-4 font-mono w-[80mm] mx-auto text-sm">
        <div className="text-center mb-4">
          <img src={logo} alt="DESH Digital Hub" className="h-16 mx-auto mb-2 grayscale" />
          <h2 className="font-bold text-xl">DESH Digital Hub</h2>
          <p className="text-xs">No 123, Main Street, City</p>
          <p className="text-xs">Tel: 077 123 4567</p>
        </div>

        <div className="border-t border-b border-black border-dashed py-2 mb-2">
          <p>Date: {new Date().toLocaleString()}</p>
          <p>Cashier: {user.email}</p>
        </div>

        <table className="w-full text-left mb-2 text-xs">
          <thead>
            <tr className="border-b border-black">
              <th className="pb-1">Item</th>
              <th className="pb-1 text-center">Qty</th>
              <th className="pb-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td className="py-1 pr-1">{item.name}</td>
                <td className="py-1 text-center">{item.qty}</td>
                <td className="py-1 text-right">{(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-black border-dashed pt-2 flex justify-between font-bold text-base">
          <span>TOTAL</span>
          <span>Rs {cartTotal.toFixed(2)}</span>
        </div>

        <div className="text-center mt-6 text-xs">
          <p>Thank you for your business!</p>
          <p>System by Antigravity</p>
        </div>
      </div>

      {/* Main Admin UI */}
      <AdminLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        user={user}
        todaySalesSum={salesHistory
          .filter(s => s.timestamp && new Date(s.timestamp.toDate()).toDateString() === new Date().toDateString())
          .reduce((sum, s) => sum + Number(s.amount), 0)}
      >
        {activeTab === 'dashboard' && <Dashboard salesHistory={salesHistory} chartData={chartData} />}
        {activeTab === 'pos' && (
          <POS 
            cart={cart}
            addToCart={addToCart}
            updateCartItem={updateCartItem}
            removeFromCart={removeFromCart}
            setCart={setCart}
            cartTotal={cartTotal}
            handleCheckout={handleCheckout}
            checkoutLoading={checkoutLoading}
            message={message}
            whatsappNumber={whatsappNumber}
            setWhatsappNumber={setWhatsappNumber}
            sendWhatsAppBill={sendWhatsAppBill}
          />
        )}
        {activeTab === 'history' && <History salesHistory={salesHistory} fetchSales={fetchSales} handleDeleteSale={handleDeleteSale} />}
      </AdminLayout>
    </>
  );
}
