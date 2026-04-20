import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, DollarSign, Users, Plus, ArrowUpRight, ArrowDownRight, Filter, Search, X, BarChart3, PieChart, Activity, Zap, PlayCircle, Eye, HandHeart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell, PieChart as RechartsPieChart, Pie } from 'recharts';
import { cn } from '../lib/utils';
import { api } from '../services/api';
import { GlobalLoader } from '../components/GlobalLoader';

const platforms = ['All', 'Instagram', 'TikTok', 'Snapchat', 'Google Ads', 'Facebook', 'Website'];

const platformColors = {
  Instagram: '#E4405F',
  TikTok: '#ffffff',
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
        setMarketingData(marketingRes.data || []);
        setLeadsData(leadsRes.data || []);
      } catch (error) {
        console.error('Error fetching marketing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <GlobalLoader label="Syncing Ad Engines..." subLabel="Pulling live ROI analytics via connected APIs" />;
  }

  // --- Dynamic Dashboard Metrics Based on Platform --- //
  const getMetrics = () => {
    if (activeTab === 'Google Ads') {
      return [
        { label: 'Search Imp. Share', value: '78.4%', trend: '+4%', icon: Eye, color: 'text-blue-400' },
        { label: 'Avg. CPC', value: '$2.14', trend: '-8%', icon: DollarSign, color: 'text-green-400' },
        { label: 'ROAS', value: '4.2x', trend: '+1.2x', icon: TrendingUp, color: 'text-emerald-400' },
        { label: 'Cost / Lead', value: '$45.20', trend: '-$5.10', icon: Target, color: 'text-purple-400' }
      ];
    }
    if (activeTab === 'TikTok' || activeTab === 'Instagram') {
      return [
        { label: 'Engagement Rate', value: '12.8%', trend: '+3.2%', icon: HandHeart, color: 'text-pink-400' },
        { label: 'Video Completion', value: '45.1%', trend: '+10%', icon: PlayCircle, color: 'text-cyan-400' },
        { label: 'Follower Growth', value: '+1,240', trend: '+400', icon: Users, color: 'text-yellow-400' },
        { label: 'Cost / View', value: '$0.02', trend: '-$0.01', icon: DollarSign, color: 'text-green-400' }
      ];
    }
    if (activeTab === 'Website') {
      return [
        { label: 'Unique Visitors', value: '24,592', trend: '+15%', icon: Users, color: 'text-indigo-400' },
        { label: 'Bounce Rate', value: '42.1%', trend: '-4%', icon: ArrowDownRight, color: 'text-red-400' },
        { label: 'Avg Session', value: '2m 14s', trend: '+12s', icon: Activity, color: 'text-green-400' },
        { label: 'Goal Completes', value: '412', trend: '+22', icon: Target, color: 'text-yellow-400' }
      ];
    }
    // Default / All
    return [
      { label: 'Total Leads', value: leadsData.length, trend: '+12%', icon: Users, color: 'text-cyan-400' },
      { label: 'Total Spend', value: '$12,450', trend: '+8%', icon: DollarSign, color: 'text-red-400' },
      { label: 'Avg Cost/Lead', value: '$38.50', trend: '-$2.10', icon: Target, color: 'text-emerald-400' },
      { label: 'Total Conversions', value: '142', trend: '+15%', icon: TrendingUp, color: 'text-purple-400' }
    ];
  };

  const metrics = getMetrics();

  // --- Mock Active Campaigns for Platform --- //
  const activeCampaigns = [
    { name: 'Summer Smile Promo', platform: 'Instagram', status: 'Active', spend: '$1,200', cpl: '$24', roas: '3.4x' },
    { name: 'Invisalign Retargeting', platform: 'Facebook', status: 'Learning', spend: '$450', cpl: '$32', roas: '2.1x' },
    { name: 'Local Search Exact Match', platform: 'Google Ads', status: 'Active', spend: '$2,800', cpl: '$54', roas: '4.8x' },
    { name: 'Viral Toothbrush Challenge', platform: 'TikTok', status: 'Active', spend: '$800', cpl: '$14', roas: '6.2x' },
    { name: 'Weekend Cleaning Special', platform: 'Snapchat', status: 'Paused', spend: '$150', cpl: '$45', roas: '1.2x' }
  ].filter(c => activeTab === 'All' || c.platform === activeTab);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 relative">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-6 rounded-2xl border border-white/5">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="text-cyan-glow animate-pulse" size={32} />
            Marketing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Command Center</span>
          </h1>
          <p className="text-gray-400">Deep-dive analytics, ad spends, and conversion tracking across all platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-navy-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-navy-700 transition-colors shadow-lg">
            <Filter size={18} />
            Date Range
          </button>
          <button 
            onClick={() => setIsNewCampaignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <Plus size={18} />
            New Campaign
          </button>
        </div>
      </div>

      {/* Dynamic AI Insight Bar */}
      <div className="bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-purple-500/20 rounded-xl p-4 flex items-start sm:items-center gap-4 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
        <div className="p-3 bg-purple-500/20 rounded-lg shrink-0">
          <Zap className="text-purple-400 animate-pulse" size={24} />
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">AI Campaign Intelligence</h3>
          <p className="text-gray-300 text-sm">
            {activeTab === 'All' && 'Overall acquisition costs dropped 8% this week. Shifting $500 from Snapchat to TikTok could yield +14 more leads.'}
            {activeTab === 'Instagram' && 'Instagram Stories are converting 3x higher than grid posts. Consider doubling the budget for "Summer Smile Promo".'}
            {activeTab === 'TikTok' && 'Unprecedented engagement detected! Cost Per View is $0.02. This is your most efficient top-of-funnel channel.'}
            {activeTab === 'Google Ads' && 'Your "Local Search Exact Match" campaign is hitting a 4.8x ROAS. We recommend increasing its daily cap by 20%.'}
            {activeTab === 'Facebook' && 'Retargeting campaigns are in "Learning" phase. Cost per lead may stabilize in 48 hours.'}
            {activeTab === 'Website' && 'Organic traffic to the "Services" page increased by 15%. Consider adding a stronger Call-To-Action form there.'}
            {activeTab === 'Snapchat' && 'Weekend Special performed poorly. Paused to prevent budget bleed. Suggest revising ad creatives.'}
          </p>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="glass-panel p-2 rounded-xl flex items-center gap-2 overflow-x-auto scrollbar-hide border border-white/5">
        {platforms.map((platform) => {
          return (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0",
                activeTab === platform
                  ? "bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "bg-transparent text-gray-400 border border-transparent hover:bg-white/5"
              )}
            >
              {platform !== 'All' && (
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: platformColors[platform as keyof typeof platformColors] }}
                />
              )}
              {platform}
            </button>
          );
        })}
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="glass-panel border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="flex items-center justify-between z-10 relative">
              <div>
                <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{metric.value}</p>
              </div>
              <div className={cn("p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm", metric.color.replace('text-', 'text-shadow-').replace('400', 'glow'))}>
                <metric.icon className={metric.color} size={28} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm z-10 relative">
              {metric.trend.startsWith('+') ? (
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-400 mr-1 rotate-180" />
              )}
              <span className={metric.trend.startsWith('+') ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                {metric.trend}
              </span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Visualizations Zone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Funnel / Demographics Data */}
        <div className="glass-panel border-white/5 rounded-xl p-6 relative overflow-hidden h-[380px]">
          <h3 className="text-lg font-medium text-white mb-2 text-center">Audience Demographics</h3>
          <p className="text-sm text-gray-400 mb-4 text-center">Age & Interaction for {activeTab}</p>
          
          <div className="absolute inset-0 top-16 flex flex-col justify-center items-center">
            <ResponsiveContainer width="90%" height="80%">
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: '18-24', value: activeTab === 'TikTok' ? 40 : 15, color: '#22d3ee' },
                    { name: '25-34', value: activeTab === 'Instagram' ? 35 : 25, color: '#a855f7' },
                    { name: '35-44', value: 30, color: '#3b82f6' },
                    { name: '45+', value: activeTab === 'Facebook' ? 40 : 10, color: '#eab308' },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {[
                    { color: '#22d3ee' },
                    { color: '#a855f7' },
                    { color: '#3b82f6' },
                    { color: '#eab308' },
                  ].map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-3xl font-bold text-white shadow-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">4.2k</span>
              <span className="text-sm text-gray-400">Interactions</span>
            </div>
          </div>
        </div>

        {/* Main Chart area (Dual Axis Funnel or Spends vs Returns) */}
        <div className="md:col-span-2 glass-panel border-white/5 rounded-xl p-6 h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">{activeTab === 'All' ? 'Overall Lead Acquisition vs Spend' : `${activeTab} Performance Trend`}</h3>
              <p className="text-sm text-gray-400">Comparing ad expenditures against generated pipelines.</p>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketingData.slice(0,7)}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="spend" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="glass-panel border-white/5 rounded-xl p-6 overflow-hidden">
         <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">Active {activeTab !== 'All' ? activeTab : ''} Campaigns</h3>
              <p className="text-sm text-gray-400">Detailed breakdown of currently running ad sets.</p>
            </div>
            <button className="text-cyan-400 text-sm hover:text-cyan-300 font-medium hidden sm:block">View Full Report &rarr;</button>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="pb-4 font-semibold px-4">Campaign Name</th>
                  <th className="pb-4 font-semibold px-4">Platform</th>
                  <th className="pb-4 font-semibold px-4">Status</th>
                  <th className="pb-4 font-semibold px-4">Spend</th>
                  <th className="pb-4 font-semibold px-4">Cost / Lead</th>
                  <th className="pb-4 font-semibold px-4">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {activeCampaigns.length > 0 ? activeCampaigns.map((campaign, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-medium text-white">{campaign.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shadow-md" style={{ backgroundColor: platformColors[campaign.platform as keyof typeof platformColors] }} />
                        <span className="text-sm text-gray-300">{campaign.platform}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        campaign.status === 'Active' ? "bg-green-500/20 text-green-400 border border-green-500/20" :
                        campaign.status === 'Learning' ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20" :
                        "bg-red-500/20 text-red-400 border border-red-500/20"
                      )}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">{campaign.spend}</td>
                    <td className="py-4 px-4 text-sm font-medium text-cyan-400">{campaign.cpl}</td>
                    <td className="py-4 px-4 text-sm font-bold text-white bg-gray-800/80 w-max px-3 py-1 rounded-lg border border-gray-700/50">{campaign.roas}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No active campaigns found for {activeTab}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}