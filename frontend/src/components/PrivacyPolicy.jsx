import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-slate-700 mt-10 mb-20 text-slate-300 relative z-10">
      
      {/* Back to Home Button */}
      <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 font-bold transition-all hover:-translate-x-1">
        <span className="mr-2">←</span> Back to Home
      </Link>

      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 drop-shadow-sm">
        Privacy Policy
      </h2>
      <p className="text-sm text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="space-y-8 text-base leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">1. Information We Collect</h3>
          <p>When you use our Smart Photo Finder, we collect the temporary selfie image you capture or upload. This image is strictly used as a biometric reference to scan and find your matches in the event gallery.</p>
        </div>

        <div className="p-6 bg-blue-900/20 border border-blue-500/30 rounded-2xl shadow-inner">
          <h3 className="text-xl font-extrabold text-blue-400 mb-3 flex items-center gap-2">
            <span className="text-2xl">⏱️</span> 24-Hour Auto-Deletion Policy
          </h3>
          <p className="text-slate-300">
            Your privacy is our top priority. <strong className="text-white">Your uploaded selfies and temporary facial recognition data are permanently deleted from our servers within 12 hours</strong> of your search. We do not store, save, or train our AI models on your personal photos.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-3">2. How We Use Your Data</h3>
          <p>Your selfie is securely processed in real-time solely to identify your face across the specific event's photo album. Once the search is complete and the 12-hour window expires, all traces of your reference photo are wiped.</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-3">3. Third-Party Sharing</h3>
          <p>We absolutely do not sell, rent, or share your biometric data, selfies, or matched event photos with any third-party advertisers or external agencies.</p>
        </div>
      </div>
    </div>
  );
}