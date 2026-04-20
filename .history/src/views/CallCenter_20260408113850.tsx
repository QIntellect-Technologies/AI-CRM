import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PhoneCall, Phone, PhoneOff, Clock, UserCheck, AlertCircle, MapPin, PhoneMissed, Search, Headphones, CheckCircle2, XCircle, FileText, ArrowUpRight, TrendingDown, Star, Activity, AlertTriangle, FileAudio } from 'lucide-react';
import { cn } from '../lib/utils';

export function CallCenter() {
  const [activeTab, setActiveTab] = useState<'live'|'history'>('live');
  const [agents, setAgents] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [agentsData, recordingsData] = await Promise.all([
        api.getCallAgents(),
        api.getCallRecordings()
      ]);
      setAgents(agentsData);
      setRecordings(recordingsData);
    } catch (error) {
      console.error('Error fetching call center data:', error);
    }
  };

  const processedCalls = recordings.map(c => {
    let callState = 'Success';
    if (c.duration <= 15) callState = 'Missed';
    else if (c.quality_score < 0.5) callState = 'Failed';

    return { ...c, callState };
  });

  const totalCalls = recordings.length;
  const missedCalls = processedCalls.filter(c => c.callState === 'Missed').length;
  const failedCalls = processedCalls.filter(c => c.callState === 'Failed').length;
  const activeAgents = agents.filter(a => a.status !== 'Offline').length;

  const filteredLogs = processedCalls.filter(call => 
    call.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.transcription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.callState.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">Call Center Analytics</h1>
          <p className="text-sm text-gray-400 mt-2">Advanced real-time monitoring of agent performance and failed/missed logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,229,160,0.3)] hover:shadow-[0_0_20px_rgba(0,229,160,0.5)]">
            <Phone size={18} />
            Global Dialer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-glow/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-cyan-glow/10 text-cyan-glow rounded-xl flex items-center justify-center mb-4 border border-cyan-glow/20 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <PhoneCall size={24} />
          </div>
          <h3 className="text-4xl font-extrabold text-white mb-1">{totalCalls}</h3>
          <p className="text-sm text-gray-400 font-medium">Total System Calls</p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center mb-4 border border-orange-500/20">
            <PhoneMissed size={24} />
          </div>
          <h3 className="text-4xl font-extrabold text-white neon-text-orange mb-1">{missedCalls}</h3>
          <p className="text-sm text-gray-400 font-medium">Missed Calls ({((missedCalls / (totalCalls||1))*100).toFixed(1)}%)</p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-4xl font-extrabold text-white mb-1 text-red-400">{failedCalls}</h3>
          <p className="text-sm text-gray-400 font-medium">Low QA / Failed Calls</p>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(0,229,160,0.3)]">
            <UserCheck size={24} />
          </div>
          <h3 className="text-4xl font-extrabold text-white mb-1">{activeAgents}<span className="text-xl text-gray-500 font-normal"> /{agents.length}</span></h3>
          <p className="text-sm text-gray-400 font-medium">Agents Online</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 pt-4 border-b border-white/5 pb-4 sticky top-0 bg-navy-950/80 z-20 backdrop-blur-xl">
         <button onClick={() => setActiveTab('live')} className={cn("px-6 py-2.5 rounded-xl font-bold transition-all", activeTab === 'live' ? 'bg-cyan-glow/20 text-cyan-400 border border-cyan-glow/50 shadow-[0_0_15px_rgba(0,212,255,0.2)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white')}>Live Agent Dashboard</button>
         <button onClick={() => setActiveTab('history')} className={cn("px-6 py-2.5 rounded-xl font-bold transition-all", activeTab === 'history' ? 'bg-cyan-glow/20 text-cyan-400 border border-cyan-glow/50 shadow-[0_0_15px_rgba(0,212,255,0.2)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white')}>Call Failure Logs & QA</button>
      </div>

      {activeTab === 'live' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-glow/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/agent${agent.id}/150/150`} alt={agent.name} className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" />
                    <span className={cn("absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-navy-900", agent.status === 'Available' ? 'bg-emerald-500' : agent.status === 'On Call' ? 'bg-red-500 animate-pulse' : 'bg-gray-500')}></span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{agent.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10} className="text-cyan-500"/>{agent.branch_name}</p>
                    <span className={cn("inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border", agent.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : agent.status === 'On Call' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20')}>{agent.status}</span>
                  </div>
                </div>
                <button className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-cyan-glow hover:bg-cyan-glow/10 hover:border-cyan-glow/30 border border-transparent transition-all shadow-[0_0_10px_rgba(0,0,0,0.2)]" title="Listen / Whisper">
                  <Headphones size={18}/>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                 <div className="bg-navy-900/50 p-3 rounded-xl border border-white/5 shadow-inner">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Calls Taken</p>
                   <p className="text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{agent.calls_today}</p>
                 </div>
                 <div className="bg-navy-900/50 p-3 rounded-xl border border-white/5 shadow-inner">
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Avg Duration</p>
                   <p className="text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{agent.avg_duration}</p>
                 </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                 <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">QA Score</p>
                   <div className="flex items-center gap-1.5">
                     <Star size={14} className={cn(agent.performance_score > 0.8 ? "text-emerald-400 fill-emerald-400/20" : agent.performance_score > 0.5 ? "text-yellow-400 fill-yellow-400/20" : "text-red-400 fill-red-400/20")} />
                     <span className={cn("text-sm font-black", agent.performance_score > 0.8 ? "text-emerald-400" : agent.performance_score > 0.5 ? "text-yellow-400" : "text-red-400")}>{(agent.performance_score * 10).toFixed(1)}</span>
                   </div>
                 </div>
                 <button className="text-xs font-bold px-4 py-2 bg-gradient-to-r from-red-500/10 to-transparent hover:from-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all flex items-center gap-2">
                   <AlertCircle size={14}/> Flag Agent
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="relative z-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-glow" size={18} />
            <input
              type="text"
              placeholder="Search by agent, lead, transcription, failure reason, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-navy-900/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all placeholder:text-gray-500 text-white shadow-lg"
            />
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)]">
            <div className="overflow-x-auto">
              <table className="glass-table w-full">
                <thead>
                  <tr className="bg-navy-900/80 border-b border-white/5">
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Agent Attended</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Caller Identity</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Result Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Failure Diagnostics / Notes</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Timestamp</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Audio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.map(call => (
                    <tr key={call.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm shadow-inner", call.callState === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' : call.callState === 'Missed' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-navy-800 text-cyan-400 border-white/10')}>
                           {call.agent_name ? call.agent_name.charAt(0) : '?'}
                          </div>
                          <span className="font-bold text-emerald-50 text-sm">{call.agent_name || 'Auto/System'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold flex items-center gap-2">{call.lead_name || call.patient_name || 'Anonymous Caller'}</span>
                        <div className="text-[10px] items-center gap-1 font-mono text-gray-500 mt-1 uppercase flex tracking-widest"><Clock size={10}/> Duration: {call.duration}s</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border",
                          call.callState === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 
                          call.callState === 'Missed' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 
                          'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        )}>
                          {call.callState === 'Success' ? <CheckCircle2 size={12}/> : call.callState === 'Missed' ? <PhoneMissed size={12}/> : <XCircle size={12}/>}
                          {call.callState}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-sm">
                        {call.callState === 'Failed' ? (
                          <div className="bg-red-500/5 border border-red-500/10 p-2.5 rounded-xl">
                            <div className="text-xs text-red-300 font-bold flex gap-1.5 items-center mb-1">
                              <AlertCircle size={12} className="shrink-0" />
                              QA Failure Detected
                            </div>
                            <span className="text-gray-400 text-xs block">{call.feedback || 'Call abandoned by agent or failed script adherence completely. Immediate review necessary.'}</span>
                          </div>
                        ) : call.callState === 'Missed' ? (
                           <div className="bg-orange-500/5 border border-orange-500/10 p-2.5 rounded-xl">
                             <div className="text-xs text-orange-300 font-bold flex gap-1.5 items-center mb-1">
                               <Clock size={12} className="shrink-0" />
                               Abandoned / Missed
                             </div>
                             <span className="text-gray-400 text-xs block">Caller disconnected before connection (System logged {call.duration}s ping).</span>
                           </div>
                        ) : (
                          <div className="text-sm text-gray-400 truncate flex gap-2 items-center bg-navy-900/50 p-2.5 rounded-xl border border-white/5"><FileText size={14} className="text-cyan-glow/50"/>{call.transcription || 'Call completed normally, recording archived via AI ingestion.'}</div>
                        )}
                        {call.callState === 'Failed' && <div className="text-[10px] text-red-500/50 mt-2 font-mono uppercase tracking-wider">QA Confidence: {(call.quality_score * 100).toFixed(0)}%</div>}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                        {new Date(call.call_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className={cn("p-2.5 rounded-xl transition-all shadow-sm border", call.callState === 'Failed' ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/30 hover:scale-110" : call.callState === 'Missed' ? "bg-gray-800 text-gray-600 border-white/5 cursor-not-allowed" : "bg-cyan-glow/10 text-cyan-glow border-cyan-glow/30 hover:bg-cyan-glow/20 hover:scale-110")} title={call.callState === 'Missed' ? 'No audio for missed call' : 'Listen to Recording'}>
                           <FileAudio size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLogs.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mb-4 border border-white/5"><Search className="text-gray-500" size={24} /></div>
                  <p className="text-gray-400 font-medium">No call analytics found matching search '{searchTerm}'.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
