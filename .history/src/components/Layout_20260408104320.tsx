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
        <header className="h-20 flex items-center justify-between px-8 shrink-0 border-b border-white/5 bg-navy-800/40 backdrop-blur-md relative z-50">
          
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <span>MHBS</span>
                <span className="text-gray-600">/</span>
                <span className="text-cyan-glow capitalize">{currentView.replace('-', ' ')}</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-white">CRM Dashboard</h2>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-4">
            {/* Branch Selector */}
            <div className="relative">
              <button 
                onClick={() => setBranchOpen(!branchOpen)}
                className="flex items-center gap-2 px-4 py-2 glass-input rounded-lg text-sm font-medium hover:bg-navy-900/80 transition-all"
              >
                <MapPin size={16} className="text-cyan-glow" />
                {selectedBranch}
                <ChevronDown size={14} className="text-gray-400 ml-2" />
              </button>
              {branchOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 glass-panel bg-navy-900/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-xl py-2 z-[100]">
                  {['All Branches', 'Al Nahda', 'Deira', 'Jumeirah', 'Sharjah', 'Abu Dhabi'].map(branch => (
                    <button 
                      key={branch}
                      onClick={() => { setSelectedBranch(branch); setBranchOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range */}
            <button className="flex items-center gap-2 px-4 py-2 glass-input rounded-lg text-sm font-medium hover:bg-navy-900/80 transition-all">
              <CalendarDays size={16} className="text-gray-400" />
              Today
              <ChevronDown size={14} className="text-gray-400 ml-2" />
            </button>
          </div>
          
          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-full glass-input hover:bg-white/5 transition-all">
                <Bell size={18} className="text-gray-300 group-hover:text-cyan-glow transition-colors" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-navy-900 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              </button>
              <div className="absolute top-full right-0 mt-2 w-80 glass-panel bg-navy-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all z-[100]">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="font-bold text-white text-sm">Notifications</span>
                  <span className="text-xs text-cyan-glow bg-cyan-glow/10 px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Follow-up Due', text: 'High priority lead waiting for response', time: '10 min ago', colorCls: 'bg-red-500 shadow-red-500/50', textCls: 'text-red-400' },
                    { title: 'Patient Inactive', text: 'Sarah Ahmed inactive for 45 days', time: '1 hour ago', colorCls: 'bg-yellow-500 shadow-yellow-500/50', textCls: 'text-yellow-400' },
                    { title: 'Campaign Success', text: 'TikTok ad generated 15 new leads', time: '2 hours ago', colorCls: 'bg-emerald-500 shadow-emerald-500/50', textCls: 'text-emerald-400' }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px]", notif.colorCls)}></div>
                      <div>
                        <p className={cn("text-sm font-medium", notif.textCls)}>{notif.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{notif.text}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full text-center text-xs font-medium text-gray-400 hover:text-white mt-3 pt-2 border-t border-white/5 transition-colors">
                  View All Automations
                </button>
              </div>
            </div>

            <div className="relative w-64">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-glow" size={16} />
              <input 
                type="text" 
                placeholder="Ask AI to search..." 
                className="w-full pl-10 pr-4 py-2 glass-input rounded-full text-sm"
              />
            </div>

            <div className="w-px h-8 bg-white/10 mx-2"></div>

            <button className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-xl transition-all">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">Dr. Admin</p>
                <p className="text-xs text-gray-400">Director</p>
              </div>
              <img src="https://picsum.photos/seed/admin/100/100" alt="User" className="w-10 h-10 rounded-full object-cover border border-white/10" />
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

