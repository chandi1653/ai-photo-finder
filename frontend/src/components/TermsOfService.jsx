import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-slate-700 mt-10 mb-20 text-slate-300 relative z-10">
      
      {/* Back to Home Button */}
      <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 font-bold transition-all hover:-translate-x-1">
        <span className="mr-2">←</span> Back to Home
      </Link>

      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-10 drop-shadow-sm">
        Terms of Service
      </h2>
      
      <div className="space-y-8 text-base leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h3>
          <p>By accessing and using the AI Photo App, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our application.</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-3">2. Acceptable Use</h3>
          <p>Our service is designed to help event guests easily find their own photos. You agree not to:</p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-slate-400 ml-4">
            <li>Upload photos of other people without their consent.</li>
            <li>Attempt to hack, disrupt, or reverse-engineer the AI system.</li>
            <li>Use the platform for any illegal or unauthorized purpose.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-3">3. Accuracy of AI</h3>
          <p>While our AI models are highly advanced, facial recognition technology is not 100% flawless. We do not guarantee that the system will find every single photo of you, nor do we guarantee zero false positives.</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h3>
          <p>The AI Photo App is provided on an "AS IS" basis. We shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our service.</p>
        </div>
      </div>
    </div>
  );
}