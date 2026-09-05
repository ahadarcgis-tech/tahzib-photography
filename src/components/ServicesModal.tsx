import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ChevronDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquire: (packageTitle?: string) => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  isOpen,
  onClose,
  onInquire,
}) => {
  const { content } = useContent();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-40 bg-[#F6F3EC] overflow-y-auto"
    >
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#E8E2D5] px-4 sm:px-12 py-4 sm:py-5 flex items-center justify-between">
        <div>
          <span className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest uppercase text-[#78716C] block">
            Investment & Offerings
          </span>
          <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-xl sm:text-3xl text-[#221F1D]">
            Services & Commissions
          </h2>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D6D0C2] hover:border-[#221F1D] text-[#221F1D] flex items-center justify-center transition-colors focus:outline-none"
          aria-label="Close Services"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-12 py-8 sm:py-12">
        {/* Intro */}
        <div className="max-w-2xl mb-12">
          <p className="font-['Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#221F1D] font-light leading-snug">
            Every love story is documented with quiet intimacy, high-fashion restraint, and museum-grade archival standards.
          </p>
          <p className="font-['Cormorant_Garamond',_serif] text-base text-[#78716C] mt-2 italic">
            Currently accepting commissions worldwide for the 2026 and 2027 seasons.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {content.services.map((pkg, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={pkg.id}
                className={`relative p-8 flex flex-col justify-between border transition-all duration-300 ${
                  isFeatured
                    ? 'border-[#221F1D] bg-[#EFEBE1] shadow-md'
                    : 'border-[#E0DACB] bg-[#FAF8F3] hover:border-[#8C857B]'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 right-6 bg-[#221F1D] text-[#F6F3EC] px-3 py-0.5 text-[10px] uppercase font-sans tracking-widest flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#E7E2D7]" />
                    Most Coveted
                  </div>
                )}

                <div>
                  <span className="font-sans text-xs uppercase tracking-widest text-[#8C857B] block">
                    {pkg.duration}
                  </span>
                  <h3 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#221F1D] mt-1 mb-2">
                    {pkg.title}
                  </h3>
                  <div className="font-['Cormorant_Garamond',_serif] text-xl font-medium text-[#221F1D] mb-4">
                    {pkg.investment}
                  </div>
                  <p className="font-['Cormorant_Garamond',_serif] text-base text-[#57534E] leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  <div className="border-t border-[#D6D0C2] pt-4 mb-6">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-[#78716C] block mb-3 font-semibold">
                      Curated Inclusions:
                    </span>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-['Cormorant_Garamond',_serif] text-[#332F2C]">
                          <Check className="w-3.5 h-3.5 text-[#221F1D] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D6D0C2]">
                  <button
                    onClick={() => onInquire(pkg.title)}
                    className={`w-full py-3 text-xs uppercase tracking-widest font-sans font-medium transition-colors flex items-center justify-center gap-2 rounded-none ${
                      isFeatured
                        ? 'bg-[#221F1D] text-[#F6F3EC] hover:bg-[#3D3835]'
                        : 'border border-[#221F1D] text-[#221F1D] hover:bg-[#221F1D] hover:text-[#F6F3EC]'
                    }`}
                  >
                    Inquire For This Collection
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div className="mt-20 pt-12 border-t border-[#E8E2D5]">
          <h3 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-center text-[#221F1D] mb-8">
            Frequently Asked Questions
          </h3>

          <div className="max-w-3xl mx-auto space-y-3">
            {content.faqs.map((faq, i) => {
              const isOpenItem = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="border border-[#E0DACB] bg-[#FAF8F3] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpenItem ? null : i)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  >
                    <span className="font-['Cormorant_Garamond',_serif] text-lg sm:text-xl text-[#221F1D] font-medium">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#78716C] transition-transform duration-200 shrink-0 ${
                        isOpenItem ? 'rotate-180 text-[#221F1D]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpenItem && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-[#57534E] font-['Cormorant_Garamond',_serif] text-base leading-relaxed border-t border-[#E8E2D5]/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="font-['Cormorant_Garamond',_serif] italic text-lg text-[#57534E] mb-4">
            Have a unique celebration or multi-destination itinerary in mind?
          </p>
          <button
            onClick={() => onInquire()}
            className="px-8 py-3.5 bg-[#221F1D] text-[#F6F3EC] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#3D3835] transition-colors rounded-none"
          >
            Request A Custom Proposal
          </button>
        </div>
      </div>
    </motion.div>
  );
};
