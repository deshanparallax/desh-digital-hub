import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceDot, Label, LabelList } from 'recharts';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  TrendingUp, Activity, Wrench, ShoppingBag, 
  PlusCircle, Clock, CheckCircle2, AlertCircle, ShoppingCart 
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard({ salesHistory, setActiveTab, posCategories = [] }) {
  const [repairs, setRepairs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const repairsQ = query(collection(db, 'repairs'), orderBy('createdAt', 'desc'));
        const repairsSnap = await getDocs(repairsQ);
        setRepairs(repairsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const expensesQ = query(collection(db, 'shop_expenses'), orderBy('timestamp', 'desc'));
        const expensesSnap = await getDocs(expensesQ);
        setExpenses(expensesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date();
  
  // -- SALES & PROFIT METRICS --
  const todaySales = salesHistory.filter(s => s.timestamp && new Date(s.timestamp.toDate()).toDateString() === today.toDateString());
  const monthSales = salesHistory.filter(s => s.timestamp && new Date(s.timestamp.toDate()).getMonth() === today.getMonth() && new Date(s.timestamp.toDate()).getFullYear() === today.getFullYear());
  const monthExpensesList = expenses.filter(e => e.timestamp && new Date(e.timestamp.toDate()).getMonth() === today.getMonth() && new Date(e.timestamp.toDate()).getFullYear() === today.getFullYear());
  
  const todaySum = todaySales.reduce((sum, s) => sum + Number(s.amount), 0);
  const monthIncome = monthSales.reduce((sum, s) => {
    if (s.isRepair) {
      return sum + (Number(s.amount || 0) - Number(s.cost || 0));
    }
    return sum + Number(s.amount || 0);
  }, 0);
  const monthExpensesTotal = monthExpensesList.reduce((sum, e) => sum + Number(e.amount), 0);
  const monthNetProfit = monthIncome - monthExpensesTotal;

  // Compare with yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdaySales = salesHistory.filter(s => s.timestamp && new Date(s.timestamp.toDate()).toDateString() === yesterday.toDateString());
  const yesterdaySum = yesterdaySales.reduce((sum, s) => sum + Number(s.amount), 0);
  const salesGrowth = yesterdaySum === 0 ? 100 : ((todaySum - yesterdaySum) / yesterdaySum) * 100;
  
  const totalRevenue = salesHistory.reduce((sum, s) => sum + Number(s.amount), 0);
  const totalOrders = salesHistory.length;

  // -- REPAIR METRICS --
  const activeRepairs = repairs.filter(r => r.status === 'Pending' || r.status === 'In Progress');
  const readyDeliveries = repairs.filter(r => r.status === 'Ready');

  // -- CHART: This Month Revenue --
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();
  
  const thisMonthDays = [...Array(currentDay)].map((_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  });

  const revenueExpenseMap = {};
  thisMonthDays.forEach(d => revenueExpenseMap[d] = { income: 0, expense: 0 });

  salesHistory.forEach(sale => {
    if (sale.timestamp) {
      const d = new Date(sale.timestamp.toDate());
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        if (revenueExpenseMap[dateStr] !== undefined) {
          if (sale.isRepair) {
            revenueExpenseMap[dateStr].income += (Number(sale.amount || 0) - Number(sale.cost || 0));
          } else {
            revenueExpenseMap[dateStr].income += Number(sale.amount || 0);
          }
        }
      }
    }
  });

  expenses.forEach(exp => {
    if (exp.timestamp) {
      const d = new Date(exp.timestamp.toDate());
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        if (revenueExpenseMap[dateStr] !== undefined) {
          revenueExpenseMap[dateStr].expense += Number(exp.amount);
        }
      }
    }
  });

  const revenueChartData = thisMonthDays.map(date => ({
    date: date.split(' ')[1], // show day number on x-axis
    fullDate: date,
    revenue: revenueExpenseMap[date].income,
    expense: revenueExpenseMap[date].expense
  }));

  // -- CHART: Today's Revenue by Hour --
  const todayHoursMap = {};
  for (let i = 8; i <= 20; i += 2) {
    const period = i >= 12 ? 'PM' : 'AM';
    const hour = i > 12 ? i - 12 : i;
    todayHoursMap[`${hour}:00 ${period}`] = 0;
  }
  todayHoursMap['Later'] = 0;

  todaySales.forEach(sale => {
    if (sale.timestamp) {
      const d = new Date(sale.timestamp.toDate());
      const h = d.getHours();
      
      let timeKey = 'Later';
      if (h >= 8 && h < 10) timeKey = '8:00 AM';
      else if (h >= 10 && h < 12) timeKey = '10:00 AM';
      else if (h >= 12 && h < 14) timeKey = '12:00 PM';
      else if (h >= 14 && h < 16) timeKey = '2:00 PM';
      else if (h >= 16 && h < 18) timeKey = '4:00 PM';
      else if (h >= 18 && h < 20) timeKey = '6:00 PM';
      else if (h >= 20 && h < 22) timeKey = '8:00 PM';

      if (todayHoursMap[timeKey] !== undefined) {
        todayHoursMap[timeKey] += Number(sale.amount);
      }
    }
  });

  const todayHoursData = Object.keys(todayHoursMap).map(time => ({
    time,
    revenue: todayHoursMap[time]
  })).filter(d => d.time !== 'Later' || d.revenue > 0);

  // -- CHART: Top Items --
  const itemMap = {};
  salesHistory.forEach(sale => {
    (sale.cartItems || []).forEach(item => {
      if (!itemMap[item.name]) itemMap[item.name] = 0;
      itemMap[item.name] += (item.qty * item.price);
    });
  });
  const topItemsData = Object.keys(itemMap).map(name => ({ name, value: itemMap[name] })).sort((a, b) => b.value - a.value).slice(0, 5);

  // -- CHART: Sales by Category (Services) --
  const itemToCategory = {};
  posCategories.forEach(cat => {
    (cat.items || []).forEach(item => {
      itemToCategory[item.name] = cat.category;
    });
  });

  const categoryMap = {};
  salesHistory.forEach(sale => {
    if (sale.isRepair) {
      if (!categoryMap['PC Repairs']) categoryMap['PC Repairs'] = 0;
      categoryMap['PC Repairs'] += Number(sale.amount);
    } else {
      (sale.cartItems || []).forEach(item => {
        const catName = itemToCategory[item.name] || 'Other';
        if (!categoryMap[catName]) categoryMap[catName] = 0;
        categoryMap[catName] += (item.qty * item.price);
      });
    }
  });

  const salesByCategoryData = Object.keys(categoryMap)
    .filter(name => categoryMap[name] > 0)
    .map(name => ({ name, value: categoryMap[name] }))
    .sort((a, b) => b.value - a.value);

  // -- CHART: Repair Status --
  const statusMap = { Pending: 0, 'In Progress': 0, Ready: 0, Delivered: 0, Cancelled: 0 };
  repairs.forEach(r => {
    if (statusMap[r.status] !== undefined) {
      statusMap[r.status] += 1;
    }
  });
  const repairStatusData = Object.keys(statusMap)
    .filter(k => statusMap[k] > 0)
    .map(name => ({ name, value: statusMap[name] }))
    .sort((a, b) => b.value - a.value);

  // -- CHART: Repair Profit (By Month) --
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const repairProfitMap = {};
  monthsList.forEach(m => repairProfitMap[m] = 0);

  salesHistory.forEach(sale => {
    if (sale.isRepair && sale.timestamp) {
      const d = new Date(sale.timestamp.toDate());
      if (d.getFullYear() === currentYear) {
        const monthStr = monthsList[d.getMonth()];
        const profit = Number(sale.amount || 0) - Number(sale.cost || 0);
        if (profit > 0) {
          repairProfitMap[monthStr] += profit;
        }
      }
    }
  });

  const repairProfitData = monthsList.map(month => ({
    month,
    profit: repairProfitMap[month]
  }));

  // -- RECENT ACTIVITY --
  // Merge sales and repairs, sort by date
  const allActivities = [
    ...salesHistory.map(s => ({
      id: s.id,
      type: 'SALE',
      title: s.isRepair ? 'Repair Payment' : 'POS Sale',
      amount: s.amount,
      date: s.timestamp ? s.timestamp.toDate() : new Date(),
      items: s.cartItems?.length || 0
    })),
    ...repairs.map(r => ({
      id: r.id,
      type: 'REPAIR',
      title: `Repair Job: ${r.deviceType || 'Device'}`,
      status: r.status,
      customer: r.customerName,
      date: r.createdAt ? r.createdAt.toDate() : new Date()
    }))
  ].sort((a, b) => b.date - a.date).slice(0, 8);


  // Data for High Labels
  const maxRevenueData = revenueChartData.length > 0 ? revenueChartData.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current) : null;
  const maxTodayData = todayHoursData.length > 0 ? todayHoursData.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current) : null;
  const maxProfitIndex = repairProfitData.length > 0 ? repairProfitData.reduce((iMax, x, i, arr) => x.profit > arr[iMax].profit ? i : iMax, 0) : 0;

  // Render Helpers
  const renderHorizontalBarLabel = (props) => {
    const { x, y, width, height, value, index } = props;
    if (index !== 0) return null; // Since topItems is sorted descending
    return (
      <text x={x + width + 8} y={y + height / 2} fill="#e2e8f0" fontSize={11} fontWeight="bold" dominantBaseline="central">
        High: {value}
      </text>
    );
  };

  const renderVerticalBarLabel = (props) => {
    const { x, y, width, value, index } = props;
    if (index !== maxProfitIndex || value === 0) return null;
    return (
      <text x={x + width / 2} y={y - 8} fill="#e2e8f0" fontSize={11} fontWeight="bold" textAnchor="middle">
        High: Rs {value}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isDate = payload[0].payload.fullDate;
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl min-w-[120px]">
          <p className="text-slate-300 text-xs font-semibold mb-2 border-b border-white/10 pb-1">{isDate || label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between gap-4 mb-1">
              <span className="text-slate-400 text-[11px] uppercase font-bold">{entry.name || 'Value'}:</span>
              <span className="font-black text-[11px]" style={{ color: entry.color }}>Rs {entry.value?.toFixed(2) || '0.00'}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, outerRadius, index, name } = props;
    if (index !== 0) return null;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius) * cos;
    const sy = cy + (outerRadius) * sin;
    const mx = cx + (outerRadius + 15) * cos;
    const my = cy + (outerRadius + 15) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 12;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#94a3b8" fill="none" />
        <circle cx={ex} cy={ey} r={2} fill="#94a3b8" stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} textAnchor={textAnchor} fill="#e2e8f0" fontSize={11} fontWeight="bold" dominantBaseline="central">
          {name}
        </text>
      </g>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-400 text-sm mt-1">Here's what's happening at your store today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab && setActiveTab('pos')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm border border-slate-700/50 hover:border-slate-600"
          >
            <ShoppingCart className="w-4 h-4" /> Go to POS
          </button>
          <button 
            onClick={() => setActiveTab && setActiveTab('repairs')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-500"
          >
            <PlusCircle className="w-4 h-4" /> New Repair
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:bg-slate-900/60 transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Today's Revenue</p>
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-100">Rs {todaySum.toFixed(2)}</h3>
          <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${salesGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}% 
            <span className="text-slate-500 font-normal">from yesterday</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:bg-slate-900/60 transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-100">Rs {totalRevenue.toFixed(2)}</h3>
          <p className="text-xs mt-2 font-medium text-slate-500 flex items-center gap-1">
            All-time earnings
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:bg-slate-900/60 transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Orders</p>
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <ShoppingCart className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-100">{totalOrders}</h3>
          <p className="text-xs mt-2 font-medium text-slate-500 flex items-center gap-1">
            All-time total orders
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:bg-slate-900/60 transition-all">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Monthly Revenue</p>
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-100">Rs {monthIncome.toFixed(2)}</h3>
          <p className="text-xs mt-2 font-medium text-slate-500 flex items-center gap-1">
            Current month total
          </p>
        </div>
      </div>

      {/* WIDGET: INCOME VS EXPENSES (THIS MONTH) */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Income vs Expenses (This Month)</h3>
          <div className="flex gap-4 md:gap-6 bg-slate-950/50 p-3 rounded-xl border border-white/5">
            <div className="text-right">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Total Income</p>
              <p className="text-sm font-black text-slate-200">Rs {monthIncome.toFixed(2)}</p>
            </div>
            <div className="text-right border-l border-white/10 pl-4 md:pl-6">
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Total Expenses</p>
              <p className="text-sm font-black text-slate-200">Rs {monthExpensesTotal.toFixed(2)}</p>
            </div>
            <div className="text-right border-l border-white/10 pl-4 md:pl-6">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Net Profit</p>
              <p className={`text-sm font-black ${monthNetProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>Rs {monthNetProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#475569" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => `Rs${val}`} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
              <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHARTS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg flex-1">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6">Revenue Trend (This Month)</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#475569" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => `Rs${val}`} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  {maxRevenueData && maxRevenueData.revenue > 0 && (
                    <ReferenceDot x={maxRevenueData.date} y={maxRevenueData.revenue} r={4} fill="#10b981" stroke="#fff" strokeWidth={2}>
                      <Label value={`High: Rs ${maxRevenueData.revenue.toFixed(0)}`} position="top" fill="#e2e8f0" fontSize={11} fontWeight="bold" offset={10} />
                    </ReferenceDot>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg flex-1">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6">Today's Revenue (By Time)</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={todayHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => `Rs${val}`} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorToday)" />
                  {maxTodayData && maxTodayData.revenue > 0 && (
                    <ReferenceDot x={maxTodayData.time} y={maxTodayData.revenue} r={4} fill="#3b82f6" stroke="#fff" strokeWidth={2}>
                      <Label value={`High: Rs ${maxTodayData.revenue.toFixed(0)}`} position="top" fill="#e2e8f0" fontSize={11} fontWeight="bold" offset={10} />
                    </ReferenceDot>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col min-h-[300px]">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-4">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
            {allActivities.length === 0 ? (
              <p className="text-slate-500 text-sm text-center mt-10">No recent activity</p>
            ) : (
              allActivities.map((act, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-white/5">
                  <div className={`p-2 rounded-lg shrink-0 ${act.type === 'SALE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {act.type === 'SALE' ? <ShoppingCart className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{act.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {act.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {act.type === 'SALE' ? `${act.items} items` : act.status}
                    </p>
                  </div>
                  {act.type === 'SALE' && (
                    <div className="text-xs font-black text-emerald-400 whitespace-nowrap mt-1">
                      Rs {act.amount?.toFixed(2)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6">Top 5 Items</h3>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItemsData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#1e293b'}} content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {topItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-2">Sales by Category</h3>
          <div className="flex flex-col h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategoryData}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {salesByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}
                  formatter={(value, name) => [`Rs ${value.toFixed(2)}`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repair Profit Chart */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg lg:col-span-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest mb-6">Monthly Repair Profit ({currentYear})</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repairProfitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#475569" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => `Rs${val}`} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#1e293b'}} content={<CustomTooltip />} />
                <Bar dataKey="profit" fill="#14b8a6" radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="profit" content={renderVerticalBarLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
