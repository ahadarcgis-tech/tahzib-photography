import React from 'react';
import { ActiveView } from '../types';

interface NavListProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onHoverNav?: (key: string | null) => void;
  children?: React.ReactNode;
}

interface NavItemConfig {
  id: ActiveView;
  title: string;
}

const LEFT_NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', title: 'Home' },
  { id: 'about', title: 'About' },
  { id: 'services', title: 'Services' },
  { id: 'portfolio', title: 'Portfolio' },
];

export const NavList: React.FC<NavListProps> = ({
  currentView,
  onNavigate,
  onHoverNav,
  children,
}) => {
  const ALL_ITEMS: NavItemConfig[] = [
    ...LEFT_NAV_ITEMS,
    { id: 'contact', title: 'Contact' },
  ];

  return (
    <nav className="w-full flex-1 flex flex-col md:flex-row justify-between items-center px-4 sm:px-10 lg:px-16 py-1 md:py-2 gap-2 md:gap-2 z-30 select-none my-auto">
      {/* Desktop Left Navigation Buttons beside image container */}
      <div className="hidden md:flex w-full md:w-56 lg:w-64 flex-col gap-4 sm:gap-5 shrink-0 order-1">
        {LEFT_NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => onHoverNav && onHoverNav(item.id)}
              onMouseLeave={() => onHoverNav && onHoverNav(null)}
              className="text-left group cursor-pointer transition-all duration-200 focus:outline-none"
            >
              <span
                className={`block font-['Cormorant_Garamond',_serif] text-xl sm:text-2xl lg:text-[24px] leading-none transition-all duration-200 tracking-wide ${
                  isActive
                    ? 'text-[#221F1D] font-medium translate-x-1'
                    : 'text-[#44403C] hover:text-[#221F1D] font-normal group-hover:translate-x-1'
                }`}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mid-Container Centerpiece Image (Visible on all devices) */}
      {children && (
        <div className="flex-1 flex justify-center items-center order-1 md:order-2 w-full px-1 sm:px-2 max-h-full">
          {children}
        </div>
      )}

      {/* Mobile-Only Unified Navigation Bar below photograph */}
      <div className="flex md:hidden w-full flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-1.5 pt-3 pb-1 px-2 order-2">
        {ALL_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="px-2 py-1 focus:outline-none cursor-pointer transition-colors active:scale-95"
            >
              <span
                className={`font-['Cormorant_Garamond',_serif] text-lg sm:text-xl tracking-wide transition-colors ${
                  isActive
                    ? 'text-[#221F1D] font-semibold border-b border-[#221F1D] pb-0.5'
                    : 'text-[#57534E] hover:text-[#221F1D] font-normal'
                }`}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Right Navigation Button beside image container: Contact */}
      <div className="hidden md:flex w-full md:w-56 lg:w-64 flex-col justify-center items-end text-right shrink-0 order-3">
        <button
          onClick={() => onNavigate('contact')}
          onMouseEnter={() => onHoverNav && onHoverNav('contact')}
          onMouseLeave={() => onHoverNav && onHoverNav(null)}
          className="group cursor-pointer text-right transition-all duration-200 focus:outline-none"
          aria-label="Contact"
        >
          <span
            className={`block font-['Cormorant_Garamond',_serif] text-xl sm:text-2xl lg:text-[24px] leading-none transition-all duration-200 tracking-wide ${
              currentView === 'contact'
                ? 'text-[#221F1D] font-medium md:-translate-x-1'
                : 'text-[#44403C] hover:text-[#221F1D] font-normal group-hover:md:-translate-x-1'
            }`}
          >
            Contact
          </span>
        </button>
      </div>
    </nav>
  );
};

