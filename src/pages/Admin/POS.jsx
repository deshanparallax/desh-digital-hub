import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, Printer, MessageCircle, Search } from 'lucide-react';
import { POS_CATEGORIES } from '../../constants/data';

export default function POS({ 
  cart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  setCart, 
  cartTotal, 
  handleCheckout, 
  checkoutLoading, 
  whatsappNumber, 
  setWhatsappNumber, 
  sendWhatsAppBill 
}) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cashGiven, setCashGiven] = useState('');
  const [customerName, setCustomerName] = useState('');

  const activeCategory = POS_CATEGORIES[activeCategoryIndex];

  const filteredItems = searchQuery.trim() !== ''
    ? POS_CATEGORIES.flatMap(cat => 
        cat.items
          .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(item => ({ ...item, CatIcon: cat.icon, catColor: cat.color }))
      )
    : activeCategory.items.map(item => ({ ...item, CatIcon: activeCategory.icon, catColor: activeCategory.color }));

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Area (Search + Items + Categories) */}
      <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden p-6">
        
        {/* Top Bar: Search */}
        <div className="flex mb-6">
          <div className="relative flex-1 w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search items or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800/80 pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded-lg transition-all shadow-sm text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <Minus className="w-4 h-4 rotate-45" />
              </button>
            )}
          </div>
        </div>

        {/* Middle Area: Items Grid */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2" style={{ scrollbarWidth: 'thin' }}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => {
              const CatIcon = item.CatIcon;
              return (
                <button
                  key={`${item.id}-${item.name}`}
                  onClick={() => addToCart(item)}
                  className="bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-emerald-500/50 p-4 flex flex-col items-center justify-center text-center transition-all duration-200 hover:-translate-y-0.5 group rounded-xl"
                >
                  <div className="w-14 h-14 mb-4 flex items-center justify-center bg-slate-900/80 rounded-lg shadow-inner">
                    {CatIcon && <CatIcon className={`w-7 h-7 transition-colors group-hover:text-emerald-400 ${item.catColor}`} />}
                  </div>
                  <span className="font-semibold text-slate-300 mb-1.5 text-xs md:text-sm leading-tight h-10 flex items-center justify-center line-clamp-2">{item.name}</span>
                  <span className="text-emerald-500 font-bold text-sm tracking-wide">
                    {item.price === 0 ? 'Custom' : `Rs ${item.price.toFixed(2)}`}
                  </span>
                </button>
              );
            })}
          </div>
          {filteredItems.length === 0 && (
            <div className="text-center text-slate-500 mt-10">No items found for "{searchQuery}"</div>
          )}
        </div>

        {/* Bottom Area: Category Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-2 snap-x snap-mandatory no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {POS_CATEGORIES.map((cat, idx) => {
            const CatIcon = cat.icon;
            const isActive = activeCategoryIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveCategoryIndex(idx);
                  setSearchQuery('');
                }}
                className={`group snap-center shrink-0 flex flex-col items-center justify-center w-28 h-20 border transition-all duration-200 rounded-xl ${
                  isActive 
                    ? 'border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                    : 'border-slate-800/50 bg-slate-950/50 hover:bg-slate-800/80 text-slate-400'
                }`}
              >
                {CatIcon && <CatIcon className={`w-5 h-5 mb-2 transition-all ${isActive ? 'text-emerald-400 scale-110' : 'opacity-60 group-hover:opacity-100'} ${isActive ? '' : cat.color}`} />}
                <span className={`text-[10px] md:text-[11px] font-semibold tracking-wider uppercase text-center px-1 ${isActive ? 'text-emerald-400' : 'opacity-70 group-hover:opacity-100'}`}>{cat.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-[380px] bg-slate-950 border-l border-slate-800/50 p-6 flex flex-col shrink-0 z-10 shadow-2xl lg:shadow-none">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800/80 pb-4">
          <h2 className="text-lg font-extrabold text-slate-100 uppercase tracking-wide">
            Current Order
          </h2>
          {cart.length > 0 && (
            <button 
              onClick={() => setCart([])}
              className="text-red-400 hover:text-white hover:bg-red-500/80 text-[11px] font-bold uppercase tracking-wider flex items-center transition-all px-3 py-1.5 rounded-md border border-red-900/30 bg-red-500/10"
            >
              <Trash2 className="w-3 h-3 mr-1.5" /> Clear
            </button>
          )}
        </div>

        <div className="flex text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
          <div className="flex-1">Name</div>
          <div className="w-16 text-center">Qty</div>
          <div className="w-20 text-right">Price</div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {cart.length === 0 ? (
            <div className="text-slate-500 text-center mt-10">Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 px-1 border-b border-slate-800/80 group">
                
                <button onClick={() => removeFromCart(item.id)} className="text-slate-600 hover:text-red-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>

                <span className="font-medium text-[13px] text-slate-300 flex-1 truncate mr-2">{item.name}</span>

                <div className="flex items-center space-x-1 w-20 justify-center">
                  <button onClick={() => updateCartItem(item.id, 'qty', Number(item.qty) - 1)} className="text-emerald-400 hover:bg-emerald-900/30 rounded-full p-0.5 transition-colors shrink-0">
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateCartItem(item.id, 'qty', e.target.value)}
                    className="w-8 text-center text-[13px] font-bold text-slate-200 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-emerald-500/50 focus:outline-none transition-colors"
                  />
                  <button onClick={() => updateCartItem(item.id, 'qty', Number(item.qty) + 1)} className="text-emerald-400 hover:bg-emerald-900/30 rounded-full p-0.5 transition-colors shrink-0">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="w-20 text-right">
                  {item.id === 'cu-1' || item.price === 0 ? (
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateCartItem(item.id, 'price', Number(e.target.value))}
                      className="w-16 bg-slate-900 text-emerald-400 font-bold px-1.5 py-1 rounded-md border border-slate-800 text-right text-[13px] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                    />
                  ) : (
                    <span className="text-slate-200 font-bold text-[13px]">Rs {(item.price * item.qty).toFixed(2)}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-4">
          <div className="flex justify-between items-center text-lg px-1">
            <span className="text-slate-300 font-semibold text-sm uppercase tracking-wider">Total Amount</span>
            <span className="text-2xl font-black text-emerald-400">Rs {cartTotal.toFixed(2)}</span>
          </div>


          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={cart.length === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-4 disabled:opacity-50 transition-all rounded-xl flex items-center justify-center text-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            Pay (Rs {cartTotal.toFixed(2)})
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4">
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900">
              <h3 className="text-lg font-extrabold text-slate-100 uppercase tracking-wide">Checkout</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Amount</span>
                <span className="text-3xl font-black text-emerald-400">Rs {cartTotal.toFixed(2)}</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer Name <span className="text-slate-600 normal-case font-medium">(Optional)</span></label>
                  <input
                    type="text"
                    placeholder="Enter customer name..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cash Given</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rs</span>
                    <input
                      type="number"
                      autoFocus
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-emerald-400 text-2xl font-bold rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-800/30 p-4 rounded-xl border border-slate-800/50">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Balance</span>
                <span className={`text-3xl font-black ${cashGiven && Number(cashGiven) >= cartTotal ? 'text-emerald-400' : 'text-red-400'}`}>
                  Rs {Math.max(0, Number(cashGiven) - cartTotal).toFixed(2)}
                </span>
              </div>

              {/* WhatsApp and Print */}
              <div className="pt-2 space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Options</label>
                <div className="flex gap-2 h-12">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-auto px-5 bg-slate-800 text-slate-300 hover:text-white font-bold border border-slate-700 hover:bg-slate-700 transition-all rounded-lg flex items-center justify-center shadow-sm"
                    title="Print Bill"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <div className="relative flex-1 h-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">+94</span>
                    <input
                      type="text"
                      placeholder="77 123 4567"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full h-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-14 pr-12 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                  <button
                    onClick={sendWhatsAppBill}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 h-full rounded-lg transition-all flex items-center justify-center shrink-0"
                    title="Send to WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>



              <div className="flex gap-3 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setCashGiven('');
                    setCustomerName('');
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-4 transition-all rounded-xl shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const success = await handleCheckout(customerName);
                    if (success) {
                      setShowPaymentModal(false);
                      setCashGiven('');
                      setCustomerName('');
                      setWhatsappNumber('');
                    }
                  }}
                  disabled={checkoutLoading || (cashGiven && Number(cashGiven) < cartTotal)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-4 disabled:opacity-50 transition-all rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center"
                >
                  {checkoutLoading ? 'Processing...' : 'Complete Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
