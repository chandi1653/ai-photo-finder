import React, { useState, useRef, useCallback } from "react";
import Header from './ui/Header';
import CameraBox from './ui/CameraBox';
import Loader from './ui/Loader';
import PhotoCard from './ui/PhotoCard'; 
import QrModal from './ui/QrModal'; 
import imageCompression from 'browser-image-compression';

const getPhotoUrl = (photo) => {
  if (!photo) return "";
  
  if (typeof photo === "string") {
    if (photo.startsWith("http")) {
      return photo;
    }

    return `https://ai-photo-finder-13.onrender.com/uploads/${photo}`;
  }
  
  return "";
};

const SmartGallery = () => {
  const webcamRef = useRef(null);
  const resultSectionRef = useRef(null);

  const [selfieBase64, setSelfieBase64] = useState(null);
  const [status, setStatus] = useState("idle");
  const [matchedPhotos, setMatchedPhotos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [isQrOpen, setIsQrOpen] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfieBase64(imageSrc);
      setErrorMsg("");
      setStatus("idle");
    }
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setStatus("uploading"); 
        
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(file, options);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelfieBase64(reader.result);
          setErrorMsg("");
          setStatus("idle");
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Compression error:", error);
        setErrorMsg("Photo compress karne mein error aayi. Try again.");
        setStatus("error");
      }
    }
  };

  const findMatches = async () => {
    if (!selfieBase64) return;
    setStatus("uploading");
    
    try {
      const [header, data] = selfieBase64.split(",");
      const mime = header.match(/:(.*?);/)[1];
      const binary = atob(data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
      const blob = new Blob([array], { type: mime });

      const formData = new FormData();
      formData.append("selfie", blob, "selfie.jpg");

      const response = await fetch(`https://ai-photo-finder-13.onrender.com/api/guests/find-photos`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to find photos");

      const validCloudPhotos = (result.photos || []).filter(photo => {
        return typeof photo === "string" && photo.startsWith("http");
      });

      setMatchedPhotos(validCloudPhotos); 
      
      setStatus("done");
      
      setTimeout(() => resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-4 md:p-8 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-700 mt-4 mb-10 transition-all">
        
        <Header />

        {!selfieBase64 ? (
          <CameraBox 
            webcamRef={webcamRef} 
            onCapture={capture} 
            onFileUpload={handleFileUpload} 
          />
        ) : (
          <div className="text-center space-y-6">
            <div className="relative inline-block mt-4">
              <img src={selfieBase64} alt="preview" className="w-40 h-40 object-cover rounded-3xl mx-auto border-4 border-slate-800 shadow-2xl" />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-2 shadow-lg border-2 border-slate-800">✨</div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button onClick={() => setSelfieBase64(null)} className="flex-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 py-4 rounded-xl font-bold transition shadow-sm border border-slate-700">Retake</button>
              <button onClick={findMatches} disabled={status === 'uploading'} className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-blue-500/30">
                {status === 'uploading' ? 'Scanning AI...' : 'Find My Photos'}
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-6 p-4 bg-red-900/40 backdrop-blur-sm text-red-400 rounded-xl text-center font-bold border border-red-800/50">
            ⚠️ {errorMsg}
          </div>
        )}

        {status === 'uploading' && <Loader />}

        {status === 'done' && (
          <div ref={resultSectionRef} className="mt-12 pt-8 border-t border-slate-700/50">
            <h3 className="text-2xl font-extrabold text-white mb-6 text-center drop-shadow-sm">
              {matchedPhotos.length > 0 ? `🎉 Found ${matchedPhotos.length} Photos!` : "No photos found yet."}
            </h3>
            <div className="grid grid-cols-2 gap-5">
              {matchedPhotos.map((p, i) => (
                <PhotoCard key={i} photoUrl={getPhotoUrl(p)} />
              ))}
            </div>
          </div>
        )}

        <QrModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
        
      </div>

      <button 
        onClick={() => setIsQrOpen(true)}
        title="Show QR Code"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-slate-800/60 hover:bg-blue-600/90 text-blue-400 hover:text-white p-4 rounded-full backdrop-blur-xl border border-slate-600/50 hover:border-blue-400 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] z-50 group flex items-center justify-center"
      >
        <svg className="w-8 h-8 transform group-hover:scale-110 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 -z-10"></span>
      </button>
    </>
  );
};

export default SmartGallery;