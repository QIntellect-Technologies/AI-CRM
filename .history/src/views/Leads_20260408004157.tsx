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

      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Lead Management</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage leads from all marketing channels with AI-powered insights.</p>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="bg-navy-900/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Leads</p>
              <p className="text-2xl font-bold text-white">{totalLeads}</p>
            </div>
            <Users className="w-8 h-8 text-cyan-glow" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400">+12%</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-navy-900/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">New Leads</p>
              <p className="text-2xl font-bold text-white">{newLeads}</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400">+8%</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-navy-900/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Qualified</p>
              <p className="text-2xl font-bold text-white">{qualifiedLeads}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400">+15%</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-navy-900/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">{conversionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400">+5%</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-cyan-glow">Loading leads...</div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 items-center shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search leads by name, phone, or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-input rounded-lg text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm"
            >
              <option value="All">All Status</option>
              <option value="New Lead">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Appointment Set">Appointment Set</option>
              <option value="Converted">Converted</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm"
            >
              <option value="All">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {viewMode === 'board' && (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {columns.map((status) => {
            const columnLeads = filteredLeads.filter(l => l.status === status);
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
                    <div key={lead.id} className="glass-card p-4 rounded-xl cursor-pointer group hover:border-cyan-glow/30" onClick={() => handleLeadClick(lead)}>
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
                          <div className="flex items-center gap-1">
                            <div className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded border",
                              lead.ai_score >= 80 ? "bg-red-500/10 border-red-500/20 text-red-400" :
                              lead.ai_score >= 60 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                              "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            )} title="AI Lead Score">
                              <BrainCircuit size={12} />
                              <span className="text-xs font-bold">{lead.ai_score}</span>
                            </div>
                            <div className={cn(
                              "px-1.5 py-0.5 rounded text-xs font-medium",
                              priorityColors[lead.priority as keyof typeof priorityColors]
                            )} title="Priority">
                              {lead.priority === 'High' ? <AlertTriangle size={10} /> : lead.priority === 'Medium' ? <Clock size={10} /> : <CheckCircle size={10} />}
                            </div>
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
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Last Contact</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="glass-table-row group cursor-pointer" onClick={() => handleLeadClick(lead)}>
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
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateLeadStatus(lead.id, e.target.value);
                      }}
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-md border-0 bg-transparent cursor-pointer",
                        statusColors[lead.status as keyof typeof statusColors]
                      )}
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Appointment Set">Appointment Set</option>
                      <option value="Converted">Converted</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td>
                    <div className={cn(
                      "flex items-center gap-1.5 w-fit px-2 py-1 rounded border",
                      lead.ai_score >= 80 ? "bg-red-500/10 border-red-500/20 text-red-400" :
                      lead.ai_score >= 60 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                      "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    )}>
                      <BrainCircuit size={14} />
                      <span className="text-xs font-bold">{lead.ai_score}</span>
                    </div>
                  </td>
                  <td>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      priorityColors[lead.priority as keyof typeof priorityColors]
                    )}>
                      {lead.priority}
                    </span>
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
          <div className="flex flex-wrap gap-4 items-center shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search leads by name, phone, or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-input rounded-lg text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm"
            >
              <option value="All">All Status</option>
              <option value="New Lead">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Appointment Set">Appointment Set</option>
              <option value="Converted">Converted</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm"
            >
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 glass-input rounded-lg text-sm"
            >
              <option value="All">All Sources</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {viewMode === 'board' && (
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
              {filteredLeads.map((lead) => (
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
