import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, DollarSign, Users, Plus, ArrowUpRight, ArrowDownRight, Filter, Search, X, BarChart3, PieChart, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell, PieChart as RechartsPieChart, Pie } from 'recharts';
import { cn } from '../lib/utils';
import { api } from '../services/api';

const platforms = ['All', 'Instagram', 'TikTok', 'Snapchat', 'Google Ads', 'Facebook', 'Website'];

const platformColors = {
  Instagram: '#E4405F',
  TikTok: '#000000',
  Snapchat: '#FFFC00',
  'Google Ads': '#4285F4',
  Facebook: '#1877F2',
  Website: '#6366F1'
};

export function Marketing() {
  const [activeTab, setActiveTab] = useState('All');
  const [marketingData, setMarketingData] = useState([]);
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketingRes, leadsRes] = await Promise.all([
          api.getMarketing(),
          api.getLeads()
        ]);
        setMarketingData(marketingRes);
        setLeadsData(leadsRes);
      } catch (error) {
        console.error('Error fetching marketing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on active tab
  const filteredMarketingData = activeTab === 'All' 
    ? marketingData 
    : marketingData.filter(item => item.platform === activeTab);

  const filteredLeadsData = activeTab === 'All'
    ? leadsData
    : leadsData.filter(lead => lead.source === activeTab);

  // Calculate platform statistics
  const platformStats = platforms.slice(1).map(platform => {
    const platformLeads = leadsData.filter(lead => lead.source === platform);
    const platformMarketing = marketingData.filter(item => item.platform === platform);
    
    return {
      platform,
      leads: platformLeads.length,
      conversions: platformMarketing.reduce((sum, item) => sum + (item.conversions || 0), 0),
      spend: platformMarketing.reduce((sum, item) => sum + (item.spent || 0), 0),
      roi: platformMarketing.length > 0 
        ? platformMarketing.reduce((sum, item) => sum + (item.roi || 0), 0) / platformMarketing.length 
        : 0
    };
  });

  const totalLeads = filteredLeadsData.length;
  const totalConversions = filteredMarketingData.reduce((sum, item) => sum + (item.conversions || 0), 0);
  const totalSpend = filteredMarketingData.reduce((sum, item) => sum + (item.spent || 0), 0);
  const avgROI = filteredMarketingData.length > 0 
    ? filteredMarketingData.reduce((sum, item) => sum + (item.roi || 0), 0) / filteredMarketingData.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyan-glow">Loading marketing data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white tracking-tight">Marketing Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Track campaign performance, ROI, and lead generation across platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold-glow/10 text-gold-glow border border-gold-glow/30 rounded-lg text-sm font-medium hover:bg-gold-glow/20 transition-all shadow-[0_0_15px_rgba(245,166,35,0.15)] hover:shadow-[0_0_20px_rgba(245,166,35,0.3)]"
          >
            <Plus size={16} />
            New Campaign
          </button>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {platforms.map((platform) => {
          const platformData = platform === 'All' ? leadsData : leadsData.filter(lead => lead.source === platform);
          const leadCount = platformData.length;
          
          return (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === platform
                  ? "bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "bg-gray-800/50 text-gray-300 border border-gray-700 hover:bg-gray-700/50"
              )}
            >
              {platform !== 'All' && (
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: platformColors[platform as keyof typeof platformColors] }}
                />
              )}
              {platform}
              <span className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                {leadCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
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

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Conversions</p>
              <p className="text-2xl font-bold text-white">{totalConversions}</p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400">+8%</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Spend</p>
              <p className="text-2xl font-bold text-white">${totalSpend.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-red-400 mr-1" />
            <span className="text-red-400">+5%</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg ROI</p>
              <p className="text-2xl font-bold text-white">{avgROI.toFixed(1)}%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400">+15%</span>
            <span className="text-gray-400 ml-1">vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance Chart */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="platform" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Bar dataKey="leads" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROI by Platform */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">ROI by Platform</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={platformStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="platform" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Line type="monotone" dataKey="roi" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Leads from {activeTab === 'All' ? 'All Platforms' : activeTab}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">AI Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Priority</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeadsData.slice(0, 10).map((lead: any) => (
                <tr key={lead.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-sm text-white">{lead.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{lead.phone}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      lead.ai_score >= 80 ? "bg-green-500/20 text-green-400" :
                      lead.ai_score >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    )}>
                      {lead.ai_score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      lead.priority === 'High' ? "bg-red-500/20 text-red-400" :
                      lead.priority === 'Medium' ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-gray-500/20 text-gray-400"
                    )}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">{lead.status}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeadsData.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No leads found for {activeTab === 'All' ? 'any platform' : activeTab}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-glow/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-cyan-glow/10 text-cyan-glow rounded-lg border border-cyan-glow/20">
              <DollarSign size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-glow text-xs font-bold bg-emerald-glow/10 px-2 py-1 rounded-full border border-emerald-glow/20">
              <ArrowUpRight size={12} /> 12.5%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Ad Spend</p>
          <h3 className="text-3xl font-mono font-bold text-white neon-text-cyan">$12,450</h3>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-glow/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-glow/10 text-emerald-glow rounded-lg border border-emerald-glow/20">
              <Users size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-glow text-xs font-bold bg-emerald-glow/10 px-2 py-1 rounded-full border border-emerald-glow/20">
              <ArrowUpRight size={12} /> 24.8%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total Leads</p>
          <h3 className="text-3xl font-mono font-bold text-white neon-text-emerald">1,160</h3>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
              <Target size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-glow text-xs font-bold bg-emerald-glow/10 px-2 py-1 rounded-full border border-emerald-glow/20">
              <ArrowDownRight size={12} className="rotate-180" /> 5.2%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Avg. Cost Per Lead</p>
          <h3 className="text-3xl font-mono font-bold text-white" style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>$10.73</h3>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-glow/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gold-glow/10 text-gold-glow rounded-lg border border-gold-glow/20">
              <TrendingUp size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-glow text-xs font-bold bg-emerald-glow/10 px-2 py-1 rounded-full border border-emerald-glow/20">
              <ArrowUpRight size={12} /> 18.2%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Average ROI</p>
          <h3 className="text-3xl font-mono font-bold text-white neon-text-gold">+142%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend vs Leads Chart */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Spend vs Leads Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[]}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5A0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5A0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#162032', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                />
                <Area yAxisId="left" type="monotone" dataKey="spend" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
                <Area yAxisId="right" type="monotone" dataKey="leads" stroke="#00E5A0" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads by Source */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Leads by Source</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[]} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#162032', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="leads" radius={[0, 4, 4, 0]} barSize={24}>
                  {sourceData.map((entry, index) => (
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

        {/* Average ROI Trend Chart */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Average ROI Trend (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dx={-10} tickFormatter={(val) => `+${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#162032', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  formatter={(value: number) => [`+${value}%`, 'ROI']}
                />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#F5A623" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#F5A623', strokeWidth: 2, stroke: '#0D1526' }} 
                  activeDot={{ r: 6, fill: '#F5A623', stroke: '#fff' }} 
                  style={{ filter: 'drop-shadow(0px 0px 8px rgba(245,166,35,0.5))' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-navy-800/40 backdrop-blur-sm">
          <h2 className="text-lg font-heading font-bold text-white">Active Campaigns</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                className="pl-9 pr-4 py-1.5 glass-input rounded-lg text-xs w-48"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 glass-input rounded-lg text-xs font-medium hover:bg-navy-900/80 transition-all">
              <Filter size={14} className="text-gray-400" />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="glass-table">
            <thead>
              <tr>
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">End Date</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Spend</th>
                <th className="px-6 py-4">Leads</th>
                <th className="px-6 py-4">CPL</th>
                <th className="px-6 py-4">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeCampaigns.map((campaign) => (
                <tr key={campaign.id} className="glass-table-row group">
                  <td className="px-6 py-4 font-medium text-white">{campaign.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      campaign.platform === 'TikTok' ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20" :
                      campaign.platform === 'Instagram' ? "bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20" :
                      campaign.platform === 'Snapchat' ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    )}>
                      {campaign.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                      campaign.status === 'Active' ? "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full shadow-sm",
                        campaign.status === 'Active' ? "bg-emerald-glow" : "bg-gray-500"
                      )}></span>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">{campaign.startDate}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">{campaign.endDate}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{campaign.budget}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{campaign.spend}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{campaign.leads}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{campaign.cpl}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-mono font-bold",
                      campaign.roi.startsWith('+') ? "text-emerald-glow" : "text-red-400"
                    )}>
                      {campaign.roi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Campaign Modal */}
      {isNewCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm">
          <div className="glass-modal rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all border-gold-glow/20 shadow-[0_0_30px_rgba(245,166,35,0.1)]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-navy-800/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-glow/10 flex items-center justify-center text-gold-glow font-bold border border-gold-glow/20 shadow-[0_0_10px_rgba(245,166,35,0.1)]">
                  <Target size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-bold text-white">Create New Campaign</h2>
                  <p className="text-sm text-gray-400">Set up a new marketing campaign across your channels.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto hide-scrollbar space-y-6">
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Campaign Name</label>
                  <input 
                    type="text" 
                    className="w-full glass-input py-2.5 px-4 rounded-xl text-sm"
                    placeholder="e.g., Summer Smile Promo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Platform</label>
                    <div className="relative">
                      <select className="w-full appearance-none glass-input py-2.5 px-4 rounded-xl text-sm bg-navy-800 text-white">
                        <option value="tiktok">TikTok Ads</option>
                        <option value="instagram">Instagram</option>
                        <option value="snapchat">Snapchat</option>
                        <option value="google">Google Ads</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Budget</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-glow" />
                      <input 
                        type="number" 
                        className="w-full glass-input py-2.5 pl-9 pr-4 rounded-xl text-sm"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Start Date</label>
                    <input 
                      type="date" 
                      className="w-full glass-input py-2.5 px-4 rounded-xl text-sm text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">End Date</label>
                    <input 
                      type="date" 
                      className="w-full glass-input py-2.5 px-4 rounded-xl text-sm text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Target Audience</label>
                  <textarea 
                    className="w-full glass-input p-3 rounded-xl text-sm min-h-[80px] resize-none"
                    placeholder="Describe your target demographic (e.g., Age 18-35, interested in cosmetic dentistry...)"
                  ></textarea>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-navy-800/60 backdrop-blur-md flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsNewCampaignModalOpen(false)}
                className="px-4 py-2 bg-gold-glow/20 text-gold-glow border border-gold-glow/30 rounded-lg text-sm font-bold hover:bg-gold-glow/30 transition-all shadow-[0_0_10px_rgba(245,166,35,0.1)]"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
