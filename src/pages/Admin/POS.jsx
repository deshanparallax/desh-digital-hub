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
  message, 
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
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search Items here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 pl-4 pr-12 py-3 text-white focus:outline-none focus:border-emerald-500 rounded-sm transition-colors shadow-sm text-sm"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-emerald-600 hover:bg-emerald-500 text-white px-4 flex items-center justify-center rounded-r-sm transition-colors">
              <Search className="w-4 h-4" />
            </button>
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
                  className="bg-slate-800 border border-slate-700 hover:border-emerald-500 p-4 flex flex-col items-center justify-center text-center transition-all hover:shadow-[0_4px_15px_rgba(16,185,129,0.15)] group rounded-sm"
                >
                  <div className="w-16 h-16 mb-4 flex items-center justify-center bg-slate-900 rounded-sm">
                    {CatIcon && <CatIcon className={`w-8 h-8 transition-transform group-hover:scale-110 ${item.catColor}`} />}
                  </div>
                  <span className="font-bold text-slate-200 mb-2 text-xs md:text-sm leading-tight h-10 flex items-center justify-center line-clamp-2">{item.name}</span>
                  <span className="text-emerald-400 font-bold text-sm">
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
                className={`group snap-center shrink-0 flex flex-col items-center justify-center w-28 h-20 border transition-all rounded-sm ${
                  isActive 
                    ? 'border-slate-500 bg-slate-800 shadow-md border-b-4' 
                    : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {CatIcon && <CatIcon className={`w-6 h-6 mb-1.5 transition-all ${isActive ? 'scale-110 drop-shadow-[0_0_5px_currentColor]' : 'opacity-50 group-hover:opacity-80'} ${cat.color}`} />}
                <span className={`text-[10px] md:text-[11px] font-bold uppercase text-center px-1 ${isActive ? 'text-slate-200' : 'opacity-70'}`}>{cat.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-[380px] bg-slate-800 border-l border-slate-700 p-6 flex flex-col shrink-0">
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            Checkout
          </h2>
          {cart.length > 0 && (
            <button 
              onClick={() => setCart([])}
              className="text-red-400 hover:text-white hover:bg-red-500 text-xs font-semibold flex items-center transition-colors px-3 py-1.5 rounded-sm border border-red-900/50"
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
              <div key={item.id} className="flex items-center justify-between p-2 hover:bg-slate-700/50 rounded-sm border-b border-slate-700/50 group">
                
                <button onClick={() => removeFromCart(item.id)} className="text-slate-600 hover:text-red-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>

                <span className="font-semibold text-sm text-slate-300 flex-1 truncate mr-2">{item.name}</span>

                <div className="flex items-center space-x-1 w-20 justify-center">
                  <button onClick={() => updateCartItem(item.id, 'qty', Number(item.qty) - 1)} className="text-emerald-400 hover:bg-emerald-900/30 rounded-full p-0.5 transition-colors shrink-0">
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateCartItem(item.id, 'qty', e.target.value)}
                    className="w-8 text-center text-sm font-bold text-slate-300 bg-transparent border-b border-transparent hover:border-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
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
                      className="w-16 bg-slate-900 text-emerald-400 font-bold px-1 py-0.5 rounded-sm border border-slate-600 text-right text-sm focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <span className="text-slate-300 font-bold text-sm">Rs {(item.price * item.qty).toFixed(2)}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-slate-700 mt-4 space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="text-white font-bold">Total Amount</span>
            <span className="text-2xl font-extrabold text-emerald-400">Rs {cartTotal.toFixed(2)}</span>
          </div>


          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={cart.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 disabled:opacity-50 transition-colors rounded-sm flex items-center justify-center text-lg shadow-lg"
          >
            Pay (Rs {cartTotal.toFixed(2)})
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-sm w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50">
              <h3 className="text-xl font-bold text-white">Payment</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-400">Total Amount</span>
                <span className="text-2xl font-extrabold text-white">Rs {cartTotal.toFixed(2)}</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Customer Name <span className="text-slate-600 normal-case">(Optional)</span></label>
                  <input
                    type="text"
                    placeholder="Enter customer name..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Cash Given</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rs</span>
                    <input
                      type="number"
                      autoFocus
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-emerald-400 text-2xl font-bold rounded-sm pl-12 pr-4 py-4 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg pt-4 border-t border-slate-700">
                <span className="text-slate-400">Balance</span>
                <span className={`text-2xl font-extrabold ${cashGiven && Number(cashGiven) >= cartTotal ? 'text-emerald-400' : 'text-red-400'}`}>
                  Rs {Math.max(0, Number(cashGiven) - cartTotal).toFixed(2)}
                </span>
              </div>

              {/* WhatsApp and Print */}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Options</label>
                <div className="flex gap-2 h-11">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-auto px-4 bg-slate-900 text-slate-300 font-bold border border-slate-700 hover:bg-slate-700 transition-colors rounded-sm flex items-center justify-center"
                    title="Print Bill"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <div className="relative flex-1 h-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+94</span>
                    <input
                      type="text"
                      placeholder="71xxxxxxx"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full h-full bg-slate-900 border border-slate-700 rounded-sm pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                  <button
                    onClick={sendWhatsAppBill}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 h-full rounded-sm transition-all flex items-center justify-center shrink-0"
                    title="Send to WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setCashGiven('');
                  setCustomerName('');
                }}
                className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors rounded-sm font-bold text-sm border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleCheckout(customerName);
                  setShowPaymentModal(false);
                  setCashGiven('');
                  setCustomerName('');
                }}
                disabled={checkoutLoading || (cashGiven !== '' && Number(cashGiven) < cartTotal)}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors rounded-sm font-bold text-lg shadow-lg"
              >
                {checkoutLoading ? 'Processing...' : 'Paid'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
