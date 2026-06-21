import React, { useState } from 'react';
import Webcam from "react-webcam";

export default function CameraBox({ webcamRef, onCapture, onFileUpload }) {
  // 👇 Camera ko track karne ke liye state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // 👇 Ek hi function jo dono kaam karega (Camera Kholna + Photo Lena)
  const handleAction = () => {
    if (cameraError) {
      setCameraError("");
      setIsCameraActive(false);
      return;
    }
    if (!isCameraActive) {
      if (!window.isSecureContext) {
        setCameraError("Insecure Context: Camera access requires a secure connection (HTTPS) or localhost. Please check your URL.");
        setIsCameraActive(true);
      } else {
        setIsCameraActive(true);
      }
    } else {
      onCapture(); // 2. Phir click kiya -> Photo Capture
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 📸 GLOWING WRAPPER SHURU */}
      <div className="relative group w-full cursor-pointer mt-4">
        
        {/* 🔥 YAHAN HAI JADOO (The Glowing Outline) 🔥 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-[1.25rem] blur-md opacity-30 group-hover:opacity-70 transition duration-500"></div>

        {/* 📸 PHOTO SHOW AREA (MAIN BOX) */}
        <div 
          onClick={handleAction}
          className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-[#0f172a] shadow-2xl aspect-video flex items-center justify-center z-10"
        >
          {cameraError ? (
            // ⚠️ JAB CAMERA ERRORED HAI (Premium Error State)
            <div className="text-center p-6 flex flex-col items-center max-w-sm">
              <div className="w-16 h-16 bg-red-950/40 rounded-full flex items-center justify-center mb-4 text-3xl shadow-lg border border-red-500/20">
                ⚠️
              </div>
              <p className="text-red-400 font-bold text-lg">Camera Access Failed</p>
              <p className="text-slate-400 text-sm mt-2 text-center leading-relaxed">
                {cameraError.includes("Permission denied") || cameraError.includes("NotAllowedError")
                  ? "Camera permission was denied. Please allow camera access in your browser settings and try again."
                  : cameraError.includes("NotFoundError") || cameraError.includes("DevicesNotFoundError")
                  ? "No camera device found on this system."
                  : cameraError}
              </p>
              <span className="mt-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 active:scale-95 transition">
                🔄 Tap to Retry
              </span>
            </div>
          ) : !isCameraActive ? (
            // 🔴 JAB CAMERA BAND HAI (Premium Placeholder)
            <div className="text-center p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all duration-300 shadow-lg shadow-blue-500/20">
                <span className="text-3xl">📷</span>
              </div>
              <p className="text-blue-400 font-bold text-lg">Tap to Open Camera</p>
              <p className="text-slate-500 text-sm mt-1">Click anywhere in this box to start</p>
            </div>
          ) : (
            // 🟢 JAB CAMERA CHALU HAI
            <>
              <Webcam 
                ref={webcamRef} 
                audio={false} // Isse faltu ka Mic permission error nahi aayega
                screenshotFormat="image/jpeg" 
                videoConstraints={{ facingMode: "user" }}
                onUserMediaError={(err) => {
                  console.error("Camera error:", err);
                  setCameraError(err?.message || err?.toString() || "Unknown camera error");
                }}
                mirrored={true}
                className="w-full h-full object-cover" 
              />
              {/* Box ke upar mouse le jane par ye hint dikhega */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <p className="text-white font-bold bg-black/60 px-6 py-3 rounded-full backdrop-blur-md shadow-xl border border-white/20">
                   📸 Tap to Capture
                 </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* 🔘 MAIN ACTION BUTTON */}
      <button 
        onClick={handleAction} 
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-lg"
      >
        {cameraError ? '🔄 Reset Camera' : !isCameraActive ? '🎥 Start Camera' : '📸 Capture Selfie'}
      </button>

      {/* 📁 UPLOAD BUTTON */}
      <div className="text-center">
        <label className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-full text-sm font-semibold cursor-pointer transition shadow-sm border border-slate-700">
          📁 Upload from Gallery
          <input type="file" accept="image/*" onChange={onFileUpload} className="hidden" />
        </label>
      </div>
      
    </div>
  );
}