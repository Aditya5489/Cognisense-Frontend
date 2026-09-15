import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SignUpView() {
  const { navigate, signup, backendConnected } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    phone: '',
    caretakerName: '',
    caretakerPhone: '',
    agreeTerms: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage('Full name, email, and password are required.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        age: formData.age ? parseInt(formData.age, 10) : null,
        phone: formData.phone.trim() || null,
        caretakerName: formData.caretakerName.trim() || null,
        caretakerPhone: formData.caretakerPhone.trim() || null,
      });

      setSuccessMessage('Profile registered successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('dashboard');
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-margin-mobile py-space-xl relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-container/10 blur-[130px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-secondary-fixed/20 blur-[130px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-[520px] bg-surface-container-lowest/90 backdrop-blur-2xl rounded-3xl p-space-md sm:p-space-lg shadow-xl shadow-primary/5 border border-white/80 relative z-10">
        <div className="flex flex-col items-center text-center mb-space-md">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30 mb-3">
            <span className="material-symbols-outlined text-on-secondary text-[28px]">person_add</span>
          </div>
          <h1 className="font-headline-lg text-headline-md text-on-surface font-semibold tracking-tight">
            Create patient profile
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Begin establishing your cognitive baseline with clinical AI telemetry.
          </p>
        </div>

        {backendConnected === false && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-600">info</span>
            <span>
              Backend is not detected on <code>localhost:5050</code>. Start Flask with <code>python Backend.py</code> for account storage.
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/30 text-error text-center text-sm font-medium flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-secondary-fixed/20 text-secondary text-center text-sm font-medium flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px] animate-spin">
              {isSubmitting ? 'progress_activity' : 'check_circle'}
            </span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
              placeholder="Eleanor Vance"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
                placeholder="eleanor@example.org"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
                Age
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
                placeholder="e.g. 72"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
                placeholder="At least 6 chars"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
                Care Partner Name
              </label>
              <input
                type="text"
                value={formData.caretakerName}
                onChange={(e) => setFormData({ ...formData, caretakerName: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
                placeholder="Sarah Vance"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface mb-1 font-medium">
                Care Partner Phone
              </label>
              <input
                type="tel"
                value={formData.caretakerPhone}
                onChange={(e) => setFormData({ ...formData, caretakerPhone: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 focus:border-primary focus:bg-surface-container-lowest text-on-surface text-body-md outline-none transition-all"
                placeholder="+1 (555) 019-2834"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              required
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-primary accent-primary"
            />
            <label htmlFor="terms" className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
              I consent to non-invasive acoustic biomarker processing and agree to the{' '}
              <span className="text-primary underline cursor-pointer">Clinical Terms & HIPAA Policy</span>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-lg shadow-primary-container/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-space-sm border-t border-outline-variant/30 mt-space-sm">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?{' '}
            <button
              onClick={() => navigate('login')}
              className="font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
