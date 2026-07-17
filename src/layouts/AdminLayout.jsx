import { LayoutDashboard, ShoppingCart, History, LogOut, Menu, Wrench } from 'lucide-react';

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
    <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-200 selection:bg-emerald-500/30 selection:text-white print:hidden">

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-16' : 'hidden'} bg-slate-950 border-r border-slate-800/50 flex flex-col justify-between shrink-0 transition-all duration-300 z-30`}>
        <div>
          <nav className="p-2 space-y-3 mt-4">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`group relative w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <div className="absolute left-14 hidden group-hover:block bg-slate-900 backdrop-blur-md text-slate-200 text-xs font-medium px-3 py-1.5 rounded border border-slate-700 whitespace-nowrap z-50 shadow-2xl">
                  Dashboard
                </div>
              </button>
            )}

              <button
                onClick={() => setActiveTab('pos')}
                className={`group relative w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${activeTab === 'pos' ? 'bg-emerald-500/10 text-emerald-400 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                <div className="absolute left-14 hidden group-hover:block bg-slate-900 backdrop-blur-md text-slate-200 text-xs font-medium px-3 py-1.5 rounded border border-slate-700 whitespace-nowrap z-50 shadow-2xl">
                Point of Sale
              </div>
            </button>

            <button
              onClick={() => setActiveTab('repairs')}
              className={`group relative w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${activeTab === 'repairs' ? 'bg-emerald-500/10 text-emerald-400 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <Wrench className="w-5 h-5" />
              <div className="absolute left-14 hidden group-hover:block bg-slate-900 backdrop-blur-md text-slate-200 text-xs font-medium px-3 py-1.5 rounded border border-slate-700 whitespace-nowrap z-50 shadow-2xl">
                PC Repairs
              </div>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('history')}
                className={`group relative w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${activeTab === 'history' ? 'bg-emerald-500/10 text-emerald-400 shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
              >
                <History className="w-5 h-5" />
                <div className="absolute left-14 hidden group-hover:block bg-slate-800/95 backdrop-blur-sm text-slate-200 text-xs font-semibold px-3 py-2 rounded-md whitespace-nowrap z-50 shadow-xl border border-slate-700/50">
                  Sales History
                </div>
              </button>
            )}
          </nav>
        </div>
        <div className="p-2 mb-4 border-t border-slate-800/50 pt-4">
          <button
            onClick={handleLogout}
            className="group relative w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <div className="absolute left-14 hidden group-hover:block bg-slate-800/95 backdrop-blur-sm text-slate-200 text-xs font-semibold px-3 py-2 rounded-md whitespace-nowrap z-50 shadow-xl border border-slate-700/50">
              Logout
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900 relative flex flex-col">
        {/* Top Header */}
        <div className="h-16 flex items-center justify-end px-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800/50 gap-4">
          
          <h1 className="text-slate-100 font-extrabold tracking-tight text-lg hidden sm:block absolute left-1/2 transform -translate-x-1/2">
            DESH Digital Hub <span className="text-emerald-500 font-normal ml-1">Admin</span>
          </h1>

          {todaySalesSum !== undefined && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-md">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Today's Sales</span>
              <span className="text-sm font-bold text-emerald-400">Rs {todaySalesSum.toFixed(2)}</span>
            </div>
          )}

          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-md border border-slate-700/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-sm font-medium text-slate-300">
                {user.email}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 top-16 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #64748b 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>

        <div className="w-full relative z-10 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
