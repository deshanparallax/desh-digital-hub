import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, serverTimestamp, query, orderBy, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';
import { Search, Plus, Wrench, X, Check, Save, PlusCircle, Trash2, Calculator, Printer, Edit, Send } from 'lucide-react';
import logo from '../../assets/logo.webp';

export default function Repairs({ user, fetchSales }) {
  const [repairs, setRepairs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isViewBillModalOpen, setIsViewBillModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  // Unified Job Form State
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [modalStatus, setModalStatus] = useState('Pending');
  const [warrantyDays, setWarrantyDays] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [editAdvancePayment, setEditAdvancePayment] = useState(0);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editDeviceType, setEditDeviceType] = useState('PC');
  const [editSerial, setEditSerial] = useState('');
  const [editIssue, setEditIssue] = useState('');
  const [editCalcItems, setEditCalcItems] = useState([{ desc: '', amount: '' }]);
  const [showCalc, setShowCalc] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const repQuery = query(collection(db, 'repairs'), orderBy('createdAt', 'desc'));
      const repSnap = await getDocs(repQuery);
      setRepairs(repSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const invSnap = await getDocs(collection(db, 'inventory'));
      setInventory(invSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this repair job?")) {
      try {
        await deleteDoc(doc(db, 'repairs', id));
        fetchData();
      } catch (err) {
        console.error("Error deleting job", err);
        alert("Failed to delete job.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openJobModal = (repair = null) => {
    setSelectedRepair(repair);
    if (repair) {
      setEditCustomerName(repair.customerName || '');
      setEditWhatsapp(repair.whatsapp || '');
      setEditDeviceType(repair.deviceType || 'PC');
      setEditSerial(repair.serial || '');
      setEditIssue(repair.issue || '');
      setModalStatus(repair.status || 'Pending');
      setWarrantyDays(repair.warrantyDays || 0);
      setDiscount(repair.discount || 0);
      setEditAdvancePayment(repair.advancePayment || 0);
      setEditCalcItems(repair.calcItems && repair.calcItems.length > 0 ? repair.calcItems : [{ desc: '', amount: '' }]);
    } else {
      setEditCustomerName('');
      setEditWhatsapp('');
      setEditDeviceType('PC');
      setEditSerial('');
      setEditIssue('');
      setModalStatus('Pending');
      setWarrantyDays(0);
      setDiscount(0);
      setEditAdvancePayment(0);
      setEditCalcItems([{ desc: '', amount: '' }]);
    }
    setShowCalc(false);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e, shouldPrint = false) => {
    if (e) e.preventDefault();
    if (!editCustomerName || !editIssue) return alert('Customer Name and Issue are required.');

    const jobData = {
      customerName: editCustomerName.trim(),
      whatsapp: editWhatsapp,
      deviceType: editDeviceType,
      serial: editSerial,
      issue: editIssue,
      calcItems: editCalcItems,
      warrantyDays: Number(warrantyDays) || 0,
      discount: Number(discount) || 0,
      advancePayment: Number(editAdvancePayment) || 0,
      estCost: editCalcItems.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      updatedAt: serverTimestamp()
    };

    try {
      if (selectedRepair) {
        jobData.status = modalStatus;
        await updateDoc(doc(db, 'repairs', selectedRepair.id), jobData);
      } else {
        jobData.status = 'Pending';
        jobData.createdAt = serverTimestamp();
        jobData.createdBy = user.email;
        jobData.parts = [];
        jobData.laborCharge = 0;
        jobData.finalTotal = 0;
        
        const docRef = await addDoc(collection(db, 'repairs'), jobData);
        jobData.id = docRef.id;
        
        if (shouldPrint) {
          printEstimate(jobData);
        }
      }

      setIsJobModalOpen(false);
      fetchData();
      alert(`Job ${selectedRepair ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error(err);
      alert('Error saving job');
    }
  };

  const printEstimate = (jobData) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Repair Estimate</title>
        <style>
          @page { size: A5 portrait; margin: 10mm; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #000; font-size: 14px; margin: 0; padding: 0; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .info-box { border: 1px solid #000; padding: 10px; width: 48%; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; border: 1px solid #000; text-align: left; }
          th { background-color: #f3f4f6; }
          .right { text-align: right; }
          .totals-container { display: flex; justify-content: flex-end; }
          .totals-table { width: 300px; border: none; }
          .totals-table td { border: none; padding: 4px 8px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #555; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <img src="${logo}" alt="Logo" style="height: 60px; margin-bottom: 5px; object-fit: contain;" />
            <div style="font-weight: bold; font-size: 16px;">DESH Digital Hub</div>
            <div>204/1, Pitapahamuna, Melsiripura</div>
            <div>Tel: 071 998 9000</div>
          </div>
          <div style="text-align: right;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">Repair Estimate</h1>
            <div style="margin-top: 10px;">
              <b>Job No:</b> #${jobData.id ? jobData.id.slice(0, 6).toUpperCase() : 'NEW'}<br/>
              <b>Date:</b> ${new Date().toLocaleString()}
            </div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-box">
            <b>Customer Details:</b><br/>
            ${jobData.customerName}<br/>
            ${jobData.whatsapp ? `WhatsApp: ${jobData.whatsapp}` : ''}
          </div>
          <div class="info-box">
            <b>Device Details:</b><br/>
            Type: ${jobData.deviceType}<br/>
            Issue: ${jobData.issue}
          </div>
        </div>

        ${jobData.calcItems && jobData.calcItems.length > 0 && jobData.calcItems.some(i => i.desc) ? `
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="right" style="width: 150px;">Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            ${jobData.calcItems.filter(i => i.desc).map(p => `
              <tr>
                <td>${p.desc}</td>
                <td class="right">${Number(p.amount || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : `
        <div style="margin: 10px 0; padding: 10px; border: 1px solid #000; border-radius: 5px;">
          <b>Services:</b><br/>
          N/A
        </div>
        `}
        
        <div class="totals-container">
          <table class="totals-table">
            <tr>
              <td>EST. TOTAL:</td>
              <td class="right"><b>Rs ${Number(jobData.estCost || 0).toFixed(2)}</b></td>
            </tr>
            ${Number(jobData.advancePayment) > 0 ? `
            <tr>
              <td>ADVANCE PAID:</td>
              <td class="right">- Rs ${Number(jobData.advancePayment).toFixed(2)}</td>
            </tr>
            ` : ''}
            ${Number(jobData.discount) > 0 ? `
            <tr>
              <td>DISCOUNT:</td>
              <td class="right">- Rs ${Number(jobData.discount).toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr style="font-weight: bold; font-size: 16px; border-top: 1px solid #000;">
              <td style="padding-top: 8px;">BALANCE:</td>
              <td class="right" style="padding-top: 8px;">Rs ${Math.max(0, Number(jobData.estCost || 0) - Number(jobData.advancePayment || 0) - Number(jobData.discount || 0)).toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          *This is only an estimate and prices may vary depending on the actual repairs required.*<br/>
          Thank you for your business!
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };



  const handleCompleteCheckout = async () => {
    if (!selectedRepair) return;

    try {
      const partsTotal = (selectedRepair.parts || []).reduce((sum, p) => sum + p.sellingPrice, 0);
      const calcItemsTotal = editCalcItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
      const calcCostTotal = editCalcItems.reduce((sum, item) => sum + Number(item.buyingPrice || 0), 0);
      
      const buyingTotal = (selectedRepair.parts || []).reduce((sum, p) => sum + p.buyingPrice, 0) + calcCostTotal;
      const finalTotal = partsTotal + calcItemsTotal - Number(discount) - Number(editAdvancePayment);

      const profit = finalTotal - buyingTotal + Number(editAdvancePayment);

      await updateDoc(doc(db, 'repairs', selectedRepair.id), {
        customerName: editCustomerName,
        whatsapp: editWhatsapp,
        deviceType: editDeviceType,
        serial: editSerial,
        issue: editIssue,
        status: 'Completed',
        calcItems: editCalcItems,
        warrantyDays: Number(warrantyDays),
        discount: Number(discount),
        advancePayment: Number(editAdvancePayment),
        finalTotal: currentFinalTotal,
        profit,
        completedAt: serverTimestamp()
      });

      let description = `Repair Payment: ${selectedRepair.customerName} - ${selectedRepair.deviceType} `;
      if ((selectedRepair.parts || []).length > 0) {
        description += `| Parts: ${(selectedRepair.parts || []).map(p => p.name).join(', ')} `;
      }
      if (editCalcItems.length > 0) {
        const calcDescs = editCalcItems.filter(i => i.desc).map(i => i.desc);
        if (calcDescs.length > 0) {
          description += `| Services: ${calcDescs.join(', ')} `;
        }
      }

      const totalCost = (selectedRepair.parts || []).reduce((sum, p) => sum + Number(p.buyingPrice || 0), 0) + calcCostTotal;

      await addDoc(collection(db, 'daily_sales'), {
        amount: currentFinalTotal,
        cost: totalCost,
        description,
        isRepair: true,
        repairId: selectedRepair.id,
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        customerName: selectedRepair.customerName || 'Repair Customer'
      });

      setIsUpdateModalOpen(false);
      fetchData();
      fetchSales();
      alert('Checkout Successful!');
    } catch (err) {
      console.error(err);
      alert('Error completing checkout');
    }
  };

  const printFinalBill = (job) => {
    const partsTotal = (job.parts || []).reduce((sum, p) => sum + p.sellingPrice, 0);
    const calcTotal = (job.calcItems || []).reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const advance = Number(job.advancePayment || 0);
    const disc = Number(job.discount || 0);
    const subTotal = partsTotal + calcTotal - disc;
    const currentFinalTotal = subTotal - advance;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Repair Bill</title>
        <style>
          @page { size: A5 portrait; margin: 10mm; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #000; font-size: 14px; margin: 0; padding: 0; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .info-box { border: 1px solid #000; padding: 10px; width: 48%; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; border: 1px solid #000; text-align: left; }
          th { background-color: #f3f4f6; }
          .right { text-align: right; }
          .totals-container { display: flex; justify-content: flex-end; }
          .totals-table { width: 300px; border: none; }
          .totals-table td { border: none; padding: 4px 8px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #555; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <img src="${logo}" alt="Logo" style="height: 60px; margin-bottom: 5px; object-fit: contain;" />
            <div style="font-weight: bold; font-size: 16px;">DESH Digital Hub</div>
            <div>204/1, Pitapahamuna, Melsiripura</div>
            <div>Tel: 071 998 9000</div>
          </div>
          <div style="text-align: right;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">Final Bill</h1>
            <div style="margin-top: 10px;">
              <b>Job No:</b> #${job.id ? job.id.slice(0, 6).toUpperCase() : 'NEW'}<br/>
              <b>Date:</b> ${new Date().toLocaleString()}
            </div>
          </div>
        </div>

        <div class="info-row">
          <div class="info-box">
            <b>Customer Details:</b><br/>
            ${job.customerName}<br/>
            ${job.whatsapp ? `WhatsApp: ${job.whatsapp}` : ''}
          </div>
          <div class="info-box">
            <b>Device Details:</b><br/>
            Type: ${job.deviceType}<br/>
            Issue: ${job.issue}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="right" style="width: 150px;">Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            ${(job.parts || []).map(p => `
              <tr>
                <td>${p.name}</td>
                <td class="right">${p.sellingPrice.toFixed(2)}</td>
              </tr>
            `).join('')}
            ${(job.calcItems || []).filter(i => i.desc).map(p => `
              <tr>
                <td>${p.desc}</td>
                <td class="right">${Number(p.amount || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
            ${disc > 0 ? `
              <tr>
                <td>Discount</td>
                <td class="right">-${disc.toFixed(2)}</td>
              </tr>
            ` : ''}
          </tbody>
        </table>
        
        <div class="totals-container">
          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td class="right">Rs ${subTotal.toFixed(2)}</td>
            </tr>
            ${advance > 0 ? `
            <tr>
              <td>Advance Paid:</td>
              <td class="right">- Rs ${advance.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr style="font-weight: bold; font-size: 18px; border-top: 2px solid #000;">
              <td style="padding-top: 8px;">FINAL TOTAL:</td>
              <td class="right" style="padding-top: 8px;">Rs ${currentFinalTotal.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          Thank you for your business!
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handlePrintBill = () => {
    if (!selectedRepair) return;
    printFinalBill({
      ...selectedRepair,
      parts: usedParts,
      laborCharge,
      discount
    });
  };

  const viewBill = (job) => {
    setViewingJob(job);
    setIsViewBillModalOpen(true);
  };

  const partsTotal = (selectedRepair?.parts || []).reduce((sum, p) => sum + p.sellingPrice, 0);
  const calcItemsTotal = editCalcItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const currentFinalTotal = partsTotal + calcItemsTotal - Number(discount) - Number(editAdvancePayment);

  const commonServices = [
    { name: 'Computer Formatting', price: 1500 },
    { name: 'Software Installation', price: 500 },
    { name: 'Driver Updating', price: 500 },
    { name: 'PC/Laptop service', price: 500 }
  ];

  const handleQuickAdd = (service) => {
    let newItems = [...editCalcItems];
    if (newItems.length === 1 && newItems[0].desc === '' && !newItems[0].amount) {
      newItems = [{ desc: service.name, amount: service.price }];
    } else {
      newItems.push({ desc: service.name, amount: service.price });
    }
    setEditCalcItems(newItems);
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Wrench className="w-8 h-8 text-emerald-500" /> PC Repairs
          </h2>
          <p className="text-slate-400 mt-1">Manage active and past repair jobs.</p>
        </div>
        <button
          onClick={() => openJobModal()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Repair Job
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-6">
        <div className="px-6 py-4 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-200">Active & Past Jobs</h3>
          <button onClick={fetchData} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">Refresh</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-4 font-semibold">Job ID</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Customer Name</th>
                <th className="px-4 py-4 font-semibold">WhatsApp</th>
                <th className="px-4 py-4 font-semibold">Device</th>
                <th className="px-4 py-4 font-semibold">Issue</th>
                <th className="px-4 py-4 font-semibold text-right">Est. Cost</th>
                <th className="px-4 py-4 font-semibold text-right">Advance Paid</th>
                <th className="px-4 py-4 font-semibold text-right">Discount</th>
                <th className="px-4 py-4 font-semibold text-right">Balance</th>
                <th className="px-4 py-4 font-semibold text-center">Status</th>
                {user?.email === 'admin@desh.lk' && (
                  <th className="px-4 py-4 font-semibold text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="10" className="px-6 py-8 text-center text-slate-500">Loading jobs...</td></tr>
              ) : repairs.length === 0 ? (
                <tr><td colSpan="10" className="px-6 py-8 text-center text-slate-500">No repair jobs found.</td></tr>
              ) : (
                repairs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-4 text-emerald-400 font-mono font-bold text-sm whitespace-nowrap align-top">
                      <button onClick={() => viewBill(job)} className="hover:underline hover:text-emerald-300 transition-colors" title="View Bill">
                        #{job.id.slice(0, 6).toUpperCase()}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs whitespace-nowrap align-top">
                      {job.createdAt ? format(job.createdAt.toDate(), 'MMM dd, p') : '...'}
                    </td>
                    <td className="px-4 py-4 text-slate-200 font-medium text-sm align-top">
                      {job.customerName}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-sm whitespace-nowrap align-top">
                      {job.whatsapp || '-'}
                    </td>
                    <td className="px-4 py-4 text-slate-300 font-semibold text-sm whitespace-nowrap align-top">
                      {job.deviceType}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-sm align-top leading-relaxed min-w-[200px]">
                      {job.issue}
                    </td>
                    <td className="px-4 py-4 text-emerald-400/80 font-medium text-sm text-right whitespace-nowrap align-top">
                      {job.estCost ? `Rs ${job.estCost.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-emerald-400 font-semibold text-sm text-right whitespace-nowrap align-top">
                      {job.advancePayment ? `Rs ${job.advancePayment.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-red-400 font-semibold text-sm text-right whitespace-nowrap align-top">
                      {job.discount ? `Rs ${job.discount.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-orange-400 font-bold text-sm text-right whitespace-nowrap align-top">
                      {((job.estCost || 0) - (job.advancePayment || 0) - (job.discount || 0)) > 0 ? `Rs ${((job.estCost || 0) - (job.advancePayment || 0) - (job.discount || 0)).toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap align-top">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${job.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        job.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          job.status === 'Delivered' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                        {job.status}
                      </span>
                    </td>
                    {user?.email === 'admin@desh.lk' && (
                      <td className="px-4 py-4 text-center whitespace-nowrap align-top">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openJobModal(job)}
                            className="text-slate-400 hover:text-emerald-400 bg-slate-800/50 hover:bg-emerald-500/10 p-2 rounded-lg transition-all"
                            title="Update Job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-slate-400 hover:text-red-400 bg-slate-800/50 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden slide-in-from-bottom-8">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                {selectedRepair ? (
                  <>Update Repair: {selectedRepair.customerName}</>
                ) : (
                  <><Wrench className="w-5 h-5 text-emerald-500" /> New PC Repair Job</>
                )}
              </h3>
              <button onClick={() => setIsJobModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Basic Details Edit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Customer Name</label>
                  <input type="text" value={editCustomerName} onChange={e => setEditCustomerName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">WhatsApp Number</label>
                  <input type="text" value={editWhatsapp} onChange={e => setEditWhatsapp(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Device Type</label>
                  <select value={editDeviceType} onChange={e => setEditDeviceType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm">
                    <option value="PC">Desktop PC</option>
                    <option value="Laptop">Laptop</option>
                    <option value="MacBook">MacBook</option>
                    <option value="Printer">Printer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Serial / Model</label>
                  <input type="text" value={editSerial} onChange={e => setEditSerial(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Issue Description</label>
                  <input type="text" value={editIssue} onChange={e => setEditIssue(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-emerald-400">Estimate / Bill Items</h4>
                  <div className="flex gap-2">
                    {commonServices.map(s => (
                      <button
                        type="button"
                        key={s.name}
                        onClick={() => handleQuickAdd(s)}
                        className="bg-slate-800 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 text-slate-200 text-xs font-semibold py-1 px-2 rounded-lg transition-all"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="py-2 text-slate-400">Item / Repair</th>
                      <th className="py-2 text-slate-400 text-right">Real Price (Buy)</th>
                      <th className="py-2 text-slate-400 text-right">Selling Price</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editCalcItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50 last:border-0">
                        <td className="py-2 pr-2">
                          <input type="text" value={item.desc} onChange={e => {
                            const newItems = [...editCalcItems];
                            newItems[idx].desc = e.target.value;
                            setEditCalcItems(newItems);
                          }} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-emerald-500" placeholder="Description" />
                        </td>
                        <td className="py-2 px-2 w-28">
                          <input type="number" value={item.buyingPrice || ''} onChange={e => {
                            const newItems = [...editCalcItems];
                            newItems[idx].buyingPrice = Number(e.target.value);
                            setEditCalcItems(newItems);
                          }} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-right focus:outline-none focus:border-emerald-500" placeholder="Cost" />
                        </td>
                        <td className="py-2 pl-2 w-32">
                          <input type="number" value={item.amount || ''} onChange={e => {
                            const newItems = [...editCalcItems];
                            newItems[idx].amount = Number(e.target.value);
                            setEditCalcItems(newItems);
                          }} className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-medium text-right focus:outline-none focus:border-emerald-500" placeholder="Selling" />
                        </td>
                        <td className="py-2 pl-2 text-right w-8">
                          <button onClick={() => setEditCalcItems(editCalcItems.filter((_, i) => i !== idx))} className="text-red-400/50 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => setEditCalcItems([...editCalcItems, { desc: '', amount: '', buyingPrice: '' }])} className="text-xs text-emerald-400 font-semibold flex items-center gap-1 hover:text-emerald-300 mt-3">
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              {selectedRepair && (
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Current Status</label>
                    <select
                      value={modalStatus}
                      onChange={e => setModalStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed / Ready for Pickup</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="border-t border-slate-800 pt-6 grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Warranty (Days)</label>
                  <input type="number" value={warrantyDays} onChange={e => setWarrantyDays(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 font-bold focus:outline-none focus:border-emerald-500 text-right" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Advance Paid (Rs)</label>
                  <input type="number" value={editAdvancePayment} onChange={e => setEditAdvancePayment(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 text-right" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Discount (Rs)</label>
                  <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-red-400 font-bold focus:outline-none focus:border-red-500 text-right" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Final Bill Amount</span>
                <span className="text-3xl font-black text-emerald-400">Rs {currentFinalTotal.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveJob}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-5 h-5" /> Save Job
                </button>
                {selectedRepair && user?.email === 'admin@desh.lk' && (
                  <button
                    onClick={handleCompleteCheckout}
                    disabled={selectedRepair.status === 'Completed' || selectedRepair.status === 'Delivered'}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-8 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {selectedRepair.status === 'Completed' || selectedRepair.status === 'Delivered' ? 'Already Completed' : <><Check className="w-5 h-5" /> Complete & Checkout</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Bill Modal */}
      {isViewBillModalOpen && viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 border border-slate-200 rounded-xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden slide-in-from-bottom-8 font-mono">

            <div className="p-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                  <img src={logo} alt="DESH Digital Hub" className="h-20 object-contain" />
                </div>
                <p className="text-sm">204/1, Pitapahamuna, Melsiripura</p>
                <p className="text-sm">Tel: 071 998 9000</p>
                <div className="mt-3 font-bold uppercase text-lg border-b-2 border-dashed border-slate-300 pb-2">
                  {(viewingJob.status === 'Completed' || viewingJob.status === 'Delivered') ? 'FINAL BILL' : 'REPAIR ESTIMATE'}
                </div>
              </div>

              <div className="text-sm space-y-1 mb-4 border-b-2 border-dashed border-slate-300 pb-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Job No:</span>
                  <span>#{viewingJob.id.slice(0, 6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Date:</span>
                  <span>{viewingJob.createdAt ? format(viewingJob.createdAt.toDate(), 'dd/MM/yyyy p') : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Customer:</span>
                  <span>{viewingJob.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Device:</span>
                  <span>{viewingJob.deviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Issue:</span>
                  <span className="text-right max-w-[180px]">{viewingJob.issue}</span>
                </div>
              </div>

              <div className="mb-4 text-sm border-b-2 border-dashed border-slate-300 pb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-1">Description</th>
                      <th className="text-right py-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewingJob.status === 'Completed' || viewingJob.status === 'Delivered') ? (
                      <>
                        {(viewingJob.parts || []).map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-1">{p.name}</td>
                            <td className="text-right py-1">{(Number(p.sellingPrice) || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                        {Number(viewingJob.laborCharge) > 0 && (
                          <tr>
                            <td className="py-1">Labor Charge</td>
                            <td className="text-right py-1">{(Number(viewingJob.laborCharge) || 0).toFixed(2)}</td>
                          </tr>
                        )}
                        {Number(viewingJob.discount) > 0 && (
                          <tr>
                            <td className="py-1">Discount</td>
                            <td className="text-right py-1">-{(Number(viewingJob.discount) || 0).toFixed(2)}</td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <>
                        {viewingJob.calcItems && viewingJob.calcItems.length > 0 && viewingJob.calcItems.some(i => i.desc) ? (
                          viewingJob.calcItems.filter(i => i.desc).map((p, idx) => (
                            <tr key={idx}>
                              <td className="py-1">{p.desc}</td>
                              <td className="text-right py-1">{(Number(p.amount) || 0).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="py-2 text-slate-500 italic text-center">
                              Reason: {viewingJob.estCostReason || 'N/A'}
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="text-sm space-y-1 mb-6">
                {(viewingJob.status === 'Completed' || viewingJob.status === 'Delivered') ? (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>Rs {((viewingJob.parts || []).reduce((sum, p) => sum + p.sellingPrice, 0) + Number(viewingJob.laborCharge || 0) - Number(viewingJob.discount || 0)).toFixed(2)}</span>
                    </div>
                    {Number(viewingJob.advancePayment) > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Advance Paid:</span>
                        <span>- Rs {Number(viewingJob.advancePayment).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-slate-300">
                      <span>FINAL TOTAL:</span>
                      <span>Rs {Number(viewingJob.finalTotal || 0).toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between font-bold text-lg">
                      <span>EST. TOTAL:</span>
                      <span>Rs {Number(viewingJob.estCost || 0).toFixed(2)}</span>
                    </div>
                    {Number(viewingJob.advancePayment) > 0 && (
                      <div className="flex justify-between text-slate-600 mt-1">
                        <span>ADVANCE PAID:</span>
                        <span>- Rs {Number(viewingJob.advancePayment).toFixed(2)}</span>
                      </div>
                    )}
                    {Number(viewingJob.discount) > 0 && (
                      <div className="flex justify-between text-red-500 mt-1">
                        <span>DISCOUNT:</span>
                        <span>- Rs {Number(viewingJob.discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-slate-300">
                      <span>BALANCE:</span>
                      <span>Rs {Math.max(0, Number(viewingJob.estCost || 0) - Number(viewingJob.advancePayment || 0) - Number(viewingJob.discount || 0)).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center text-xs text-slate-500">
                {!(viewingJob.status === 'Completed' || viewingJob.status === 'Delivered') && (
                  <div className="mb-2">*This is only an estimate.*</div>
                )}
                <div>Thank you for your business!</div>
              </div>
            </div>

            <div className="p-4 bg-slate-100 flex justify-end gap-3 border-t border-slate-200">
              <div className="flex gap-2">
                {viewingJob.whatsapp && (
                  <button
                    onClick={() => {
                      const isComplete = viewingJob.status === 'Completed' || viewingJob.status === 'Delivered';
                      const advance = Number(viewingJob.advancePayment || 0);
                      const disc = Number(viewingJob.discount || 0);
                      const itemsText = [];
                      if (viewingJob.parts && viewingJob.parts.length > 0) {
                        viewingJob.parts.forEach(p => itemsText.push(`- ${p.name}: Rs ${p.sellingPrice.toFixed(2)}`));
                      }
                      if (viewingJob.calcItems && viewingJob.calcItems.length > 0) {
                        viewingJob.calcItems.filter(i => i.desc).forEach(p => itemsText.push(`- ${p.desc}: Rs ${Number(p.amount || 0).toFixed(2)}`));
                      }
                      const itemsString = itemsText.length > 0 ? `\n\nServices & Items:\n${itemsText.join('\n')}\n` : '\n';

                      let msg = '';
                      
                      if (isComplete) {
                        let discountStr = disc > 0 ? `\nDiscount: Rs ${disc.toFixed(2)}` : '';
                        msg = `Hello ${viewingJob.customerName},\n\nYour repair job (Job #${viewingJob.id.slice(0, 6).toUpperCase()}) for ${viewingJob.deviceType} is now ${viewingJob.status}.${itemsString}\nTotal Bill: Rs ${Number(viewingJob.finalTotal || 0).toFixed(2)}${discountStr}\n\nThank you for choosing DESH Digital Hub.`;
                      } else {
                         const balance = Math.max(0, Number(viewingJob.estCost || 0) - advance - disc);
                         let discountStr = disc > 0 ? `\nDiscount: Rs ${disc.toFixed(2)}` : '';
                         msg = `Hello ${viewingJob.customerName},\n\nHere is your repair estimate (Job #${viewingJob.id.slice(0, 6).toUpperCase()}) for ${viewingJob.deviceType}.${itemsString}\nEstimated Cost: Rs ${Number(viewingJob.estCost || 0).toFixed(2)}\nAdvance Paid: Rs ${advance.toFixed(2)}${discountStr}\nBalance: Rs ${balance.toFixed(2)}\n\nThank you for choosing DESH Digital Hub.`;
                      }
                      let formattedNum = viewingJob.whatsapp.replace(/\D/g, '');
                      if (formattedNum.startsWith('0')) formattedNum = '94' + formattedNum.substring(1);
                      window.open(`https://wa.me/${formattedNum}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="px-4 py-2 font-sans font-bold bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-md"
                  >
                     <Send className="w-4 h-4" /> WhatsApp
                  </button>
                )}
                <button
                  onClick={() => setIsViewBillModalOpen(false)}
                  className="px-4 py-2 font-sans font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
              <button
                onClick={() => {
                  if (viewingJob.status === 'Completed' || viewingJob.status === 'Delivered') {
                    printFinalBill(viewingJob);
                  } else {
                    printEstimate(viewingJob);
                  }
                }}
                className="px-4 py-2 font-sans font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-md"
              >
                <Printer className="w-4 h-4" /> Print Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
