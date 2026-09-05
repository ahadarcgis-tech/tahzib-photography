import React from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { ActiveView } from '../types';
import { useContent } from '../context/ContentContext';

interface HeaderProps {
  onNavigate: (view: ActiveView) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { content } = useContent();

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-10 lg:px-16 pt-5 sm:pt-8 z-30 select-none">
      {/* Brand Title: Tahzib / Photography */}
      <div 
        onClick={() => onNavigate('home')}
        className="group cursor-pointer text-left transition-opacity duration-300 hover:opacity-85"
        role="button"
        tabIndex={0}
        aria-label="Go to Home"
      >
        <h1 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-3xl sm:text-5xl lg:text-[56px] tracking-tight leading-none text-[#221F1D] font-normal">
          {content.brand.name}
        </h1>
        <p className="font-['Cormorant_Garamond',_serif] italic text-xs sm:text-sm tracking-[0.22em] uppercase text-[#78716C] mt-1 pl-0.5 group-hover:text-[#221F1D] transition-colors">
          {content.brand.tagline}
        </p>
      </div>


      {/* Top Right Action: Get a Schedule */}
      <button
        onClick={() => onNavigate('contact')}
        className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-[#221F1D] text-[#F6F3EC] hover:bg-[#3D3835] border border-[#221F1D] text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.22em] font-sans font-medium transition-all duration-300 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        aria-label="Get a Schedule"
      >
        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
        <span>Get a Schedule</span>
        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </button>
    </header>
  );
};
