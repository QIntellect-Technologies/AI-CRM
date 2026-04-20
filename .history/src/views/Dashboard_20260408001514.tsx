import React, { useState, useEffect } from 'react';
import {
  TrendingUp, PhoneCall, Calendar, Activity, AlertTriangle,
  Phone, Calendar as CalendarIcon, FileText, ChevronRight,
  BrainCircuit, Target, Clock, X, Users, Bell, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell
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
  const [stats, setStats] = useState({
    totalLeadsToday: 0,
    callsHandled: 0,
    appointmentsToday: 0,
    activePatients: 0
  });
  const [marketingData, setMarketingData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [callAgents, setCallAgents] = useState([]);
  const [aiInsights, setAiInsights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, marketingDataRes, leadsData, callAgentsData, aiInsightsData] = await Promise.all([
          api.getDashboardStats(),
          api.getMarketing(),
          api.getLeads(),
          api.getCallAgents(),
          api.getAIInsights()
        ]);

        setStats(statsData);
        setMarketingData(marketingDataRes);
        setLeads(leadsData);
        setCallAgents(callAgentsData);
        setAiInsights(aiInsightsData);
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
    <div className="flex flex-col h-full space-y-6 pb-20">
      
      {/* KPI CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Leads */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-glow/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-navy-800/80 rounded-lg border border-white/5">
              <Users size={18} className="text-cyan-glow" />
            </div>
            <div className="flex items-center gap-1 text-emerald-glow text-xs font-medium bg-emerald-glow/10 px-2 py-1 rounded-full border border-emerald-glow/20">
              <TrendingUp size={12} /> +12%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Leads Today</p>
          <h3 className="text-3xl font-mono font-bold text-white neon-text-cyan">
            <AnimatedCounter value={stats.totalLeadsToday} />
          </h3>
        </div>

        {/* Calls Handled */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-glow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-glow"></span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-emerald-glow font-bold">Live</span>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-navy-800/80 rounded-lg border border-white/5">
              <PhoneCall size={18} className="text-emerald-glow" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Calls Handled</p>
          <h3 className="text-3xl font-mono font-bold text-white neon-text-emerald">
            <AnimatedCounter value={stats.callsHandled} />
          </h3>
        </div>

        {/* Appointments Booked */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-navy-800/80 rounded-lg border border-white/5">
              <Calendar size={18} className="text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-glow text-xs font-medium bg-emerald-glow/10 px-2 py-1 rounded-full border border-emerald-glow/20">
              <TrendingUp size={12} /> +5%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Appointments Booked</p>
          <h3 className="text-3xl font-mono font-bold text-white" style={{ textShadow: '0 0 10px rgba(192, 132, 252, 0.5)' }}>
            <AnimatedCounter value={stats.appointmentsToday} />
          </h3>
        </div>

        {/* Conversion Rate */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-400 text-sm font-medium">Conversion Rate</p>
            <div className="p-2 bg-navy-800/80 rounded-lg border border-white/5">
              <Activity size={18} className="text-gold-glow" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#F5A623" strokeWidth="3" strokeDasharray="68, 100" className="drop-shadow-[0_0_5px_rgba(245,166,35,0.8)]" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono font-bold text-white">68%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Target: 65%</span>
              <span className="text-xs text-emerald-glow font-medium">On Track</span>
            </div>
          </div>
        </div>

        {/* Active Patients */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group border-emerald-glow/30 hover:border-emerald-glow/50 shadow-[0_0_15px_rgba(0,229,160,0.1)]">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-glow/5 to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-glow/10 rounded-lg border border-emerald-glow/20">
              <Users size={18} className="text-emerald-glow drop-shadow-[0_0_5px_rgba(0,229,160,0.8)]" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Active Patients</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-mono font-bold text-emerald-glow drop-shadow-[0_0_8px_rgba(0,229,160,0.6)]">
              <AnimatedCounter value={stats.activePatients} />
            </h3>
            <span className="text-xs text-emerald-glow mb-1">Healthy</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN (60%) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* LEAD PIPELINE BOARD */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-cyan-glow" /> Lead Pipeline
              </h2>
              <button className="text-xs font-medium text-cyan-glow hover:text-white transition-colors">View Full Board →</button>
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
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <PhoneCall size={18} className="text-emerald-glow" /> Live Call Center
                </h2>
                <div className="flex items-center gap-2 bg-emerald-glow/10 border border-emerald-glow/20 px-2.5 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-glow opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-glow"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-glow">2 Active Calls</span>
                </div>
              </div>
              <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">View All Agents</button>
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
          <div className="glass-panel rounded-2xl p-6 border-cyan-glow/20 shadow-[0_0_30px_rgba(0,212,255,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-glow/10 rounded-bl-full -mr-10 -mt-10 blur-xl"></div>
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <BrainCircuit size={20} className="text-cyan-glow" />
              <h2 className="text-lg font-heading font-bold text-white drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">AI Recommendations</h2>
            </div>
            
            <div className="space-y-4 relative z-10">
              {aiAlerts.slice(0, 3).map((alert, i) => (
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
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <CalendarIcon size={18} className="text-purple-400" /> This Week
              </h2>
              <button className="text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 px-3 py-1.5 rounded-lg transition-colors">
                Book Appointment
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
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                <Target size={18} className="text-[#f5a623]" /> Channel Performance
              </h2>
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

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PATIENT ACTIVITY TIMELINE */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-heading font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={18} className="text-emerald-glow" /> Patient Activity
          </h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {patientTimeline.map((item, i) => (
              <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-navy-800 text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <img src={`https://picsum.photos/seed/patient${i}/100/100`} alt={item.patient} className="w-8 h-8 rounded-full object-cover" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-navy-800/50 border border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white">{item.patient}</h4>
                    <span className="text-[10px] text-gray-500 font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{item.action} • <span className="text-cyan-glow">{item.branch}</span></p>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    item.status === 'Appointment Confirmed' ? "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20" :
                    item.status === 'Follow-up Needed' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    item.status === 'Re-engaged' ? "bg-cyan-glow/10 text-cyan-glow border-cyan-glow/20" :
                    "bg-gold-glow/10 text-gold-glow border-gold-glow/20"
                  )}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS PANEL */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <Bell size={18} className="text-red-400" /> System Alerts
            </h2>
            <button className="text-xs text-gray-400 hover:text-white transition-colors">Mark all read</button>
          </div>
          <div className="space-y-3">
            {systemNotifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 p-3 rounded-xl bg-navy-800/40 border border-white/5 hover:bg-navy-800/60 transition-colors">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                  notif.severity === 'red' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" :
                  notif.severity === 'yellow' ? "bg-gold-glow shadow-[0_0_8px_rgba(245,166,35,0.8)]" :
                  "bg-emerald-glow shadow-[0_0_8px_rgba(0,229,160,0.8)]"
                )}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{notif.message}</p>
                  <span className="text-[10px] text-gray-500 font-mono mt-1 block">{notif.time}</span>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors p-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
