import React from 'react';
import { ShoppingCart, Minus, Plus, Trash2, Printer, MessageCircle } from 'lucide-react';
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
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* POS Grid */}
      <div className="flex-1 bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-3xl overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
          <h2 className="text-2xl font-bold text-white">Services</h2>
        </div>
        <div className="space-y-8">
          {POS_CATEGORIES.map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <div key={idx} className="bg-slate-900/30 p-5 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-bold text-cyan-400 mb-4 tracking-wide uppercase text-sm border-b border-slate-700/50 pb-2 flex items-center">
                  {CatIcon && <CatIcon className={`w-5 h-5 mr-2 ${cat.color}`} />}
                  {cat.category}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="bg-slate-900/80 border border-slate-700 hover:border-cyan-500 p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:bg-slate-800 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(8,145,178,0.15)] group"
                    >
                      {CatIcon && <CatIcon className={`w-6 h-6 mb-2 transition-transform group-hover:scale-110 ${cat.color} drop-shadow-[0_0_8px_currentColor]`} />}
                      <span className="font-semibold text-slate-200 mb-1 text-[10px] md:text-xs leading-tight px-1">{item.name}</span>
                      <span className="text-cyan-400 font-bold text-[10px] md:text-xs mt-1 bg-cyan-950/30 px-2 py-0.5 rounded-full border border-cyan-800/50">
                        {item.price === 0 ? 'Custom Price' : `Rs ${item.price.toFixed(2)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-96 bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ShoppingCart className="mr-2 text-cyan-400" /> Current Order
          </h2>
          {cart.length > 0 && (
            <button 
              onClick={() => setCart([])}
              className="text-red-400 hover:text-white hover:bg-red-500 text-xs font-semibold flex items-center transition-colors bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 shadow-sm"
            >
              <Trash2 className="w-3 h-3 mr-1.5" /> Clear Cart
            </button>
          )}
        </div>

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

                  {item.id === 'cu-1' || item.price === 0 ? (
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
          <div className="flex gap-3">
            <button
              onClick={() => {
                window.print();
                handleCheckout();
              }}
              disabled={cart.length === 0 || checkoutLoading}
              className="w-1/2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:shadow-none transition-all border border-slate-600 flex items-center justify-center"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Bill
            </button>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkoutLoading}
              className="w-1/2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center"
            >
              {checkoutLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-700 mt-2 space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-sm font-medium">Send Bill via WhatsApp</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+94</span>
                  <input
                    type="text"
                    placeholder="71xxxxxxx"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                  />
                </div>
                <button
                  onClick={sendWhatsAppBill}
                  disabled={cart.length === 0}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 rounded-xl shadow-[0_0_15px_rgba(22,163,74,0.3)] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center shrink-0"
                  title="Send to WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
