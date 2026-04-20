import React from 'react';
import { Activity, BrainCircuit } from 'lucide-react';

interface GlobalLoaderProps {
  label?: string;
  subLabel?: string;
}

export function GlobalLoader({ label = "Synthesizing Data...", subLabel = "Securing connection to CRM database" }: GlobalLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full fade-in zoom-in-95 duration-150">
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Ring */}
        <div className="absolute w-32 h-32 border-4 border-cyan-500/10 border-t-cyan-400 rounded-full animate-spin"></div>
        {/* Middle Ring */}
        <div className="absolute w-24 h-24 border-4 border-purple-500/10 border-b-purple-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
        {/* Inner Ring */}
        <div className="absolute w-16 h-16 border-4 border-emerald-500/10 border-l-emerald-400 rounded-full animate-[spin_3s_linear_infinite]"></div>
        
        {/* Core Icon */}
        <div className="relative bg-navy-900/50 backdrop-blur-md p-3 rounded-full border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
          <BrainCircuit className="text-cyan-400 animate-pulse" size={28} />
        </div>
      </div>

      <div className="text-center relative">
        <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-widest uppercase animate-pulse">
          {label}
        </h2>
        <p className="text-gray-400 text-sm mt-2 font-mono flex items-center justify-center gap-2">
          <Activity size={14} className="text-purple-400" />
          {subLabel}
        </p>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-black/40 rounded-full mt-6 mx-auto overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-[slide_1.5s_ease-in-out_infinite_alternate]" style={{
              animation: 'indeterminate 1.5s ease-in-out infinite'
          }}></div>
        </div>
        <style>{`
          @keyframes indeterminate {
            0% { transform: translateX(-100%); width: 50%; }
            50% { transform: translateX(50%); width: 30%; }
            100% { transform: translateX(200%); width: 50%; }
          }
        `}</style>
      </div>
    </div>
  );
}
