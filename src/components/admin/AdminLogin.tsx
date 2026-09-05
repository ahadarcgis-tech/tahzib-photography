import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (user: string, pass: string) => boolean;
  onBackToSite: () => void;
  adminUsername: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLogin,
  onBackToSite,
  adminUsername,
}) => {
  const [username, setUsername] = useState(adminUsername || 'tahzib');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = onLogin(username, password);
      if (!success) {
        setError('Invalid username or password. Please verify your credentials.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-[#12100E] text-[#F6F3EC] flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F6F3EC]/60 hover:text-[#DFB15B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Website</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#DFB15B]/80">
          <ShieldCheck className="w-4 h-4 text-[#DFB15B]" />
          <span>Restricted Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1A1715] border border-[#2E2925] p-8 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gold top border accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DFB15B] to-transparent" />

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full border border-[#DFB15B]/40 bg-[#241F1C] text-[#DFB15B] flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Lock className="w-5 h-5" />
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#DFB15B] block mb-1">
              Tahzib Atelier · CMS
            </span>
            <h1 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#F6F3EC]">
              Administrative Sign In
            </h1>
            <p className="font-['Cormorant_Garamond',_serif] text-sm text-[#A8A29E] italic mt-1 font-light">
              Enter authorized studio credentials to manage content & portfolio archives.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 rounded text-red-200 text-xs text-center font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-widest text-[#A8A29E] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-4 py-3 text-sm text-[#F6F3EC] focus:outline-none transition-colors"
                placeholder="e.g. tahzib"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[#A8A29E]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-mono text-[#DFB15B]/80 hover:text-[#DFB15B] flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" /> Show
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-4 py-3 text-sm text-[#F6F3EC] focus:outline-none transition-colors pr-10"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-[#DFB15B] hover:bg-[#C99E4B] text-[#12100E] py-3 text-xs font-mono uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Verifying...' : 'Access Dashboard'}</span>
            </button>
          </form>

          {/* Discreet Credentials Hint for Owner */}
          <div className="mt-8 pt-6 border-t border-[#2E2925]/80 text-center">
            <span className="text-[11px] font-mono text-[#78716C] block">
              Default Credentials: <code className="text-[#DFB15B] bg-[#12100E] px-1.5 py-0.5 rounded text-[10px]">tahzib</code> / <code className="text-[#DFB15B] bg-[#12100E] px-1.5 py-0.5 rounded text-[10px]">tahzib2026</code>
            </span>
            <span className="text-[10px] text-[#78716C]/60 block mt-1">
              You can change your password anytime inside the dashboard settings.
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-6xl w-full mx-auto text-center py-4 border-t border-[#2E2925]/60 text-[11px] font-mono text-[#78716C]">
        Tahzib Photography · Confidential Studio Management Portal
      </div>
    </div>
  );
};
