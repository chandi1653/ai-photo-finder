import React, { useState, useRef } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const EventPhotoUpload = ({ eventId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Progress Bar State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  
  const fileInputRef = useRef(null); 

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    setMessage('');
    setUploadProgress(0);
    setUploadedCount(0);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Pehle kuch photos toh select karo bhai!");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);
    setMessage('Compressing photos for ultra-fast upload... ⚡');

    try {
      // 1. Compress Images First (Set to 3MB for Better AI Face Detection)
      const compressedFiles = await Promise.all(
        Array.from(selectedFiles).map(async (file) => {
          try {
            const options = {
              maxSizeMB: 3, // AI ke liye high quality maintain karega
              maxWidthOrHeight: 2500, 
              useWebWorker: true,
            };
            return await imageCompression(file, options);
          } catch (err) {
            console.warn(`Compression failed for ${file.name}, uploading original:`, err);
            return file;
          }
        })
      );

      setMessage('Uploading to Cloud & Scanning Faces... ⏳');

      const formData = new FormData();
      for (let i = 0; i < compressedFiles.length; i++) {
        formData.append('eventPhotos', compressedFiles[i], selectedFiles[i].name);
      }
      
      formData.append('eventId', eventId || 'dummy-event-id'); 

      // 2. Upload with Axios & Track Real-Time Progress
      const response = await axios.post(`http://${window.location.hostname}:5001/api/events/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          
          const filesDone = Math.floor((percentCompleted / 100) * selectedFiles.length);
          setUploadedCount(filesDone);
        }
      });

      setMessage(`✅ ${response.data.message}`);
      
      // 3. UI Reset after 2 seconds
      setTimeout(() => {
        setSelectedFiles([]); 
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setUploadProgress(0);
        setUploadedCount(0);
        setUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error("Upload Error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Server se connect nahi ho paya ya bad request.';
      setMessage(`❌ Error: ${errorMsg}`);
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-8">
      
      {/* 🔥 PREMIUM STYLISH HEADER */}
      <div className="text-center mb-10">
        <div className="inline-block mb-3 px-4 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-sm">
          Admin Upload Panel
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)] tracking-tight mb-3">
          AI PHOTO FINDER ✨
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-medium max-w-md mx-auto">
          Upload bulk event photos here. Our ultra-fast AI will automatically extract and match guest faces in the background.
        </p>
      </div>

      {/* Premium Dashed File Upload Area */}
      <div className={`relative w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 group shadow-inner ${selectedFiles?.length > 0 ? 'border-cyan-500 bg-cyan-900/10' : 'border-slate-600 hover:border-cyan-500 bg-slate-900/40'}`}>
        
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={handleFileChange} 
          ref={fileInputRef}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        />
        
        <div className="pointer-events-none flex flex-col items-center justify-center space-y-3">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${selectedFiles?.length > 0 ? 'bg-cyan-600/30' : 'bg-slate-800 group-hover:scale-110 group-hover:bg-cyan-900/30'}`}>
            <span className="text-3xl">{selectedFiles?.length > 0 ? '✨' : '📁'}</span>
          </div>
          
          {selectedFiles && selectedFiles.length > 0 ? (
            <p className="text-cyan-400 font-bold text-lg">
              {selectedFiles.length} photo(s) selected ready to scan.
            </p>
          ) : (
            <>
              <p className="text-slate-300 font-bold text-base">
                Click or drag photos here
              </p>
              <p className="text-slate-500 text-xs">
                Supports JPG, PNG, WEBP (High Res Recommended)
              </p>
            </>
          )}
        </div>
      </div>

      {/* 🔥 PREMIUM PROGRESS BAR UI OR UPLOAD BUTTON */}
      {uploading ? (
        <div className="w-full mt-6 bg-slate-800/60 p-5 rounded-2xl border border-slate-700 shadow-lg backdrop-blur-sm">
          <div className="flex justify-between text-slate-300 text-sm font-bold mb-3 tracking-wide">
            <span>
              {uploadProgress < 100 
                ? `Uploading ${uploadedCount} of ${selectedFiles.length} photos...` 
                : 'Processing AI Scan... ⚡'}
            </span>
            <span className="text-cyan-400">{uploadProgress}%</span>
          </div>
          
          {/* Progress Bar Track */}
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden shadow-inner border border-slate-800">
            {/* Progress Bar Fill with Glow */}
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-600 h-full rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${uploadProgress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleUpload}
          disabled={!selectedFiles || selectedFiles.length === 0}
          className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-300 active:scale-95 text-lg border border-cyan-400/20"
        >
          Upload & Extract Faces
        </button>
      )}

      {/* Dynamic Status Message with Glass Effect */}
      {message && (
        <div className={`w-full mt-5 p-4 rounded-xl text-center font-bold backdrop-blur-md border ${
          message.includes('✅') 
            ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' 
            : message.includes('❌') 
            ? 'bg-red-900/30 text-red-400 border-red-800/50'
            : 'bg-cyan-900/20 text-cyan-400 border-cyan-800/40' 
        }`}>
          {message}
        </div>
      )}

    </div>
  );
};

export default EventPhotoUpload;