import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ArrowUpRight, Award, Compass, Heart, Camera, Upload } from 'lucide-react';
import { PRESS_ACCOLADES, CLIENT_TESTIMONIALS } from '../data/portfolioData';
import { useContent } from '../context/ContentContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquire: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onInquire,
}) => {
  const { content, updateAbout } = useContent();
  const portraitSrc = content.about.portraitUrl || '/images/tahzib.jpg';
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback to local image or Unsplash if file not yet uploaded to server
  const handleImageError = () => {
    if (portraitSrc !== '/images/tahzib.jpg' && portraitSrc !== '/images/image.png') {
      updateAbout({ portraitUrl: '/images/tahzib.jpg' });
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        updateAbout({ portraitUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (!isOpen) return null;


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-40 bg-[#F6F3EC] overflow-y-auto"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#E8E2D5] px-4 sm:px-12 py-4 sm:py-5 flex items-center justify-between">
        <div>
          <span className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest uppercase text-[#78716C] block">
            Artist Biography & Philosophy
          </span>
          <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-xl sm:text-3xl text-[#221F1D]">
            Meet Tahzib
          </h2>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D6D0C2] hover:border-[#221F1D] text-[#221F1D] flex items-center justify-center transition-colors focus:outline-none"
          aria-label="Close About"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-12 py-8 sm:py-12">
        {/* Top Split Section: Portrait & Artist Statement */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="md:col-span-5 relative">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`relative aspect-[3/4] overflow-hidden bg-[#221F1D] shadow-lg group transition-all duration-300 ${
                isDragOver ? 'ring-2 ring-[#DFB15B] scale-[1.01]' : ''
              }`}
            >
              <img
                src={portraitSrc}
                alt="Tahzib"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover object-top contrast-[1.03]"
              />
              <div className="absolute inset-0 film-grain pointer-events-none opacity-20 mix-blend-overlay" />

              {/* Hidden file input for uploading the user's exact portrait file */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload/Replace Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-4 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-10 h-10 rounded-full bg-[#F6F3EC] text-[#221F1D] flex items-center justify-center shadow-md">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="font-['Cormorant_Garamond',_serif] text-sm text-[#F6F3EC] tracking-wider font-medium">
                  Click or Drop to Replace Portrait
                </span>
                <span className="text-[10px] text-[#F6F3EC]/70 uppercase tracking-widest font-mono">
                  Preserves original resolution
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[#78716C]">
              <span className="font-['Cormorant_Garamond',_serif] italic text-xs sm:text-sm">
                Tahzib · Chittagong, Bangladesh
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-mono uppercase tracking-wider text-[#8C857B] hover:text-[#221F1D] flex items-center gap-1 cursor-pointer transition-colors"
                title="Replace with your original photo"
              >
                <Upload className="w-3 h-3" />
                <span>Replace Photo</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#8C857B] block">
              {content.about.subtitle || 'Editorial Eye · Analog Soul'}
            </span>
            <h3 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-3xl sm:text-4xl text-[#221F1D] leading-tight">
              {content.about.headlineQuote || '"We don\'t manufacture moments; we make quiet space for them to breathe."'}
            </h3>
            
            <p className="font-['Cormorant_Garamond',_serif] text-lg sm:text-xl text-[#44403C] leading-relaxed font-light">
              {content.about.bioParagraph1}
            </p>

            <p className="font-['Cormorant_Garamond',_serif] text-base sm:text-lg text-[#57534E] leading-relaxed font-light">
              {content.about.bioParagraph2}
            </p>

            <div className="pt-2 flex flex-wrap gap-6 items-center border-t border-[#E8E2D5]">
              <div>
                <span className="block font-sans text-xs uppercase tracking-wider text-[#8C857B]">Base Studio</span>
                <span className="font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] font-medium">{content.about.baseStudio || content.brand.location}</span>
              </div>
              <div className="w-px h-8 bg-[#E0DACB]" />
              <div>
                <span className="block font-sans text-xs uppercase tracking-wider text-[#8C857B]">Commissions</span>
                <span className="font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] font-medium">Worldwide Travel</span>
              </div>
              <div className="w-px h-8 bg-[#E0DACB]" />
              <div>
                <span className="block font-sans text-xs uppercase tracking-wider text-[#8C857B]">Primary Medium</span>
                <span className="font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] font-medium">120 & 35mm Analog Film</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars of the Tahzib Ethos */}
        <div className="mt-20 pt-12 border-t border-[#E8E2D5]">
          <h4 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-center text-[#221F1D] mb-12">
            The Three Principles
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#EFEBE1] border border-[#E0DACB]">
              <Compass className="w-6 h-6 text-[#57534E] mb-4" />
              <h5 className="font-['Cormorant_Garamond',_serif] text-xl text-[#221F1D] font-medium mb-2">
                Patience Over Noise
              </h5>
              <p className="font-['Cormorant_Garamond',_serif] text-base text-[#57534E] leading-relaxed">
                By resisting the temptation to spray hundreds of frames each minute, we remain hyper-present. We wait for genuine emotion rather than manufacturing artificial scenes.
              </p>
            </div>

            <div className="p-6 bg-[#EFEBE1] border border-[#E0DACB]">
              <Heart className="w-6 h-6 text-[#57534E] mb-4" />
              <h5 className="font-['Cormorant_Garamond',_serif] text-xl text-[#221F1D] font-medium mb-2">
                Analog Silver Halide
              </h5>
              <p className="font-['Cormorant_Garamond',_serif] text-base text-[#57534E] leading-relaxed">
                Authentic Kodak Portra and Tri-X medium format film renders luminous skin tones, gentle highlights, and heirloom depth that will remain timeless fifty years from today.
              </p>
            </div>

            <div className="p-6 bg-[#EFEBE1] border border-[#E0DACB]">
              <Award className="w-6 h-6 text-[#57534E] mb-4" />
              <h5 className="font-['Cormorant_Garamond',_serif] text-xl text-[#221F1D] font-medium mb-2">
                Heirloom Craftsmanship
              </h5>
              <p className="font-['Cormorant_Garamond',_serif] text-base text-[#57534E] leading-relaxed">
                From hand-curated contact sheets to custom linen and leather albums bound by master artisans in Florence, every deliverable is created to outlive digital screens.
              </p>
            </div>
          </div>
        </div>

        {/* Featured In & Press */}
        <div className="mt-20 pt-12 border-t border-[#E8E2D5] text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#8C857B] block mb-6">
            Recognized & Featured By
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {PRESS_ACCOLADES.map((pub) => (
              <span
                key={pub}
                className="font-['Italiana',_'Cormorant_Garamond',_serif] text-lg sm:text-xl text-[#44403C] tracking-wider"
              >
                {pub}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 pt-12 border-t border-[#E8E2D5]">
          <h4 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-center text-[#221F1D] mb-10">
            Kind Words From Couples
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENT_TESTIMONIALS.map((t, index) => (
              <div
                key={index}
                className="p-6 bg-[#FAF8F3] border border-[#E8E2D5] flex flex-col justify-between"
              >
                <p className="font-['Cormorant_Garamond',_serif] italic text-base sm:text-lg text-[#44403C] leading-relaxed mb-4">
                  "{t.quote}"
                </p>
                <div>
                  <div className="font-['Cormorant_Garamond',_serif] font-medium text-[#221F1D] text-base">
                    {t.couple}
                  </div>
                  <div className="font-['Cormorant_Garamond',_serif] italic text-xs text-[#78716C]">
                    {t.venue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquire CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={onInquire}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#221F1D] text-[#F6F3EC] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#3D3835] transition-colors rounded-none"
          >
            Start A Conversation With Tahzib
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
