import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { ActiveView } from '../types';
import { useContent } from '../context/ContentContext';

interface EditorialStatementSectionProps {
  onNavigate: (view: ActiveView) => void;
  onScrollToTop: () => void;
}

export const EditorialStatementSection: React.FC<EditorialStatementSectionProps> = ({
  onNavigate,
  onScrollToTop,
}) => {
  const { content } = useContent();
  const sectionRef = useRef<HTMLElement>(null);

  
  // Parallax scroll tracking through section 2
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Subtle counter-movement: as the user scrolls, the background image shifts counterly
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section 
      ref={sectionRef}
      id="editorial-statement" 
      className="relative min-h-[100dvh] md:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#2D060B] text-[#F6F3EC] select-none"
    >
      {/* Background Image Layer with Counter-Movement */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute -top-[8%] -bottom-[8%] left-0 right-0 h-[116%] w-full z-0 pointer-events-none will-change-transform"
      >
        <img
          src="/images/tahzib_crimson_veil.jpg"
          alt="Tahzib Photography - On Earth, We Exist"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-[0.82] contrast-[1.08] saturate-[1.12]"
        />
      </motion.div>

      {/* Deep Crimson & Burgundy Vignette Overlays matching reference image */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#200307]/90 via-[#2D060B]/35 to-[#200307]/80 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#200307]/85 via-transparent to-[#200307]/75 pointer-events-none" />

      {/* Authentic analog film grain */}
      <div className="absolute inset-0 z-[1] film-grain pointer-events-none opacity-30 mix-blend-overlay" />

      {/* Top Bar: Section Number & Quick Return */}
      <div className="relative z-10 w-full flex items-center justify-between px-3.5 sm:px-12 lg:px-20 pt-4 sm:pt-12">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#F6F3EC]/60 uppercase">
            02 / Editorial Archive
          </span>
          <span className="w-4 sm:w-8 h-[1px] bg-[#F6F3EC]/30" />
          <span className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest text-[#F6F3EC]/70 uppercase hidden sm:inline">
            Heirloom Ceremonies
          </span>
        </div>

        <button
          onClick={onScrollToTop}
          className="group flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-['Cormorant_Garamond',_serif] uppercase tracking-[0.2em] text-[#F6F3EC]/70 hover:text-[#F6F3EC] transition-colors"
          title="Back to Top"
        >
          <span>Top</span>
          <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full px-3.5 sm:px-12 lg:px-20 py-6 sm:py-16 my-auto flex flex-col justify-between">
        {/* Massive Editorial Headline matching the reference image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1 sm:space-y-2 max-w-6xl"
        >
          <h2 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-4xl xs:text-5xl sm:text-8xl md:text-9xl lg:text-[136px] xl:text-[158px] font-normal leading-[0.9] sm:leading-[0.88] tracking-tight sm:tracking-[-0.02em] text-[#F6F3EC] drop-shadow-sm">
            On Earth,
          </h2>
          <h2 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-4xl xs:text-5xl sm:text-8xl md:text-9xl lg:text-[136px] xl:text-[158px] font-normal leading-[0.9] sm:leading-[0.88] tracking-[0.03em] sm:tracking-[0.04em] uppercase text-[#F6F3EC] drop-shadow-sm">
            WE EXIST.
          </h2>
        </motion.div>

        {/* Lower Content Grid: Editorial Text & Meet Tahzib link */}
        <div className="mt-6 sm:mt-20 md:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-end">
          {/* Left Column: Brand Signature / Watermark as seen in photo 1 */}
          <div className="lg:col-span-5 flex flex-col justify-end">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#DFB15B]/50 flex items-center justify-center bg-[#200307]/60 backdrop-blur-sm shadow-md shrink-0">
                <span className="font-['Italiana',_serif] text-[#DFB15B] text-xs sm:text-sm italic font-medium leading-none">
                  t
                </span>
              </div>
              <div>
                <div className="font-['Cormorant_Garamond',_serif] tracking-[0.2em] sm:tracking-[0.25em] text-[11px] sm:text-xs uppercase text-[#DFB15B] font-medium">
                  {content.brand.name}
                </div>
                <div className="font-['Cormorant_Garamond',_serif] italic text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] text-[#F6F3EC]/60 uppercase">
                  Photography · {content.brand.location}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Paragraph and Meet Link matching screenshot 2 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start lg:items-end text-left lg:text-left space-y-4 sm:space-y-6"
          >
            <div className="max-w-xl space-y-3 sm:space-y-4">
              <p className="font-['Cormorant_Garamond',_serif] text-sm sm:text-lg lg:text-xl text-[#F6F3EC]/95 leading-relaxed font-normal drop-shadow-sm">
                {content.editorial.welcomeText}
              </p>

              {/* Link matching the exact reference: '▪ Meet Fijora' -> '▪ Meet Tahzib' */}
              <div className="pt-1 sm:pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="group inline-flex items-center gap-2 sm:gap-2.5 text-xs sm:text-base font-['Cormorant_Garamond',_serif] tracking-wider text-[#F6F3EC] hover:text-[#DFB15B] transition-colors cursor-pointer"
                  aria-label={`Meet ${content.brand.name}`}
                >
                  <span className="text-[9px] sm:text-[10px] text-[#F6F3EC]/80 group-hover:text-[#DFB15B] transition-colors">
                    ▪
                  </span>
                  <span className="underline underline-offset-4 decoration-[#F6F3EC]/40 group-hover:decoration-[#DFB15B]">
                    Meet {content.brand.name}
                  </span>
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar: Ambient details */}
      <div className="relative z-10 w-full px-3.5 sm:px-12 lg:px-20 pb-4 sm:pb-8 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-[#F6F3EC]/50 font-['Cormorant_Garamond',_serif] tracking-wider sm:tracking-widest uppercase border-t border-[#F6F3EC]/10 pt-3 sm:pt-4 gap-2 text-center sm:text-left">
        <span>Curated Analog Works & Destination Commissions</span>
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => onNavigate('portfolio')} 
            className="hover:text-[#F6F3EC] transition-colors underline underline-offset-4 decoration-[#F6F3EC]/30"
          >
            Explore Portfolio
          </button>
          <button 
            onClick={() => onNavigate('contact')} 
            className="hover:text-[#F6F3EC] transition-colors underline underline-offset-4 decoration-[#F6F3EC]/30"
          >
            Inquire For Dates
          </button>
        </div>
      </div>
    </section>
  );
};
