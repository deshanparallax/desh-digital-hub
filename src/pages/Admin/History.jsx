import React from 'react';
import { format } from 'date-fns';

export default function History({ salesHistory, fetchSales }) {
  return (
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
  );
}
