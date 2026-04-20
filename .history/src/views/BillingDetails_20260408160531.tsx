import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, User, Building, Phone, Mail, Receipt, AlertCircle, FileText, CheckCircle, BarChart3, TrendingUp, ShieldCheck, Printer, Send, MessageSquare, ListPlus, CreditCard, ChevronDown, RefreshCw, X, FilePlus2, Search, Filter, History, HandHeart, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function BillingDetails({ patientId, onBack, selectedBranch }: { patientId: string | number | null, onBack: () => void, selectedBranch: string }) {
  const [patientInvoices, setPatientInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);
  
  // Modals & New Feature States
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  
  // Filters
  const [dateFilter, setDateFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchDoc, setSearchDoc] = useState('');
  
  useEffect(() => {
    if (patientId) {
      fetchBillingHistory();
    }
  }, [patientId]);

  const fetchBillingHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getInvoices();
      const matchedInvoices = res.filter((inv: any) => String(inv.patient_id) === String(patientId));
      
      const branches = ['Downtown Clinic', 'Marina Center', 'Jumeirah Branch'];
      const finalized = matchedInvoices.map((inv: any, idx: number) => {
         const baseAmount = inv.total_amount || inv.amount || 0;
         const isInsured = idx % 3 === 0;
         const covPercent = isInsured ? 0.7 : 0;
         const covered = Math.floor(baseAmount * covPercent);
         const copay = baseAmount - covered;
         
         return {
           ...inv,
           branch: inv.branch || branches[(inv.id || 0) % branches.length],
           // Mock Itemized line items
           items: [
              { id: 'ITM1', name: 'Specialist Consultation', price: 400 },
              { id: 'ITM2', name: 'Diagnostic Imaging / X-Ray', price: Math.max(0, baseAmount - 400) }
           ],
           // Insurance Mock data
           insurance: isInsured ? {
              provider: 'NextCare',
              status: ['Approved', 'Pending Approval', 'Rejected'][Math.floor(Math.random() * 3)],
              covered,
              copay
           } : null,
           // Mock Timeline events
           timeline: [
             { date: inv.created_at || '2024-01-01', event: 'Invoice Generated via System', by: 'Auto' },
             { date: inv.created_at || '2024-01-02', event: 'Sent via SMS / Email Link', by: 'System' },
             ...(inv.status === 'Paid' ? [{ date: inv.due_date || '2024-01-10', event: `Payment of ${baseAmount} AED Cleared`, by: 'Patient' }] : [])
           ]
         };
      });

      setPatientInvoices(finalized);
      setFilteredInvoices(finalized);

      if (finalized.length > 0) {
        setPatientData({
           name: finalized[0].patient_name,
           phone: finalized[0].patient_phone || '+971 50 XXXXXXX',
           email: `${finalized[0].patient_name.toLowerCase().replace(' ', '.')}@example.com`,
           primaryBranch: finalized[0].branch
        });
      } else {
        setPatientData({ name: `Patient #${patientId}`, phone: 'Unknown', email: 'Unknown', primaryBranch: 'Unknown' });
      }

    } catch (error) {
      console.error("Error fetching patient billing:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run Filters whenever dependency changes
  useEffect(() => {
     let temp = [...patientInvoices];
     
     // General Search
     if (searchDoc) {
        temp = temp.filter(i => String(i.invoice_number || i.id).toLowerCase().includes(searchDoc.toLowerCase()));
     }
     
     // Status Filter
     if (statusFilter !== 'All') {
        temp = temp.filter(i => i.status.toLowerCase() === statusFilter.toLowerCase());
     }
     
     // Date Filter (Simulated logic based on string selection)
     if (dateFilter !== 'All Time') {
        const today = new Date();
        let targetDate = new Date();
        if (dateFilter === 'Today') targetDate.setDate(today.getDate() - 1);
        if (dateFilter === 'This Week') targetDate.setDate(today.getDate() - 7);
        if (dateFilter === 'This Month') targetDate.setMonth(today.getMonth() - 1);
        
        temp = temp.filter(i => {
           if (!i.created_at) return true; // keep if no date
           return new Date(i.created_at) >= targetDate;
        });
     }
     
     setFilteredInvoices(temp);
  }, [searchDoc, statusFilter, dateFilter, patientInvoices]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'Overdue': return "bg-red-500/10 text-red-400 border-red-500/20";
      case 'Unpaid': return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case 'Partially Paid': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const handlePrintPDF = () => {
    window.print(); // Simple mock for PDF printable template
  };

  const handleSendReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Payment Link & SMS Reminder sent instantly via WhatsApp to ${patientData.phone}`);
  };

  // Safe calculated metrics on FILTERED invoices (so KPI updates dynamically!)
  const totalBilled = filteredInvoices.reduce((sum, inv) => sum + (inv.total_amount || inv.amount || 0), 0);
  const totalPaid = filteredInvoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + (inv.total_amount || inv.amount || 0) : sum, 0);
  const outstanding = filteredInvoices.reduce((sum, inv) => inv.status !== 'Paid' ? sum + (inv.total_amount || inv.amount || 0) : sum, 0);

  const paymentTimeline = [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 1500 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 3200 },
    { month: 'May', amount: 800 },
    { month: 'Jun', amount: totalPaid > 5000 ? totalPaid - 5500 : 500 },
  ];
  
  const paymentSources = [
    { name: 'Credit Card', value: 65, color: '#06b6d4' },
    { name: 'Cash', value: 20, color: '#10b981' },
    { name: 'Insurance', value: 15, color: '#8b5cf6' }
  ];

  if (loading) {
    return <GlobalLoader label="Synchronizing Deep Financial Ledgers..." subLabel="Processing secure transactions" />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 fade-in zoom-in-95 animate-in">
      
      {/* --- INVISIBLE PRINT TEMPLATE FOR PDF GENERATION --- */}
      <div className="hidden print:block text-black bg-white p-10 font-sans z-[9999] fixed inset-0 h-screen w-screen absolute">
         <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
            <div>
               <h1 className="text-3xl font-bold text-gray-900 tracking-tight">TAX INVOICE</h1>
               <p className="text-gray-500 mt-1">Invoice ID: {selectedInvoice?.invoice_number || `INV-${String(selectedInvoice?.id).padStart(4, '0')}`}</p>
               <p className="text-gray-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
               <h2 className="text-xl font-bold text-gray-800">{selectedInvoice?.branch || 'AI Clinic Main Branch'}</h2>
               <p className="text-gray-500 text-sm">Dubai Healthcare City, UAE</p>
               <p className="text-gray-500 text-sm">TRN: 100388927490003</p>
            </div>
         </div>
         <div className="mb-8">
            <h3 className="font-bold text-gray-700 text-lg border-b border-gray-200 pb-2 mb-2">Billed To</h3>
            <p className="font-bold text-gray-900">{patientData?.name}</p>
            <p className="text-gray-600">{patientData?.phone}</p>
            <p className="text-gray-600">{patientData?.email}</p>
         </div>
         <table className="w-full text-left border-collapse mb-8">
            <thead>
               <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 border border-gray-300 w-2/3">Description of Services</th>
                  <th className="p-3 border border-gray-300 text-right">Amount (AED)</th>
               </tr>
            </thead>
            <tbody>
               {selectedInvoice?.items?.map((itm: any, i: number) => (
                 <tr key={i}>
                    <td className="p-3 border border-gray-300">{itm.name}</td>
                    <td className="p-3 border border-gray-300 text-right">{itm.price.toLocaleString()}</td>
                 </tr>
               ))}
               <tr className="font-bold text-gray-900 bg-gray-50">
                  <td className="p-3 border border-gray-300 text-right">Total Net Amount:</td>
                  <td className="p-3 border border-gray-300 text-right">{(selectedInvoice?.total_amount || selectedInvoice?.amount || 0).toLocaleString()} AED</td>
               </tr>
            </tbody>
         </table>
         {selectedInvoice?.insurance && (
             <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900 mb-8">
                <strong>Insurance Claim ({selectedInvoice.insurance.provider}):</strong> Covered portion is {selectedInvoice.insurance.covered} AED. Patient Out-of-Pocket Co-Pay is {selectedInvoice.insurance.copay} AED.
             </div>
         )}
         <div className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-200">
             Thank you for trusting our clinic. Please settle the amount before the due date.
         </div>
      </div>
      {/* -------------------------------------------------- */}


      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-navy-800 rounded-xl hover:bg-navy-700 transition-colors text-gray-400 hover:text-white border border-white/5"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
               Patient Finance Portal
            </h1>
            <p className="text-gray-400 text-sm mt-1">Deep analytics, itemization, and payment collections.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            {/* Quick Actions */}
            <button onClick={() => setShowPaymentModal(true)} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-colors flex items-center gap-2 font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
               <CreditCard size={16} /> Record Payment / Installment
            </button>
            <button className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition flex items-center gap-2 font-medium text-sm shadow-lg shrink-0">
               <Download size={16} /> Export Statement CSV
            </button>
        </div>
      </div>

      {/* Patient Identity & Account Standing */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 relative flex flex-col md:flex-row justify-between items-center gap-6 print:hidden overflow-visible">
         <div className="flex items-center gap-5 z-10">
           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
             <User size={28} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                 {patientData?.name}
                 {outstanding === 0 ? 
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">Fully Cleared</span> : 
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">Balance Pending</span>
                 }
             </h2>
             <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1.5 text-gray-400"><Phone size={14} className="text-cyan-500"/> {patientData?.phone}</span>
                <span className="flex items-center gap-1.5 text-gray-400"><Mail size={14} className="text-emerald-500"/> {patientData?.email}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Building size={12}/> Primary: {patientData?.primaryBranch}
                </span>
             </div>
           </div>
         </div>

         {/* Filter System - Integrated neatly inside top panel */}
         <div className="flex gap-2 z-10 bg-navy-900/80 p-2 rounded-xl border border-white/10 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-lg text-sm border border-white/5 relative group hover:border-cyan-glow/30 transition-all cursor-pointer">
              <Calendar size={14} className="text-cyan-400" />
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-transparent text-white outline-none appearance-none pr-4 cursor-pointer">
                <option value="All Time" className="bg-navy-800">All Time History</option>
                <option value="Today" className="bg-navy-800">Today</option>
                <option value="This Week" className="bg-navy-800">This Week</option>
                <option value="This Month" className="bg-navy-800">This Month</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 text-gray-500 pointer-events-none group-hover:text-cyan-glow" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-lg text-sm border border-white/5 relative group hover:border-cyan-glow/30 transition-all cursor-pointer">
              <Filter size={14} className="text-cyan-400" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-white outline-none appearance-none pr-4 cursor-pointer capitalize">
                 {['All', 'Paid', 'Unpaid', 'Overdue'].map(st => <option key={st} value={st} className="bg-navy-800">{st}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 text-gray-500 pointer-events-none group-hover:text-cyan-glow" />
            </div>
         </div>
      </div>

      {/* Deep Analytics Report based on FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col text-center">
            <span className="text-cyan-glow mb-2 flex justify-center"><CheckCircle size={28}/></span>
            <span className="text-3xl font-bold text-white mt-1">{totalPaid.toLocaleString()} <span className="text-sm font-normal text-gray-500 font-mono">AED</span></span>
            <span className="text-gray-400 text-xs uppercase tracking-widest mt-2 border-t border-white/5 pt-2 flex items-center justify-center gap-1"><TrendingUp size={12} className="text-emerald-500" /> Filtered Collected</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col text-center shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <span className="text-yellow-400 mb-2 flex justify-center"><AlertCircle size={28}/></span>
            <span className="text-3xl font-bold text-white mt-1">{outstanding.toLocaleString()} <span className="text-sm font-normal text-gray-500 font-mono">AED</span></span>
            <span className="text-gray-400 text-xs uppercase tracking-widest mt-2 border-t border-white/5 pt-2 flex items-center justify-center gap-1"><AlertCircle size={12} className="text-yellow-500" /> Filtered Outstanding Balance</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col text-center">
            <span className="text-indigo-400 mb-2 flex justify-center"><FileText size={28}/></span>
            <span className="text-3xl font-bold text-white mt-1">{filteredInvoices.length} <span className="text-sm font-normal text-gray-500 font-mono">DOCS</span></span>
            <span className="text-gray-400 text-xs uppercase tracking-widest mt-2 border-t border-white/5 pt-2">Displayed Documents</span>
        </div>
      </div>

      {/* Complex Split Layout: Table vs Sidebar Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:hidden">
         
         {/* Left Side: Itemized Invoices Table */}
         <div className="lg:col-span-3 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
             <div className="flex items-center justify-between border-b border-white/5 pb-4">
               <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
                 <ListPlus size={16} className="text-cyan-glow" /> Document Archive
               </h3>
               {/* Search Specific Doc */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                     type="text"
                     placeholder="Search Doc ID..."
                     value={searchDoc}
                     onChange={e => setSearchDoc(e.target.value)}
                     className="w-48 pl-8 pr-3 py-1.5 bg-navy-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
               </div>
             </div>

            {filteredInvoices.length === 0 ? (
               <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                  <Receipt size={40} className="mb-3 opacity-20" />
                  No documents match your exact filter criteria.
               </div>
            ) : (
               <div className="overflow-x-auto min-h-[300px]">
                 <table className="w-full text-left border-collapse text-sm">
                   <thead>
                     <tr className="text-gray-400 text-xs uppercase tracking-wider">
                       <th className="py-3 px-4 font-medium">Doc ID</th>
                       <th className="py-3 px-4 font-medium">Date Set</th>
                       <th className="py-3 px-4 font-medium">Policy / CoPay</th>
                       <th className="py-3 px-4 font-medium">Amount</th>
                       <th className="py-3 px-4 font-medium">Clearance</th>
                       <th className="py-3 px-4 font-medium text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 relative">
                     {filteredInvoices.map((inv: any, idx: number) => (
                       <tr 
                          key={inv.id || idx} 
                          onClick={() => setSelectedInvoice(inv)}
                          className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                        >
                         <td className="py-4 px-4">
                            <span className="font-mono text-cyan-glow font-bold tracking-wider">{inv.invoice_number || `INV-${String(inv.id).padStart(4, '0')}`}</span>
                            <span className="block text-xs text-gray-500 mt-1">{inv.branch}</span>
                         </td>
                         <td className="py-4 px-4 text-gray-400 whitespace-nowrap">
                            {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : 'N/A'}
                         </td>
                         <td className="py-4 px-4">
                            {inv.insurance ? (
                               <div className="flex flex-col gap-1 items-start">
                                  <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-500/20 font-bold">{inv.insurance.provider}</span>
                                  <span className="text-xs text-gray-400 flex items-center gap-1"><HandHeart size={10} className="text-emerald-500" /> {inv.insurance.covered} AED Cov.</span>
                               </div>
                            ) : (
                               <span className="text-xs text-gray-600 font-mono tracking-widest bg-white/5 px-2 py-1 rounded">Out Of Pocket</span>
                            )}
                         </td>
                         <td className="py-4 px-4 font-bold text-white whitespace-nowrap text-base">
                           {(inv.total_amount || inv.amount || 0).toLocaleString()} <span className="text-xs text-gray-500 font-normal">AED</span>
                         </td>
                         <td className="py-4 px-4">
                           <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border whitespace-nowrap", getStatusBadge(inv.status))}>
                             {inv.status}
                           </span>
                         </td>
                         <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               {inv.status !== 'Paid' && (
                                  <button onClick={(e) => handleSendReminder(String(inv.id), e)} className="p-2 bg-white/5 hover:bg-emerald-500/20 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 transition-all font-medium text-[10px] uppercase flex items-center gap-1" title="Instantly Send SMS Reminder via WhatsApp API">
                                    <MessageSquare size={12} /> Remind
                                  </button>
                               )}
                               <button disabled className="p-2 opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-cyan-glow/20 rounded text-gray-400 hover:text-cyan-glow transition-all" title="View Full Breakdown">
                                 <FilePlus2 size={16} />
                               </button>
                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}
         </div>

         {/* Right Side: Automated Billing Timeline */}
         <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col h-full bg-gradient-to-b from-navy-900/50 to-navy-950">
             <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                <History size={16} className="text-cyan-glow" /> Activity Audit Log
             </h3>
             <div className="flex-1 overflow-y-auto space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                 {paymentTimeline.map((_, i) => (
                    // Mocking generalized system events
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon Marker */}
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-navy-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-cyan-glow/50 relative z-10">
                           {i % 2 === 0 ? <MessageSquare size={10} /> : <CreditCard size={10} />}
                        </div>
                        {/* Box */}
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-white/5 border border-white/5 glass-panel text-xs">
                           <span className="text-gray-500 font-mono mb-1 block">Jan {10 + i}, 2024</span>
                           <span className="text-gray-300 font-medium">{i % 2 === 0 ? 'Document Generation triggers Patient Alert' : 'System records Payment Partial Process'}</span>
                        </div>
                    </div>
                 ))}
             </div>
         </div>

      </div>


      {/* ==== MODALS ==== */}

      {/* Invoice Details / Itemization PDF Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 print:hidden">
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-md" onClick={() => setSelectedInvoice(null)} />
          
          <div className="bg-navy-900 border border-white/20 rounded-2xl w-full max-w-3xl overflow-hidden relative shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/20">
                 <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                       <FileText className="text-cyan-glow" /> Document {selectedInvoice.invoice_number || `INV-${String(selectedInvoice.id).padStart(4, '0')}`}
                    </h2>
                 </div>
                 <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded bg-white/5 hover:bg-white/10"><X size={18} /></button>
             </div>

             <div className="p-6 bg-navy-900/50 flex-1 overflow-y-auto space-y-6">
                
                <div className="flex justify-between items-center p-4 bg-navy-800 rounded-xl border border-white/5">
                   <div>
                      <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-1">State / Clearance</p>
                      <span className={cn("text-xs font-bold px-3 py-1 rounded uppercase tracking-wider border", getStatusBadge(selectedInvoice.status))}>
                         {selectedInvoice.status}
                      </span>
                   </div>
                   <div className="text-right">
                      <p className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-1">Due Date Target</p>
                      <p className="text-white font-medium text-sm">{selectedInvoice.due_date ? new Date(selectedInvoice.due_date).toLocaleDateString() : 'N/A'}</p>
                   </div>
                </div>

                {/* Patient Itemized Line Items */}
                <div className="border border-white/5 rounded-xl overflow-hidden">
                   <div className="bg-black/20 p-3 border-b border-white/5"><h4 className="text-sm font-bold text-gray-300">Itemized Protocol Breakdown</h4></div>
                   <table className="w-full text-sm text-left">
                      <thead>
                         <tr className="border-b border-white/5 text-gray-500 text-xs">
                            <th className="p-3">Reference/Service</th><th className="p-3 text-right">Cost (AED)</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                         {selectedInvoice.items.map((itm: any, idx: number) => (
                           <tr key={idx} className="hover:bg-white/5">
                              <td className="p-3 font-medium text-white">{itm.name} <span className="block text-xs font-mono text-gray-500 mt-0.5">{itm.id}</span></td>
                              <td className="p-3 text-right">{itm.price.toLocaleString()}</td>
                           </tr>
                         ))}
                      </tbody>
                      <tfoot className="bg-navy-800 font-bold border-t-2 border-white/10">
                         {selectedInvoice.insurance && (
                           <>
                              <tr className="text-emerald-400/80 text-xs">
                                 <td className="p-3 text-right">Insurance Contribution ({selectedInvoice.insurance.provider}):</td><td className="p-3 text-right">-{selectedInvoice.insurance.covered.toLocaleString()}</td>
                              </tr>
                              <tr className="text-yellow-400/80 text-xs border-b border-white/5">
                                 <td className="p-3 text-right">Patient Co-Pay Obligation:</td><td className="p-3 text-right">{selectedInvoice.insurance.copay.toLocaleString()}</td>
                              </tr>
                           </>
                         )}
                         <tr className="text-white text-base">
                            <td className="p-4 text-right tracking-wide">NET BILLABLE TOTAL:</td>
                            <td className="p-4 text-right tracking-wider text-cyan-glow">{(selectedInvoice.total_amount || selectedInvoice.amount || 0).toLocaleString()} AED</td>
                         </tr>
                      </tfoot>
                   </table>
                </div>

             </div>

             <div className="p-5 border-t border-white/10 bg-black/40 flex justify-between">
                <button onClick={() => setSelectedInvoice(null)} className="px-5 py-2 text-sm text-gray-400 hover:text-white">Close Inspector</button>
                <div className="flex gap-3">
                   {selectedInvoice.status !== 'Paid' && (
                     <button onClick={(e) => handleSendReminder(String(selectedInvoice.id), e)} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all font-medium text-sm flex items-center gap-2">
                        <MessageSquare size={14}/> Send Pay Link
                     </button>
                   )}
                   <button onClick={handlePrintPDF} className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all font-medium text-sm flex items-center gap-2">
                      <Printer size={14}/> Generate A4 Print
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Process Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 print:hidden">
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-md" onClick={() => setShowPaymentModal(false)} />
          
          <div className="bg-navy-800 border border-white/20 rounded-2xl w-full max-w-sm overflow-hidden relative shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
             <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                 <h2 className="font-bold text-white flex items-center gap-2"><CreditCard size={18} className="text-emerald-500" /> Accept Payment</h2>
                 <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
             </div>
             
             <div className="p-6 space-y-5">
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wide">Collection Amount (AED)</label>
                  <input type="number" placeholder="Enter amount..." value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white text-lg font-bold placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
                  <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1"><AlertCircle size={10}/> Maximum outstanding: {outstanding.toLocaleString()} AED</p>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wide">Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer">
                     <option>Credit Card / POS</option>
                     <option>Cash Collection</option>
                     <option>Bank Transfer (EFT)</option>
                     <option>Tabby Installments</option>
                  </select>
                </div>
             </div>

             <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-white/5 rounded-lg">Cancel</button>
                <button onClick={() => { alert(`Success! Recorded ${paymentAmount} AED via ${paymentMethod}`); setShowPaymentModal(false); }} className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all outline-none">Confirm Auth</button>
             </div>
          </div>
        </div>
      )}


    </div>
  );
}