import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginView() {
  const { navigate, login, backendConnected } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      await login(email, password);
      setSuccessMessage('Authenticated successfully! Loading your dashboard...');
      setTimeout(() => {
        navigate('dashboard');
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSso = (provider) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage(`Routing to ${provider} Identity Gateway...`);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('');
      navigate('dashboard');
    }, 1200);
  };

  const fillDemoAccount = () => {
    setEmail('eleanor.vance@healthnet.org');
    setPassword('Mindguard@2025');
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-margin-mobile py-space-xl relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary-container/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-secondary-fixed/20 blur-[120px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-[460px] bg-surface-container-lowest/90 backdrop-blur-2xl rounded-3xl p-space-md sm:p-space-lg shadow-xl shadow-primary/5 border border-white/80 relative z-10">
        {/* Top brand icon */}
        <div className="flex flex-col items-center text-center mb-space-md">
          <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary-container/30 mb-3">
            <span className="material-symbols-outlined text-on-primary text-[28px]">neurology</span>
          </div>
          <h1 className="font-headline-lg text-headline-md text-on-surface font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Sign in to access your cognitive health profile and baseline telemetry.
          </p>
        </div>

        {/* Backend Status indicator banner if offline */}
        {backendConnected === false && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-600">info</span>
            <span>
              Backend is not detected on <code>localhost:5050</code>. Start Flask with <code>python Backend.py</code> for live evaluation.
            </span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/30 text-error text-center text-sm font-medium flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success / Progress message */}
        {successMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-secondary-fixed/20 text-secondary text-center text-sm font-medium flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px] animate-spin">
              {isLoading ? 'progress_activity' : 'check_circle'}
            </span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
                placeholder="name@example.com"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-secondary">
                mail
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-label-sm text-label-sm text-on-surface font-medium">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="font-label-sm text-[12px] text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 pr-11 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                defaultChecked
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
              />
              <label htmlFor="rememberMe" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer">
                Remember this device
              </label>
            </div>

            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-[12px] text-secondary hover:underline font-medium"
            >
              Fill Demo Info
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-lg shadow-primary-container/25 hover:shadow-xl hover:shadow-primary-container/40 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Log in</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-space-md text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/40"></div>
          </div>
          <span className="relative px-3 bg-surface-container-lowest text-[12px] uppercase font-label-sm text-on-surface-variant">
            Or continue with
          </span>
        </div>

        {/* SSO & Passkey */}
        <div className="grid grid-cols-2 gap-space-xs mb-space-sm">
          <button
            type="button"
            onClick={() => handleSso('Health Pass')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors font-label-md text-label-md text-on-surface shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">domain</span>
            <span>Provider SSO</span>
          </button>
          <button
            type="button"
            onClick={() => handleSso('Passkey')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors font-label-md text-label-md text-on-surface shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">fingerprint</span>
            <span>Passkey</span>
          </button>
        </div>

        {/* Create account link */}
        <div className="text-center pt-space-xs">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            New here?{' '}
            <button
              onClick={() => navigate('signup')}
              className="font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>

      {/* HIPAA notice */}
      <div className="mt-space-md flex items-center justify-center gap-2 px-space-md py-2.5 rounded-full bg-surface-container-low/80 backdrop-blur-md shadow-sm mx-auto w-fit border border-white/60">
        <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          HIPAA-compliant · AES-256 encrypted neuro-telemetry
        </span>
      </div>
    </div>
  );
}
