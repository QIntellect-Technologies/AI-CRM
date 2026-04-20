import React, { useState, useEffect } from 'react';
import {
  TrendingUp, PhoneCall, Calendar, Activity, AlertTriangle,
  Phone, Calendar as CalendarIcon, FileText, ChevronRight,
  BrainCircuit, Target, Clock, X, Users, Bell, Sparkles, Plus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, AreaChart, Area, PieChart, Pie
} from 'recharts';
import { api } from '../services/api';
import { cn } from '../lib/utils';

// Animated Counter Component
const AnimatedCounter = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{count}{suffix}</span>;
};

// Live Timer Component
const LiveTimer = ({ initialMinutes, initialSeconds }: { initialMinutes: number, initialSeconds: number }) => {
  const [time, setTime] = useState({ m: initialMinutes, s: initialSeconds });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.s === 59) return { m: prev.m + 1, s: 0 };
        return { ...prev, s: prev.s + 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span>{time.m}m {time.s.toString().padStart(2, '0')}s</span>;
};

export function Dashboard() {
  const [stats, setStats] = useState<any>({
    totalLeadsToday: 0,
    callsHandled: 0,
    appointmentsToday: 0,
    activePatients: 0,
    monthlyStats: []
  });
  const [marketingData, setMarketingData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [callAgents, setCallAgents] = useState([]);
  const [aiInsights, setAiInsights] = useState({});
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, marketingDataRes, leadsData, callAgentsData, aiInsightsData, patientsData, notificationsData] = await Promise.all([
          api.getDashboardStats(),
          api.getMarketing(),
          api.getLeads(),
          api.getCallAgents(),
          api.getAIInsights(),
          api.getPatients(),
          api.getNotifications()
        ]);

        setStats(statsData);
        setMarketingData(marketingDataRes);
        setLeads(leadsData);
        setCallAgents(callAgentsData);
        setAiInsights(aiInsightsData);
        setPatients(patientsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const pipelineStages = ['New Lead', 'Contacted', 'Appointment Set', 'Converted', 'Inactive'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyan-glow">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 pb-20 relative">
      
      {/* Ambient background glows specific to dashboard */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-glow/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen mix-blend-plus-lighter"></div>
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-emerald-glow/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-plus-lighter"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-plus-lighter"></div>

      {/* DASHBOARD HERO / WELCOME SECTION */}
      <div className="glass-panel p-8 rounded-3xl relative flex items-center justify-between">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-glow/10 via-transparent to-emerald-glow/5 opacity-50 mix-blend-overlay"></div>
        <div className="relative z-10 w-full">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2">
              <Sparkles size={12} className="text-cyan-glow" /> AI Overview Active
            </span>
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 tracking-tight leading-tight mb-2">
            Welcome back, Dr. Admin
          </h1>
          <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
            Here is the real-time AI-powered overview of your Polyclinic's performance. Lead tracking, call center efficiency, and patient re-engagement are fully optimized today.
          </p>
        </div>
      </div>

      {/* KPI CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Total Leads */}
        <div className="glass-card p-6 rounded-3xl group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-glow/20 to-transparent rounded-bl-full opacity-50 transition-transform duration-700 group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-navy-800/80 rounded-xl border border-white/5 backdrop-blur-md shadow-lg">
              <Users size={20} className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            </div>
            <div className="flex items-center gap-1 text-emerald-glow text-xs font-bold bg-emerald-glow/10 px-2 py-1 rounded-full border border-emerald-glow/20">
              <TrendingUp size={12} /> +12%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-semibold mb-1 uppercase tracking-wider relative z-10">Total Leads</p>
          <h3 className="text-4xl font-mono font-bold text-white neon-text-cyan relative z-10 drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]">
            <AnimatedCounter value={stats.totalLeadsToday} />
          </h3>
        </div>

        {/* Calls Handled */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-glow/20 to-transparent rounded-bl-full opacity-50 transition-transform duration-700 group-hover:scale-110"></div>
          <div className="absolute top-5 right-5 flex items-center gap-2 px-3 py-1 bg-emerald-glow/10 border border-emerald-glow/20 rounded-full shadow-[0_0_10px_rgba(0,229,160,0.1)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-glow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-glow"></span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-emerald-glow font-bold">Live</span>
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-navy-800/80 rounded-xl border border-white/5 backdrop-blur-md shadow-lg">
              <PhoneCall size={20} className="text-emerald-glow" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-semibold mb-1 uppercase tracking-wider">Calls Handled</p>
          <h3 className="text-4xl font-mono font-bold text-white neon-text-emerald relative z-10 drop-shadow-[0_0_15px_rgba(0,229,160,0.5)]">
            <AnimatedCounter value={stats.callsHandled} />
          </h3>
        </div>

        {/* Appointments Booked */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-full opacity-50 transition-transform duration-700 group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-navy-800/80 rounded-xl border border-white/5 backdrop-blur-md shadow-lg">
              <Calendar size={20} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            </div>
            <div className="flex items-center gap-1 text-emerald-glow text-xs font-bold bg-emerald-glow/10 px-2 py-1 rounded-full border border-emerald-glow/20">
              <TrendingUp size={12} /> +5%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-semibold mb-1 uppercase tracking-wider">Appointments</p>
          <h3 className="text-4xl font-mono font-bold text-white relative z-10" style={{ textShadow: '0 0 15px rgba(192, 132, 252, 0.6)' }}>
            <AnimatedCounter value={stats.appointmentsToday} />
          </h3>
        </div>

        {/* Conversion Rate */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold-glow/20 to-transparent rounded-bl-full opacity-50 transition-transform duration-700 group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mt-2">Conversion</p>
            <div className="p-3 bg-navy-800/80 rounded-xl border border-white/5 backdrop-blur-md shadow-lg">
              <Activity size={20} className="text-gold-glow drop-shadow-[0_0_8px_rgba(245,166,35,0.8)]" />
            </div>
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(245,166,35,0.4)]" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F5A623" strokeWidth="4" strokeDasharray="68, 100" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-mono font-black text-white">68%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase tracking-widest mb-1">Target: 65%</span>
              <span className="text-xs text-emerald-glow font-bold bg-emerald-glow/10 px-2 py-0.5 rounded border border-emerald-glow/20 inline-block w-max">On Track</span>
            </div>
          </div>
        </div>

        {/* Active Patients */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group border-emerald-glow/30 hover:border-emerald-glow/60 shadow-[0_0_20px_rgba(0,229,160,0.15)] bg-gradient-to-br from-emerald-glow/5 to-transparent">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-glow/10 to-transparent pointer-events-none mix-blend-overlay"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-emerald-glow/20 rounded-xl border border-emerald-glow/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,160,0.3)]">
              <Users size={20} className="text-emerald-glow drop-shadow-[0_0_8px_rgba(0,229,160,1)]" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-semibold mb-1 uppercase tracking-wider relative z-10">Active Patients</p>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-4xl font-mono font-bold text-emerald-glow drop-shadow-[0_0_15px_rgba(0,229,160,0.8)]">
              <AnimatedCounter value={stats.activePatients} />
            </h3>
            <span className="text-xs font-bold text-emerald-glow mb-2 bg-emerald-glow/20 px-2 py-0.5 rounded-full border border-emerald-glow/30">Healthy</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN (60%) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* LEAD PIPELINE BOARD */}
          <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden flex flex-col h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(192,132,252,0.3)]">
                  <Users size={24} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,1)]" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  Lead Pipeline Matrix
                </h2>
              </div>
              <button className="text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-all flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 border border-purple-500/20 hover:border-purple-500/50 rounded-xl shadow-lg">
                View Board <ChevronRight size={14}/>
              </button>
            </div>
            
            <div className="flex-1 overflow-x-auto hide-scrollbar flex gap-4 pb-2">
              {pipelineStages.map(stage => (
                <div key={stage} className="flex-shrink-0 w-64 flex flex-col gap-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stage}</h3>
                    <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded-full text-gray-500">
                      {leads.filter(l => l.status === stage).length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3 pr-1">
                    {leads.filter(l => l.status === stage).map(lead => (
                      <div key={lead.id} className="bg-navy-800/80 border border-white/5 rounded-xl p-3 hover:border-cyan-glow/30 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                            lead.source === 'TikTok' ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20" :
                            lead.source === 'Instagram' ? "bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20" :
                            "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          )}>
                            {lead.source}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded border",
                            lead.ai_score > 80 ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            lead.ai_score > 50 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          )}>
                            {lead.ai_score > 80 ? 'HOT' : lead.ai_score > 50 ? 'WARM' : 'COLD'}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-white mb-1">{lead.name}</h4>
                        <p className="text-xs text-gray-500 font-mono mb-3">{lead.phone}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1.5">
                            <Clock size={10} className="text-gray-500" />
                            <span className="text-[10px] text-gray-500">{lead.lastContact}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 bg-white/5 hover:bg-cyan-glow/20 rounded text-gray-400 hover:text-cyan-glow transition-colors">
                              <Phone size={12} />
                            </button>
                            <button className="p-1.5 bg-white/5 hover:bg-emerald-glow/20 rounded text-gray-400 hover:text-emerald-glow transition-colors">
                              <CalendarIcon size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE CALL CENTER PANEL */}
          <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-glow/10 to-transparent blur-xl rounded-tr-full opacity-50 z-0"></div>
            <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-glow/20 border border-emerald-glow/30 rounded-xl shadow-[0_0_15px_rgba(0,229,160,0.3)]">
                  <PhoneCall size={24} className="text-emerald-glow drop-shadow-[0_0_8px_rgba(0,229,160,1)]" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Global Call Center
                </h2>
                <div className="flex items-center gap-2 bg-emerald-glow/10 border border-emerald-glow/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,229,160,0.2)] ml-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-glow opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-glow"></span>
                  </span>
                  <span className="text-xs font-black tracking-widest uppercase text-emerald-glow">2 Active Calls</span>
                </div>
              </div>
              <button className="text-xs font-bold text-gray-400 hover:text-emerald-glow transition-all bg-white/5 hover:bg-emerald-glow/10 px-4 py-2 rounded-xl border border-white/5 hover:border-emerald-glow/30 uppercase tracking-widest flex items-center gap-2">View All <ChevronRight size={14}/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {callAgents.map((agent, i) => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-xl bg-navy-800/50 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={`https://picsum.photos/seed/agent${i}/100/100`} alt={agent.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <div className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-navy-800",
                        agent.status === 'On Call' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" :
                        agent.status === 'Available' ? "bg-emerald-glow shadow-[0_0_8px_rgba(0,229,160,0.8)]" :
                        agent.status === 'Wrap-up' ? "bg-gold-glow shadow-[0_0_8px_rgba(245,166,35,0.8)]" :
                        "bg-gray-500"
                      )}></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{agent.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{agent.branch}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <span className={cn(
                          "text-[10px] font-medium",
                          agent.status === 'On Call' ? "text-red-400" :
                          agent.status === 'Available' ? "text-emerald-glow" :
                          agent.status === 'Wrap-up' ? "text-gold-glow" :
                          "text-gray-500"
                        )}>{agent.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {agent.status === 'On Call' && (
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-red-400 animate-pulse">
                        <LiveTimer initialMinutes={Math.floor(Math.random() * 5)} initialSeconds={Math.floor(Math.random() * 60)} />
                      </div>
                      <span className="text-[10px] text-gray-500">Duration</span>
                    </div>
                  )}
                  {agent.status !== 'On Call' && (
                    <div className="text-right">
                      <div className="text-xs font-mono font-medium text-gray-300">{agent.callsToday}</div>
                      <span className="text-[10px] text-gray-500">Calls Today</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (40%) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* AI INSIGHTS CARD */}
          <div className="glass-panel p-8 rounded-3xl group overflow-hidden border-cyan-glow/20 shadow-[0_0_30px_rgba(0,212,255,0.1)] relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-glow/20 to-transparent rounded-bl-full opacity-50 blur-xl"></div>
            <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-glow/10 border border-cyan-glow/20 rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                  <BrainCircuit size={24} className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,212,255,1)]" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]">AI Intelligence</h2>
              </div>
              <div className="flex gap-1">
                 <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse"></span>
                 <span className="w-2 h-2 rounded-full bg-cyan-glow/50"></span>
                 <span className="w-2 h-2 rounded-full bg-cyan-glow/20"></span>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              {[
                { message: aiInsights.marketing || 'TikTok campaigns are currently yielding the highest quality leads (Avg Score: 85). Consider reallocating 15% of Snapchat budget to TikTok for the weekend.', priority: 'High' },
                { message: aiInsights.retention || 'Identified 42 patients at risk of churn (inactive >45 days). An automated SMS campaign offering a free consultation could recover ~15% of them.', priority: 'Medium' },
                { message: aiInsights.forecasting || 'Based on current trends, expect 23% increase in appointments next week. Consider adding Saturday slots.', priority: 'Low' }
              ].map((alert, i) => (
                <div key={i} className="p-3 rounded-xl bg-navy-800/60 border border-white/5 hover:bg-navy-800/80 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 p-1.5 rounded-lg border",
                      alert.priority === 'High' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                      "bg-gold-glow/10 border-gold-glow/20 text-gold-glow"
                    )}>
                      <Sparkles size={12} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 leading-snug mb-2">{alert.message}</p>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-cyan-glow hover:text-white transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        Take Action <ChevronRight size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* APPOINTMENT CALENDAR MINI */}
          <div className="glass-panel p-8 rounded-3xl group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-full opacity-50 blur-xl px-2"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(192,132,252,0.3)]">
                  <CalendarIcon size={24} className="text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,1)]" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  Schedule Overview
                </h2>
              </div>
              <button className="text-xs font-bold uppercase tracking-widest text-purple-300 hover:text-white transition-all bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 hover:border-purple-500/50 px-4 py-2 flex items-center gap-2 rounded-xl shadow-lg">
                <Plus size={14} /> Book
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const isToday = i === 2; // Mock Wednesday as today
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-medium uppercase tracking-wider",
                      isToday ? "text-cyan-glow" : "text-gray-500"
                    )}>{day}</span>
                    <div className={cn(
                      "w-full h-24 rounded-lg border p-1 flex flex-col gap-1 overflow-hidden",
                      isToday ? "bg-navy-800/80 border-cyan-glow/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]" : "bg-navy-800/40 border-white/5"
                    )}>
                      {isToday && <span className="text-[10px] font-bold text-white text-center mb-1">08</span>}
                      {!isToday && <span className="text-[10px] font-medium text-gray-500 text-center mb-1">0{i+6}</span>}
                      
                      {/* Mock appointment blocks */}
                      {i === 1 && <div className="w-full h-1.5 rounded-full bg-emerald-glow/50"></div>}
                      {i === 2 && (
                        <>
                          <div className="w-full h-1.5 rounded-full bg-cyan-glow"></div>
                          <div className="w-full h-1.5 rounded-full bg-purple-500"></div>
                          <div className="w-full h-1.5 rounded-full bg-gold-glow"></div>
                        </>
                      )}
                      {i === 3 && <div className="w-full h-1.5 rounded-full bg-cyan-glow/50"></div>}
                      {i === 4 && (
                        <>
                          <div className="w-full h-1.5 rounded-full bg-emerald-glow/50"></div>
                          <div className="w-full h-1.5 rounded-full bg-purple-500/50"></div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MARKETING CHANNELS PERFORMANCE */}
          <div className="glass-panel p-8 rounded-3xl group overflow-hidden relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#f5a623]/20 to-transparent blur-xl rounded-tr-full opacity-50 z-0"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#f5a623]/20 border border-[#f5a623]/30 rounded-xl shadow-[0_0_15px_rgba(245,166,35,0.3)]">
                  <Target size={24} className="text-[#f5a623] drop-shadow-[0_0_8px_rgba(245,166,35,1)]" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  Marketing Matrix
                </h2>
              </div>
              <button className="text-xs font-bold bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 hover:bg-[#f5a623]/20 hover:border-[#f5a623]/40 px-4 py-2 rounded-xl transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg">
                View Charts <ChevronRight size={14}/>
              </button>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketingData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} width={70} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#162032', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="leads" radius={[0, 4, 4, 0]} barSize={16}>
                    {marketingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        index === 0 ? '#00f2fe' : 
                        index === 1 ? '#f5a623' : 
                        index === 2 ? '#e6396b' : '#10b981'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM ROW - ADVANCED CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* REVENUE & LEADS AREA CHART */}
        <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-glow/10 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-cyan-glow/20 border border-cyan-glow/30 rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                <Activity size={24} className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,212,255,1)]" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                Revenue & Growth Trend
              </h2>
            </div>
          </div>
          
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyStats && stats.monthlyStats.length > 0 ? stats.monthlyStats : [
                { month: 'Jan', revenue: 45000, leads: 120 },
                { month: 'Feb', revenue: 52000, leads: 150 },
                { month: 'Mar', revenue: 48000, leads: 130 },
                { month: 'Apr', revenue: 61000, leads: 180 },
                { month: 'May', revenue: 59000, leads: 160 },
                { month: 'Jun', revenue: 75000, leads: 220 }
              ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5A0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5A0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1526', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#fff', padding: '12px' }}
                  itemStyle={{ fontWeight: 600, fontSize: '14px' }}
                  labelStyle={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#00E5A0" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#00E5A0', stroke: '#0D1526', strokeWidth: 2 }} />
                <Area yAxisId="right" type="monotone" dataKey="leads" stroke="#00D4FF" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" activeDot={{ r: 6, fill: '#00D4FF', stroke: '#0D1526', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CLINIC ENGAGEMENT RADAR */}
        <div className="glass-panel p-8 rounded-3xl relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-gold-glow/10 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10 border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gold-glow/20 border border-gold-glow/30 rounded-xl shadow-[0_0_15px_rgba(245,166,35,0.3)]">
                <Target size={24} className="text-gold-glow drop-shadow-[0_0_8px_rgba(245,166,35,1)]" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                Engagement Matrix
              </h2>
            </div>
          </div>
          
          <div className="h-72 w-full pt-4 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
                  </filter>
                </defs>
                <Pie
                  data={[
                    { name: 'Follow-ups Completed', value: 45, fill: '#00E5A0' },
                    { name: 'Appointments Set', value: 30, fill: '#00D4FF' },
                    { name: 'Needs Re-engagement', value: 15, fill: '#F5A623' },
                    { name: 'Inactive', value: 10, fill: '#E6396B' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  filter="url(#shadow)"
                >
                  <Cell fill="#00E5A0" className="hover:opacity-80 transition-opacity" cursor="pointer" />
                  <Cell fill="#00D4FF" className="hover:opacity-80 transition-opacity" cursor="pointer" />
                  <Cell fill="#F5A623" className="hover:opacity-80 transition-opacity" cursor="pointer" />
                  <Cell fill="#E6396B" className="hover:opacity-80 transition-opacity" cursor="pointer" />
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1526', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#fff' }}
                  itemStyle={{ fontWeight: 600, fontSize: '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center metric */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none mt-2">
              <span className="text-3xl font-mono font-bold text-white drop-shadow-md">85%</span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-glow font-bold bg-emerald-glow/10 px-2 py-0.5 rounded-full border border-emerald-glow/20">Success</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
