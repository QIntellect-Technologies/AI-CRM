import React, { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp, Users, Target, Zap, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { api } from '../services/api';
import { cn } from '../lib/utils';

const conversionData = [
  { name: 'Mon', rate: 12 },
  { name: 'Tue', rate: 15 },
  { name: 'Wed', rate: 18 },
  { name: 'Thu', rate: 14 },
  { name: 'Fri', rate: 22 },
  { name: 'Sat', rate: 25 },
  { name: 'Sun', rate: 20 },
];

const sourceData = [
  { name: 'Instagram', leads: 45 },
  { name: 'TikTok', leads: 65 },
  { name: 'Snapchat', leads: 30 },
  { name: 'Google Ads', leads: 20 },
];

export function AIInsights() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
            AI Insights & Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-1">AI-powered analysis of your marketing and operational performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Recommendation Cards */}
        <div className="glass-card rounded-2xl p-6 border-cyan-glow/20 hover:border-cyan-glow/40 shadow-[0_0_15px_rgba(0,212,255,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-glow/10 rounded-bl-full -mr-10 -mt-10 blur-xl transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-cyan-glow/10 text-cyan-glow rounded-lg border border-cyan-glow/20">
              <Target size={20} />
            </div>
            <h3 className="font-heading font-bold text-white">Marketing Optimization</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6 relative z-10">
            TikTok campaigns are currently yielding the highest quality leads (Avg Score: 85). Consider reallocating 15% of Snapchat budget to TikTok for the weekend.
          </p>
          <button className="text-xs font-bold uppercase tracking-wider text-cyan-glow hover:text-white flex items-center gap-1.5 bg-cyan-glow/10 px-4 py-2 rounded-lg border border-cyan-glow/30 hover:bg-cyan-glow/20 transition-all relative z-10 w-full justify-center">
            Apply Recommendation <Sparkles size={14} />
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6 border-emerald-glow/20 hover:border-emerald-glow/40 shadow-[0_0_15px_rgba(0,229,160,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-glow/10 rounded-bl-full -mr-10 -mt-10 blur-xl transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-emerald-glow/10 text-emerald-glow rounded-lg border border-emerald-glow/20">
              <Users size={20} />
            </div>
            <h3 className="font-heading font-bold text-white">Patient Retention</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6 relative z-10">
            Identified 42 patients at risk of churn (inactive &gt; 45 days). An automated SMS campaign offering a free consultation could recover ~15% of them.
          </p>
          <button className="text-xs font-bold uppercase tracking-wider text-emerald-glow hover:text-white flex items-center gap-1.5 bg-emerald-glow/10 px-4 py-2 rounded-lg border border-emerald-glow/30 hover:bg-emerald-glow/20 transition-all relative z-10 w-full justify-center">
            Create Campaign <Sparkles size={14} />
          </button>
        </div>

        <div className="glass-card rounded-2xl p-6 border-purple-500/20 hover:border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-10 -mt-10 blur-xl transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-heading font-bold text-white">Sales Forecasting</h3>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6 relative z-10">
            Based on current lead velocity and historical conversion rates, expect a 12% increase in scheduled appointments next week. Ensure adequate staffing.
          </p>
          <button className="text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-white flex items-center gap-1.5 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/20 transition-all relative z-10 w-full justify-center">
            View Staffing Needs <Sparkles size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Trend Chart */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Conversion Rate Trend (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#162032', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="rate" stroke="#00D4FF" strokeWidth={3} dot={{ r: 4, fill: '#00D4FF', strokeWidth: 2, stroke: '#0D1526' }} activeDot={{ r: 6, fill: '#00D4FF', stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Chart */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Lead Volume by Source</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#162032', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="leads" radius={[4, 4, 0, 0]} barSize={32}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      index === 0 ? '#f5a623' : 
                      index === 1 ? '#00f2fe' : 
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
  );
}
