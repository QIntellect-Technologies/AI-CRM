import React, { useState, useEffect } from 'react';
import {
  Search, Menu, Plus, Star, Clock, List, Target, LayoutDashboard,
  FileText, Folder, Settings, MessageCircle, Command, Activity,
  ChevronDown, ChevronUp, Users, Calendar, PhoneCall, BrainCircuit, UserCircle, 
  Bell, Sparkles, MapPin, CalendarDays
} from 'lucide-react';
import { cn } from '../lib/utils';
import { api } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Layout({ children, currentView, setCurrentView }: LayoutProps) {
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = await api.getNotifications();
        setNotifications(notifs);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchNotifications();
    
    // Auto-refresh notifications every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (e) {
      console.error(e);
    }
  };

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
      <aside className="w-72 flex flex-col py-6 shrink-0 border-r border-white/5 bg-gradient-to-b from-navy-800/80 to-navy-900/90 backdrop-blur-2xl z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-4 px-6 mb-10 w-full group cursor-pointer">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-glow to-blue-600 p-[1px] shadow-[0_0_20px_rgba(0,212,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all duration-500">
            <div className="w-full h-full bg-navy-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/20 to-blue-600/20"></div>
              <span className="font-heading font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-glow relative z-10">M</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-heading font-extrabold text-xl text-white tracking-wide group-hover:text-cyan-glow transition-colors">MHBS</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow shadow-[0_0_5px_rgba(0,229,160,0.8)] animate-pulse"></span>
              <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">Systems Pro</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 mb-4">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Main Menu</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 px-4 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => setCurrentView(item.id)} 
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden w-full text-left",
                  isActive 
                    ? "bg-gradient-to-r from-cyan-glow/10 to-transparent border border-cyan-glow/20 shadow-[inset_4px_0_0_rgba(0,212,255,1)]" 
                    : "hover:bg-white/[0.03] border border-transparent hover:border-white/5"
                )}
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-glow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <div className={cn(
                  "relative z-10 p-1.5 rounded-lg transition-colors duration-300",
                  isActive ? "bg-cyan-glow/20 text-cyan-glow" : "text-gray-400 group-hover:text-gray-300 group-hover:bg-white/5"
                )}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <span className={cn(
                  "relative z-10 text-sm font-medium tracking-wide transition-all duration-300",
                  isActive ? "text-white font-semibold" : "text-gray-400 group-hover:text-gray-200 group-hover:translate-x-1"
                )}>
                  {item.label}
                </span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-cyan-glow shadow-[0_0_8px_rgba(0,212,255,0.8)]"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Agent Status Bottom */}
        <div className="mt-8 px-6 pt-6 border-t border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-glow/30 to-transparent"></div>
          
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-navy-900/60 border border-white/10 hover:border-cyan-glow/30 transition-all cursor-pointer group shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(0,212,255,0.15)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-glow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-glow to-blue-600 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-500"></div>
              <img src="https://picsum.photos/seed/agent/100/100" alt="Agent" className="relative w-11 h-11 rounded-full object-cover border-2 border-navy-900 shadow-md group-hover:border-cyan-glow/50 transition-colors" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-glow rounded-full border-[2.5px] border-navy-900 shadow-[0_0_8px_rgba(0,229,160,0.8)] z-10"></div>
            </div>
            
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-sm font-bold text-white truncate group-hover:text-cyan-glow transition-colors tracking-wide">Sara Ahmed</p>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Agent</p>
                <span className="text-[9px] font-bold text-emerald-glow bg-emerald-glow/10 px-1.5 py-0.5 rounded border border-emerald-glow/20">ONLINE</span>
              </div>
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
                className={cn("flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all text-gray-200 hover:text-white z-50", branchOpen ? "bg-white/10 text-white" : "hover:bg-white/5")}
              >
                <div className="p-1 rounded-md bg-cyan-glow/10 border border-cyan-glow/20">
                  <MapPin size={14} className="text-cyan-glow" />
                </div>
                {selectedBranch}
                <ChevronDown size={14} className={cn("text-gray-500 ml-1 transition-transform", branchOpen && "rotate-180")} />
              </button>
              {branchOpen && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setBranchOpen(false)}></div>
                  <div className="absolute top-[calc(100%+28px)] left-0 w-56 glass-panel bg-navy-900/95 backdrop-blur-xl border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] rounded-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
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
              <div 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-glow/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] transition-all z-50">
                <Bell size={20} className={cn("transition-colors", notificationsOpen ? "text-cyan-glow" : "text-gray-300 group-hover:text-cyan-glow")} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 flex h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
                  </span>
                )}
              </div>
              
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setNotificationsOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-3 w-96 glass-panel bg-navy-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_15px_50px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <span className="font-heading font-extrabold text-white tracking-wide">Notifications</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-glow bg-cyan-glow/10 px-2.5 py-1 rounded-md border border-cyan-glow/20">{unreadCount} New</span>
                    </div>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                            className={cn(
                              "flex items-start gap-4 p-3 rounded-xl transition-all cursor-pointer border", 
                              notif.is_read ? "opacity-60 hover:opacity-100 hover:bg-white/5 border-transparent" : "bg-white/5 border-white/10 hover:border-cyan-glow/30"
                            )}>
                            <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 shrink-0", 
                               notif.type === 'alert' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                               notif.type === 'action' ? 'bg-gold-glow shadow-[0_0_10px_rgba(245,166,35,0.5)]' : 
                               'bg-cyan-glow shadow-[0_0_10px_rgba(0,212,255,0.5)]'
                            )}></div>
                            <div>
                              <p className={cn("text-sm font-bold tracking-wide", 
                                notif.type === 'alert' ? 'text-red-400' : 
                                notif.type === 'action' ? 'text-gold-glow' : 
                                'text-cyan-glow'
                              )}>{notif.title}</p>
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-mono">
                                {new Date(notif.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
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

