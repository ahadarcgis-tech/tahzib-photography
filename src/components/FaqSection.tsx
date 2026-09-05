import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface FaqSectionProps {
  onScrollToServices?: () => void;
}

export const FAQS = [
  {
    q: 'How does shooting analog film work for a wedding?',
    a: 'We carry both medium-format cameras (Contax 645, Hasselblad) and modern digital bodies side by side. Tahzib photographs the key emotional moments, bridal details, and couple portraits on film for that incomparable painterly grain and luminous depth. After the celebration, the rolls are hand-delivered to our partner pro laboratory, developed in fresh chemistry, and high-resolution drum scanned.',
  },
  {
    q: 'Are travel and accommodations included in your pricing?',
    a: 'For our signature Destination Weekend collection, travel and accommodation within Europe (Italy, France, Spain, Greece) and North America are fully included with zero surprise expenses. For smaller bespoke commissions, we provide a flat, transparent travel quote upfront.',
  },
  {
    q: 'When will we receive our photographs?',
    a: 'You will receive a curated Editorial Preview of 40–60 fully graded images within 5 business days of your celebration to share with family and friends. Your full complete gallery and scanned film negatives are delivered within 6 to 8 weeks.',
  },
  {
    q: 'How far in advance should we reserve our date?',
    a: 'Because we limit our calendar to 14 commissions annually to maintain our highest standards of craft, most couples reserve their date 9 to 18 months in advance.',
  },
  {
    q: 'Do you provide black & white as well as color imagery?',
    a: 'Yes, every commission incorporates a deliberate curation of Kodak Tri-X / Ilford 400 black-and-white analog frames alongside rich, natural Fuji 400H and Portra 400 color tones, carefully matched to the emotional cadence of your celebration.',
  },
];

export const FaqSection: React.FC<FaqSectionProps> = ({ onScrollToServices }) => {
  const { content } = useContent();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const items = content.faqs && content.faqs.length > 0 ? content.faqs : FAQS;

  return (
    <section
      id="faq"
      className="relative w-full bg-[#FAF8F3] text-[#221F1D] py-10 sm:py-32 px-3 sm:px-12 lg:px-20 border-t border-[#E8E2D5] select-none"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-20">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-3">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.25em] text-[#8C857B] uppercase">
              03 / Notes & Clarifications
            </span>
            <span className="w-4 sm:w-8 h-[1px] bg-[#8C857B]/40" />
            <span className="font-['Cormorant_Garamond',_serif] italic text-[11px] sm:text-xs tracking-wider sm:tracking-widest text-[#78716C] uppercase">
              Frequently Inquired
            </span>
          </div>
          <h2 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#221F1D] mb-1.5 sm:mb-4">
            Questions & Answers
          </h2>
          <p className="font-['Cormorant_Garamond',_serif] text-xs sm:text-lg text-[#78716C] max-w-xl mx-auto font-light italic leading-relaxed">
            Essential details concerning our analog film craft, international commissions, archive delivery, and reservation timelines.
          </p>
        </div>

        {/* FAQs Accordion - Compact on Mobile */}
        <div className="space-y-2 sm:space-y-4 mb-8 sm:mb-14">
          {items.map((faq, i) => {
            const isOpen = openFaqIndex === i;
            return (
              <div
                key={i}
                className={`border transition-colors duration-200 ${
                  isOpen ? 'border-[#221F1D] bg-[#F6F3EC]' : 'border-[#E0DACB] bg-[#FAF8F3] hover:border-[#8C857B]'
                }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="w-full text-left p-3 sm:p-7 flex items-center justify-between gap-2.5 sm:gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2 sm:gap-3.5">
                    <HelpCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${isOpen ? 'text-[#221F1D]' : 'text-[#A8A29E]'}`} />
                    <span className="font-['Cormorant_Garamond',_serif] text-xs xs:text-sm sm:text-xl font-medium text-[#221F1D] leading-snug">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#78716C] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#221F1D]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-3 sm:px-7 pb-3.5 sm:pb-7 pt-1.5 sm:pt-2 text-xs sm:text-lg font-['Cormorant_Garamond',_serif] text-[#57534E] leading-relaxed font-light border-t border-[#E8E2D5]/80 pl-3 sm:pl-11">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Call to view services directly below */}
        {onScrollToServices && (
          <div className="text-center pt-1 sm:pt-2">
            <button
              onClick={onScrollToServices}
              className="group inline-flex items-center gap-1.5 sm:gap-2 font-['Cormorant_Garamond',_serif] italic text-xs sm:text-base text-[#78716C] hover:text-[#221F1D] transition-colors cursor-pointer"
            >
              <span>Explore Services & Investment Collections</span>
              <span className="transition-transform group-hover:translate-y-0.5">↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
