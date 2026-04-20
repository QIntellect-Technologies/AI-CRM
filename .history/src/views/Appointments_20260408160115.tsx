import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Calendar as CalendarIcon, Clock, User, Plus, X, 
  FileText, Activity, AlertCircle, MapPin, CheckCircle2, 
  XCircle, Filter, Search, ChevronRight 
} from 'lucide-react';
import { cn, getAvatarUrl } from '../lib/utils';
import { AppointmentPopup } from '../components/AppointmentPopup';

export function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Scheduled' | 'Completed' | 'Canceled'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await Promise.all([
        api.getAppointments()
      ]);
      setAppointments(data[0]);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const handleMutation = () => fetchAppointments();
    window.addEventListener('crm-mutation', handleMutation);
    const interval = setInterval(fetchAppointments, 60000);
    return () => {
      window.removeEventListener('crm-mutation', handleMutation);
      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await api.updateAppointment(id, { status: newStatus });
      setAppointments(prev => prev.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      ));
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter !== 'All' && apt.status !== filter) return false;
    const searchLower = searchTerm.toLowerCase();
    const patientName = apt.patient_name || apt.patient_name_full || 'Unknown Patient';
    const doctorName = apt.doctor || 'Unknown Doctor';
    return patientName.toLowerCase().includes(searchLower) ||
           doctorName.toLowerCase().includes(searchLower);
  });

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    canceled: appointments.filter(a => a.status === 'Canceled').length,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative pb-10 fade-in duration-300">
      
      {/* Sticky Header & KPIs */}
      <div className="sticky top-[96px] z-[50] bg-navy-950/90 backdrop-blur-2xl pb-4 pt-4 -mx-8 px-8 rounded-b-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-b border-light-blue/10 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Appointments</h1>
            <p className="text-gray-400 mt-1">Manage clinic schedules and view patient visits.</p>
          </div>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            <Plus size={18} />
            New Appointment
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors bg-navy-900/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-500/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Total Appointments</p>
                <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <CalendarIcon size={20} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-colors bg-navy-900/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-amber-500/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Scheduled / Upcoming</p>
                <h3 className="text-3xl font-bold text-white">{stats.scheduled}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Clock size={20} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors bg-navy-900/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Completed</p>
                <h3 className="text-3xl font-bold text-white">{stats.completed}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-red-500/30 transition-colors bg-navy-900/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-red-500/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Cancellations</p>
                <h3 className="text-3xl font-bold text-white">{stats.canceled}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <XCircle size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-800/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Scheduled', 'Completed', 'Canceled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  filter === f
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                    : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-gray-300"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients or doctors..."
                className="w-full bg-navy-900/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
            <button className="p-2 bg-navy-900/50 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon size={32} className="text-gray-600" />
              </div>
              <p className="text-lg font-medium text-gray-400">No appointments found</p>
              <p className="text-sm mt-1">Try dropping your filters or schedule a new one.</p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const patientName = apt.patient_name || apt.patient_name_full || 'Unknown Patient';
              
              return (
                <div
                  key={apt.id}
                  className="p-5 hover:bg-white/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                  onClick={() => setSelectedAppointment(apt)}
                >
                  <div className="flex md:w-1/4 items-center gap-4">
                    <div className="relative">
                      <img 
                        src={getAvatarUrl(patientName, apt.patient_id || apt.id)} 
                        alt={patientName} 
                        className="w-12 h-12 rounded-full border border-white/10 object-cover" 
                      />
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-navy-900 flex items-center justify-center shadow-lg",
                        apt.status === 'Completed' ? "bg-emerald-500 text-white" :
                        apt.status === 'Canceled' ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                      )}>
                        {apt.status === 'Completed' ? <CheckCircle2 size={10} /> :
                         apt.status === 'Canceled' ? <XCircle size={10} /> : <Clock size={10} />}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                        {patientName}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{apt.patient_phone || '+971 50 XXX XXXX'}</p>
                    </div>
                  </div>

                  <div className="md:w-1/4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CalendarIcon size={14} className="text-purple-400" />
                      <span className="font-medium text-sm">{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                      <Clock size={14} className="text-blue-400" />
                      <span className="text-xs">{apt.time}</span>
                    </div>
                  </div>

                  <div className="md:w-1/4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 shrink-0">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">{apt.doctor || 'Dr. Assigned'}</p>
                      <p className="text-xs text-gray-500">{apt.branch_name || 'Main Branch'}</p>
                    </div>
                  </div>

                  <div className="md:w-1/4 flex justify-between items-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      apt.status === 'Completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      apt.status === 'Canceled' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    )}>
                      {apt.status || 'Scheduled'}
                    </span>
                    <button className="text-gray-500 hover:text-purple-400 p-2 rounded-full hover:bg-purple-500/10 transition-colors opacity-0 group-hover:opacity-100">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {isPopupOpen && (
        <AppointmentPopup onClose={() => {
          setIsPopupOpen(false);
          fetchAppointments();
        }} />
      )}

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex justify-center items-start pt-10 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-navy-900 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-start justify-between bg-gradient-to-r from-purple-500/10 to-transparent relative shrink-0">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              
              <div className="flex items-center gap-4">
                <img 
                  src={getAvatarUrl(selectedAppointment.patient_name || selectedAppointment.patient_name_full, selectedAppointment.patient_id || selectedAppointment.id)} 
                  alt="Patient" 
                  className="w-16 h-16 rounded-full border-2 border-white/20 object-cover shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {selectedAppointment.patient_name || selectedAppointment.patient_name_full || 'Unknown Patient'}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock size={12} className="text-blue-400"/> {selectedAppointment.date} at {selectedAppointment.time}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      selectedAppointment.status === 'Completed' ? "bg-emerald-500/20 text-emerald-400" :
                      selectedAppointment.status === 'Canceled' ? "bg-red-500/20 text-red-500" : "bg-amber-500/20 text-amber-500"
                    )}>
                      {selectedAppointment.status || 'Scheduled'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                style={{ zIndex: 50 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-navy-800/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy-900/50 border border-white/5 p-4 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <User size={12} className="text-cyan-400" /> Physician
                  </div>
                  <div className="font-medium text-white">{selectedAppointment.doctor || 'Not assigned'}</div>
                </div>
                <div className="bg-navy-900/50 border border-white/5 p-4 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <MapPin size={12} className="text-amber-400" /> Location
                  </div>
                  <div className="font-medium text-white">{selectedAppointment.branch_name || 'Main Branch'}</div>
                </div>
                <div className="bg-navy-900/50 border border-white/5 p-4 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Activity size={12} className="text-purple-400" /> Type
                  </div>
                  <div className="font-medium text-white">{selectedAppointment.type || 'Consultation'}</div>
                </div>
                <div className="bg-navy-900/50 border border-white/5 p-4 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <AlertCircle size={12} className="text-red-400" /> Follow-Up
                  </div>
                  <div className="font-medium text-white">{selectedAppointment.follow_up_required ? 'Required' : 'None Required'}</div>
                </div>
              </div>

              {selectedAppointment.patient_history && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FileText size={14} className="text-blue-500" /> Patient History
                  </label>
                  <p className="text-sm text-gray-300 p-4 bg-navy-900/50 rounded-xl border border-white/5 leading-relaxed">
                    {selectedAppointment.patient_history}
                  </p>
                </div>
              )}

              {selectedAppointment.special_instructions && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-amber-500" />
                    <h4 className="text-sm font-bold text-amber-500">Special Instructions</h4>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedAppointment.special_instructions}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity size={14} className="text-purple-500" /> Clinical Notes
                </label>
                <textarea
                  className="w-full glass-input p-3 rounded-xl text-sm min-h-[100px] resize-none bg-navy-900/80 border-white/10 text-white placeholder-gray-600 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="Add notes about the patient's condition..."
                  defaultValue={selectedAppointment.doctor_notes || ''}
                ></textarea>
              </div>

              {selectedAppointment.status !== 'Completed' && selectedAppointment.status !== 'Canceled' && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-blue-400" />
                    <h4 className="text-sm font-bold text-blue-400">AI Preparation Insight</h4>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Based on patient history and type "{selectedAppointment.type || 'Consultation'}", there is an 82% likelihood they will seek further treatment. Ensure pre-authorization forms are ready.
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-navy-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 {selectedAppointment.status !== 'Scheduled' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedAppointment.id, 'Scheduled')}
                      className="flex-1 sm:flex-none px-4 py-2 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/10 transition-colors"
                    >
                      Set Scheduled
                    </button>
                 )}
                 {selectedAppointment.status !== 'Completed' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedAppointment.id, 'Completed')}
                      className="flex-1 sm:flex-none px-4 py-2 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/10 transition-colors"
                    >
                      Mark Completed
                    </button>
                 )}
                 {selectedAppointment.status !== 'Canceled' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedAppointment.id, 'Canceled')}
                      className="flex-1 sm:flex-none px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors"
                    >
                      Cancel Visit
                    </button>
                 )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
                >
                  Close
                </button>
                <button 
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl hover:from-purple-400 hover:to-purple-500 transition-all"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
