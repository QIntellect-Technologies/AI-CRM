import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LeadStatus } from '../data/mockData';
import { Search, Filter, Plus, MoreHorizontal, BrainCircuit, Clock, Phone, Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Leads() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    source: 'Instagram',
    notes: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    source: 'Instagram',
    notes: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await api.getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addLead(formData);
      setFormData({ name: '', phone: '', source: 'Instagram', notes: '' });
      setShowAddForm(false);
      fetchLeads(); // Refresh data
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleUpdateLead = async (id: number, updates: any) => {
    try {
      await api.updateLead(id, updates);
      fetchLeads(); // Refresh data
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const columns: LeadStatus[] = ['New Lead', 'Contacted', 'Appointment Set', 'Converted', 'Inactive'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      
      {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-white">Add New Lead</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-navy-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-glow focus:outline-none"
                  placeholder="Enter lead name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-navy-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-glow focus:outline-none"
                  placeholder="+971 50 123 4567"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full px-3 py-2 bg-navy-900 border border-white/10 rounded-lg text-white focus:border-cyan-glow focus:outline-none"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Snapchat">Snapchat</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-navy-900 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-glow focus:outline-none resize-none"
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-cyan-glow text-white rounded-lg hover:bg-cyan-glow/90 transition-colors"
                >
                  Add Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Leads Pipeline</h1>
          <p className="text-sm text-gray-400 mt-1">Manage and track your incoming leads from all channels.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-navy-800/50 backdrop-blur-sm border border-white/5 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('board')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                viewMode === 'board' ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              )}
            >
              Board
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                viewMode === 'list' ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              )}
            >
              List
            </button>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30 rounded-lg text-sm font-medium hover:bg-cyan-glow/20 transition-all shadow-[0_0_15px_rgba(0,212,255,0.15)] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <Plus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-cyan-glow">Loading leads...</div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search leads by name, phone, or source..." 
                className="w-full pl-10 pr-4 py-2 glass-input rounded-lg text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 glass-input rounded-lg text-sm font-medium hover:bg-navy-900/80 transition-all">
              <Filter size={16} className="text-gray-400" />
              Filters
            </button>
          </div>

          {viewMode === 'board' && (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {columns.map((status) => {
            const columnLeads = leads.filter(l => l.status === status);
            return (
              <div key={status} className="flex-1 min-w-[300px] flex flex-col glass-panel rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-navy-800/40 backdrop-blur-sm">
                  <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">{status}</h3>
                  <span className="bg-white/5 text-gray-400 text-xs font-mono px-2 py-0.5 rounded-full border border-white/10">
                    {columnLeads.length}
                  </span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 hide-scrollbar">
                  {columnLeads.map(lead => (
                    <div key={lead.id} className="glass-card p-4 rounded-xl cursor-pointer group hover:border-cyan-glow/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit",
                            lead.source === 'TikTok' ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20" :
                            lead.source === 'Instagram' ? "bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20" :
                            lead.source === 'Snapchat' ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20" :
                            lead.source === 'Google Ads' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          )}>
                            {lead.source}
                          </span>
                          <h4 className="font-medium text-white text-sm mt-1">{lead.name}</h4>
                        </div>
                        <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-400 font-mono mb-4">{lead.phone}</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-500" />
                          <span className="text-[10px] text-gray-500">{lead.last_contact || 'Just now'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                            <button className="p-1.5 bg-white/5 hover:bg-cyan-glow/20 rounded text-gray-400 hover:text-cyan-glow transition-colors">
                              <Phone size={12} />
                            </button>
                            <button className="p-1.5 bg-white/5 hover:bg-emerald-glow/20 rounded text-gray-400 hover:text-emerald-glow transition-colors">
                              <CalendarIcon size={12} />
                            </button>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded border",
                            lead.ai_score > 80 ? "bg-red-500/10 border-red-500/20 text-red-400" :
                            lead.ai_score > 50 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                            "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          )} title="AI Lead Score">
                            <BrainCircuit size={12} />
                            <span className="text-xs font-bold">{lead.ai_score}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnLeads.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-6 bg-white/5">
                      <p className="text-sm text-gray-500 text-center font-medium">No leads in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>AI Score</th>
                <th>Assigned To</th>
                <th>Last Contact</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead) => (
                <tr key={lead.id} className="glass-table-row group">
                  <td className="font-medium text-white">{lead.name}</td>
                  <td className="font-mono text-gray-400">{lead.phone}</td>
                  <td>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      lead.source === 'TikTok' ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20" :
                      lead.source === 'Instagram' ? "bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20" :
                      lead.source === 'Snapchat' ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20" :
                      lead.source === 'Google Ads' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    )}>
                      {lead.source}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-medium text-gray-300 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <div className={cn(
                      "flex items-center gap-1.5 w-fit px-2 py-1 rounded border",
                      lead.ai_score > 80 ? "bg-red-500/10 border-red-500/20 text-red-400" :
                      lead.ai_score > 50 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                      "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    )}>
                      <BrainCircuit size={14} />
                      <span className="text-xs font-bold">{lead.ai_score}</span>
                    </div>
                  </td>
                  <td className="text-gray-400 text-sm">{lead.assigned_to || '-'}</td>
                  <td className="text-gray-400 text-sm flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-500" />
                    {lead.last_contact || 'Just now'}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-white/5 hover:bg-cyan-glow/20 rounded text-gray-400 hover:text-cyan-glow transition-colors">
                        <Phone size={14} />
                      </button>
                      <button className="p-1.5 bg-white/5 hover:bg-emerald-glow/20 rounded text-gray-400 hover:text-emerald-glow transition-colors">
                        <CalendarIcon size={14} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </>
      )}
    </div>
  );
}
