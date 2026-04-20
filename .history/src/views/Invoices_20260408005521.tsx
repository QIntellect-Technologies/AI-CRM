import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Download, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';

export function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.getInvoices();
      setInvoices(res || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <FileText className="text-cyan-glow" />
            Billing & Invoices
          </h1>
          <p className="text-gray-400 mt-1">Manage patient billing and payment tracking</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <Plus size={16} />
          Create Invoice
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-cyan-glow animate-pulse">Loading billing data...</div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 items-center shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 glass-panel rounded-xl text-sm border-white/5">
              <Filter size={16} className="text-cyan-glow" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-gray-300 border-none outline-none focus:ring-0 cursor-pointer"
              >
                <option value="All" className="bg-navy-800">All Status</option>
                <option value="Paid" className="bg-navy-800">Paid</option>
                <option value="Unpaid" className="bg-navy-800">Unpaid</option>
                <option value="Overdue" className="bg-navy-800">Overdue</option>
              </select>
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden mt-4">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Patient ID / Name</th>
                  <th>Amount (AED)</th>
                  <th>Date Issued</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="glass-table-row group">
                    <td className="font-mono text-cyan-glow">{invoice.invoice_number}</td>
                    <td className="text-gray-300">Patient {invoice.patient_id}</td>
                    <td className="font-bold text-white">{(invoice.total_amount || invoice.amount || 0).toLocaleString()} AED</td>
                    <td className="text-gray-400 text-sm">{invoice.issue_date?.split('T')[0] || 'N/A'}</td>
                    <td className="text-gray-400 text-sm">{invoice.due_date?.split('T')[0] || 'N/A'}</td>
                    <td>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border",
                        invoice.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        invoice.status === 'Overdue' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      )}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-white/5 hover:bg-cyan-glow/20 rounded text-gray-400 hover:text-cyan-glow transition-colors">
                          <Download size={14} />
                        </button>
                        <button className="p-1.5 bg-white/5 hover:bg-emerald-glow/20 rounded text-gray-400 hover:text-emerald-glow transition-colors">
                          <CheckCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}