import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, Check, Lock } from 'lucide-react';
import { AuthUser } from '../../types';

interface OAuthModalProps {
  provider: 'google' | 'apple' | null;
  mode: 'login' | 'signup';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export const OAuthModal: React.FC<OAuthModalProps> = ({
  provider,
  mode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedName, setSelectedName] = useState('Achieng Odhiambo');
  const [selectedEmail, setSelectedEmail] = useState(
    provider === 'google' ? 'achieng.care@gmail.com' : 'achieng@icloud.com'
  );
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  React.useEffect(() => {
    if (provider === 'google') {
      setSelectedEmail('achieng.care@gmail.com');
    } else if (provider === 'apple') {
      setSelectedEmail('achieng@icloud.com');
    }
  }, [provider]);

  if (!isOpen || !provider) return null;

  const isGoogle = provider === 'google';
  const providerTitle = isGoogle ? 'Google' : 'Apple';

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      onSuccess({
        id: `${provider}-${Date.now()}`,
        name: selectedName.trim() || 'Achieng',
        email: selectedEmail.trim(),
        provider,
        avatar: isGoogle ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' : undefined,
      });
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] shadow-2xl p-6 text-[#4A2B33] relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#7A5862] hover:text-[#4A2B33] rounded-full hover:bg-[#EFE7DE] transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Header with Provider Branding */}
          <div className="flex items-center gap-3 mb-4">
            {isGoogle ? (
              <div className="w-10 h-10 rounded-full bg-white border border-[#EADBCE] flex items-center justify-center shadow-xs">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1F1418] text-white flex items-center justify-center shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.66-.99 1.73-.85 2.76.99.08 2.01-.51 2.56-1.26z" />
                </svg>
              </div>
            )}
            <div>
              <h2 className="font-serif text-lg font-medium text-[#4A2B33]">
                {mode === 'signup' ? `Connect with ${providerTitle}` : `Sign in with ${providerTitle}`}
              </h2>
              <p className="text-xs text-[#7A5862]">
                OAuth authentication with Womb Atlas
              </p>
            </div>
          </div>

          {/* Account Selection Box */}
          <div className="bg-[#F7F3EC] border border-[#EADBCE] rounded-[16px] p-3.5 mb-4">
            <span className="text-[11px] font-medium text-[#7A5862] uppercase tracking-wider block mb-2">
              Select identity account
            </span>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-[#7A5862] block mb-1">Display name</label>
                <input
                  type="text"
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[10px] px-3 py-1.5 text-xs text-[#4A2B33] focus:outline-none focus:border-[#C99A86]"
                />
              </div>

              <div>
                <label className="text-xs text-[#7A5862] block mb-1">Email address</label>
                <input
                  type="email"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-[10px] px-3 py-1.5 text-xs text-[#4A2B33] focus:outline-none focus:border-[#C99A86]"
                />
              </div>
            </div>
          </div>

          {/* Requested Scopes */}
          <div className="mb-4">
            <span className="text-xs font-medium text-[#7A5862] block mb-2">
              Permissions requested:
            </span>
            <ul className="space-y-1.5 text-xs text-[#4A2B33]">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#A8B5A2]" />
                <span>Verify your name and email address</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#A8B5A2]" />
                <span>Create secure encrypted session</span>
              </li>
            </ul>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[14px] p-3 text-xs text-[#5B6D55] mb-5 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-[#5B6D55] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Sanctuary guarantee:</strong> No cycle logs, flow records, or intimate symptoms are ever shared with {providerTitle}. Your health data remains strictly encrypted and confidential.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isAuthorizing}
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-[14px] border border-[#EADBCE] text-xs font-medium text-[#7A5862] hover:text-[#4A2B33] hover:bg-[#EFE7DE] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAuthorize}
              disabled={isAuthorizing}
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-[14px] bg-[#4A2B33] text-[#F7F3EC] text-xs font-medium hover:bg-[#3B2229] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isAuthorizing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#F7F3EC] border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock size={13} />
                  <span>Authorize &amp; Continue</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
