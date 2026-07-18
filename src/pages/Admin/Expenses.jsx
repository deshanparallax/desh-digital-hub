import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Search, Plus, Trash2, Wallet, PackageOpen, DollarSign, Calendar } from 'lucide-react';
import { notify } from '../../utils/toast';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

export default function Expenses({ isAdmin }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete Modal State
  const [deleteRecordId, setDeleteRecordId] = useState(null);

  // Quick Select Options
  const quickItems = ["A4 Bundle", "Laminate Bundle", "Printer Ink"];

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const q = query(collection(db, 'shop_expenses'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setRecords(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      notify.error("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !amount) {
      notify.error("Item name and Amount are required.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'shop_expenses'), {
        itemName,
        amount: Number(amount),
        timestamp: serverTimestamp()
      });
      notify.success("Expense recorded successfully!");
      setItemName('');
      setAmount('');
      fetchRecords();
    } catch (error) {
      console.error("Error adding expense:", error);
      notify.error("Failed to add expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    setDeleteRecordId(id);
  };

  const confirmDelete = async () => {
    if (!deleteRecordId) return;
    try {
      await deleteDoc(doc(db, 'shop_expenses', deleteRecordId));
      notify.success("Expense record deleted.");
      fetchRecords();
    } catch (error) {
      console.error("Error deleting expense:", error);
      notify.error("Failed to delete record.");
    } finally {
      setDeleteRecordId(null);
    }
  };

  const filteredRecords = records.filter(record => 
    (record.itemName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalExpenses = records.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-4 md:p-6 space-y-6 w-full relative z-10 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-orange-900/10 pointer-events-none -z-10 rounded-3xl"></div>
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Shop Expenses</h1>
          <p className="text-slate-400 font-medium">Record money spent on shop supplies and inventory</p>
        </div>
        
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-500"></div>
          <div className="p-3.5 bg-gradient-to-br from-red-500/20 to-red-900/40 rounded-xl border border-red-500/20 shadow-inner">
            <Wallet className="w-6 h-6 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Expenses</p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Rs {totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1 h-full min-h-0">
          <div className="h-full flex flex-col min-h-0 bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-6 flex items-center gap-2 drop-shadow-sm shrink-0">
              <Plus className="w-5 h-5 text-red-400" /> Add New Expense
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ef4444 transparent' }}>
              <form onSubmit={handleSubmit} className="space-y-6 pb-2">
              
              {/* Quick Select Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Select</label>
                <div className="flex flex-wrap gap-2">
                  {quickItems.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setItemName(item)}
                      className="px-3 py-1.5 rounded-lg text-[13px] font-bold border transition-all bg-slate-950/50 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Item Name / Description *</label>
                <div className="relative">
                  <PackageOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-10 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                    placeholder="e.g. A4 Bundle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Amount (Rs) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rs.</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-10 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] disabled:opacity-50"
              >
                {isSubmitting ? 'Recording...' : 'Record Expense'}
              </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2 h-full min-h-0">
          <div className="h-full flex flex-col min-h-0 bg-gradient-to-b from-slate-900/60 to-slate-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.3)] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
              <h2 className="text-lg font-black text-slate-100 tracking-wide">Recent Expenses</h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/50 rounded-full px-9 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
                <Wallet className="w-12 h-12 mb-3 opacity-20" />
                <p>No expenses recorded yet.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ef4444 transparent' }}>
                {filteredRecords.map(record => (
                  <div key={record.id} className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                    
                    <div className="flex-1">
                      <h3 className="text-slate-200 font-bold text-base flex items-center gap-2">
                        {record.itemName}
                      </h3>
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> 
                        {record.timestamp ? new Date(record.timestamp.toDate()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</p>
                        <p className="text-lg font-black text-red-400">Rs {record.amount.toFixed(2)}</p>
                      </div>

                      <div className="flex gap-2">
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-4"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
      
      <DeleteConfirmModal 
        isOpen={!!deleteRecordId} 
        onClose={() => setDeleteRecordId(null)} 
        onConfirm={confirmDelete}
        title="Delete Expense?"
        message="Are you sure you want to delete this expense record? This action cannot be undone."
      />
    </div>
  );
}
