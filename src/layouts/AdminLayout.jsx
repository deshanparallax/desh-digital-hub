import React from 'react';
import { LayoutDashboard, ShoppingCart, History, LogOut, Menu } from 'lucide-react';
import logo from '../assets/logo.webp';

export default function AdminLayout({ 
  children, 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  handleLogout 
}) {
  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-200 selection:bg-cyan-600 selection:text-white print:hidden">

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-20 md:w-64' : 'hidden'} bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300`}>
        <div>
          <div className="h-24 flex items-center justify-center border-b border-slate-100 py-2">
            <img src={logo} alt="DESH Digital Hub" className="h-16 object-contain scale-125" />
          </div>

          <nav className="p-4 space-y-2 mt-4">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <LayoutDashboard className="w-6 h-6 md:mr-3 mx-auto md:mx-0" />
                <span className="hidden md:block font-medium">Dashboard</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('pos')}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'pos' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <ShoppingCart className="w-6 h-6 md:mr-3 mx-auto md:mx-0" />
              <span className="hidden md:block font-medium">Point of Sale</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <History className="w-6 h-6 md:mr-3 mx-auto md:mx-0" />
                <span className="hidden md:block font-medium">Sales History</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900 relative flex flex-col">
        {/* Top Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-20">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>

        <div className="absolute inset-0 top-16 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #0891b2 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
