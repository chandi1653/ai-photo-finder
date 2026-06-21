import React from 'react';

export default function PhotoCard({ photoUrl }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-md border border-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 bg-slate-50">
      
      {/* 👇 Yahan onError add kiya gaya hai broken images ko hide karne ke liye */}
      <img 
        loading="lazy" 
        src={photoUrl} 
        className="w-full h-56 object-cover" 
        alt="Matched Moment" 
        onError={(e) => { 
          e.target.parentElement.style.display = 'none'; 
        }}
      />
      
      {/* Dark Blur Overlay on Hover */}
      <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
        <a 
          href={photoUrl} 
          download 
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl transition-transform transform hover:scale-105 active:scale-95"
        >
          ⬇ Download HD
        </a>
      </div>
    </div>
  );
}