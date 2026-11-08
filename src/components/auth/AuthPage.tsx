import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, Heart, User, Sparkles, Check } from 'lucide-react';
import { AuthUser } from '../../types';
import { OAuthModal } from './OAuthModal';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  isMobileView?: boolean;
  onSuccess: (user: AuthUser, authMode?: 'login' | 'signup') => void;
  onContinueGuest: () => void;
  onCancel?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  isMobileView = false,
  onSuccess,
  onContinueGuest,
  onCancel,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
  }, [initialMode]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<'google' | 'apple' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Passphrase should be at least 4 characters.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const userName = mode === 'signup' && name.trim() ? name.trim() : email.split('@')[0];
      onSuccess(
        {
          id: `email-${Date.now()}`,
          name: userName,
          email: email.trim(),
          provider: 'email',
        },
        mode
      );
    }, 450);
  };

  const handleOAuthSuccess = (user: AuthUser) => {
    setActiveOAuthProvider(null);
    onSuccess(user, mode);
  };

  /* Mobile Layout Render */
  if (isMobileView) {
    return (
      <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-5 pt-4 pb-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-tight text-[#4A2B33] font-medium">
              Womb Atlas
            </span>
            <span className="text-[11px] text-[#7A5862]">· Sanctuary</span>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-[#7A5862] hover:text-[#4A2B33] px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#EADBCE]"
            >
              Back
            </button>
          )}
        </div>

        {/* Mode Toggle Pills */}
        <div className="bg-[#EFE7DE] p-1 rounded-full border border-[#DFD3C5] flex items-center mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all text-center ${
              mode === 'login'
                ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs'
                : 'text-[#7A5862] hover:text-[#4A2B33]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all text-center ${
              mode === 'signup'
                ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs'
                : 'text-[#7A5862] hover:text-[#4A2B33]'
            }`}
          >
            Create sanctuary
          </button>
        </div>

        {/* Heading */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-4"
        >
          <h1 className="font-serif text-2xl font-normal text-[#4A2B33] leading-snug">
            {mode === 'login' ? 'Welcome back to your sanctuary' : 'Begin your private sanctuary'}
          </h1>
          <p className="text-xs text-[#7A5862] mt-1 leading-relaxed">
            {mode === 'login'
              ? 'Sign in to access your rhythm and personal cycle observations.'
              : 'A calm, supportive space kept safe on your terms. Yours alone.'}
          </p>
        </motion.div>

        {/* OAuth Buttons Section */}
        <div className="space-y-2.5 mb-5">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => setActiveOAuthProvider('google')}
            className="w-full min-h-[46px] px-4 py-2.5 bg-[#FAF6F0] hover:bg-white border border-[#EADBCE] rounded-[16px] text-xs font-medium text-[#4A2B33] flex items-center justify-center gap-3 transition-all shadow-2xs hover:border-[#C99A86] active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={() => setActiveOAuthProvider('apple')}
            className="w-full min-h-[46px] px-4 py-2.5 bg-[#4A2B33] hover:bg-[#3B2229] border border-[#3B2229] rounded-[16px] text-xs font-medium text-[#F7F3EC] flex items-center justify-center gap-3 transition-all shadow-2xs active:scale-[0.99]"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.73-.85 2.76.99.08 2.01-.51 2.56-1.26z" />
            </svg>
            <span>{mode === 'signup' ? 'Sign up with Apple' : 'Continue with Apple'}</span>
          </button>
        </div>

        {/* Or Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#EADBCE]"></div>
          <span className="text-[11px] text-[#7A5862] font-serif italic">or with private email</span>
          <div className="flex-1 h-px bg-[#EADBCE]"></div>
        </div>

        {/* Email & Passphrase Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#7A5862] mb-1">
                What should we call you? <span className="font-normal text-[11px]">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Achieng"
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[14px] px-3.5 py-2.5 text-xs text-[#4A2B33] placeholder-[#B5A49D] focus:outline-none focus:border-[#C99A86] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#7A5862] mb-1">
              Private email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@sanctuary.me"
                className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[14px] px-3.5 py-2.5 text-xs text-[#4A2B33] placeholder-[#B5A49D] focus:outline-none focus:border-[#C99A86] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7A5862] mb-1">
              {mode === 'signup' ? 'Choose a passphrase' : 'Your passphrase'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[14px] px-3.5 py-2.5 text-xs text-[#4A2B33] placeholder-[#B5A49D] focus:outline-none focus:border-[#C99A86] transition-colors"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-[#A84A58] bg-[#FDF0F2] border border-[#F2D1D6] rounded-[10px] p-2 leading-relaxed">
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[46px] py-2.5 px-4 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-xs font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs mt-2"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-[#F7F3EC] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create your sanctuary' : 'Enter sanctuary'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Private Local Device Lock Fallback (Midwife Tone) */}
        <div className="mt-auto pt-3 border-t border-[#EADBCE]/70 text-center">
          <button
            type="button"
            onClick={onContinueGuest}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] underline decoration-[#C99A86]/60 underline-offset-4 font-serif transition-colors py-1.5"
          >
            Or keep everything on this device only (no account)
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-[#A8B5A2] mt-2 font-medium">
            <ShieldCheck size={12} />
            <span>Zero advertising · Private by design</span>
          </div>
        </div>

        {/* OAuth Modal */}
        <OAuthModal
          provider={activeOAuthProvider}
          mode={mode}
          isOpen={Boolean(activeOAuthProvider)}
          onClose={() => setActiveOAuthProvider(null)}
          onSuccess={handleOAuthSuccess}
        />
      </div>
    );
  }

  /* Desktop Layout Render (Poetic 2-Column Split) */
  return (
    <div className="w-full max-w-5xl mx-auto py-8 lg:py-12 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Brand & Sanctuary Narrative */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#EADBCE] text-xs text-[#7A5862]">
            <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
            <span>Private &amp; caring menstrual companion</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-[1.15] text-[#4A2B33] font-normal">
              A private sanctuary, honoring your rhythm.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[#7A5862]">
              Like a caring midwife by your side, Womb Atlas listens quietly to your body without judgment, advertisements, or clinical clutter.
            </p>
          </div>

          {/* Gentle Midwife Quote Card */}
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[22px] p-6 shadow-[0_4px_24px_rgba(74,43,51,0.03)] space-y-3">
            <p className="font-serif text-base italic leading-relaxed text-[#4A2B33]">
              &ldquo;Your body speaks in cycles, not straight lines. Whether you sign in with OAuth or keep every note strictly on your device, your sanctuary is safe.&rdquo;
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C99A86] font-medium">
              <span>— Womb Atlas Midwife Care</span>
            </div>
          </div>

          {/* Three Quiet Sanctuary Pillars */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#EEF3ED] text-[#5B6D55] flex items-center justify-center shrink-0 mt-0.5">
                <Check size={14} />
              </div>
              <p className="text-xs leading-relaxed text-[#7A5862]">
                <strong className="text-[#4A2B33] font-medium">Zero data sales:</strong> Your flow, intimate pain levels, and symptoms are never commercialized.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#EEF3ED] text-[#5B6D55] flex items-center justify-center shrink-0 mt-0.5">
                <Check size={14} />
              </div>
              <p className="text-xs leading-relaxed text-[#7A5862]">
                <strong className="text-[#4A2B33] font-medium">Encrypted sync:</strong> Sign in with Google, Apple, or email to carry your rhythm with you.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#EEF3ED] text-[#5B6D55] flex items-center justify-center shrink-0 mt-0.5">
                <Check size={14} />
              </div>
              <p className="text-xs leading-relaxed text-[#7A5862]">
                <strong className="text-[#4A2B33] font-medium">Local-first freedom:</strong> You may also enter with no account at all, anytime.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Desktop Auth Card */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="lg:col-span-6"
        >
          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[28px] p-7 sm:p-9 shadow-[0_8px_32px_rgba(74,43,51,0.06)] relative">
            {/* Mode Switcher Pill */}
            <div className="bg-[#EFE7DE] p-1 rounded-full border border-[#DFD3C5] flex items-center mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-full transition-all text-center ${
                  mode === 'login'
                    ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs'
                    : 'text-[#7A5862] hover:text-[#4A2B33]'
                }`}
              >
                Sign in to your sanctuary
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-full transition-all text-center ${
                  mode === 'signup'
                    ? 'bg-[#FAF6F0] text-[#4A2B33] shadow-xs'
                    : 'text-[#7A5862] hover:text-[#4A2B33]'
                }`}
              >
                Create sanctuary
              </button>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-normal text-[#4A2B33]">
                {mode === 'login' ? 'Welcome back' : 'Create your private account'}
              </h2>
              <p className="text-xs text-[#7A5862] mt-1">
                {mode === 'login'
                  ? 'Connect with OAuth or enter your passphrase.'
                  : 'Start your confidential cycle tracker today.'}
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setActiveOAuthProvider('google')}
                className="min-h-[46px] px-4 py-2.5 bg-[#FAF6F0] hover:bg-white border border-[#EADBCE] rounded-[16px] text-xs font-medium text-[#4A2B33] flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:border-[#C99A86] active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveOAuthProvider('apple')}
                className="min-h-[46px] px-4 py-2.5 bg-[#4A2B33] hover:bg-[#3B2229] border border-[#3B2229] rounded-[16px] text-xs font-medium text-[#F7F3EC] flex items-center justify-center gap-2.5 transition-all shadow-2xs active:scale-[0.99]"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.73-.85 2.76.99.08 2.01-.51 2.56-1.26z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#EADBCE]"></div>
              <span className="text-xs text-[#7A5862] font-serif italic">or continue with email</span>
              <div className="flex-1 h-px bg-[#EADBCE]"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#7A5862] mb-1.5">
                    What should we call you? <span className="font-normal text-[11px]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Achieng"
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[14px] px-4 py-2.5 text-xs text-[#4A2B33] placeholder-[#B5A49D] focus:outline-none focus:border-[#C99A86] transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#7A5862] mb-1.5">
                  Private email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="achieng@example.com"
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[14px] px-4 py-2.5 text-xs text-[#4A2B33] placeholder-[#B5A49D] focus:outline-none focus:border-[#C99A86] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#7A5862]">
                    {mode === 'signup' ? 'Choose a passphrase' : 'Your passphrase'}
                  </label>
                  {mode === 'login' && (
                    <span className="text-[11px] text-[#C99A86] hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[14px] px-4 py-2.5 text-xs text-[#4A2B33] placeholder-[#B5A49D] focus:outline-none focus:border-[#C99A86] transition-colors"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-[#A84A58] bg-[#FDF0F2] border border-[#F2D1D6] rounded-[10px] p-2.5 leading-relaxed">
                  {errorMessage}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3 px-5 rounded-[16px] bg-[#4A2B33] text-[#F7F3EC] text-sm font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-[#F7F3EC] border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create sanctuary' : 'Enter sanctuary'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Local Guest Bypass */}
            <div className="mt-6 pt-5 border-t border-[#EADBCE] text-center">
              <button
                type="button"
                onClick={onContinueGuest}
                className="text-xs text-[#7A5862] hover:text-[#4A2B33] underline decoration-[#C99A86]/60 underline-offset-4 font-serif transition-colors"
              >
                Or continue locally without an account (private device lock)
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* OAuth Modal */}
      <OAuthModal
        provider={activeOAuthProvider}
        mode={mode}
        isOpen={Boolean(activeOAuthProvider)}
        onClose={() => setActiveOAuthProvider(null)}
        onSuccess={handleOAuthSuccess}
      />
    </div>
  );
};
