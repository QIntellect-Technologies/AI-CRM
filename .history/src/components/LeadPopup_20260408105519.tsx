import React from 'react';
import { X } from 'lucide-react';

interface LeadPopupProps {
  onClose: () => void;
}

export function LeadPopup({ onClose }: LeadPopupProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            New Lead
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form className="p-6 space-y-4 flex-1 overflow-y-auto" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-400 px-1">First Name</label>
              <input type="text" className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all placeholder:text-gray-600" placeholder="John" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-gray-400 px-1">Last Name</label>
              <input type="text" className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all placeholder:text-gray-600" placeholder="Doe" required />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm text-gray-400 px-1">Contact Number</label>
            <input type="tel" className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all placeholder:text-gray-600" placeholder="+1 (555) 000-0000" required />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm text-gray-400 px-1">Email</label>
            <input type="email" className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all placeholder:text-gray-600" placeholder="john@example.com" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm text-gray-400 px-1">Lead Source</label>
            <select className="w-full bg-navy-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-all appearance-none cursor-pointer">
              <option value="direct">Direct Referral</option>
              <option value="google">Google Ads</option>
              <option value="meta">Facebook / Instagram</option>
              <option value="website">Website Form</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,160,0.3)] hover:shadow-[0_0_20px_rgba(0,229,160,0.5)]"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
