import React from 'react';
import { X, Calendar as CalendarIcon, Clock, Users, FileText } from 'lucide-react';

interface AppointmentPopupProps {
  onClose: () => void;
}

export function AppointmentPopup({ onClose }: AppointmentPopupProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-30"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg">
              <CalendarIcon size={20} className="text-purple-400" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Book Appointment
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors relative z-10"
          >
            <X size={20} />
          </button>
        </div>
        
        <form className="p-6 space-y-5 flex-1 overflow-y-auto" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          
          {/* Patient Selection */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-gray-300 px-1 flex items-center gap-2">
              <Users size={14} className="text-blue-400" />
              Patient Name
            </label>
            <div className="relative group">
              <input 
                type="text" 
                className="w-full bg-navy-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600" 
                placeholder="Search patient..." 
                required 
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Users size={16} />
              </div>
            </div>
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 px-1 flex items-center gap-2">
                <CalendarIcon size={14} className="text-cyan-glow" />
                Date
              </label>
              <div className="relative group">
                <input 
                  type="date" 
                  className="w-full bg-navy-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-glow/50 focus:ring-1 focus:ring-cyan-glow/50 transition-all [color-scheme:dark]" 
                  required 
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-glow transition-colors">
                  <CalendarIcon size={16} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 px-1 flex items-center gap-2">
                <Clock size={14} className="text-[#f5a623]" />
                Time
              </label>
              <div className="relative group">
                <input 
                  type="time" 
                  className="w-full bg-navy-800/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#f5a623]/50 focus:ring-1 focus:ring-[#f5a623]/50 transition-all [color-scheme:dark]" 
                  required 
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#f5a623] transition-colors">
                  <Clock size={16} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Appointment Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 px-1">Appointment Type</label>
            <select className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer">
              <option value="consultation">Initial Consultation</option>
              <option value="followup">Follow-up</option>
              <option value="cleaning">Routine Cleaning</option>
              <option value="surgery">Surgery</option>
              <option value="urgent">Urgent / Emergency</option>
            </select>
          </div>
          
          {/* Notes */}
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-300 px-1 flex items-center gap-2">
              <FileText size={14} className="text-emerald-400" />
              Notes (Optional)
            </label>
            <textarea 
              className="w-full bg-navy-800/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all placeholder:text-gray-600 resize-none h-24" 
              placeholder="Add any special instructions or notes here..." 
            ></textarea>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
