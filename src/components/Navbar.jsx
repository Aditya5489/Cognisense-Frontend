import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { currentPage, navigate, user, logout } = useApp();

  const isPortal = ['dashboard', 'screening', 'result', 'history'].includes(currentPage);
  const displayName = user?.fullName || user?.name || 'Patient';

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(26,25,45,0.04)] border-b border-primary/5 transition-all">
      <div className="h-20 w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-gutter">
        {/* Brand & Logo */}
        <div 
          onClick={() => navigate('home')} 
          className="flex items-center gap-space-sm cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-[0_4px_16px_rgba(108,92,231,0.25)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-on-primary text-[24px]">neurology</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none group-hover:text-primary transition-colors">
              CogniSense
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold tracking-wider uppercase leading-none mt-1">
              {isPortal ? 'Clinical Portal' : 'Neuro Health AI'}
            </span>
          </div>

          {isPortal && (
            <div className="hidden xl:flex items-center gap-space-xs ml-space-sm pl-space-md py-1 bg-surface-container-low/80 rounded-full px-space-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-surface font-medium">{displayName}</span>
              <span className="font-label-sm text-label-sm text-tertiary">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">{user.id}</span>
              <span className="font-label-sm text-label-sm text-tertiary">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">CogniSense ML Ensemble</span>
            </div>
          )}
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-space-xs p-1.5 rounded-full bg-surface-container/50">
          {!isPortal ? (
            <>
              <button
                onClick={() => navigate('home')}
                className={`px-space-md py-space-xs rounded-full font-label-md transition-all ${
                  currentPage === 'home'
                    ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Home
              </button>
              <a
                href="#early-signs"
                onClick={(e) => {
                  if (currentPage !== 'home') {
                    e.preventDefault();
                    navigate('home');
                    setTimeout(() => {
                      document.getElementById('early-signs')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="px-space-md py-space-xs rounded-full font-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Early Signs
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  if (currentPage !== 'home') {
                    e.preventDefault();
                    navigate('home');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="px-space-md py-space-xs rounded-full font-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                How It Works
              </a>
              <button
                onClick={() => navigate('dashboard')}
                className="px-space-md py-space-xs rounded-full font-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Patient Portal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('dashboard')}
                className={`px-space-md py-space-xs rounded-full font-label-md transition-all ${
                  currentPage === 'dashboard'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('history')}
                className={`px-space-md py-space-xs rounded-full font-label-md transition-all ${
                  currentPage === 'history'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                History
              </button>
              <button
                onClick={() => navigate('result')}
                className={`px-space-md py-space-xs rounded-full font-label-md transition-all ${
                  currentPage === 'result'
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Latest Result
              </button>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-space-sm">
          {!isPortal ? (
            <>
              <button
                onClick={() => navigate('login')}
                className="hidden sm:inline-flex px-space-md py-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high/60"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('screening')}
                className="px-space-md py-space-xs rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shadow-[0_8px_24px_rgba(108,92,231,0.3)] hover:shadow-[0_12px_28px_rgba(108,92,231,0.45)] hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-full">
                <div className="flex items-center gap-1 text-secondary px-space-xs">
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                  <span className="material-symbols-outlined text-[18px]">volume_up</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-medium hidden sm:inline-block pr-1">
                  Active Calibrated
                </span>
              </div>

              {currentPage === 'screening' ? (
                <button
                  onClick={() => navigate('dashboard')}
                  className="flex items-center gap-1.5 px-space-md py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors shadow-sm"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary">pause_circle</span>
                  <span className="hidden sm:inline">Pause & Exit</span>
                </button>
              ) : (
                <button
                  onClick={logout}
                  className="inline-flex items-center px-space-md py-space-xs rounded-full font-label-sm text-label-sm text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors"
                >
                  Log out
                </button>
              )}

              <div 
                onClick={() => navigate('dashboard')}
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition-transform"
                title="View Profile"
              >
                <span className="material-symbols-outlined text-on-primary text-[20px]">person</span>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
