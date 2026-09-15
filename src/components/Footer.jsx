import { useApp } from '../context/AppContext';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="relative z-10 w-full bg-surface-container-low/80 backdrop-blur-xl mt-space-xl border-t border-outline-variant/30">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin py-space-xl">
        {/* Top Footer Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-space-lg pb-space-lg">
          <div className="max-w-md">
            <div 
              onClick={() => navigate('home')}
              className="flex items-center gap-space-xs mb-space-sm cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">neurology</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface">CogniSense</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Pioneering early cognitive trajectory assessment through non-invasive neural biomarkers, voice phonetics, and adaptive conversational intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-lg">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                Platform
              </span>
              <button 
                onClick={() => { navigate('home'); }} 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
              >
                Early Signs
              </button>
              <button 
                onClick={() => { navigate('home'); }} 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
              >
                How It Works
              </button>
              <button 
                onClick={() => { navigate('screening'); }} 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
              >
                Screening Test
              </button>
            </div>

            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                Access
              </span>
              <button 
                onClick={() => navigate('dashboard')} 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
              >
                Patient Dashboard
              </button>
              <button 
                onClick={() => navigate('history')} 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
              >
                Telemetry Records
              </button>
              <button 
                onClick={() => navigate('login')} 
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors text-left"
              >
                Provider SSO
              </button>
            </div>

            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-semibold">
                Clinical
              </span>
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-secondary-fixed/20 px-space-xs py-0.5 rounded-full w-fit">
                <span className="material-symbols-outlined text-[14px]">verified</span>IRB Approved
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">ISO 27001 Certified</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">HIPAA AES-256</span>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Box */}
        <div className="p-space-md rounded-2xl bg-surface-container/60 backdrop-blur-sm mb-space-lg border border-white/40">
          <div className="flex items-start gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">health_and_safety</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface font-medium">Medical Disclaimer:</strong> CogniSense is an investigational screening instrument intended for cognitive baseline tracking and early risk stratification. It is not intended to substitute for professional medical diagnosis, clinical evaluation, or treatment of Alzheimer's disease or other neurodegenerative disorders. Always consult a certified neurologist or physician.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <p>© 2025 CogniSense Health Inc. All rights reserved.</p>
          <div className="flex items-center gap-space-md">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
