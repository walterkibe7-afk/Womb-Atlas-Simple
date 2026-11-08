import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut, ShieldCheck, User, KeyRound, Sparkles } from 'lucide-react';
import { AuthUser, UserProfile } from '../../types';

interface AccountMenuModalProps {
  isOpen: boolean;
  currentUser?: AuthUser;
  userProfile?: UserProfile;
  onClose: () => void;
  onSignOut: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const AccountMenuModal: React.FC<AccountMenuModalProps> = ({
  isOpen,
  currentUser,
  userProfile,
  onClose,
  onSignOut,
  onOpenAuth,
}) => {
  if (!isOpen) return null;

  const isGuest = !currentUser || currentUser.provider === 'local';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm bg-[#FAF6F0] border border-[#EADBCE] rounded-[24px] shadow-2xl p-6 text-[#4A2B33] relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#7A5862] hover:text-[#4A2B33] rounded-full hover:bg-[#EFE7DE] transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* User Profile Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#EFE7DE] border border-[#EADBCE] flex items-center justify-center text-[#4A2B33] font-serif text-lg font-medium shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <h2 className="font-serif text-lg font-normal text-[#4A2B33]">
                {currentUser?.name || userProfile?.userName || 'Achieng'}
              </h2>
              <p className="text-xs text-[#7A5862]">
                {currentUser?.email || (isGuest ? 'Local private sanctuary' : 'Personal cycle sanctuary')}
              </p>
            </div>
          </div>

          {/* Account Status Badge Card */}
          <div className="bg-[#F7F3EC] border border-[#EADBCE] rounded-[18px] p-4 mb-5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#7A5862]">Authentication:</span>
              <span className="font-medium text-[#4A2B33] capitalize flex items-center gap-1.5">
                {currentUser?.provider === 'google' && (
                  <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
                )}
                {currentUser?.provider === 'apple' && (
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                )}
                {currentUser?.provider === 'email' && (
                  <span className="w-2 h-2 rounded-full bg-[#C99A86]"></span>
                )}
                {isGuest && (
                  <span className="w-2 h-2 rounded-full bg-[#A8B5A2]"></span>
                )}
                {isGuest ? 'Device-only (Guest)' : `${currentUser?.provider} account`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5862]">Data storage:</span>
              <span className="text-[#4A2B33] font-medium flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#A8B5A2]" />
                Zero-tracker encrypted
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#7A5862]">Passcode lock:</span>
              <span className="text-[#4A2B33] font-medium">
                {userProfile?.passcodeSet ? 'Active (4-digit)' : 'Not set'}
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-[#EEF3ED] border border-[#D7E3D4] rounded-[14px] p-3 text-xs text-[#5B6D55] mb-5 leading-relaxed">
            Your reproductive cycle entries, flow notes, and personal observations belong solely to you. We never sell or train public models on your health diary.
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {isGuest ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth('login');
                  }}
                  className="flex-1 min-h-[44px] py-2.5 px-3 rounded-[14px] bg-[#4A2B33] text-[#F7F3EC] text-xs font-medium hover:bg-[#3B2229] transition-all text-center"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth('signup');
                  }}
                  className="flex-1 min-h-[44px] py-2.5 px-3 rounded-[14px] bg-[#FAF6F0] border border-[#EADBCE] text-[#4A2B33] text-xs font-medium hover:bg-[#EFE7DE] transition-all text-center"
                >
                  Sign up
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-[14px] border border-[#EADBCE] text-[#7A5862] hover:text-[#9F4855] hover:bg-[#FBECEE] hover:border-[#E8CAD0] text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                <span>Sign out of sanctuary</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
