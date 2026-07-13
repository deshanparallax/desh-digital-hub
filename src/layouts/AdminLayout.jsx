import React from 'react';
import { LayoutDashboard, ShoppingCart, History, LogOut, Menu } from 'lucide-react';

export default function AdminLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  handleLogout,
  user,
  todaySalesSum
}) {
  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-200 selection:bg-cyan-600 selection:text-white print:hidden">

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-16' : 'hidden'} bg-slate-800 flex flex-col justify-between shrink-0 transition-all duration-300 z-30`}>
        <div>
          <nav className="p-2 space-y-4 mt-4">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`group relative w-full flex items-center justify-center p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-cyan-900/40 text-cyan-400 shadow-sm' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <div className="absolute left-14 hidden group-hover:block bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg border border-slate-600">
                  Dashboard
                </div>
              </button>
            )}

            <button
              onClick={() => setActiveTab('pos')}
              className={`group relative w-full flex items-center justify-center p-3 rounded-xl transition-all ${activeTab === 'pos' ? 'bg-cyan-900/40 text-cyan-400 shadow-sm' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              <div className="absolute left-14 hidden group-hover:block bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg border border-slate-600">
                Point of Sale
              </div>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('history')}
                className={`group relative w-full flex items-center justify-center p-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-cyan-900/40 text-cyan-400 shadow-sm' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
              >
                <History className="w-5 h-5" />
                <div className="absolute left-14 hidden group-hover:block bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg border border-slate-600">
                  Sales History
                </div>
              </button>
            )}
          </nav>
        </div>
        <div className="p-2 mb-4 border-t border-slate-700 pt-4">
          <button
            onClick={handleLogout}
            className="group relative w-full flex items-center justify-center p-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-5 h-5" />
            <div className="absolute left-14 hidden group-hover:block bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg border border-slate-600">
              Logout
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900 relative flex flex-col">
        {/* Top Header */}
        <div className="h-16 flex items-center justify-end px-6 bg-slate-800/90 backdrop-blur sticky top-0 z-20 shadow-sm gap-4">
          
          <h1 className="text-white font-bold text-lg hidden sm:block absolute left-1/2 transform -translate-x-1/2">
            DESH Digital Hub - Admin Portal
          </h1>

          {todaySalesSum !== undefined && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
              <span className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">Today's Sales</span>
              <span className="text-sm font-bold text-emerald-400">Rs {todaySalesSum.toFixed(2)}</span>
            </div>
          )}

          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-sm font-medium text-slate-300">
                {user.email}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 top-16 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #0891b2 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="w-full relative z-10 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
