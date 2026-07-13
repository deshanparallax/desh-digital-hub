import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { POS_CATEGORIES } from '../../constants/data';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Dashboard({ salesHistory, chartData }) {
  const today = new Date();
  
  // Metrics Calculations
  const todaySales = salesHistory.filter(s => s.timestamp && new Date(s.timestamp.toDate()).toDateString() === today.toDateString());
  const monthSales = salesHistory.filter(s => s.timestamp && new Date(s.timestamp.toDate()).getMonth() === today.getMonth() && new Date(s.timestamp.toDate()).getFullYear() === today.getFullYear());
  const yearSales = salesHistory.filter(s => s.timestamp && new Date(s.timestamp.toDate()).getFullYear() === today.getFullYear());

  const todaySum = todaySales.reduce((sum, s) => sum + Number(s.amount), 0);
  const monthSum = monthSales.reduce((sum, s) => sum + Number(s.amount), 0);
  const yearSum = yearSales.reduce((sum, s) => sum + Number(s.amount), 0);
  const totalSum = salesHistory.reduce((sum, s) => sum + Number(s.amount), 0);
  const ordersToday = todaySales.length;

  // Chart: This Year by Month
  const yearMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const yearChartDataMap = {};
  yearMonths.forEach(m => yearChartDataMap[m] = 0);

  yearSales.forEach(sale => {
    if (sale.timestamp) {
      const monthStr = new Date(sale.timestamp.toDate()).toLocaleString('en-US', { month: 'short' });
      if (yearChartDataMap[monthStr] !== undefined) {
        yearChartDataMap[monthStr] += Number(sale.amount);
      }
    }
  });

  const yearChartData = yearMonths.map(month => ({
    month,
    revenue: yearChartDataMap[month]
  }));

  // Chart: Sales by Service (Items)
  const itemMap = {};
  salesHistory.forEach(sale => {
    (sale.cartItems || []).forEach(item => {
      if (!itemMap[item.name]) itemMap[item.name] = 0;
      itemMap[item.name] += (item.qty * item.price);
    });
  });
  const itemsData = Object.keys(itemMap).map(name => ({ name, value: itemMap[name] })).sort((a, b) => b.value - a.value).slice(0, 8); // Top 8 items

  // Chart: Sales by Category
  const itemToCategory = {};
  POS_CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      itemToCategory[item.name] = cat.category;
    });
  });

  const categoryMap = {};
  salesHistory.forEach(sale => {
    (sale.cartItems || []).forEach(item => {
      const catName = itemToCategory[item.name] || 'Custom / Other';
      if (!categoryMap[catName]) categoryMap[catName] = 0;
      categoryMap[catName] += (item.qty * item.price);
    });
  });
  const categoryData = Object.keys(categoryMap).map(name => ({ name, value: categoryMap[name] })).sort((a, b) => b.value - a.value);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    if (percent < 0.05) return null; // Don't show labels for tiny slices
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold text-white mb-8">Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 border-t-[3px] border-t-emerald-500 shadow-sm relative overflow-hidden group hover:bg-slate-900 transition-colors">
          <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Today's Sales</h3>
          <p className="text-2xl font-black text-slate-100 mt-1">Rs {todaySum.toFixed(2)}</p>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
        </div>
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 border-t-[3px] border-t-blue-500 shadow-sm relative overflow-hidden group hover:bg-slate-900 transition-colors">
          <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">This Month's Sales</h3>
          <p className="text-2xl font-black text-slate-100 mt-1">Rs {monthSum.toFixed(2)}</p>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
        </div>
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 border-t-[3px] border-t-purple-500 shadow-sm relative overflow-hidden group hover:bg-slate-900 transition-colors">
          <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">This Year's Sales</h3>
          <p className="text-2xl font-black text-slate-100 mt-1">Rs {yearSum.toFixed(2)}</p>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all"></div>
        </div>
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 border-t-[3px] border-t-pink-500 shadow-sm relative overflow-hidden group hover:bg-slate-900 transition-colors">
          <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Total Sales (All Time)</h3>
          <p className="text-2xl font-black text-slate-100 mt-1">Rs {totalSum.toFixed(2)}</p>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all"></div>
        </div>
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 border-t-[3px] border-t-slate-500 shadow-sm relative overflow-hidden group hover:bg-slate-900 transition-colors">
          <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">Total Orders Today</h3>
          <p className="text-2xl font-black text-slate-100 mt-1">{ordersToday}</p>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-500/10 rounded-full blur-xl group-hover:bg-slate-500/20 transition-all"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Pie Chart */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 shadow-sm h-96 flex flex-col">
          <h3 className="text-slate-200 font-extrabold tracking-wide mb-2 shrink-0">Sales by Category</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={110} fill="#8884d8" dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `Rs ${value.toFixed(2)}`} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ fontWeight: 'bold' }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Services Pie Chart */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 shadow-sm h-96 flex flex-col">
          <h3 className="text-slate-200 font-extrabold tracking-wide mb-2 shrink-0">Top Services/Items</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={itemsData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={110} fill="#8884d8" dataKey="value" stroke="none">
                  {itemsData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `Rs ${value.toFixed(2)}`} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ fontWeight: 'bold' }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend Bar Chart */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 shadow-sm h-96 lg:col-span-2 flex flex-col">
          <h3 className="text-slate-200 font-extrabold tracking-wide mb-6 shrink-0">Revenue Trend (Last 7 Days)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-7)}>
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#10b981', fontWeight: 'bold' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* This Year Sales Bar Chart */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 shadow-sm h-96 lg:col-span-2 flex flex-col">
          <h3 className="text-slate-200 font-extrabold tracking-wide mb-6 shrink-0">This Year's Revenue by Month</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearChartData}>
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} itemStyle={{ color: '#a855f7', fontWeight: 'bold' }} />
                <Bar dataKey="revenue" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
