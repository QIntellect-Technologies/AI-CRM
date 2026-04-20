import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LeadStatus } from '../data/mockData';
import { Search, Filter, Plus, MoreHorizontal, BrainCircuit, Clock, Phone, Calendar as CalendarIcon, X, Star, AlertTriangle, CheckCircle, Users, TrendingUp, Target } from 'lucide-react';
import { cn } from '../lib/utils';

const statusColors = {
  'New Lead': 'bg-blue-500/20 text-blue-400',
  'Contacted': 'bg-yellow-500/20 text-yellow-400',
  'Appointment Set': 'bg-green-500/20 text-green-400',
  'Converted': 'bg-purple-500/20 text-purple-400',
  'Inactive': 'bg-red-500/20 text-red-400'
};

const priorityColors = {
  'High': 'bg-red-500/20 text-red-400',
  'Medium': 'bg-yellow-500/20 text-yellow-400',
  'Low': 'bg-gray-500/20 text-gray-400'
};

export function Leads() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    source: 'Instagram',
    notes: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter(lead => lead.priority === priorityFilter);
    }

    if (sourceFilter !== 'All') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, priorityFilter, sourceFilter]);

  const fetchLeads = async () => {
    try {
      const data = await api.getLeads();
      setLeads(data);
      setFilteredLeads(data);
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

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const columns: LeadStatus[] = ['New Lead', 'Contacted', 'Appointment Set', 'Converted', 'Inactive'];

  // Calculate statistics
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => lead.status === 'New Lead').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'Appointment Set').length;
  const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  const sources = [...new Set(leads.map(lead => lead.source))];

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

      {/* Lead Detail Modal */}
      {isLeadModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold text-white">Lead Details</h2>
                <button
                  onClick={() => setIsLeadModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-cyan-glow/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-cyan-glow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedLead.name}</h3>
                    <p className="text-gray-400">{selectedLead.interests}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                    <p className="text-white">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <p className="text-white">{selectedLead.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">AI Score</label>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        selectedLead.ai_score >= 80 ? "bg-green-500/20 text-green-400" :
                        selectedLead.ai_score >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      )}>
                        {selectedLead.ai_score}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      priorityColors[selectedLead.priority as keyof typeof priorityColors]
                    )}>
                      {selectedLead.priority}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Source</label>
                    <p className="text-white">{selectedLead.source}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      statusColors[selectedLead.status as keyof typeof statusColors]
                    )}>
                      {selectedLead.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                  <p className="text-white bg-navy-900 p-3 rounded-lg">{selectedLead.notes || 'No notes available'}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30 rounded-lg hover:bg-cyan-glow/20 transition-all">
                    <Phone size={16} />
                    Call
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all">
                    <CalendarIcon size={16} />
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between shrink-0 mb-2 mt-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-cyan-glow/20 to-blue-500/20 border border-cyan-glow/30 rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            <Target size={24} className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,212,255,1)]" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] tracking-tight">Lead Pipeline</h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">Manage and qualify incoming prospects</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-navy-800/80 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-lg">
            <button 
              onClick={() => setViewMode('board')}
              className={cn(
                "px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
                viewMode === 'board' ? "bg-gradient-to-r from-cyan-glow/20 to-blue-500/20 text-white shadow-sm border border-cyan-glow/30" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              )}
            >
              <Target size={14} /> Board
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
                viewMode === 'list' ? "bg-gradient-to-r from-cyan-glow/20 to-blue-500/20 text-white shadow-sm border border-cyan-glow/30" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              )}
            >
              <Users size={14} /> List
            </button>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,160,0.3)] hover:shadow-[0_0_20px_rgba(0,229,160,0.5)] text-sm ml-2">
            <Plus size={16} />
            New Lead
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 relative z-10">
        <div className="glass-panel p-6 rounded-2xl group relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-cyan-glow/30 transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-glow/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-cyan-glow/10 border border-cyan-glow/20 rounded-xl">
              <Users className="w-6 h-6 text-cyan-glow drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">+12%</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Pipeline</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{totalLeads}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl group relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-blue-500/30 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <Target className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">+8%</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">New & Active</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{newLeads}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl group relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-emerald-500/30 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">+15%</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Qualified Set</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{qualifiedLeads}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl group relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-purple-500/30 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">+5%</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Conversion Rate</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{conversionRate}%</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-cyan-glow">Loading leads...</div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 items-center shrink-0 bg-navy-800/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-glow" size={18} />
              <input 
                type="text" 
                placeholder="Search leads by name, phone, or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-navy-900/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all placeholder:text-gray-500 text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-navy-900/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all text-white appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="All">All Pipeline Stages</option>
              <option value="New Lead">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Appointment Set">Appointment Set</option>
              <option value="Converted">Converted</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 bg-navy-900/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-white appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-3 bg-navy-900/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/50 transition-all text-white appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="All">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {viewMode === 'board' && (
        <div className="flex-1 flex gap-5 overflow-x-auto pb-6 pt-2 hide-scrollbar">
          {columns.map((status) => {
            const columnLeads = filteredLeads.filter(l => l.status === status);
            
            // Status-based styling for columns
            let statusColor = "from-gray-500/20 to-transparent border-gray-500/20 text-gray-400";
            let glowColor = "shadow-[0_0_15px_rgba(156,163,175,0.1)]";
            let dropShadow = "drop-shadow-[0_0_5px_rgba(156,163,175,0.8)]";
            
            if (status === 'New Lead') {
              statusColor = "from-blue-500/20 to-transparent border-blue-500/30 text-blue-400";
              glowColor = "shadow-[0_0_15px_rgba(59,130,246,0.15)]";
              dropShadow = "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]";
            } else if (status === 'Contacted') {
              statusColor = "from-yellow-400/20 to-transparent border-yellow-400/30 text-yellow-400";
              glowColor = "shadow-[0_0_15px_rgba(250,204,21,0.15)]";
              dropShadow = "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]";
            } else if (status === 'Appointment Set') {
              statusColor = "from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400";
              glowColor = "shadow-[0_0_15px_rgba(16,185,129,0.15)]";
              dropShadow = "drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]";
            } else if (status === 'Converted') {
              statusColor = "from-purple-500/20 to-transparent border-purple-500/30 text-purple-400";
              glowColor = "shadow-[0_0_15px_rgba(168,85,247,0.15)]";
              dropShadow = "drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]";
            } else if (status === 'Inactive') {
              statusColor = "from-red-500/20 to-transparent border-red-500/30 text-red-500";
              glowColor = "shadow-[0_0_15px_rgba(239,68,68,0.1)]";
              dropShadow = "drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]";
            }

            return (
              <div key={status} className={cn("flex-1 min-w-[320px] max-w-[350px] flex flex-col glass-panel rounded-2xl overflow-hidden relative group", glowColor)}>
                <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", statusColor)}></div>
                
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-navy-800/60 backdrop-blur-md relative z-10">
                  <h3 className={cn("font-heading font-extrabold text-sm uppercase tracking-widest", statusColor.split(' ')[4], dropShadow)}>
                    {status}
                  </h3>
                  <span className="bg-navy-900/80 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 shadow-inner">
                    {columnLeads.length}
                  </span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 hide-scrollbar bg-navy-900/20 relative z-10">
                  {columnLeads.map(lead => (
                    <div key={lead.id} className="bg-navy-800/80 backdrop-blur-sm border border-white/5 p-5 rounded-2xl cursor-pointer group/card hover:border-cyan-glow/40 transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:-translate-y-1 relative overflow-hidden" onClick={() => handleLeadClick(lead)}>
                      {/* Subdued Glow behind card on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"></div>
                      
                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="flex flex-col gap-2">
                          <span className={cn(
                            "text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest w-fit shadow-sm",
                            lead.source === 'TikTok' ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20" :
                            lead.source === 'Instagram' ? "bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/30" :
                            lead.source === 'Snapchat' ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20" :
                            lead.source === 'Google Ads' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          )}>
                            {lead.source}
                          </span>
                          <h4 className="font-bold text-white text-base mt-2 group-hover/card:text-cyan-glow transition-colors">{lead.name}</h4>
                        </div>
                        <button className="text-gray-500 hover:text-white opacity-0 group-hover/card:opacity-100 transition-opacity bg-navy-900/50 p-1.5 rounded-lg border border-white/10">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-5 relative z-10">
                        <Phone size={14} className="text-gray-500" />
                        <p className="text-xs text-gray-400 font-mono">{lead.phone}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                        <div className="flex items-center gap-1.5 bg-navy-900/60 px-2 py-1 rounded-md border border-white/5">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-[10px] font-medium text-gray-300">{lead.last_contact || 'Just now'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity mr-2">
                            <button className="p-1.5 bg-cyan-glow/10 hover:bg-cyan-glow/20 border border-cyan-glow/20 rounded-md text-cyan-glow transition-all hover:scale-110">
                              <Phone size={12} />
                            </button>
                            <button className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md text-emerald-400 transition-all hover:scale-110">
                              <CalendarIcon size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-md border shadow-sm",
                              lead.ai_score >= 80 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                              lead.ai_score >= 60 ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                              "bg-red-500/10 border-red-500/30 text-red-400"
                            )} title="AI Lead Score">
                              <BrainCircuit size={12} />
                              <span className="text-[11px] font-black">{lead.ai_score}</span>
                            </div>
                            <div className={cn(
                              "w-6 h-6 flex items-center justify-center rounded-md border shadow-sm",
                              priorityColors[lead.priority as keyof typeof priorityColors].replace('text-', 'text-').replace('bg-', 'bg-').split(' ')[0],
                              priorityColors[lead.priority as keyof typeof priorityColors].split(' ')[1].replace('text-', 'border-').replace('400', '500/30'), // Generate matching border
                              priorityColors[lead.priority as keyof typeof priorityColors].split(' ')[1]
                            )} title={`Priority: ${lead.priority}`}>
                              {lead.priority === 'High' ? <AlertTriangle size={12} /> : lead.priority === 'Medium' ? <Clock size={12} /> : <CheckCircle size={12} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnLeads.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-8 bg-white/5">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                        <Users size={20} className="text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-400 text-center font-medium">No leads in pipeline</p>
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
        <div className="glass-panel p-4 rounded-3xl overflow-hidden mt-4 relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-glow/10 to-transparent blur-3xl opacity-50 z-0 pointer-events-none"></div>
          <div className="overflow-x-auto relative z-10 hide-scrollbar pb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 uppercase tracking-widest text-[10px] text-gray-400">
                  <th className="p-4 font-bold">Name</th>
                  <th className="p-4 font-bold">Phone</th>
                  <th className="p-4 font-bold">Source</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">AI Score</th>
                  <th className="p-4 font-bold">Priority</th>
                  <th className="p-4 font-bold">Last Contact</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="group/row hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleLeadClick(lead)}>
                    <td className="p-4 font-semibold text-white group-hover/row:text-cyan-glow transition-colors">{lead.name}</td>
                    <td className="p-4 font-mono text-gray-400 text-sm">{lead.phone}</td>
                    <td className="p-4">
                      <span className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm",
                        lead.source === 'TikTok' ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20" :
                        lead.source === 'Instagram' ? "bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/30" :
                        lead.source === 'Snapchat' ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20" :
                        lead.source === 'Google Ads' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      )}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateLeadStatus(lead.id, e.target.value);
                        }}
                        className={cn(
                          "text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity appearance-none shadow-sm",
                          lead.status === 'New Lead' ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                          lead.status === 'Contacted' ? "bg-yellow-400/10 border-yellow-400/30 text-yellow-400" :
                          lead.status === 'Appointment Set' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                          lead.status === 'Converted' ? "bg-purple-500/10 border-purple-500/30 text-purple-400" :
                          "bg-red-500/10 border-red-500/30 text-red-500"
                        )}
                      >
                        <option value="New Lead" className="bg-navy-900">New Lead</option>
                        <option value="Contacted" className="bg-navy-900">Contacted</option>
                        <option value="Appointment Set" className="bg-navy-900">Appointment Set</option>
                        <option value="Converted" className="bg-navy-900">Converted</option>
                        <option value="Inactive" className="bg-navy-900">Inactive</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className={cn(
                        "flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md border shadow-sm",
                        lead.ai_score >= 80 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                        lead.ai_score >= 60 ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                        "bg-red-500/10 border-red-500/30 text-red-400"
                      )} title="AI Lead Score">
                        <BrainCircuit size={14} />
                        <span className="text-xs font-black">{lead.ai_score}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={cn(
                        "flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md border shadow-sm",
                        lead.priority === 'High' ? "bg-red-500/10 border-red-500/30 text-red-400" :
                        lead.priority === 'Medium' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
                        "bg-gray-500/10 border-gray-500/30 text-gray-400"
                      )}>
                        {lead.priority === 'High' ? <AlertTriangle size={12} /> : lead.priority === 'Medium' ? <Clock size={12} /> : <CheckCircle size={12} />}
                        <span className="text-xs font-bold uppercase tracking-wider">{lead.priority}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400 font-medium">
                      {lead.last_contact || 'Just now'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <button className="p-2 bg-cyan-glow/10 border border-cyan-glow/20 rounded-lg text-cyan-glow hover:bg-cyan-glow/20 transition-colors shadow-sm" title="Call Lead">
                          <Phone size={14} />
                        </button>
                        <button className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-sm" title="Schedule Appointment">
                          <CalendarIcon size={14} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-white transition-colors" title="More Options">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* End of view modes */}
        </>
      )}
    </div>
  );
}
