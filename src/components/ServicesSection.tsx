import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, ArrowUpRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ServicesSectionProps {
  onInquire: (packageTitle?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onInquire }) => {
  const { content } = useContent();

  return (
    <section
      id="services"
      className="relative min-h-screen w-full bg-[#F6F3EC] text-[#221F1D] py-10 sm:py-32 px-3 sm:px-12 lg:px-20 border-t border-[#E8E2D5] select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-20 gap-4 sm:gap-6 border-b border-[#E0DACB] pb-4 sm:pb-8">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-2">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.25em] text-[#8C857B] uppercase">
                04 / Offerings & Commissions
              </span>
              <span className="w-4 sm:w-8 h-[1px] bg-[#8C857B]/40" />
              <span className="font-['Cormorant_Garamond',_serif] italic text-[11px] sm:text-xs tracking-wider sm:tracking-widest text-[#78716C] uppercase">
                2026 & 2027 Season
              </span>
            </div>
            <h2 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#221F1D]">
              Services & Investment
            </h2>
          </div>
          <p className="font-['Cormorant_Garamond',_serif] text-xs sm:text-lg text-[#78716C] max-w-md font-light italic">
            Documented with quiet intimacy, high-fashion restraint, and museum-grade archival standards.
          </p>
        </div>

        {/* Packages Grid - Compact on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {content.services.map((pkg, idx) => {
            const isFeatured = idx === 0;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`relative p-4 sm:p-10 flex flex-col justify-between border transition-all duration-300 ${
                  isFeatured
                    ? 'border-[#221F1D] bg-[#EFEBE1] shadow-lg'
                    : 'border-[#E0DACB] bg-[#FAF8F3] hover:border-[#8C857B]'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 sm:-top-3.5 right-4 sm:right-8 bg-[#221F1D] text-[#F6F3EC] px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] uppercase font-sans tracking-wider sm:tracking-[0.2em] flex items-center gap-1 sm:gap-1.5 shadow-sm">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#DFB15B]" />
                    Most Coveted Commission
                  </div>
                )}

                <div>
                  <div className="font-mono text-[10px] sm:text-xs tracking-widest text-[#8C857B] uppercase mb-0.5 sm:mb-1">
                    {pkg.duration}
                  </div>
                  <h3 className="font-['Bodoni_Moda',_'Italiana',_serif] text-xl sm:text-3xl text-[#221F1D] mb-1 sm:mb-2 font-normal leading-tight">
                    {pkg.title}
                  </h3>
                  <div className="text-lg sm:text-2xl font-['Cormorant_Garamond',_serif] font-semibold text-[#221F1D] mb-2 sm:mb-4">
                    {pkg.investment}
                  </div>
                  <p className="font-['Cormorant_Garamond',_serif] text-xs sm:text-base text-[#57534E] leading-relaxed mb-3 sm:mb-6 font-light">
                    {pkg.description}
                  </p>

                  <div className="border-t border-[#D6D0C2]/80 pt-3 sm:pt-5 mb-4 sm:mb-8">
                    <div className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#8C857B] mb-2 sm:mb-3">
                      Curation & Inclusions:
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2.5">
                      {pkg.features.map((feat, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm font-['Cormorant_Garamond',_serif] text-[#44403C] leading-snug"
                        >
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#221F1D] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-[#D6D0C2]/80">
                  <button
                    onClick={() => onInquire(pkg.title)}
                    className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-[0.2em] font-sans font-medium transition-all duration-200 cursor-pointer ${
                      isFeatured
                        ? 'bg-[#221F1D] text-[#F6F3EC] hover:bg-[#3D3835]'
                        : 'border border-[#221F1D] text-[#221F1D] hover:bg-[#221F1D] hover:text-[#F6F3EC]'
                    }`}
                  >
                    <span>Inquire For This Collection</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
