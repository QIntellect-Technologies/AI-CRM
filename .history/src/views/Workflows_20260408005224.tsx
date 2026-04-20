import React, { useState, useEffect } from 'react';
import { Command, Workflow, Zap, Plus, Settings2, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';

export function Workflows() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const res = await api.getWorkflows();
      setWorkflows(res.data);
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Command className="text-emerald-glow" />
            Automations & Workflows
          </h1>
          <p className="text-gray-400 mt-1">Configure automated messages, follow-ups, and rules</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <Plus size={16} />
          Create Rule
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-emerald-glow animate-pulse">Loading automations...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/5 relative overflow-hidden group hover:border-cyan-glow/30 transition-colors cursor-pointer bg-navy-800">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={64} className="text-cyan-glow" />
            </div>
            {workflows.map((wf) => (
              <div key={wf.id} className="bg-navy-900 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg flex items-center justify-center border",
                    wf.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-gray-800 text-gray-500 border-gray-700"
                  )}>
                    <Workflow size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize tracking-wide">{wf.name.replace('_', ' ')}</h3>
                    <p className="text-sm text-gray-400">Trigger: <span className="text-cyan-glow font-mono">{wf.trigger_type}</span></p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 max-w-sm hidden md:block">
                  <p className="whitespace-pre-line truncate">
                    Actions: {Array.isArray(parseJson(wf.actions)) ? `${parseJson(wf.actions).length} Step(s)` : 'Custom Pipeline'}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end">
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider border",
                    wf.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-gray-800 text-gray-500 border-gray-700"
                  )}>
                    {wf.is_active ? 'Active' : 'Disabled'}
                  </span>
                  
                  <button className="p-2 bg-white/5 hover:bg-cyan-glow/20 rounded-md text-gray-400 hover:text-cyan-glow transition-colors">
                    <Settings2 size={16} />
                  </button>
                  <button className="p-2 bg-white/5 hover:bg-red-500/20 rounded-md text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}