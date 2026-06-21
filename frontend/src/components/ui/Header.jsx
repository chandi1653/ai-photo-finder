import React from 'react';

export default function Header() {
  return (
    <div className="text-center mb-8 mt-2 flex flex-col items-center">
      
      {/* 🔥 STYLISH VIP BADGE DESIGN */}
      <div className="relative inline-block mt-2">
        {/* Piche ka glowing blur effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-30 animate-pulse"></div>
        
        {/* Main box */}
        <div className="relative px-6 py-3 bg-slate-900/90 ring-1 ring-slate-700/50 rounded-full flex items-center gap-3 shadow-xl backdrop-blur-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-blue-200 to-purple-200 font-black text-xs md:text-sm uppercase tracking-[0.25em]">
            Find your event memories
          </span>
          <span className="text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">📸</span>
        </div>
      </div>

    </div>
  );
}