import React, { useState, useEffect } from 'react';
import { Command, Workflow, Zap, Plus, Settings2, Trash2, ShieldAlert, MessageCircle, Mail, Smartphone, BellRing, Users, UserCheck, UserX, Crown, Calendar, Target, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';

export function Workflows({ selectedBranch, onWorkflowSelect }: { selectedBranch?: string, onWorkflowSelect?: (id: number) => void }) {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    trigger_type: 'appointment_booked',
    platform: 'whatsapp',
    target_audience: 'all_active',
    action_content: ''
  });

  useEffect(() => {
    fetchWorkflows();
  }, [selectedBranch]);

  const fetchWorkflows = async () => {
    try {
      // setLoading(true);
      const res = await api.getWorkflows();
      setWorkflows(res || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseJson = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'whatsapp': return <MessageCircle size={20} className="text-emerald-400" />;
      case 'email': return <Mail size={20} className="text-blue-400" />;
      case 'sms': return <Smartphone size={20} className="text-orange-400" />;
      case 'push': return <BellRing size={20} className="text-purple-400" />;
      default: return <Zap size={20} className="text-cyan-400" />;
    }
  };

  const getAudienceDisplay = (aud: string) => {
    switch (aud?.toLowerCase()) {
      case 'active': case 'all_active': return { label: 'Active Members', icon: <UserCheck size={14}/>, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'inactive': return { label: 'Inactive Members', icon: <UserX size={14}/>, color: 'text-red-400 bg-red-500/10 border-red-500/20' };
      case 'loyal': case 'vip': return { label: 'Loyal VIPs', icon: <Crown size={14}/>, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
      default: return { label: 'All Audience', icon: <Users size={14}/>, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const conditions = JSON.stringify({ audience: formData.target_audience, platform: formData.platform });
      const actions = JSON.stringify([{ type: 'send_message', content: formData.action_content }]);
      
      const payload = {
        name: formData.name || `Auto ${formData.trigger_type}`,
        trigger_type: formData.trigger_type,
        conditions,
        actions,
        is_active: 1
      };

      if (editingId) {
        // Find existing workflow to preserve its active status
        const existing = workflows.find((w) => w.id === editingId);
        if (existing) {
          payload.is_active = existing.is_active;
        }
        await api.updateWorkflow(editingId, payload);
      } else {
        await api.addWorkflow(payload);
      }

      setShowAddModal(false);
      setEditingId(null);
      setFormData({ name: '', trigger_type: 'appointment_booked', platform: 'whatsapp', target_audience: 'all_active', action_content: '' });
      fetchWorkflows();
    } catch (error) {
      console.error('Failed to save automation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (wf: any) => {
    let cond: any = {};
    let acts: any = [];
    try { cond = JSON.parse(wf.conditions); } catch(e){}
    try { acts = JSON.parse(wf.actions); } catch(e){}

    setFormData({
      name: wf.name || '',
      trigger_type: wf.trigger_type || 'appointment_booked',
      platform: cond?.platform || 'whatsapp',
      target_audience: cond?.audience || 'all_active',
      action_content: (Array.isArray(acts) && acts[0]) ? acts[0].content : ''
    });
    setEditingId(wf.id);
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this automation rule?')) return;
    try {
      await api.deleteWorkflow(id);
      fetchWorkflows();
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  };

  const toggleActiveStatus = async (wf: any) => {
    try {
      await api.updateWorkflow(wf.id, {
        name: wf.name,
        trigger_type: wf.trigger_type,
        conditions: wf.conditions,
        actions: wf.actions,
        is_active: wf.is_active ? 0 : 1
      });
      fetchWorkflows();
    } catch (error) {
      console.error('Failed to update workflow status:', error);
    }
  };

  const currentStats = {
    active: workflows.filter((w) => w.is_active).length,
    whatsapp: workflows.filter((w) => { const c = parseJson(w.conditions); return c?.platform === 'whatsapp' || w.actions?.includes('whatsapp'); }).length,
    inactiveTargets: workflows.filter((w) => { const c = parseJson(w.conditions); return c?.audience === 'inactive'; }).length,
    vipTargets: workflows.filter((w) => { const c = parseJson(w.conditions); return c?.audience === 'loyal' || c?.audience === 'vip'; }).length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Command className="text-emerald-glow" />
            Automations & Workflows
          </h1>
          <p className="text-gray-400 mt-1">Master Automation details across all patient platforms and loyalties.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', trigger_type: 'appointment_booked', platform: 'whatsapp', target_audience: 'all_active', action_content: '' });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
        >
          <Plus size={16} />
          Create Detailed Rule
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{currentStats.active}</p>
            <p className="text-xs text-gray-400">Active Workflows</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <MessageCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{currentStats.whatsapp}</p>
            <p className="text-xs text-gray-400">WhatsApp Rules</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{currentStats.inactiveTargets}</p>
            <p className="text-xs text-gray-400">Targeting Inactive</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
            <Crown size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{currentStats.vipTargets}</p>
            <p className="text-xs text-gray-400">VIP/Loyal Sequences</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-emerald-glow animate-pulse font-medium">Loading detailed automations...</div>
        </div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-white/5">
          <Workflow className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-lg text-white font-medium">No Automations Yet</h3>
          <p className="text-gray-400 mt-2">Start tracking members via custom automation flows.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap size={100} className="text-cyan-glow" />
            </div>
            
            {workflows.map((wf) => {
              let cond: any = null;
              let acts: any = null;
              try { cond = JSON.parse(wf.conditions); } catch(e){}
              try { acts = JSON.parse(wf.actions); } catch(e){}
              
              const platform = cond?.platform || 'system';
              const targetMem = cond?.audience || 'all_active';
              const audienceData = getAudienceDisplay(targetMem);
              
              return (
                <div 
                  key={wf.id} 
                  onClick={() => onWorkflowSelect && onWorkflowSelect(wf.id)}
                  className="bg-navy-900 border border-white/10 rounded-xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-cyan-glow/50 cursor-pointer transition-all relative z-10 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] group"
                >
                  
                  {/* Icon & Details */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-xl bg-navy-800 border border-white/5 mt-1 group-hover:scale-105 transition-transform">
                       {getPlatformIcon(platform)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white capitalize tracking-wide flex items-center gap-2">
                        {wf.name.replace(/_/g, ' ')}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        <span className="text-cyan-glow font-mono bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-md">
                          Trigger: {wf.trigger_type.replace(/_/g, ' ')}
                        </span>
                        <span className={cn("flex items-center gap-1 px-2 py-1 border rounded-md", audienceData.color)}>
                          {audienceData.icon} {audienceData.label}
                        </span>
                        <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded-md border border-gray-700">
                          Via <span className="capitalize font-medium text-white">{platform}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions summary */}
                  <div className="text-sm text-gray-400 lg:w-1/3 p-3 bg-navy-950 rounded-lg border border-white/5">
                    <p className="font-medium text-gray-300 mb-1 flex items-center gap-1">
                       <Target size={14} className="text-emerald-400"/> Action Steps
                    </p>
                    <p className="truncate">
                      {Array.isArray(acts) && acts[0] ? acts[0].content || acts[0].message || (acts[0].type + ' rule') : 'Custom Pipeline Triggered'}
                    </p>
                  </div>

                  {/* Toggles & Options */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => toggleActiveStatus(wf)}
                      className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider border transition-colors",
                        wf.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700"
                      )}>
                      {wf.is_active ? 'Active' : 'Disabled'}
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(wf)}
                        className="p-2 bg-white/5 hover:bg-cyan-glow/20 rounded-md text-gray-400 hover:text-cyan-glow transition-colors"
                        title="Edit Automation"
                      >
                        <Settings2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(wf.id)}
                        className="p-2 bg-white/5 hover:bg-red-500/20 rounded-md text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete Automation"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Form Modal (z-[9999]) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          
          <div className="bg-navy-800 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl shadow-cyan-900/20 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-navy-900/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Workflow className="text-cyan-glow" />
                {editingId ? 'Edit Automation Rule' : 'Create Detailed Automation'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingId(null);
                }} 
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Rule Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Birthday Offer SMS"
                    className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Trigger Event</label>
                  <select
                    value={formData.trigger_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, trigger_type: e.target.value }))}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-glow/50 truncate pr-8 cursor-pointer appearance-none"
                  >
                    <option value="appointment_booked">Appt. Booked</option>
                    <option value="appointment_missed">Appt. Missed</option>
                    <option value="inactivity_detected">Patient Inactive</option>
                    <option value="birthday">Patient Birthday</option>
                    <option value="new_lead_added">New Lead</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Target Member State</label>
                  <select
                    value={formData.target_audience}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-glow/50 truncate pr-8 cursor-pointer appearance-none"
                  >
                    <option value="all_active">Active Members</option>
                    <option value="inactive">Inactive / Lost</option>
                    <option value="loyal">Loyal VIP (10+)</option>
                    <option value="new">New Patients</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Execution Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-glow/50 truncate pr-8 cursor-pointer appearance-none"
                  >
                    <option value="whatsapp">WhatsApp API</option>
                    <option value="sms">SMS Message</option>
                    <option value="email">Email Dispatch</option>
                    <option value="push">Push Notif.</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Action Payload (Message Content)</label>
                <textarea
                  required
                  value={formData.action_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, action_content: e.target.value }))}
                  placeholder={formData.platform === 'whatsapp' ? 'Hi {name}! 🎉 We saw you haven\'t visited in a while...' : 'Enter your message or payload here...'}
                  rows={4}
                  className="w-full bg-navy-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all resize-none"
                ></textarea>
                <p className="text-xs text-emerald-400/70">Tokens supported: {'{name}'}, {'{branch}'}, {'{date}'}</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                  }}
                  className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-400 hover:to-teal-400 transition-colors font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <Zap size={18} />
                  )}
                  {isSubmitting ? 'Saving...' : (editingId ? 'Save Changes' : 'Deploy Automation')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
