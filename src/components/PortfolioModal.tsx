import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Film, ArrowUpRight, Filter } from 'lucide-react';
import { PortfolioCategory, PortfolioItem } from '../types';
import { PORTFOLIO_ITEMS } from '../data/portfolioData';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (item: PortfolioItem) => void;
  onInquire: () => void;
}

const CATEGORIES: PortfolioCategory[] = [
  'All',
  'Weddings',
  'Editorial & Fashion',
  'Portraits',
  'Destination & Travel',
  '35mm & 120 Film',
];

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  onInquire,
}) => {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All');

  if (!isOpen) return null;

  const filteredItems = activeCategory === 'All'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-40 bg-[#F6F3EC] overflow-y-auto"
    >
      {/* Top sticky navigation bar */}
      <div className="sticky top-0 z-30 bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#E8E2D5] px-6 sm:px-12 py-5 flex items-center justify-between">
        <div>
          <span className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest uppercase text-[#78716C] block">
            Archives & Selected Commissions
          </span>
          <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#221F1D]">
            Curated Collections
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onInquire}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-[#221F1D] text-xs uppercase tracking-widest font-sans font-medium text-[#221F1D] hover:bg-[#221F1D] hover:text-[#F6F3EC] transition-colors rounded-none"
          >
            Inquire For 2026/2027
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-[#D6D0C2] hover:border-[#221F1D] text-[#221F1D] flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close Portfolio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        {/* Intro Statement */}
        <div className="max-w-2xl mb-10">
          <p className="font-['Cormorant_Garamond',_serif] text-xl sm:text-2xl text-[#44403C] font-light leading-relaxed">
            A celebration of honest light, medium-format grain, and unscripted human emotion documented across Europe and the Americas.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 border-b border-[#E8E2D5] no-scrollbar">
          <span className="text-xs uppercase tracking-widest text-[#8C857B] font-sans flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Series:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-['Cormorant_Garamond',_serif] transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#221F1D] text-[#F6F3EC] font-medium'
                  : 'bg-transparent text-[#78716C] hover:text-[#221F1D] hover:bg-[#ECE8DE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                onClick={() => {
                  onSelectPhoto(item);
                }}
                className="group cursor-pointer flex flex-col"
              >
                {/* Photo Frame */}
                <div className="relative overflow-hidden bg-[#221F1D] aspect-[3/4] mb-3.5 shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-[1.1] transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 film-grain pointer-events-none opacity-35 mix-blend-overlay" />
                  
                  {/* Subtle Badge for Film Stock */}
                  <div className="absolute top-3 left-3 bg-[#171513]/75 backdrop-blur-sm px-2.5 py-1 text-[10px] text-[#E7E2D7] font-sans tracking-wider uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Film className="w-2.5 h-2.5 text-[#A8A29E]" />
                    <span>{item.filmStock}</span>
                  </div>
                </div>

                {/* Metadata details */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-['Cormorant_Garamond',_serif] text-lg sm:text-xl text-[#221F1D] font-normal leading-snug group-hover:underline underline-offset-4 decoration-[#8C857B]">
                      {item.title}
                    </h4>
                    <p className="font-['Cormorant_Garamond',_serif] italic text-xs sm:text-sm text-[#78716C]">
                      {item.location} · {item.year}
                    </p>
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-[#A8A29E] shrink-0 mt-1 border border-[#D6D0C2] px-2 py-0.5">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#8C857B] font-sans mt-1">
                  <Camera className="w-3 h-3 text-[#A8A29E]" />
                  <span className="truncate">{item.camera}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Callout */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-12 border border-[#E0DACB] bg-[#EFEBE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#221F1D]">
              Planning a Destination Celebration?
            </h3>
            <p className="font-['Cormorant_Garamond',_serif] italic text-base text-[#57534E] mt-1 max-w-xl">
              We accept a maximum of 14 bespoke wedding commissions each season to ensure undivided artistic devotion to every couple.
            </p>
          </div>
          <button
            onClick={onInquire}
            className="px-6 py-3 bg-[#221F1D] text-[#F6F3EC] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#3D3835] transition-colors rounded-none whitespace-nowrap"
          >
            Check Date Availability
          </button>
        </div>
      </div>
    </motion.div>
  );
};
