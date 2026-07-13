import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export default function History({ salesHistory, fetchSales, handleDeleteSale }) {
  // Group sales by date
  const groupedSalesArray = [];
  salesHistory.forEach(sale => {
    const dateStr = sale.timestamp 
      ? new Date(sale.timestamp.toDate()).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : 'Pending';
    let group = groupedSalesArray.find(g => g.date === dateStr);
    if (!group) {
      group = { date: dateStr, sales: [], total: 0 };
      groupedSalesArray.push(group);
    }
    group.sales.push(sale);
    group.total += Number(sale.amount);
  });

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const [expandedDates, setExpandedDates] = useState([todayStr]);

  const toggleDate = (date) => {
    setExpandedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  return (
    <div className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Sales History</h2>
        <button onClick={fetchSales} className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-4 py-2 rounded-sm text-sm font-semibold transition-colors border border-slate-700">
          Refresh Data
        </button>
      </div>

      {groupedSalesArray.length === 0 ? (
        <div className="bg-slate-950 rounded-xl border border-slate-800/80 p-12 text-center text-slate-500 shadow-sm flex flex-col items-center justify-center">
          <History className="w-12 h-12 text-slate-700 mb-4 opacity-50" />
          <span className="font-semibold tracking-wide">No records found.</span>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-800/80 ml-4 space-y-8 pb-8">
          {groupedSalesArray.map(group => {
            const isExpanded = expandedDates.includes(group.date);
            return (
              <div key={group.date} className="relative pl-8">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>

                <div className="bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-md transition-all">
                  <button 
                    onClick={() => toggleDate(group.date)}
                    className={`w-full px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-slate-900 transition-colors cursor-pointer text-left ${isExpanded ? 'bg-slate-900/50 border-b border-slate-800/80' : 'bg-slate-950'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-emerald-500/10' : 'bg-slate-800'}`}>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                      </div>
                      <h3 className="text-[15px] font-extrabold tracking-wide text-slate-100">{group.date === todayStr ? 'Today' : group.date}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider hidden sm:block">Daily Total</span>
                      <span className="text-emerald-400 font-black bg-emerald-500/10 px-4 py-1.5 rounded-lg border border-emerald-500/20 text-sm shrink-0">
                        Rs {group.total.toFixed(2)}
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800/80">
                            <th className="px-6 py-4 w-32">Time</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4 w-40">Customer</th>
                            <th className="px-6 py-4 w-32">User</th>
                            <th className="px-6 py-4 text-right w-32">Amount (Rs)</th>
                            <th className="px-6 py-4 text-center w-20">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {group.sales.map(sale => (
                            <tr key={sale.id} className="hover:bg-slate-900/50 transition-colors group/row">
                              <td className="px-6 py-4 text-slate-400 text-[13px] font-medium whitespace-nowrap">
                                {sale.timestamp ? format(sale.timestamp.toDate(), 'p') : '...'}
                              </td>
                              <td className="px-6 py-4 text-slate-300 text-[13px] leading-relaxed">
                                {sale.description}
                              </td>
                              <td className="px-6 py-4 text-slate-200 text-[13px] font-semibold">
                                {sale.customerName || <span className="text-slate-600 font-normal">N/A</span>}
                              </td>
                              <td className="px-6 py-4 text-slate-500 text-[13px] font-medium truncate max-w-[8rem] capitalize">
                                {(() => {
                                  const email = sale.userEmail || '';
                                  if (email.includes('@')) return email.split('@')[0];
                                  return sale.userEmail || sale.userId || 'Admin';
                                })()}
                              </td>
                              <td className="px-6 py-4 text-emerald-400 font-bold text-right whitespace-nowrap text-sm">
                                {Number(sale.amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleDeleteSale(sale.id)}
                                  className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all opacity-0 group-hover/row:opacity-100 focus:opacity-100"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
