import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, User, Building, MapPin, Phone, Mail, Receipt, Calendar, CreditCard, Filter, AlertCircle, FileText, CheckCircle, BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function BillingDetails({ patientId, onBack, selectedBranch }: { patientId: string | number | null, onBack: () => void, selectedBranch: string }) {
  const [patientInvoices, setPatientInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);
  
  useEffect(() => {
    if (patientId) {
      fetchBillingHistory();
    }
  }, [patientId]);

  const fetchBillingHistory = async () => {
    try {
      setLoading(true);
      
      // Simulate real API cascade
      const res = await api.getInvoices();
      const matchedInvoices = res.filter((inv: any) => String(inv.patient_id) === String(patientId));
      
      const branches = ['Downtown Clinic', 'Marina Center', 'Jumeirah Branch'];
      const finalized = matchedInvoices.map((inv: any) => ({
        ...inv,
        branch: inv.branch || branches[(inv.id || 0) % branches.length]
      }));

      setPatientInvoices(finalized);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'Overdue': return "bg-red-500/10 text-red-400 border-red-500/20";
      case 'Unpaid': return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case 'Partially Paid': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  // Safe calculated metrics
  const totalBilled = patientInvoices.reduce((sum, inv) => sum + (inv.total_amount || inv.amount || 0), 0);
  const totalPaid = patientInvoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + (inv.total_amount || inv.amount || 0) : sum, 0);
  const outstanding = patientInvoices.reduce((sum, inv) => inv.status !== 'Paid' ? sum + (inv.total_amount || inv.amount || 0) : sum, 0);

  // Mocked Chart Data
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
    return (
      <div className="flex h-full items-center justify-center text-cyan-glow gap-3">
        <Receipt className="animate-pulse" size={24} />
        Compiling Financial Statement...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 fade-in zoom-in-95 animate-in">
      
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-navy-800 rounded-xl hover:bg-navy-700 transition-colors text-gray-400 hover:text-white border border-white/5"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
               Patient Ledger Statement
            </h1>
            <p className="text-gray-400 text-sm">Comprehensive lifetime billing report</p>
          </div>
        </div>
        
        <button className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition flex items-center gap-2 font-medium text-sm shadow-lg">
          <Download size={16} /> Download Full Statement
        </button>
      </div>

      {/* Patient Identity & Branches */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/10 blur-[80px] rounded-full pointer-events-none" />
         
         <div className="flex items-center gap-5 z-10">
           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
             <User size={28} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-white uppercase tracking-wide">{patientData?.name}</h2>
             <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1.5 text-gray-400"><Phone size={14} className="text-cyan-500"/> {patientData?.phone}</span>
                <span className="flex items-center gap-1.5 text-gray-400"><Mail size={14} className="text-emerald-500"/> {patientData?.email}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Building size={12}/> Primary: {patientData?.primaryBranch}
                </span>
             </div>
           </div>
         </div>

         <div className="flex items-center gap-4 z-10 w-full md:w-auto">
            <div className="px-5 py-3 rounded-xl bg-navy-900/80 border border-white/5 flex flex-col">
               <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Account Status</span>
               <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-1"><ShieldCheck size={16}/> Good Standing</span>
            </div>
            <div className="px-5 py-3 rounded-xl bg-navy-900/80 border border-white/5 flex flex-col">
               <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Lifetime Value</span>
               <span className="text-white font-bold tracking-wider mt-1">{totalBilled.toLocaleString()} <span className="text-xs text-gray-500">AED</span></span>
            </div>
         </div>
      </div>

      {/* Deep Analytics Report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col text-center">
            <span className="text-cyan-glow mb-2 flex justify-center"><CheckCircle size={28}/></span>
            <span className="text-3xl font-bold text-white mt-1">{totalPaid.toLocaleString()} <span className="text-sm font-normal text-gray-500 font-mono">AED</span></span>
            <span className="text-gray-400 text-xs uppercase tracking-widest mt-2 border-t border-white/5 pt-2">Successfully Collected</span>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col text-center">
            <span className="text-yellow-400 mb-2 flex justify-center"><AlertCircle size={28}/></span>
            <span className="text-3xl font-bold text-white mt-1">{outstanding.toLocaleString()} <span className="text-sm font-normal text-gray-500 font-mono">AED</span></span>
            <span className="text-gray-400 text-xs uppercase tracking-widest mt-2 border-t border-white/5 pt-2">Outstanding Balance</span>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col text-center">
            <span className="text-indigo-400 mb-2 flex justify-center"><FileText size={28}/></span>
            <span className="text-3xl font-bold text-white mt-1">{patientInvoices.length} <span className="text-sm font-normal text-gray-500 font-mono">DOCS</span></span>
            <span className="text-gray-400 text-xs uppercase tracking-widest mt-2 border-t border-white/5 pt-2">Total Issued Invoices</span>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payment History Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 lg:col-span-2 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 tracking-wide uppercase">
               <TrendingUp size={16} className="text-emerald-400" /> Payment Trajectory
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={paymentTimeline} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Source Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 lg:col-span-1 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 tracking-wide uppercase">
               <BarChart3 size={16} className="text-indigo-400" /> Revenue Channels
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
               <div className="h-[160px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentSources}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {paymentSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                 </ResponsiveContainer>
               </div>
               {/* Label Legend */}
               <div className="w-full flex justify-between px-2 mt-4 text-xs font-medium">
                  {paymentSources.map(src => (
                     <div key={src.name} className="flex flex-col items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: src.color }} />
                        <span className="text-gray-400">{src.name}</span>
                     </div>
                  ))}
               </div>
            </div>
        </div>

      </div>

      {/* Standard Ledger Document List */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
             <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-cyan-glow" /> Official Invoices
             </h3>
             <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 mr-2">Sort By:</span>
                <select className="bg-navy-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-cyan-500/50">
                  <option>Latest First</option>
                  <option>Amount: High to Low</option>
                  <option>Status: Pending</option>
                </select>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Doc Number</th>
                  <th className="py-3 px-4 font-medium">Processing Branch</th>
                  <th className="py-3 px-4 font-medium">Date Set</th>
                  <th className="py-3 px-4 font-medium">Net Amount</th>
                  <th className="py-3 px-4 font-medium text-center">Auth Status</th>
                  <th className="py-3 px-4 font-medium text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {patientInvoices.map((inv: any, idx: number) => (
                  <tr key={inv.id || idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 px-4">
                       <span className="font-mono text-cyan-glow flex items-center gap-1.5"><Receipt size={14}/> {inv.invoice_number || `INV-${String(inv.id).padStart(4, '0')}`}</span>
                    </td>
                    <td className="py-3 px-4">
                       <span className="flex items-center gap-1.5 text-gray-300 bg-white/5 w-max px-2.5 py-1 rounded-md border border-white/5">
                         <Building size={12} className="text-emerald-400" /> {inv.branch}
                       </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                       {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {(inv.total_amount || inv.amount || 0).toLocaleString()} <span className="text-xs text-gray-500 font-normal">AED</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border", getStatusBadge(inv.status))}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                       <button className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/5 hover:bg-cyan-glow/20 rounded text-gray-400 hover:text-cyan-glow transition-all">
                         <Download size={14} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}