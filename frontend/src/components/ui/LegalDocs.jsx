import React from 'react';

export default function LegalDocs() {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-700 mt-10 mb-20 text-slate-300">
      
      {/* ========================================== */}
      {/*             PRIVACY POLICY                 */}
      {/* ========================================== */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6 drop-shadow-sm">
          Privacy Policy
        </h2>
        <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">1. Information We Collect</h3>
            <p>
              When you use our Smart Photo Finder, we collect the temporary selfie image you capture or upload. This image is strictly used as a biometric reference to scan and find your matches in the event gallery.
            </p>
          </div>

          <div className="p-5 bg-blue-900/20 border border-blue-500/30 rounded-2xl shadow-inner my-6">
            <h3 className="text-lg font-extrabold text-blue-400 mb-2 flex items-center gap-2">
              <span className="text-xl">⏱️</span> 12-Hour Auto-Deletion Policy
            </h3>
            <p className="text-slate-300">
              Your privacy is our top priority. <strong className="text-white">Your uploaded selfies and temporary facial recognition data are permanently deleted from our servers within 12 hours</strong> of your search. We do not store, save, or train our AI models on your personal photos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">2. How We Use Your Data</h3>
            <p>
              Your selfie is securely processed in real-time solely to identify your face across the specific event's photo album. Once the search is complete and the 12-hour window expires, all traces of your reference photo are wiped.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">3. Third-Party Sharing</h3>
            <p>
              We absolutely do not sell, rent, or share your biometric data, selfies, or matched event photos with any third-party advertisers or external agencies.
            </p>
          </div>
        </div>
      </section>

      {/* Stylish Divider */}
      <hr className="border-t border-slate-700/50 mb-16" />

      {/* ========================================== */}
      {/*             TERMS OF SERVICE               */}
      {/* ========================================== */}
      <section>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 drop-shadow-sm">
          Terms of Service
        </h2>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h3>
            <p>
              By accessing and using the AI Photo App, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our application.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">2. Acceptable Use</h3>
            <p>
              Our service is designed to help event guests easily find their own photos. You agree not to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400 ml-2">
              <li>Upload photos of other people without their consent.</li>
              <li>Attempt to hack, disrupt, or reverse-engineer the AI system.</li>
              <li>Use the platform for any illegal or unauthorized purpose.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">3. Accuracy of AI</h3>
            <p>
              While our AI models are highly advanced, facial recognition technology is not 100% flawless. We do not guarantee that the system will find every single photo of you, nor do we guarantee zero false positives (showing a photo of someone who looks very similar to you).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">4. Limitation of Liability</h3>
            <p>
              The AI Photo App is provided on an "AS IS" basis. We shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our service.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}