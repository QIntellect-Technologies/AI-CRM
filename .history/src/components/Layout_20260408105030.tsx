import React, { useState } from 'react';
import { 
  Search, Menu, Plus, Star, Clock, List, Target, LayoutDashboard, 
  FileText, Folder, Settings, MessageCircle, Command, Activity,
  ChevronDown, ChevronUp, Users, Calendar, PhoneCall, BrainCircuit, UserCircle,
  Bell, Sparkles, MapPin, CalendarDays
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Layout({ children, currentView, setCurrentView }: LayoutProps) {
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All Branches');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads Pipeline', icon: Users },
    { id: 'callcenter', label: 'Call Center', icon: PhoneCall },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: UserCircle },
    { id: 'workflows', label: 'Automations', icon: Command },
    { id: 'invoices', label: 'Billing System', icon: FileText },
    { id: 'marketing', label: 'Marketing', icon: Target },
    { id: 'reports', label: 'Reports', icon: Activity },
    { id: 'ai-insights', label: 'AI Insights', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-navy-900 font-sans text-gray-200 overflow-hidden selection:bg-cyan-glow/30 selection:text-cyan-glow relative">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-glow/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-glow/10 blur-[120px] pointer-events-none"></div>
      
      {/* Left Sidebar */}
      <aside className="w-64 flex flex-col py-6 shrink-0 border-r border-white/5 bg-navy-800/40 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3 px-6 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-glow to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            M
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-white tracking-wide">MHBS</h1>
            <p className="text-[10px] text-cyan-glow uppercase tracking-widest font-medium">Services</p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setCurrentView(item.id)} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 relative group text-sm font-medium",
                  isActive 
                    ? "text-white bg-white/5" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-glow rounded-r-full shadow-[0_0_10px_rgba(0,212,255,0.8)]"></div>
                )}
                <Icon size={18} className={isActive ? "text-cyan-glow" : "text-gray-500 group-hover:text-gray-300 transition-colors"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Agent Status Bottom */}
        <div className="mt-auto px-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900/50 border border-white/5">
            <div className="relative">
              <img src="https://picsum.photos/seed/agent/100/100" alt="Agent" className="w-10 h-10 rounded-full object-cover border border-white/10" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-glow rounded-full border-2 border-navy-900 shadow-[0_0_8px_rgba(0,229,160,0.8)]"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Sara Ahmed</p>
              <p className="text-xs text-gray-400 truncate">Online • Agent</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        {/* Top Header Bar */}
        <header className="h-24 flex items-center justify-between px-8 shrink-0 relative z-50 bg-gradient-to-b from-navy-900/90 to-navy-800/40 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1.5">
                <span className="hover:text-gray-300 cursor-pointer transition-colors">MHBS</span>
                <span className="text-gray-600">/</span>
                <span className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">{currentView.replace('-', ' ')}</span>
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                CRM Dashboard
              </h2>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-3 bg-navy-900/60 p-1.5 rounded-2xl border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]">
            {/* Branch Selector */}
            <div className="relative">
              <button 
                onClick={() => setBranchOpen(!branchOpen)}
                className="flex items-center gap-2 px-5 py-2 hover:bg-white/5 rounded-xl text-sm font-semibold transition-all text-gray-200 hover:text-white"
              >
                <div className="p-1 rounded-md bg-cyan-glow/10 border border-cyan-glow/20">
                  <MapPin size={14} className="text-cyan-glow" />
                </div>
                {selectedBranch}
                <ChevronDown size={14} className="text-gray-500 ml-1" />
              </button>
              {branchOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 glass-panel bg-navy-900/95 backdrop-blur-xl border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] rounded-2xl py-2 z-[100]">
                  <div className="px-4 py-2 border-b border-white/5 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Select Region</span>
                  </div>
                  {['All Branches', 'Al Nahda', 'Deira', 'Jumeirah', 'Sharjah', 'Abu Dhabi'].map(branch => (
                    <button 
                      key={branch}
                      onClick={() => { setSelectedBranch(branch); setBranchOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <MapPin size={12} className="text-gray-500 group-hover:text-cyan-glow transition-colors" /> {branch}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-white/10"></div>

            {/* Date Range */}
            <button className="flex items-center gap-2 px-5 py-2 hover:bg-white/5 rounded-xl text-sm font-semibold transition-all text-gray-200 hover:text-white">
              <div className="p-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                <CalendarDays size={14} className="text-purple-400" />
              </div>
              Today
              <ChevronDown size={14} className="text-gray-500 ml-1" />
            </button>
          </div>
          
          {/* Right Controls */}
          <div className="flex items-center gap-5">
            {/* Search Bar - Advanced */}
            <div className="relative w-64 group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-glow/20 to-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative flex items-center bg-navy-900/80 border border-white/10 rounded-full overflow-hidden focus-within:border-cyan-glow/50 focus-within:shadow-[0_0_15px_rgba(0,212,255,0.15)] transition-all">
                <div className="pl-4 pr-2">
                  <Sparkles className="text-cyan-glow animate-pulse" size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Ask AI to search..." 
                  className="w-full py-2.5 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-gray-500"
                />
                <div className="pr-3">
                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10">
                    <Command size={10} className="text-gray-400" />
                    <span className="text-[10px] font-mono text-gray-400 font-bold">K</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10"></div>

            {/* Notifications Dropdown */}
            <div className="relative group cursor-pointer">
              <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-glow/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] transition-all z-50">
                <Bell size={20} className="text-gray-300 group-hover:text-cyan-glow transition-colors" />
                <span className="absolute top-2.5 right-2.5 w-2 flex h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
                </span>
              </div>
              <div className="absolute top-full right-0 mt-3 w-80 glass-panel bg-navy-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_15px_50px_rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all duration-300 origin-top-right z-[100]">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="font-heading font-extrabold text-white tracking-wide">Notifications</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-glow bg-cyan-glow/10 px-2.5 py-1 rounded-md border border-cyan-glow/20">3 New</span>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Follow-up Due', text: 'High priority lead waiting for response', time: '10 min ago', colorCls: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]', textCls: 'text-red-400' },
                    { title: 'Patient Inactive', text: 'Sarah Ahmed inactive for 45 days', time: '1 hour ago', colorCls: 'bg-gold-glow shadow-[0_0_10px_rgba(245,166,35,0.5)]', textCls: 'text-gold-glow' },
                    { title: 'Campaign Success', text: 'TikTok ad generated 15 new leads', time: '2 hours ago', colorCls: 'bg-emerald-glow shadow-[0_0_10px_rgba(0,229,160,0.5)]', textCls: 'text-emerald-glow' }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/5">
                      <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", notif.colorCls)}></div>
                      <div>
                        <p className={cn("text-sm font-bold tracking-wide", notif.textCls)}>{notif.title}</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{notif.text}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-mono">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-3 mt-5 rounded-xl bg-gradient-to-r from-cyan-glow/10 to-blue-500/10 hover:from-cyan-glow/20 hover:to-blue-500/20 border border-cyan-glow/20 hover:border-cyan-glow/40 text-[11px] font-bold uppercase tracking-widest text-cyan-glow hover:text-white transition-all shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                  View All Automations
                </button>
              </div>
            </div>

            {/* Profile Menu */}
            <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-1.5 pr-4 rounded-full border border-white/5 hover:border-white/10 transition-all group">
              <div className="relative">
                <img src="https://picsum.photos/seed/admin/100/100" alt="User" className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-cyan-glow/50 transition-colors" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-glow rounded-full border-2 border-navy-900 shadow-[0_0_8px_rgba(0,229,160,0.8)]"></div>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-white group-hover:text-cyan-glow transition-colors tracking-wide">Dr. Admin</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Director</p>
              </div>
              <ChevronDown size={14} className="text-gray-500 ml-2 group-hover:text-white transition-colors" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

