import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { LayoutDashboard, ShoppingCart, History, LogOut, Plus, Minus, Trash2, MonitorPlay } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const POS_ITEMS = [
  { id: 1, name: 'Printout [B/W]', price: 10, category: 'Print' },
  { id: 2, name: 'Printout [Color]', price: 20, category: 'Print' },
  { id: 3, name: 'Photocopy', price: 10, category: 'Print' },
  { id: 4, name: 'Scan', price: 20, category: 'Document' },
  { id: 5, name: 'Laminating [A4]', price: 150, category: 'Document' },
  { id: 6, name: 'Book Binding', price: 200, category: 'Document' },
  { id: 7, name: 'PC / Laptop Repair', price: 500, category: 'Tech' },
  { id: 8, name: 'Computer Format', price: 1500, category: 'Tech' },
  { id: 9, name: 'CV Design', price: 350, category: 'Design' },
  { id: 10, name: 'Bill Payment', price: 50, category: 'Utility' },
  { id: 11, name: 'Fuel QR', price: 100, category: 'Utility' },
  { id: 12, name: 'Custom Item', price: 0, category: 'Custom' } // Price can be edited in cart
];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, pos, history
  const [salesHistory, setSalesHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  
  // POS State
  const [cart, setCart] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  // App State
  const [message, setMessage] = useState('');

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchSales();
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
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
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
        const newVal = field === 'qty' ? Math.max(1, value) : Math.max(0, value);
        return { ...item, [field]: newVal };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    
    // Create description from cart items
    const description = cart.map(item => `${item.qty}x ${item.name}`).join(', ');
    
    try {
      await addDoc(collection(db, 'daily_sales'), {
        amount: cartTotal,
        description: description,
        cartItems: cart, // Optional: save detailed items
        timestamp: serverTimestamp(),
        userId: user.uid
      });
      
      setCart([]);
      setMessage('Checkout successful!');
      setTimeout(() => setMessage(''), 3000);
      fetchSales(); // Refresh dashboard data
    } catch (error) {
      setMessage('Checkout failed: ' + error.message);
    }
    setCheckoutLoading(false);
  };

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-cyan-600 selection:text-white">
        <div className="bg-slate-800 p-8 rounded-3xl shadow-[0_0_50px_rgba(8,145,178,0.2)] border border-cyan-500/20 w-full max-w-md backdrop-blur-xl">
          <div className="flex justify-center mb-6">
            <MonitorPlay className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 mb-6 text-center tracking-tight">
            Admin Portal
          </h2>
          {message && <p className="text-red-400 text-sm mb-4 text-center font-medium bg-red-900/30 py-2 rounded-lg">{message}</p>}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm mb-2 font-medium">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2 font-medium">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                required
              />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all transform hover:-translate-y-0.5 mt-4">
              Secure Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD LAYOUT ---
  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-200 selection:bg-cyan-600 selection:text-white">
      
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-slate-800/80 border-r border-slate-700/50 flex flex-col justify-between backdrop-blur-xl">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-700/50">
            <MonitorPlay className="w-8 h-8 text-cyan-400 md:mr-3" />
            <span className="hidden md:block font-bold text-lg text-white">Digital Hub</span>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(8,145,178,0.1)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard className="w-6 h-6 md:mr-3 mx-auto md:mx-0" />
              <span className="hidden md:block font-medium">Dashboard</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('pos')}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'pos' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(8,145,178,0.1)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <ShoppingCart className="w-6 h-6 md:mr-3 mx-auto md:mx-0" />
              <span className="hidden md:block font-medium">Point of Sale</span>
            </button>

            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(8,145,178,0.1)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <History className="w-6 h-6 md:mr-3 mx-auto md:mx-0" />
              <span className="hidden md:block font-medium">Sales History</span>
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-700/50">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors">
            <LogOut className="w-6 h-6 md:mr-3 mx-auto md:mx-0" />
            <span className="hidden md:block font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900 relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #0891b2 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto relative z-10 min-h-full">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-white mb-8">Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-lg">
                  <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Sales Today</h3>
                  <p className="text-4xl font-extrabold text-cyan-400">
                    Rs. {salesHistory
                      .filter(s => s.timestamp && new Date(s.timestamp.toDate()).toDateString() === new Date().toDateString())
                      .reduce((sum, s) => sum + Number(s.amount), 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-lg">
                  <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Orders Today</h3>
                  <p className="text-4xl font-extrabold text-white">
                    {salesHistory.filter(s => s.timestamp && new Date(s.timestamp.toDate()).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-lg h-96">
                <h3 className="text-slate-300 font-bold mb-6">Revenue Trend (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(-7)}>
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      itemStyle={{ color: '#22d3ee' }}
                    />
                    <Bar dataKey="revenue" fill="#0891b2" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB: POS */}
          {activeTab === 'pos' && (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* POS Grid */}
              <div className="flex-1 bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-3xl overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {POS_ITEMS.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="bg-slate-900/80 border border-slate-700 hover:border-cyan-500 p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:bg-slate-800 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(8,145,178,0.2)]"
                    >
                      <span className="font-semibold text-slate-200 mb-2">{item.name}</span>
                      <span className="text-cyan-400 font-bold text-sm">
                        {item.price === 0 ? 'Custom Price' : `Rs ${item.price.toFixed(2)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Panel */}
              <div className="w-full lg:w-96 bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <ShoppingCart className="mr-2 text-cyan-400" /> Current Order
                </h2>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {cart.length === 0 ? (
                    <div className="text-slate-500 text-center mt-10">Cart is empty</div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-slate-200">{item.name}</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-1">
                            <button onClick={() => updateCartItem(item.id, 'qty', item.qty - 1)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                            <button onClick={() => updateCartItem(item.id, 'qty', item.qty + 1)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {item.id === 12 ? (
                            <input 
                              type="number" 
                              value={item.price}
                              onChange={(e) => updateCartItem(item.id, 'price', Number(e.target.value))}
                              className="w-20 bg-slate-800 text-cyan-400 font-bold px-2 py-1 rounded border border-slate-700 text-right text-sm"
                            />
                          ) : (
                            <span className="text-cyan-400 font-bold text-sm">Rs {(item.price * item.qty).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-slate-700 mt-4 space-y-4">
                  {message && <div className="text-green-400 text-sm text-center font-medium bg-green-900/20 py-2 rounded">{message}</div>}
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-300 font-medium">Total</span>
                    <span className="text-2xl font-extrabold text-white">Rs {cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || checkoutLoading}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)] disabled:opacity-50 disabled:shadow-none transition-all"
                  >
                    {checkoutLoading ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: HISTORY */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Sales History</h2>
                <button onClick={fetchSales} className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700">
                  Refresh Data
                </button>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
                        <th className="p-4 font-semibold">Date & Time</th>
                        <th className="p-4 font-semibold">Description</th>
                        <th className="p-4 font-semibold text-right">Amount (Rs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {salesHistory.length === 0 ? (
                        <tr><td colSpan="3" className="p-8 text-center text-slate-500">No records found.</td></tr>
                      ) : (
                        salesHistory.map((sale) => (
                          <tr key={sale.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 text-slate-300 text-sm whitespace-nowrap">
                              {sale.timestamp ? format(sale.timestamp.toDate(), 'PPpp') : 'Pending...'}
                            </td>
                            <td className="p-4 text-slate-200">
                              {sale.description}
                            </td>
                            <td className="p-4 text-cyan-400 font-bold text-right whitespace-nowrap">
                              {Number(sale.amount).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
