import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ArrowLeft, Phone, Clock, UserCheck, Star, 
  MapPin, ShieldAlert, Activity, CheckCircle2, XCircle, FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAvatarUrl } from '../lib/utils';

export function AgentDetails({ agentId, onBack }: { agentId: string | number | null, onBack: () => void }) {
  const [agent, setAgent] = useState<any>(null);
  const [agentRecordings, setAgentRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) return;

    const fetchAgentData = async () => {
      try {
        setLoading(true);
        const [agentsData, recordingsData] = await Promise.all([
          api.getCallAgents(),
          api.getCallRecordings()
        ]);

        const selectedAgent = agentsData.find((a: any) => a.id === agentId || a.id === Number(agentId));
        setAgent(selectedAgent);

        // Filter recordings for this specific agent
        const filteredRecordings = recordingsData.filter((r: any) => r.agent_id === agentId || r.agent_id === Number(agentId));
        setAgentRecordings(filteredRecordings);
        
      } catch (error) {
        console.error("Failed to load agent details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [agentId]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Agent not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-navy-800 rounded-lg text-cyan-400">Go Back</button>
      </div>
    );
  }

  // Calculate some derived metrics
  const totalCalls = agentRecordings.length;
  const successfulCalls = agentRecordings.filter(r => r.quality_score >= 0.6).length;
  const failedCalls = totalCalls - successfulCalls;
  const avgQAScore = totalCalls ? (agentRecordings.reduce((acc, r) => acc + (r.quality_score || 0), 0) / totalCalls * 100).toFixed(1) : 0;
  
  // Aggregate mock chart data (performance over time)
  const chartData = [
    { name: 'Mon', score: 85, vol: 15 },
    { name: 'Tue', score: 88, vol: 20 },
    { name: 'Wed', score: 92, vol: 12 },
    { name: 'Thu', score: 80, vol: 25 },
    { name: 'Fri', score: Number(avgQAScore) || 90, vol: totalCalls },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-lg bg-navy-800/50 text-gray-400 hover:text-white hover:bg-navy-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Agent Profile</h1>
            <p className="text-gray-400 mt-1">Detailed performance and call history</p>
          </div>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-6 md:w-1/3 border-r border-white/10 pr-8">
            <div className="relative">
              <img
                src={getAvatarUrl(agent.name, agent.id)}
                alt={agent.name}
                className="w-24 h-24 rounded-full border-4 border-navy-800 object-cover shadow-xl"
              />
              <span className={cn(
                "absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-navy-900", 
                agent.status === 'Available' ? 'bg-emerald-500' :
                agent.status === 'On Call' ? 'bg-red-500' : 'bg-gray-500'
              )}></span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <div className="flex items-center text-cyan-400 mt-1 mb-3 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {agent.branch_name || 'Main Branch'}
              </div>
              <div className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                agent.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' :
                agent.status === 'On Call' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
              )}>
                {agent.status}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
              <div className="text-gray-400 text-sm mb-1 flex items-center gap-1"><Phone className="w-4 h-4"/> Calls Handled</div>
              <div className="text-2xl font-bold text-white">{agent.calls_today || totalCalls}</div>
            </div>
            <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
              <div className="text-gray-400 text-sm mb-1 flex items-center gap-1"><Clock className="w-4 h-4"/> Avg. Duration</div>
              <div className="text-2xl font-bold text-white">{agent.avg_duration || '2m 30s'}</div>
            </div>
            <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
              <div className="text-gray-400 text-sm mb-1 flex items-center gap-1"><Star className="w-4 h-4 text-emerald-400"/> Overall QA</div>
              <div className="text-2xl font-bold text-white">{avgQAScore > 0 ? `${avgQAScore}%` : `${agent.performance_score}%`}</div>
            </div>
            <div className="bg-navy-900/50 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
              <div className="text-gray-400 text-sm mb-1 flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-red-400"/> Failed Audits</div>
              <div className="text-2xl font-bold text-white">{failedCalls}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call History Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-navy-800/30">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              Detailed Call Logs
            </h3>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-navy-900/90 backdrop-blur-md z-10 border-b border-white/10 shadow-sm">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-400">Date/Time</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Duration</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">QA Score</th>
                  <th className="p-4 text-sm font-semibold text-gray-400">Status & Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agentRecordings.length > 0 ? (
                  agentRecordings.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 align-top">
                        <div className="font-medium text-gray-200">
                          {new Date(rec.call_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(rec.call_date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-4 align-top text-gray-300">
                        {rec.duration}s
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-navy-800 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full", rec.quality_score >= 0.8 ? "bg-emerald-500" : rec.quality_score >= 0.5 ? "bg-amber-500" : "bg-red-500")}
                              style={{ width: `${rec.quality_score * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-300">{(rec.quality_score * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-4 align-top max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1 text-sm font-medium">
                          {rec.quality_score >= 0.6 ? (
                            <><CheckCircle2 className="w-4 h-4 text-emerald-500"/> <span className="text-emerald-400">Passed</span></>
                          ) : (
                            <><XCircle className="w-4 h-4 text-red-500"/> <span className="text-red-400">Failed QA</span></>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-white/10 pl-2 mt-2">
                          "{rec.feedback || (rec.quality_score >= 0.6 ? 'Standard call handled perfectly.' : 'Failed mandatory checks.')}"
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 italic">No call records found for this agent.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts & Analysis Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden bg-navy-800/30">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Performance Trend
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights specific to this Agent */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-navy-800/40 to-purple-900/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              AI Coaching Summary
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                <p>Excellent opening scripts and friendly tone detected in latest calls.</p>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <p>Wait times during hold are slightly higher than the branch average (1m 20s).</p>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                <p>Lost points in 3 recent calls due to missing compliance disclosures.</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
