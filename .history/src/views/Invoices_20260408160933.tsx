import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Filter, Download, CreditCard, Clock, 
  CheckCircle, ArrowRight, Wallet, Receipt, User, Eye, Activity, Building, Briefcase, RefreshCw, X, ReceiptIcon
} from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Invoices({ onPatientSelect, selectedBranch }: { onPatientSelect: (id: number) => void, selectedBranch: string }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats Data
  const [stats, setStats] = useState({
    totalRevenue: 0,
    outstanding: 0,
    overdueAmount: 0,
    paidInvoices: 0,
    unpaidInvoices: 0
  });

  // Example formData for create
  const [formData, setFormData] = useState({
    patient_id: '',
    amount: '',
    status: 'Unpaid',
    due_date: ''
  });

  useEffect(() => {
    fetchInvoices();
  }, [selectedBranch]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.getInvoices();
      const branches = ['Downtown Clinic', 'Marina Center', 'Jumeirah Branch'];
      
      const fetchedInvoices = (res || []).map((inv: any) => ({
        ...inv,
        branch: inv.branch || branches[(inv.id || 0) % branches.length]
      }));

      setInvoices(fetchedInvoices);
      
      let total = 0, outstanding = 0, overdue = 0, paidCount = 0, unpaidCount = 0;
      
      fetchedInvoices.forEach((inv: any) => {
        if (selectedBranch !== 'All Branches' && inv.branch !== selectedBranch) return;

        const amt = inv.total_amount || inv.amount || 0;
        if (inv.status === 'Paid') {
          total += amt;
          paidCount++;
        } else if (inv.status === 'Overdue') {
          overdue += amt;
          outstanding += amt;
          unpaidCount++;
        } else {
          outstanding += amt;
          unpaidCount++;
        }
      });
      
      setStats({
        totalRevenue: total,
        outstanding,
        overdueAmount: overdue,
        paidInvoices: paidCount,
        unpaidInvoices: unpaidCount
      });
      
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.patient_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesBranch = selectedBranch === 'All Branches' || inv.branch === selectedBranch;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case 'Overdue': return "bg-red-500/10 text-red-400 border-red-500/20";
      case 'Unpaid': return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 8900 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <FileText className="text-cyan-glow" />
            Billing & Receivables
          </h1>
          <p className="text-gray-400 mt-1">Comprehensive tracking of all financial transactions matching patients to treatments.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
        >
          <Plus size={16} />
          Generate Invoice
        </button>
      </div>

      {/* KPI Stats Layer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3 relative overflow-hidden">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 relative z-10">
            <Wallet size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-2xl font-bold text-white uppercase">{stats.totalRevenue.toLocaleString()} <span className="text-xs text-gray-500 font-normal">AED</span></p>
            <p className="text-xs text-gray-400">Total Collected</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/10 blur-xl rounded-full" />
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3 relative overflow-hidden">
          <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 relative z-10">
            <Clock size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-2xl font-bold text-white uppercase">{stats.outstanding.toLocaleString()} <span className="text-xs text-gray-500 font-normal">AED</span></p>
            <p className="text-xs text-gray-400">Outstanding Expected</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3 relative overflow-hidden">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 relative z-10">
            <Activity size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-2xl font-bold text-white uppercase">{stats.overdueAmount.toLocaleString()} <span className="text-xs text-gray-500 font-normal">AED</span></p>
            <p className="text-xs text-gray-400">Total Overdue Collections</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3 relative overflow-hidden">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 relative z-10">
            <Receipt size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-2xl font-bold text-white">{stats.paidInvoices} <span className="text-gray-500 font-normal text-base">/ {invoices.length}</span></p>
            <p className="text-xs text-gray-400">Invoices Fully Cleared</p>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">

        {/* Right Side: Data Table */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center shrink-0 w-full justify-between">
            
            {/* Search */}
            <div className="relative flex-1 min-w-[250px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search patient, ID, or invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-navy-900 border border-white/10 rounded-xl text-sm text-white focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-500"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 px-3 py-2 bg-navy-900/80 rounded-xl text-sm border border-white/10 shrink-0 relative overflow-hidden group hover:border-cyan-glow/30 transition-all">
              <Filter size={16} className="text-cyan-glow z-10" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-gray-300 border-none outline-none focus:ring-0 cursor-pointer appearance-none truncate pr-6 z-10"
              >
                <option value="All" className="bg-navy-800">All</option>
                <option value="Paid" className="bg-navy-800">Paid Clear</option>      
                <option value="Unpaid" className="bg-navy-800">Awaiting Payment</option>  
                <option value="Overdue" className="bg-navy-800">Danger Overdue</option>
              </select>
            </div>

          </div>

          <div className="glass-panel overflow-hidden border border-white/5 rounded-2xl">
            {loading ? (
              <div className="flex h-[50vh] items-center justify-center">
                <GlobalLoader label="Validating Invoices..." subLabel="Loading secure ledger" />
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-20 bg-navy-900/50">
                <Receipt className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-lg text-white font-medium">No Invoices Located</h3>
                <p className="text-gray-400 mt-2 text-sm">Ensure parameters are correct to view financial ledgers.</p>
              </div>
            ) : (
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-medium">Invoice Record</th>
                      <th className="py-4 px-6 font-medium">Patient / Branch</th>
                      <th className="py-4 px-6 font-medium">Financial Payload</th>
                      <th className="py-4 px-6 font-medium">Cycle Info</th>
                      <th className="py-4 px-6 font-medium text-center">Ledger State</th>
                      <th className="py-4 px-6 font-medium text-right">Gateways</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredInvoices.map((invoice, idx) => (
                      <tr 
                        key={invoice.id || idx} 
                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => onPatientSelect(invoice.patient_id)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-mono text-cyan-glow font-bold flex items-center gap-1.5"><Receipt size={14}/> {invoice.invoice_number || `INV-${String(invoice.id).padStart(4, '0')}`}</span>
                            <span className="text-xs text-gray-500 mt-1 uppercase tracking-widest">ID: SYS{String(invoice.id).padStart(4, '0')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                               <User size={14} />
                            </div>
                            <div className="flex flex-col">
                               <span className="text-gray-200 font-medium capitalize">{invoice.patient_name || `Patient #${invoice.patient_id}`}</span>
                               <span className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                                  <Building size={10} className="text-cyan-400/70" /> {invoice.branch || 'Unknown Branch'}
                               </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex flex-col">
                              <span className="font-bold text-white flex items-baseline gap-1">{(invoice.total_amount || invoice.amount || 0).toLocaleString()} <span className="text-xs text-emerald-400 font-normal">AED</span></span>
                              {invoice.tax_amount > 0 && <span className="text-xs text-gray-500 mt-0.5">Incl. {(invoice.tax_amount).toLocaleString()} Tax</span>}
                           </div>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex flex-col text-xs space-y-1">
                              <span className="text-gray-300"><span className="text-gray-500 font-mono mr-2">ISSUE</span> {invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : 'N/A'}</span>
                              <span className="text-red-400/80"><span className="text-red-500/50 font-mono mr-2">PAYBY</span> {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</span>
                           </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border",
                            getStatusBadge(invoice.status)
                          )}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 bg-white/5 hover:bg-cyan-glow/20 rounded-lg text-gray-400 hover:text-cyan-glow transition-all" title="View Full Ledger">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 bg-white/5 hover:bg-emerald-500/20 rounded-lg text-gray-400 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30" title="Mark Paid">
                              <CreditCard size={16} />
                            </button>
                            <button className="p-2 bg-white/5 hover:bg-blue-500/20 rounded-lg text-gray-400 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/30" title="Download Official PDF">
                              <Download size={16} />
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
        </div>

      </div>

      {/* Simplified Add Invoice Modal for illustration */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          
          <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden relative shadow-2xl shadow-cyan-900/20 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-navy-900/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ReceiptIcon className="text-cyan-glow" />
                Generate Fast Invoice
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Patient Select</label>
                  <select
                    className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-glow/50 truncate pr-8 cursor-pointer appearance-none"
                  >
                    <option value="">-- Choose Patient --</option>
                    <option value="1">Patient #1 (Sarah M.)</option>
                    <option value="2">Patient #2 (Ahmed K.)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Treatment Amount (AED)</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Due Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-glow/50 transition-all [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Initial Status</label>
                  <select
                    className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-glow/50 truncate pr-8 cursor-pointer appearance-none"
                  >
                    <option value="Unpaid">Unpaid / Awaiting</option>
                    <option value="Paid">Fully Paid Now</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg font-medium"
                >
                  Cancel Process
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-400 hover:to-teal-400 transition-colors font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <CreditCard size={18} />
                  Initiate Billing
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
