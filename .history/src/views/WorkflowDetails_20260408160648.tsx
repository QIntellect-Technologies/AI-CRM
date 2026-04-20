import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ArrowLeft, Workflow, MessageCircle, Mail, Smartphone, BellRing, UserCheck, 
  UserX, Crown, Users, Zap, CheckCircle2, Activity, PlayCircle, Clock 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function WorkflowDetails({ workflowId, onBack }: { workflowId: string | number | null, onBack: () => void }) {
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock engagement data for the charts
  const [engagementData] = useState([
    { day: 'Mon', sent: 120, opened: 90, clicked: 40, conversions: 12 },
    { day: 'Tue', sent: 150, opened: 110, clicked: 55, conversions: 18 },
    { day: 'Wed', sent: 180, opened: 130, clicked: 70, conversions: 25 },
    { day: 'Thu', sent: 140, opened: 95, clicked: 45, conversions: 15 },
    { day: 'Fri', sent: 200, opened: 160, clicked: 85, conversions: 30 },
    { day: 'Sat', sent: 220, opened: 180, clicked: 100, conversions: 35 },
    { day: 'Sun', sent: 190, opened: 150, clicked: 80, conversions: 28 },
  ]);

  useEffect(() => {
    if (!workflowId) return;

    const fetchWorkflowData = async () => {
      try {
        setLoading(true);
        const workflowsData = await api.getWorkflows();
        const selectedWorkflow = workflowsData.find((w: any) => w.id === workflowId || w.id === Number(workflowId));
        setWorkflow(selectedWorkflow);
      } catch (error) {
        console.error('Error fetching workflow details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowData();
  }, [workflowId]);

  if (loading) {
    return <GlobalLoader label="Loading Detailed Metrics..." subLabel="Fetching automation sequence traces" />;
  }

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Workflow size={64} className="text-gray-600 mb-4" />
        <h2 className="text-xl font-medium text-white">Workflow Not Found</h2>
        <p className="text-gray-400 mt-2">The requested automation rule could not be loaded.</p>
        <button 
          onClick={onBack}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const parseJson = (str: string) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  };

  let cond = parseJson(workflow.conditions);
  let acts = parseJson(workflow.actions);
  const platform = cond?.platform || 'whatsapp';
  const audience = cond?.audience || 'all_active';

  const getPlatformDisplay = (plat: string) => {
    switch (plat?.toLowerCase()) {
      case 'whatsapp': return { icon: <MessageCircle size={28} />, label: 'WhatsApp', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
      case 'email': return { icon: <Mail size={28} />, label: 'Email Dispatch', color: 'text-blue-400', bg: 'bg-blue-500/10' };
      case 'sms': return { icon: <Smartphone size={28} />, label: 'SMS Message', color: 'text-orange-400', bg: 'bg-orange-500/10' };
      case 'push': return { icon: <BellRing size={28} />, label: 'Push Notification', color: 'text-purple-400', bg: 'bg-purple-500/10' };
      default: return { icon: <Zap size={28} />, label: 'System Action', color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    }
  };

  const getAudienceDisplay = (aud: string) => {
    switch (aud?.toLowerCase()) {
      case 'active': case 'all_active': return { label: 'Active Members', icon: <UserCheck size={18}/>, color: 'text-emerald-400' };
      case 'inactive': return { label: 'Inactive / Lost', icon: <UserX size={18}/>, color: 'text-red-400' };
      case 'loyal': case 'vip': return { label: 'Loyal VIP (10+ Visits)', icon: <Crown size={18}/>, color: 'text-yellow-400' };
      case 'new': return { label: 'New Patients (0 Visits)', icon: <Activity size={18}/>, color: 'text-blue-400' };
      default: return { label: 'All Audience', icon: <Users size={18}/>, color: 'text-cyan-400' };
    }
  };

  const platformData = getPlatformDisplay(platform);
  const audienceData = getAudienceDisplay(audience);
  const totalSent = engagementData.reduce((acc, curr) => acc + curr.sent, 0);
  const totalOpened = engagementData.reduce((acc, curr) => acc + curr.opened, 0);
  const totalClicked = engagementData.reduce((acc, curr) => acc + curr.clicked, 0);
  const openRate = ((totalOpened / totalSent) * 100).toFixed(1);
  const clickRate = ((totalClicked / totalOpened) * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      
      {/* Top Header */}
      <div className="flex items-center justify-between bg-navy-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden z-10">
        <div className="absolute -right-10 -top-10 opacity-10 blur-xl">
          {platformData.icon}
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-5">
            <div className={cn("p-4 rounded-2xl border border-white/10", platformData.bg, platformData.color)}>
              {platformData.icon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-wide">
                  {workflow.name.replace(/_/g, ' ')}
                </h1>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                  workflow.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-gray-800 text-gray-500 border-gray-700"
                )}>
                  {workflow.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <PlayCircle size={14} className="text-cyan-400" />
                  Trigger: <strong className="text-white capitalize">{workflow.trigger_type.replace(/_/g, ' ')}</strong>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 flex items-center gap-1.5">
                  Target: <strong className={cn("flex items-center gap-1", audienceData.color)}>{audienceData.icon} {audienceData.label}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1 flex items-center justify-end gap-2">
            <Clock size={14} /> Created
          </div>
          <div className="text-white font-medium">
            {new Date(workflow.created_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
           <div className="flex items-center justify-between">
             <p className="text-sm text-gray-400 font-medium">Total Messages Sent</p>
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><MessageCircle size={18}/></div>
           </div>
           <p className="text-3xl font-bold text-white mt-4">{totalSent.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
           <div className="flex items-center justify-between">
             <p className="text-sm text-gray-400 font-medium">Unique Opens</p>
             <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><CheckCircle2 size={18}/></div>
           </div>
           <p className="text-3xl font-bold text-white mt-4">{totalOpened.toLocaleString()}</p>
           <p className="text-xs text-emerald-400 mt-2 font-medium">{openRate}% Open Rate</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
           <div className="flex items-center justify-between">
             <p className="text-sm text-gray-400 font-medium">Total Clicks</p>
             <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Activity size={18}/></div>
           </div>
           <p className="text-3xl font-bold text-white mt-4">{totalClicked.toLocaleString()}</p>
           <p className="text-xs text-cyan-400 mt-2 font-medium">{clickRate}% CTR</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
           <div className="flex items-center justify-between">
             <p className="text-sm text-gray-400 font-medium">Platform Used</p>
           </div>
           <div className={cn("text-2xl font-bold mt-4 flex items-center gap-2", platformData.color)}>
              {platformData.label}
           </div>
           <p className="text-xs text-gray-500 mt-2 font-medium">Execution Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart View */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/5 p-6 relative">
          <div className="absolute -left-32 -top-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          <h3 className="text-lg font-bold text-white mb-6 relative z-10 flex items-center gap-2">
            <Activity className="text-cyan-400" /> Interaction Metrics
          </h3>
          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sent" name="Sent" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" />
                <Area type="monotone" dataKey="opened" name="Opened" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOpened)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Configuration */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageCircle className={platformData.color} /> Action Payload
          </h3>
          
          <div className="bg-navy-950 border border-white/10 rounded-xl p-5 flex-1 relative overflow-hidden">
             <div className={cn("absolute top-0 left-0 w-1 h-full", platformData.bg.replace('/10', '/50'))}/>
             <span className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2 block">Message Content Sent</span>
             <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
               {Array.isArray(acts) && acts[0] ? acts[0].content : 'No message content defined.'}
             </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-navy-950 border border-white/5 rounded-xl p-4">
                <span className="text-xs text-gray-500 block mb-1">Target Filters</span>
                <span className="text-sm font-medium text-white">{audienceData.label}</span>
             </div>
             <div className="bg-navy-950 border border-white/5 rounded-xl p-4">
                <span className="text-xs text-gray-500 block mb-1">Deliverability</span>
                <span className="text-sm font-medium text-emerald-400">99.8% Success</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}