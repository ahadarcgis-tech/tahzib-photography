import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera, Film, MapPin } from 'lucide-react';

export interface LightboxData {
  imageUrl: string;
  title: string;
  subtitle?: string;
  category?: string;
  location?: string;
  year?: string;
  camera?: string;
  filmStock?: string;
  description?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  item: LightboxData | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  item,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#171513]/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-8 select-none"
      >
        {/* Top bar with image info and close */}
        <div className="w-full flex items-center justify-between max-w-6xl text-[#E7E2D7]">
          <div>
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#A8A29E] block">
              {item.category || 'Curated Portfolio'}
            </span>
            <h3 className="font-['Cormorant_Garamond',_serif] text-lg sm:text-2xl font-normal text-[#F6F3EC] truncate max-w-[240px] sm:max-w-none">
              {item.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 hover:border-white/30 text-[#E7E2D7] hover:text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Central Photograph and Navigation Arrows */}
        <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-2 sm:my-4">
          {onPrev && (
            <button
              onClick={() => {
                onPrev();
              }}
              className="absolute left-1 sm:left-4 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 border border-white/10 text-white hover:bg-black/70 hover:scale-105 flex items-center justify-center transition-all focus:outline-none"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={item.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.42, 0, 0.58, 1] }}
              className="relative max-h-[72vh] max-w-full overflow-hidden rounded-sm shadow-2xl flex items-center justify-center"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] max-w-full object-contain"
              />
              {/* Film Grain Texture */}
              <div className="absolute inset-0 film-grain pointer-events-none opacity-30 mix-blend-overlay" />
            </motion.div>
          </AnimatePresence>

          {onNext && (
            <button
              onClick={() => {
                onNext();
              }}
              className="absolute right-1 sm:right-4 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 border border-white/10 text-white hover:bg-black/70 hover:scale-105 flex items-center justify-center transition-all focus:outline-none"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Bottom Technical EXIF & Film Metadata */}
        <div className="w-full max-w-4xl border-t border-white/10 pt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A8A29E] font-sans">
          <div className="flex items-center gap-4 flex-wrap">
            {item.camera && (
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#E7E2D7]" />
                <span>{item.camera}</span>
              </span>
            )}
            {item.filmStock && (
              <span className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#E7E2D7]" />
                <span className="text-[#E7E2D7] font-medium">{item.filmStock}</span>
              </span>
            )}
            {item.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E7E2D7]" />
                <span>{item.location} {item.year ? `· ${item.year}` : ''}</span>
              </span>
            )}
          </div>

          {item.description && (
            <p className="font-['Cormorant_Garamond',_serif] italic text-sm text-[#D6D0C2] line-clamp-1 max-w-md">
              "{item.description}"
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
