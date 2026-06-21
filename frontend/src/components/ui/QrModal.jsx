import React from 'react';
import QRCode from 'react-qr-code';

export default function QrModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Ye automatically aapki website ka live link utha lega (localhost ya hosted domain)
  const currentUrl = window.location.href;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* QR Code Card (Premium Dark Glass) */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-[2rem] p-8 shadow-2xl shadow-blue-500/20 max-w-sm w-full relative z-10 transform transition-all scale-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800 hover:bg-red-500 text-slate-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Scan to Open App
          </h3>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Let guests scan this QR to instantly open the photo gallery on their phones.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl mx-auto w-fit shadow-inner">
          <QRCode 
            value={currentUrl} 
            size={200} 
            bgColor="#ffffff"
            fgColor="#0f172a" // Dark slate color for QR pattern
          />
        </div>
        
        <p className="text-center text-slate-500 text-xs mt-6 font-mono tracking-wider">
          {currentUrl}
        </p>
      </div>
    </div>
  );
}