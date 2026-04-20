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
  const [activeTab, setActiveTab] = useState<string>('New Lead');
  
  // Call functionality state
  const [callingLead, setCallingLead] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<string>('Idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  
  // Schedule functionality state
  const [schedulingLead, setSchedulingLead] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    type: 'Consultation',
    doctor: 'Dr. Sarah Wilson' // default
  });

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

  // Call Functions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callingLead && callStatus === 'Connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callingLead, callStatus]);

  const startCall = (lead: any) => {
    // Prevent event bubbling if clicking inside card
    setCallingLead(lead);
    setCallStatus('Connecting');
    setCallDuration(0);
    
    // Simulate real call sequence
    setTimeout(() => setCallStatus('Ringing...'), 1500);
    setTimeout(() => {
      setCallStatus('Connected');
      // Set to contacted as a side-effect of picking up
      updateLeadStatus(lead.id, 'Contacted'); 
    }, 4500);
  };

  const endCall = async () => {
    try {
      // Create a simulated call recording entry
      // (Using basic api method since standard ones usually allow generic post)
      await fetch('/api/call-recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          call_id: `C-${Date.now()}`,
          agent_id: 1, // Default agent
          lead_id: callingLead.id,
          duration: callDuration,
          transcription: "Simulated call connected correctly. Discussed services.",
          quality_score: 95,
          feedback: "Great conversation."
        })
      });
      // Add a note mapping back to lead
      await api.updateLead(callingLead.id, { 
        notes: `${callingLead.notes || ''}\n[Call Log: Duration ${formatDuration(callDuration)}]` 
      });
    } catch (error) {
      console.error("Failed to log call:", error);
    }
    
    setCallStatus('Ended');
    setTimeout(() => {
      setCallingLead(null);
      setCallStatus('Idle');
      fetchLeads();
    }, 1500);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Schedule Functions
  const openScheduleModaI = (lead: any) => {
    setSchedulingLead(lead);
    setScheduleData({ ...scheduleData, date: new Date().toISOString().split('T')[0] });
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingLead) return;

    try {
      // Call standard CRM API for appointment
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: schedulingLead.name,
          date: scheduleData.date,
          time: scheduleData.time,
          doctor: scheduleData.doctor,
          type: scheduleData.type,
          branch_id: 1,
          special_instructions: `Scheduled from Leads pipeline.`
        })
      });
      
      // Update the lead status
      await api.updateLead(schedulingLead.id, {
         status: 'Appointment Set',
         follow_up_date: scheduleData.date
      });
      
      setSchedulingLead(null);
      fetchLeads(); // refresh state
    } catch (error) {
      console.error('Error scheduling:', error);
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
    <div className="space-y-6 max-w-7xl mx-auto flex flex-col pb-10">
      
            {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col scale-100 animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                <Target size={20} className="text-emerald-400" /> New Lead
              </h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400 font-medium px-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all placeholder:text-gray-600 shadow-inner"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400 font-medium px-1">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-navy-800/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all placeholder:text-gray-600 shadow-inner"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400 font-medium px-1">Lead Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Snapchat">Snapchat</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Referral">Direct Referral</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400 font-medium px-1">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all placeholder:text-gray-600 resize-none shadow-inner h-24"
                  placeholder="Any specific interests, constraints, or best times to contact..."
                />
              </div>

              <div className="pt-5 mt-2 border-t border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,160,0.3)] hover:shadow-[0_0_20px_rgba(0,229,160,0.5)] flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Create Lead
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
          <div className="sticky -top-8 pt-8 pb-4 z-40 flex flex-wrap gap-4 items-center shrink-0 bg-navy-900/95 backdrop-blur-2xl -mx-4 px-4 rounded-b-2xl border-b border-white/5 shadow-lg">
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
        <div className="flex flex-col flex-1">
          {/* Status Tabs */}
          <div className="sticky top-[68px] z-30 flex items-center justify-start gap-3 overflow-x-auto pb-6 pt-4 hide-scrollbar shrink-0 border-b border-white/5 bg-navy-950/90 backdrop-blur-2xl -mx-4 px-4">
            {columns.map((status) => {
              const count = filteredLeads.filter(l => l.status === status).length;
              const isActive = activeTab === status;
              
              let activeColor = "border-gray-400/50 text-gray-300 bg-gray-500/10";
              let dotColor = "bg-gray-400";
              
              if (status === 'New Lead') { activeColor = "border-blue-500/50 text-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]"; dotColor = "bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"; }
              else if (status === 'Contacted') { activeColor = "border-yellow-500/50 text-yellow-400 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.15)]"; dotColor = "bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.8)]"; }
              else if (status === 'Appointment Set') { activeColor = "border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]"; dotColor = "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"; }
              else if (status === 'Converted') { activeColor = "border-purple-500/50 text-purple-400 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]"; dotColor = "bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]"; }
              else if (status === 'Inactive') { activeColor = "border-red-500/50 text-red-400 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.15)]"; dotColor = "bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.8)]"; }

              return (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border",
                    isActive 
                      ? activeColor 
                      : "border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10 bg-navy-900/50 backdrop-blur-md"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full", isActive ? dotColor : "bg-gray-600")} />
                  <span className="tracking-wide">{status}</span>
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-black",
                    isActive ? "bg-black/20 text-white" : "bg-black/40 text-gray-500 group-hover:text-gray-300"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          <div className="flex-1 pb-32 pt-8 pr-2">
            {columns.filter(c => c === activeTab).map((status) => {
              const columnLeads = filteredLeads.filter(l => l.status === status);

              return (
                <div key={status} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Cards Grid */}
                  {columnLeads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {columnLeads.map(lead => (
                        <div key={lead.id} className="bg-navy-800/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl cursor-pointer group/card hover:border-white/30 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 relative overflow-hidden flex flex-col" onClick={() => handleLeadClick(lead)}>
                          {/* Subdued Glow behind card on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none"></div>
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-cyan-glow/20 to-transparent blur-3xl opacity-0 group-hover/card:opacity-100 transition-duration-500 rounded-full pointer-events-none"></div>
                          
                          <div className="flex items-start justify-between mb-5 relative z-10">
                            <span className={cn(
                              "text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest w-fit shadow-inner border border-white/5",
                              lead.source === 'TikTok' ? "bg-[#00f2fe]/10 text-[#00f2fe]" :
                              lead.source === 'Instagram' ? "bg-[#f5a623]/10 text-[#f5a623]" :
                              lead.source === 'Snapchat' ? "bg-yellow-400/10 text-yellow-400" :
                              lead.source === 'Google Ads' ? "bg-blue-500/10 text-blue-400" :
                              "bg-purple-500/10 text-purple-400"
                            )}>
                              {lead.source}
                            </span>
                            <button className="text-gray-500 hover:text-white opacity-0 group-hover/card:opacity-100 transition-opacity bg-navy-900/80 p-2 rounded-xl border border-white/10 shadow-sm transition-all hover:bg-white/10">
                              <MoreHorizontal size={20} />
                            </button>
                          </div>
                          
                          <div className="flex-1 flex flex-col gap-2 relative z-10 mb-6">
                              <h4 className="font-extrabold text-white text-xl group-hover/card:text-cyan-400 transition-colors drop-shadow-sm truncate">{lead.name}</h4>
                              <div className="flex items-center gap-3 bg-navy-900/50 px-3 py-2 rounded-xl border border-white/5 w-fit mt-2">
                                <Phone size={14} className="text-cyan-400" />
                                <p className="text-sm text-gray-300 font-medium tracking-wide">{lead.phone}</p>
                              </div>
                              {lead.email && (
                                <div className="flex items-center gap-3 bg-navy-900/50 px-3 py-2 rounded-xl border border-white/5 w-fit">
                                  <Mail size={14} className="text-emerald-400" />
                                  <p className="text-sm text-gray-300 font-medium truncate">{lead.email}</p>
                                </div>
                              )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-navy-900/30 border border-white/5">
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">AI Score</span>
                              <div className={cn(
                                "flex items-center gap-1.5",
                                lead.ai_score >= 80 ? "text-emerald-400" :
                                lead.ai_score >= 60 ? "text-yellow-400" :
                                "text-red-400"
                              )}>
                                <BrainCircuit size={16} />
                                <span className="text-base font-black">{lead.ai_score}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-navy-900/30 border border-white/5">
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Priority</span>
                              <div className={cn(
                                "flex items-center gap-1.5 text-sm font-bold",
                                lead.priority === 'High' ? "text-red-400" :
                                lead.priority === 'Medium' ? "text-yellow-400" :
                                "text-blue-400"
                              )}>
                                {lead.priority === 'High' ? <AlertTriangle size={16} /> : lead.priority === 'Medium' ? <Clock size={16} /> : <CheckCircle size={16} />}
                                {lead.priority}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-5 border-t border-white/10 relative z-10">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900/60 border border-white/5">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{lead.last_contact || 'Just now'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2.5 hover:bg-cyan-500/20 rounded-xl text-cyan-400 bg-navy-900/80 border border-white/10 transition-all hover:scale-110 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                                <Phone size={16} />
                              </button>
                              <button className="p-2.5 hover:bg-emerald-500/20 rounded-xl text-emerald-400 bg-navy-900/80 border border-white/10 transition-all hover:scale-110 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                                <CalendarIcon size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-16 bg-navy-800/30 mx-2 mt-8">
                      <div className="w-20 h-20 bg-navy-900/80 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5">
                        <Users size={36} className="text-gray-500" />
                      </div>
                      <p className="text-2xl text-white font-black mb-2 tracking-tight">No leads in {status}</p>
                      <p className="text-base text-gray-500 font-medium">As leads are updated, they will appear here</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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













