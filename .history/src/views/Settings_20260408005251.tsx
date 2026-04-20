import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Key, Bell, CreditCard, Users, Link as LinkIcon, Smartphone, Save } from 'lucide-react';
import { cn } from '../lib/utils';

export function Settings() {
  const [activeTab, setActiveTab] = useState('rbact');

  const tabs = [
    { id: 'rbact', label: 'Roles & Permissions', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing Settings', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <SettingsIcon className="text-cyan-glow" />
            System Settings
          </h1>
          <p className="text-gray-400 mt-1">Configure CRM preferences, API tokens, and access roles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all font-medium text-sm shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6 overflow-hidden">
        {/* Left Sidebar for Settings Tabs */}
        <div className="w-full md:w-64 glass-panel rounded-2xl p-4 shrink-0 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-glow/20 to-blue-500/10 text-cyan-glow border border-cyan-glow/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Panel Content */}
        <div className="flex-1 glass-panel rounded-2xl p-6 overflow-y-auto hide-scrollbar relative">
          
          {/* Role Based Access Control Tab */}
          {activeTab === 'rbact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Roles & Permissions Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Operations Manager Role */}
                <div className="bg-navy-900 border border-emerald-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl group-hover:opacity-30 transition-opacity">
                    <Shield size={64} className="text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">Operations Manager (Admin)</h3>
                  <p className="text-sm text-gray-400 mb-4">Full access to dashboard, marketing stats, routing assignments, and branch metrics.</p>
                  
                  <div className="space-y-2">
                    {['View Global Dashboards', 'Modify Automations', 'Manage Users & Access', 'Billing Access'].map((perm, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                        {perm}
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2 bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 transition-colors rounded border border-white/10 text-sm font-medium">
                    Edit Role
                  </button>
                </div>

                {/* Call Center Agent Role */}
                <div className="bg-navy-900 border border-cyan-glow/20 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl group-hover:opacity-30 transition-opacity">
                    <Users size={64} className="text-cyan-glow" />
                  </div>
                  <h3 className="text-lg font-bold text-cyan-glow mb-2">Call Center Agent</h3>
                  <p className="text-sm text-gray-400 mb-4">Limited access. Can only view assigned leads, make calls, and book appointments.</p>
                  
                  <div className="space-y-2">
                    {['View Assigned Leads', 'Call Recording / Handling', 'Schedule Appointments', 'Daily Personal KPIs'].map((perm, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow shadow-[0_0_8px_rgba(0,212,255,0.8)]"></div>
                        {perm}
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2 bg-white/5 hover:bg-cyan-glow/20 text-gray-300 hover:text-cyan-glow transition-colors rounded border border-white/10 text-sm font-medium">
                    Edit Role
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Installed Integrations</h2>
              <div className="space-y-4">
                {[
                  { name: 'WhatsApp Business API', desc: 'Automated SMS, remiders, and patient re-engagement', icon: Smartphone, status: 'Active', colorCls: 'text-emerald-400 bg-emerald-500/20' },
                  { name: 'TikTok Ads API', desc: 'Sync TikTok lead forms instantly', icon: LinkIcon, status: 'Active', colorCls: 'text-cyan-400 bg-cyan-500/20' },
                  { name: 'Meta (IG/FB) Lead Sync', desc: 'Live syncing of campaign leads into Pipeline', icon: LinkIcon, status: 'Syncing', colorCls: 'text-blue-400 bg-blue-500/20' },
                  { name: 'Twilio Voice (Call Center)', desc: 'Agent call routing and transcription recordings', icon: Shield, status: 'Active', colorCls: 'text-emerald-400 bg-emerald-500/20' },
                ].map((intg, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-navy-900 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg", intg.colorCls)}>
                        <intg.icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{intg.name}</h4>
                        <p className="text-sm text-gray-400">{intg.desc}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
                      intg.status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse"
                    )}>
                      {intg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback for other tabs */}
          {['api', 'notifications', 'billing'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                 {activeTab === 'api' && <Key className="text-gray-400" size={32} />}
                 {activeTab === 'notifications' && <Bell className="text-gray-400" size={32} />}
                 {activeTab === 'billing' && <CreditCard className="text-gray-400" size={32} />}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 capitalize">{activeTab} Settings</h3>
              <p className="text-gray-400 max-w-md">This configuration page is currently locked. Contact your system admin to make changes to {activeTab} permissions.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}