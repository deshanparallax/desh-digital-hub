import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ salesHistory, chartData }) {
  return (
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
  );
}
