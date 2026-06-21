import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmartGallery from './components/SmartGallery'; 
import EventPhotoUpload from './components/EventPhotoUpload'; 
import Footer from './components/ui/Footer'; 
import PrivacyPolicy from './components/PrivacyPolicy'; 
import TermsOfService from './components/TermsOfService'; 

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0b1120] font-sans relative overflow-hidden">
        
        {/* 🔥 PREMIUM SCREEN EDGE GLOW (Pura page ke charo taraf) 🔥 */}
        <div className="pointer-events-none fixed inset-0 z-50">
          {/* Inner Dimming Shadow */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(59,130,246,0.15)] sm:shadow-[inset_0_0_120px_rgba(168,85,247,0.15)]"></div>
          
          {/* Cyan to Purple Glowing Border Blur */}
          <div className="absolute -inset-2 border-4 border-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-20 blur-xl"></div>
          
          {/* Subtle Outer White Border line */}
          <div className="absolute inset-0 border border-white/5"></div>
        </div>

        {/* Background Glowing Effects (Pehle Wale) */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex-grow pb-12 pt-6">
          
          <Routes>
            <Route path="/" element={
              <>
                {/* TOP HEADER */}
                <div className="max-w-xl mx-auto px-4 text-center mb-2 mt-2 w-full">
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] tracking-tight">
                    AI PHOTO FINDER ✨
                  </h1>
                </div>
                
                <SmartGallery /> 

                <hr className="w-1/2 mx-auto border-t border-slate-800 my-16 rounded-full" />

                <div className="max-w-md mx-auto bg-slate-900/50 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-slate-800 border-t-4 border-t-blue-500">
                  <h3 className="text-center text-blue-400 text-xl font-bold mb-4">
                    🔒 Admin / Photographer Area
                  </h3>
                  <EventPhotoUpload eventId="event_12345" />
                </div>
              </>
            } />

            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>

        </div>

        <Footer />
        
      </div>
    </Router>
  );
}

export default App;