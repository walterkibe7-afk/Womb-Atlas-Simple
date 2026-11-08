import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Mode = 'register' | 'signin';

interface UnlockScreenProps {
  onSubmit: (mode: Mode, handle: string, pin: string) => void;
  error?: string | null;
  busy?: boolean;
  onClearError?: () => void;
}

export const UnlockScreen: React.FC<UnlockScreenProps> = ({
  onSubmit,
  error,
  busy,
  onClearError,
}) => {
  const [mode, setMode] = useState<Mode>('register');
  const [handle, setHandle] = useState('');
  const [pin, setPin] = useState('');
  const [view, setView] = useState<'handle' | 'pin'>('handle');
  const [handleError, setHandleError] = useState<string | null>(null);

  // Clear error when user edits handle or toggles mode
  useEffect(() => {
    if (error && (handle || mode)) {
      onClearError?.();
    }
  }, [handle, mode, error, onClearError]);

  const normalizedHandle = handle.trim().toLowerCase();

  const handleHandleChange = (value: string) => {
    const lower = value.toLowerCase();
    setHandle(lower);
    if (handleError) setHandleError(null);
    if (error) {
      // Error will be cleared by parent when submit is called again
    }
  };

  const handleHandleSubmit = () => {
    const validationError = validateHandle(normalizedHandle);
    if (validationError) {
      setHandleError(validationError);
      return;
    }
    setView('pin');
    setPin('');
  };

  const validateHandle = (h: string): string | null => {
    if (h.length < 3 || h.length > 24) return 'Nickname must be 3–24 characters';
    if (!/^[a-z0-9]/.test(h)) return 'Must start with a letter or digit';
    if (!/^[a-z0-9._-]+$/.test(h)) return 'Only letters, numbers, dots, underscores, and dashes allowed';
    return null;
  };

  const handlePinChange = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 6) {
        setTimeout(() => {
          onSubmit(mode, normalizedHandle, nextPin);
        }, 150);
      }
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'register' ? 'signin' : 'register'));
    setView('handle');
    setHandle('');
    setPin('');
    setHandleError(null);
  };

  const isHandleValid = normalizedHandle.length >= 3 && /^[a-z0-9][a-z0-9._-]{2,23}$/.test(normalizedHandle);

  return (
    <div className="flex flex-col h-full bg-[#F7F3EC] text-[#4A2B33] px-6 pt-10 pb-8 justify-between select-none">
      {/* Top Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center pt-4"
      >
        <span className="font-serif text-3xl text-[#4A2B33] font-normal tracking-tight block">
          Womb Atlas
        </span>
        <p className="text-xs text-[#7A5862] font-sans mt-2 max-w-[260px] mx-auto leading-relaxed">
          A private space, just for you.
        </p>
      </motion.div>

      {/* Middle Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(74,43,51,0.03)] text-center my-auto"
      >
        <AnimatePresence mode="wait">
          {view === 'handle' && (
            <motion.div
              key="handle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-9 h-9 rounded-full bg-[#EEF3ED] text-[#5B6D55] mx-auto flex items-center justify-center text-sm mb-3">
                👤
              </div>
              <h2 className="font-serif text-xl font-normal text-[#4A2B33]">
                {mode === 'register' ? 'Create your private space' : 'Welcome back'}
              </h2>
              <p className="text-xs text-[#7A5862] font-sans mt-1 mb-5">
                {mode === 'register'
                  ? 'Choose a sign-in nickname — just for signing in, not your name.'
                  : 'Enter your nickname to sign in.'}
              </p>

              <div className="max-w-[260px] mx-auto text-left">
                <label className="block text-xs font-sans font-medium text-[#4A2B33] mb-1.5">
                  Your sign-in nickname
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => handleHandleChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHandleSubmit()}
                  className={`w-full px-4 py-3 rounded-[16px] bg-[#F7F3EC] border border-[#D8CCC1] text-base font-sans text-[#4A2B33] placeholder:text-[#A89A8F] focus:outline-none focus:ring-2 focus:ring-[#C99A86] focus:border-transparent transition-all ${
                    handleError ? 'border-[#C99A86]' : ''
                  }`}
                  placeholder="e.g. achieng"
                  autoComplete="username"
                  autoFocus
                  disabled={busy}
                />
                {handleError && (
                  <p className="text-xs text-[#C99A86] font-sans mt-1.5" role="alert">
                    {handleError}
                  </p>
                )}
                <p className="text-xs text-[#7A5862] font-sans mt-2">
                  Just for signing in — not your name. Letters, numbers, dots or dashes.
                </p>
              </div>

              {!busy && (
                <button
                  type="button"
                  onClick={handleHandleSubmit}
                  disabled={!isHandleValid}
                  className={`mt-6 w-full min-h-[48px] rounded-[16px] font-sans font-medium text-base transition-all ${
                    isHandleValid
                      ? 'bg-[#4A2B33] text-[#F7F3EC] active:bg-[#3D252B] active:scale-[0.98]'
                      : 'bg-[#E8DFD5] text-[#9A7D86] cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              )}
            </motion.div>
          )}

          {view === 'pin' && (
            <motion.div
              key="pin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-9 h-9 rounded-full bg-[#E8F0E8] text-[#5B6D55] mx-auto flex items-center justify-center text-sm mb-3">
                🔒
              </div>
              <h2 className="font-serif text-xl font-normal text-[#4A2B33]">
                {mode === 'register' ? 'Set your passcode' : 'Enter your passcode'}
              </h2>
              <p className="text-xs text-[#7A5862] font-sans mt-1 mb-5">
                {mode === 'register'
                  ? 'Six quiet digits. There\'s no way to reset a forgotten passcode, so choose one you\'ll remember.'
                  : 'Six digits to unlock your space.'}
              </p>

              {/* 6 Plain Dots Display */}
              <div className="flex items-center justify-center gap-3.5 mb-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const isFilled = pin.length > idx;
                  return (
                    <motion.div
                      key={idx}
                      animate={{
                        scale: isFilled ? [1, 1.2, 1] : 1,
                        backgroundColor: isFilled ? '#4A2B33' : '#E8DFD5',
                      }}
                      transition={{ duration: 0.15 }}
                      className="w-3.5 h-3.5 rounded-full border border-[#D8CCC1]"
                    />
                  );
                })}
              </div>

              {/* Soft Touch Keypad */}
              <div className="grid grid-cols-3 gap-y-2.5 gap-x-5 max-w-[260px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinChange(num)}
                    disabled={busy}
                    className="min-h-[48px] h-12 rounded-full bg-[#FAF6F0] border border-[#EADBCE] text-base font-sans font-medium text-[#4A2B33] active:bg-[#EADBCE]/70 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {num}
                  </button>
                ))}
                <div className="h-12" />
                <button
                  type="button"
                  onClick={() => handlePinChange('0')}
                  disabled={busy}
                  className="min-h-[48px] h-12 rounded-full bg-[#FAF6F0] border border-[#EADBCE] text-base font-sans font-medium text-[#4A2B33] active:bg-[#EADBCE]/70 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handlePinDelete}
                  aria-label="Delete last digit"
                  disabled={busy || pin.length === 0}
                  className="min-h-[48px] h-12 rounded-full text-xs font-sans text-[#7A5862] active:text-[#4A2B33] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle link */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={toggleMode}
            disabled={busy}
            className="text-xs text-[#7A5862] hover:text-[#4A2B33] transition-colors py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'register' ? 'I already have a space' : 'Create a new space'}
          </button>
        </div>
      </motion.div>

      {/* Bottom Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-[#C99A86] font-sans px-4"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
