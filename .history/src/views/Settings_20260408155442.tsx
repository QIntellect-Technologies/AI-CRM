import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Key, Bell, CreditCard, Users, Link as LinkIcon, Smartphone, Save, CheckCircle2, User, Mail, Globe, MapPin, Search, Plus, Trash2, Edit3, Lock, Copy, RefreshCw, EyeOff, Eye, ArrowUpRight, Zap, Share2, Mic2, PlayCircle, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);

  const tabs = [
    { id: 'profile', label: 'General & Profile', icon: User },
    { id: 'rbact', label: 'Roles & Access', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       // alert("Settings updated successfully! Applying configurations...");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col pb-4 fade-in zoom-in-95 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 backdrop-blur-md bg-navy-900/30 p-5 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-inner">
             <SettingsIcon className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              System Configuration
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your workspace preferences, access controls, and integrations.</p>
          </div>
        </div>
        <button 
           onClick={handleSave}
           disabled={loading}
           className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
        >
          {loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? 'Committing Changes...' : 'Save Configuration'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 overflow-hidden flex-1 relative z-10">
        
        {/* LEFT NAV SIDEBAR */}
        <div className="w-full md:w-64 glass-panel rounded-2xl p-4 shrink-0 flex flex-col gap-2 shadow-2xl h-fit border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm group",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/5 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] select-none"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent select-none"
              )}
            >
              <tab.icon size={18} className={cn(
                 "transition-transform",
                 activeTab === tab.id ? "scale-110" : "group-hover:scale-110 text-gray-500 group-hover:text-gray-300"
              )} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN SETTINGS CANVAS */}
        <div className="flex-1 glass-panel rounded-2xl p-6 md:p-8 overflow-y-auto custom-scrollbar relative shadow-2xl border-white/5">
          
          {/* PROFILE & GENERAL */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                 <h2 className="text-xl font-bold text-white mb-1">Company Profile</h2>
                 <p className="text-gray-400 text-sm">Update your clinic or enterprise base parameters.</p>
              </div>

              <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                 <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-navy-800 to-black border-2 border-dashed border-cyan-500/50 flex items-center justify-center overflow-hidden">
                       <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AC</span>
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Edit3 size={20} className="text-white" />
                    </div>
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-lg">Aesthetic Clinics UAE</h3>
                    <p className="text-cyan-400 text-sm font-medium mt-1">Enterprise Workspace</p>
                    <button className="text-gray-400 text-xs hover:text-white transition-colors mt-2 underline">Change Logo</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Workspace Name</label>
                    <div className="relative">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                       <input type="text" defaultValue="Aesthetic Clinics UAE" className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none transition-all placeholder:text-gray-600 block" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Email</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                       <input type="email" defaultValue="admin@aesthetic.ae" className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none transition-all placeholder:text-gray-600 block" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location / Tax HQ</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                       <input type="text" defaultValue="Marina Plaza, Level 24, Dubai" className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none transition-all placeholder:text-gray-600 block" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Default Currency</label>
                    <div className="relative">
                       <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                       <select className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                          <option value="AED">AED - UAE Dirham</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="SAR">SAR - Saudi Riyal</option>
                       </select>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ROLES & PERMISSIONS */}
          {activeTab === 'rbact' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                 <div>
                    <h2 className="text-xl font-bold text-white mb-1">Access Control matrix</h2>
                    <p className="text-gray-400 text-sm">Define what your staff can see and do.</p>
                 </div>
                 <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-200 text-sm font-bold hover:bg-white/10 flex items-center gap-2 transition-colors">
                    <Plus size={16}/> Create Custom Role
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                
                {/* Operations Manager Role */}
                <div className="bg-navy-900/50 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-inner">
                           <Shield size={20} className="text-emerald-400" />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-emerald-400">System Admin</h3>
                           <p className="text-xs text-emerald-500/70 font-mono tracking-wider">FULL_ACCESS</p>
                        </div>
                     </div>
                     <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-emerald-500/20">3 Assigned</span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6 relative z-10 line-clamp-2">Complete control over the CRM. Can delete records, export patient databases, and change billing parameters.</p>
                  
                  <div className="space-y-3 relative z-10 mb-6">
                    {['Global Dashboard Viewing', 'Delete / Export Records', 'Modify Automation Routes', 'Billing & API Access'].map((perm, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                        <CheckCircle2 size={16} className="text-emerald-400" /> {perm}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 relative z-10">
                     <button className="flex-1 py-2.5 bg-black/40 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 transition-colors rounded-xl border border-white/5 hover:border-emerald-500/30 text-sm font-bold flex items-center justify-center gap-2">
                        <Edit3 size={16}/> Edit Matrix
                     </button>
                     <button className="px-4 py-2.5 bg-black/40 text-gray-500 rounded-xl border border-white/5 cursor-not-allowed" title="Cannot delete system default role">
                        <Lock size={16}/>
                     </button>
                  </div>
                </div>

                {/* Call Center Agent Role */}
                <div className="bg-navy-900/50 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-inner">
                           <Users size={20} className="text-cyan-400" />
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-cyan-400">Call Agent</h3>
                           <p className="text-xs text-cyan-500/70 font-mono tracking-wider">RESTRICTED</p>
                        </div>
                     </div>
                     <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-cyan-500/20">24 Assigned</span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6 relative z-10 line-clamp-2">Standard operations role for handling inbound calls, booking appointments, and following up on basic leads.</p>
                  
                  <div className="space-y-3 relative z-10 mb-6">
                    {['View Assigned Leads Only', 'Execute Dial Campaigns', 'Schedule Calendar Slots', 'View Personal KPIs'].map((perm, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                        <CheckCircle2 size={16} className="text-cyan-400" /> {perm}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 relative z-10">
                     <button className="flex-1 py-2.5 bg-black/40 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 transition-colors rounded-xl border border-white/5 hover:border-cyan-500/30 text-sm font-bold flex items-center justify-center gap-2">
                        <Edit3 size={16}/> Edit Matrix
                     </button>
                     <button className="px-4 py-2.5 bg-black/40 text-red-400 hover:bg-red-500/20 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors">
                        <Trash2 size={16}/>
                     </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                 <div>
                    <h2 className="text-xl font-bold text-white mb-1">Connected Apps</h2>
                    <p className="text-gray-400 text-sm">Supercharge your CRM by connecting external data sources.</p>
                 </div>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input type="text" placeholder="Search integrations..." className="bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 outline-none" />
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  { name: 'WhatsApp Business API', desc: 'Automated conversational flows & instant appointment reminders.', icon: Smartphone, status: 'Active', color: 'emerald' },
                  { name: 'Meta Lead Core (FB/IG)', desc: 'Real-time webhook sync mapping Facebook leads to CRM pipeline.', icon: Share2, status: 'Active', color: 'blue' },
                  { name: 'Twilio Virtual PBX', desc: 'SIP trunking architecture for internal dialer and call recordings.', icon: Mic2, status: 'Active', color: 'purple' },
                  { name: 'TikTok Ads Engine', desc: 'Secure OAuth bridging for viral campaign lead routing.', icon: PlayCircle, status: 'Configuring', color: 'pink' },
                  { name: 'Stripe Payment Gateway', desc: 'Collect online deposits and store transparent ledger histories.', icon: CreditCard, status: 'Disconnected', color: 'gray' },
                  { name: 'Zoom Conferencing', desc: 'Automatic meeting generation for telehealth telemedicine routines.', icon: Monitor, status: 'Disconnected', color: 'gray' },
                ].map((intg, i) => (
                  <div key={i} className="flex flex-col justify-between p-5 bg-black/20 border border-white/5 rounded-2xl group hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "p-3 rounded-xl shadow-lg border",
                           intg.color === 'emerald' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]" :
                           intg.color === 'blue' ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]" :
                           intg.color === 'purple' ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]" :
                           intg.color === 'pink' ? "bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.15)]" :
                           "bg-gray-500/10 text-gray-400 border-gray-500/20 shadow-[0_0_15px_rgba(156,163,175,0.15)]"
                         )}>
                           <intg.icon size={22} />
                         </div>
                         <div>
                           <h4 className="text-white font-bold">{intg.name}</h4>
                           <span className={cn(
                             "text-[10px] font-bold uppercase tracking-widest mt-1 inline-block",
                             intg.status === 'Active' ? "text-emerald-400" : intg.status === 'Configuring' ? "text-amber-400 animate-pulse" : "text-gray-500"
                           )}>
                             {intg.status}
                           </span>
                         </div>
                      </div>
                      
                      {/* Toggle Switch */}
                      <button className={cn(
                        "w-12 h-6 rounded-full relative transition-colors focus:outline-none",
                        intg.status === 'Active' ? "bg-emerald-500" : "bg-gray-700"
                      )}>
                         <span className={cn(
                           "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                           intg.status === 'Active' ? "translate-x-6" : "translate-x-0"
                         )}></span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">{intg.desc}</p>
                    
                    {intg.status === 'Active' && (
                       <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                          <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded border border-white/5">Settings</button>
                          <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded border border-white/5">View Logs</button>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API KEYS */}
          {activeTab === 'api' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                 <div className="max-w-lg">
                    <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Key className="text-cyan-400"/> Developer API Keys</h2>
                    <p className="text-gray-400 text-sm">Secure tokens for programmatic access to your infrastructure. Do not share these publicly.</p>
                 </div>
                 <button className="px-5 py-2 min-w-max bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center gap-2">
                    <Plus size={16}/> Generate New Token
                 </button>
              </div>

              <div className="overflow-x-auto print:overflow-visible bg-black/20 rounded-2xl border border-white/5">
                 <table className="w-full text-left text-sm border-collapse">
                    <thead>
                       <tr className="border-b border-white/5">
                          <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Token Name</th>
                          <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Secret Key</th>
                          <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Created</th>
                          <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Last Used</th>
                          <th className="p-4 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Revoke</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {[
                         { id: '1', name: 'Zapier Form Automation', prefix: 'sk_prod_59x1...', created: 'Oct 12, 2025', used: '2 mins ago', active: true },
                         { id: '2', name: 'Internal ERP Hook', prefix: 'sk_prod_11a3...', created: 'Sep 04, 2025', used: '5 hours ago', active: true },
                       ].map((token) => (
                          <tr key={token.id} className="hover:bg-white/5 transition-colors">
                             <td className="p-4 text-white font-medium flex items-center gap-2">
                                <Zap size={14} className="text-amber-400" /> {token.name}
                             </td>
                             <td className="p-4">
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-white/5 w-max">
                                   <span className="font-mono text-xs text-gray-300">
                                      {showKey === token.id ? 'sk_prod_' + Math.random().toString(36).substr(2, 24) : token.prefix + '••••••••'}
                                   </span>
                                   <button 
                                      onClick={() => setShowKey(showKey === token.id ? null : token.id)}
                                      className="text-gray-500 hover:text-cyan-400 transition-colors ml-2"
                                   >
                                      {showKey === token.id ? <EyeOff size={14}/> : <Eye size={14}/>}
                                   </button>
                                   <button className="text-gray-500 hover:text-white transition-colors"><Copy size={14}/></button>
                                </div>
                             </td>
                             <td className="p-4 text-gray-400 text-xs font-mono">{token.created}</td>
                             <td className="p-4 text-gray-400 text-xs font-mono">{token.used}</td>
                             <td className="p-4 text-right">
                                <button className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20">
                                   <Trash2 size={14} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 max-w-3xl">
              <div className="border-b border-white/5 pb-4">
                 <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Bell className="text-emerald-400"/> Alert Preferences</h2>
                 <p className="text-gray-400 text-sm">Control how and when the system alerts your internal users.</p>
              </div>

              {[
                { section: 'New Lead Acquisition', desc: 'When viral campaigns generate new patient profiles.', email: true, push: true, sms: false },
                { section: 'Appointment Bookings', desc: 'When calendar slots are confirmed or rescheduled.', email: true, push: true, sms: true },
                { section: 'Billing & Invoices', desc: 'When payments clear or refunds are issued.', email: true, push: false, sms: false },
                { section: 'System Security', desc: 'Failed logins, new IP addresses, API key generations.', email: true, push: true, sms: true },
              ].map((grp, i) => (
                 <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5 last:border-0">
                    <div className="flex-1">
                       <h4 className="text-white font-bold text-base">{grp.section}</h4>
                       <p className="text-gray-400 text-sm mt-1">{grp.desc}</p>
                    </div>
                    <div className="flex gap-3 bg-black/20 p-2 rounded-xl border border-white/5 shrink-0">
                       <label className="flex flex-col items-center gap-2 cursor-pointer group">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-white transition-colors">Email</span>
                          <input type="checkbox" defaultChecked={grp.email} className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500/50 bg-black/40 cursor-pointer accent-cyan-500" />
                       </label>
                       <div className="w-px bg-white/10 mx-2"></div>
                       <label className="flex flex-col items-center gap-2 cursor-pointer group">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-white transition-colors">Push</span>
                          <input type="checkbox" defaultChecked={grp.push} className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500/50 bg-black/40 cursor-pointer accent-cyan-500" />
                       </label>
                       <div className="w-px bg-white/10 mx-2"></div>
                       <label className="flex flex-col items-center gap-2 cursor-pointer group">
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-white transition-colors">SMS</span>
                          <input type="checkbox" defaultChecked={grp.sms} className="w-5 h-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500/50 bg-black/40 cursor-pointer accent-cyan-500" />
                       </label>
                    </div>
                 </div>
              ))}
            </div>
          )}

          {/* BILLING & PLANS */}
          {activeTab === 'billing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="border-b border-white/5 pb-4">
                 <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><CreditCard className="text-amber-400"/> Subscription & Billing</h2>
                 <p className="text-gray-400 text-sm">Manage your CRM licensing, payment methods, and current quotas.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Current Plan Card */}
                 <div className="lg:col-span-2 bg-gradient-to-br from-navy-800 to-black border border-amber-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
                    
                    <div className="flex justify-between items-start relative z-10">
                       <div>
                          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-amber-500/30 mb-4 inline-block">Active Plan</span>
                          <h3 className="text-3xl font-extrabold text-white">Enterprise CRM</h3>
                          <p className="text-gray-400 mt-1">Unlimited branches & high-volume routing capabilities.</p>
                       </div>
                       <div className="text-right">
                          <h3 className="text-3xl font-bold font-mono text-white">$499<span className="text-sm text-gray-500">/mo</span></h3>
                          <p className="text-xs text-gray-500 mt-1">Renews Oct 15, 2026</p>
                       </div>
                    </div>

                    <div className="mt-8 space-y-4 relative z-10">
                       <div>
                          <div className="flex justify-between text-sm mb-2">
                             <span className="text-gray-400 font-bold">User Seats (27 / 50)</span>
                             <span className="text-amber-400 font-mono">54%</span>
                          </div>
                          <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                             <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '54%' }}></div>
                          </div>
                       </div>
                       <div>
                          <div className="flex justify-between text-sm mb-2">
                             <span className="text-gray-400 font-bold">API Storage Call Volume (840k / 1M)</span>
                             <span className="text-emerald-400 font-mono">84%</span>
                          </div>
                          <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                             <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '84%' }}></div>
                          </div>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                       <button className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                          Upgrade to Unlimited <ArrowUpRight size={16}/>
                       </button>
                       <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 transition-colors text-sm font-bold">Manage Plan</button>
                    </div>
                 </div>

                 {/* Payment Method */}
                 <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                       <h3 className="text-white font-bold text-lg mb-4">Payment Method</h3>
                       <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                          <div className="w-12 h-8 bg-gradient-to-tr from-blue-800 to-blue-600 rounded flex items-center justify-center font-bold text-white text-xs italic">VISA</div>
                          <div>
                             <p className="text-white font-bold font-mono tracking-wider">•••• 4242</p>
                             <p className="text-xs text-gray-500 mt-0.5">Expires 12/28</p>
                          </div>
                       </div>
                    </div>
                    <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded border border-white/10 transition-colors text-sm font-bold mt-6">
                       Update Payment Details
                    </button>
                 </div>
              </div>

              <h3 className="text-white font-bold mt-8 mb-4">Recent Invoices</h3>
              <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 border-b border-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                       <tr><th className="p-4">Date</th><th className="p-4">Invoice</th><th className="p-4">Amount</th><th className="p-4 text-right">PDF</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {['Sep 15, 2025', 'Aug 15, 2025', 'Jul 15, 2025'].map((date, i) => (
                          <tr key={i} className="hover:bg-white/5 text-gray-300 font-medium">
                             <td className="p-4 font-mono text-xs">{date}</td>
                             <td className="p-4">INV-{4092 - i}</td>
                             <td className="p-4 font-mono text-white">$499.00</td>
                             <td className="p-4 text-right">
                                <button className="text-cyan-400 hover:text-cyan-300 underline text-xs">Download</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
