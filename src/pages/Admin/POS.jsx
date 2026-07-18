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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        <div className="z-10 relative flex flex-col h-full p-6">
        
        {/* Top Bar: Search */}
        <div className={`flex mb-6 relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] h-10 ${isSearchExpanded ? 'w-full max-w-2xl' : 'w-10'}`}>
          {!isSearchExpanded ? (
            <button 
              onClick={() => setIsSearchExpanded(true)}
              className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-400 z-20 rounded-full bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          ) : (
            <div className="relative w-full flex items-center animate-in fade-in zoom-in-95 duration-300">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-[18px] h-[18px] text-emerald-500/70 z-10" />
              <Input
                type="text"
                placeholder="Search items or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-11 pr-10 py-5 bg-slate-900/50 backdrop-blur-md border-slate-700/50 focus-visible:ring-emerald-500/40 rounded-xl text-sm shadow-inner w-full text-slate-200 placeholder:text-slate-500 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-12 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 z-10 p-1 bg-slate-800/80 rounded-full hover:bg-slate-700 transition-colors">
                  <Minus className="w-3 h-3 rotate-45" />
                </button>
              )}
              <button 
                onClick={() => {
                  setIsSearchExpanded(false);
                  setSearchQuery('');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                title="Close Search"
              >
                <Minus className="w-[18px] h-[18px] rotate-45" />
              </button>
            </div>
          )}
        </div>

        {/* Middle Area: Items Grid */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 relative" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Background Category Icon */}
          {activeCategory && activeCategory.icon && (
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
              {React.createElement(activeCategory.icon, { className: "w-[30rem] h-[30rem]" })}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-10">
            {filteredItems.map((item) => {
              const CatIcon = item.CatIcon;
              return (
                <button
                  key={`${item.id}-${item.name}`}
                  onClick={() => addToCart(item)}
                  className="relative group bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-sm border border-slate-800/80 hover:border-emerald-500/40 flex flex-col text-left transition-all duration-300 active:scale-[0.98] rounded-xl h-28 w-full shadow-sm hover:shadow-md overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex-1 p-3.5 flex items-start z-10">
                    <span className="font-semibold text-slate-200 group-hover:text-emerald-50 text-[13px] leading-tight line-clamp-2">{item.name}</span>
                  </div>
                  <div className="bg-slate-950/60 group-hover:bg-emerald-950/40 w-full px-3.5 py-2 border-t border-slate-800/50 group-hover:border-emerald-900/50 mt-auto z-10 transition-colors duration-300">
                    <span className="text-emerald-400 group-hover:text-emerald-300 font-bold text-[14px] tracking-wide">
                      {item.price === 0 ? 'Custom' : `Rs ${item.price.toFixed(2)}`}
                    </span>
                  </div>
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
                className={`relative group shrink-0 flex flex-col justify-center items-center w-28 h-20 border transition-all duration-300 rounded-2xl p-2 active:scale-[0.96] overflow-hidden ${
                  isActive 
                    ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/70 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
                <div className="z-10 w-full h-full relative overflow-hidden">
                  {/* Icon */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? 'opacity-0 -translate-y-8 scale-50' : 'opacity-100 translate-y-0 scale-100 group-hover:opacity-0 group-hover:-translate-y-8 group-hover:scale-50'}`}>
                    {CatIcon && <CatIcon className={`w-8 h-8 opacity-80 drop-shadow-md ${cat.color}`} />}
                  </div>
                  
                  {/* Text */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'}`}>
                    <span className={`text-[11px] md:text-[12px] font-extrabold tracking-widest uppercase text-center px-2 leading-tight ${isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-slate-100 drop-shadow-md'}`}>
                      {cat.category}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-[380px] bg-slate-950/60 backdrop-blur-2xl border-l border-white/5 p-6 flex flex-col shrink-0 z-20 shadow-2xl lg:shadow-none relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950/50 pointer-events-none -z-10"></div>
        <div className="flex justify-between items-center mb-6 border-b border-slate-800/80 pb-4">
          <h2 className="text-lg font-extrabold text-slate-100 uppercase tracking-wide">
            Current Order
          </h2>
          {cart.length > 0 && (
            <button 
              onClick={() => setCart([])}
              className="h-8 flex items-center justify-center rounded-lg text-[11px] uppercase tracking-wider font-bold px-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-900/30 transition-colors"
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
