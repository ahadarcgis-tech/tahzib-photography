import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Film, ArrowUpRight, ArrowLeft, ArrowRight, Filter, MapPin, Calendar, Sparkles, Menu, X } from 'lucide-react';
import { ActiveView, PortfolioCategory, PortfolioItem } from '../types';
import { useContent } from '../context/ContentContext';
import { Footer } from './Footer';

interface PortfolioPageProps {
  onNavigate: (view: ActiveView) => void;
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

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigate,
  onSelectPhoto,
  onInquire,
}) => {
  const { content } = useContent();
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All');
  const [columnsView, setColumnsView] = useState<'standard' | 'large'>('standard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const itemsToDisplay = content.portfolio;

  const filteredItems = activeCategory === 'All'
    ? itemsToDisplay
    : itemsToDisplay.filter((item) => item.category === activeCategory);

  const featuredSpotlight = itemsToDisplay.find((p) => p.featured) || itemsToDisplay[0];


  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#221F1D] selection:bg-[#221F1D] selection:text-[#F6F3EC] font-sans antialiased">
      {/* 1. TOP EDITORIAL NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#F6F3EC]/92 backdrop-blur-md border-b border-[#E8E2D5] px-4 sm:px-12 lg:px-16 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('home')}
          className="group cursor-pointer text-left transition-opacity duration-300 hover:opacity-85"
        >
          <h1 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl font-light tracking-wide text-[#221F1D] leading-none">
            Tahzib
          </h1>
          <p className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest text-[#78716C] leading-none mt-1">
            Photography
          </p>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="font-['Cormorant_Garamond',_serif] text-lg text-[#57534E] hover:text-[#221F1D] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="font-['Cormorant_Garamond',_serif] text-lg text-[#57534E] hover:text-[#221F1D] transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => onNavigate('services')}
            className="font-['Cormorant_Garamond',_serif] text-lg text-[#57534E] hover:text-[#221F1D] transition-colors cursor-pointer"
          >
            Services
          </button>
          <span className="font-['Cormorant_Garamond',_serif] text-lg font-medium text-[#221F1D] border-b border-[#221F1D] pb-0.5">
            Portfolio
          </span>
          <button
            onClick={() => onNavigate('contact')}
            className="font-['Cormorant_Garamond',_serif] text-lg text-[#57534E] hover:text-[#221F1D] transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onInquire}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-[#221F1D] text-[11px] sm:text-xs uppercase tracking-widest font-sans font-medium text-[#221F1D] hover:bg-[#221F1D] hover:text-[#F6F3EC] transition-all cursor-pointer rounded-none"
          >
            <span>Inquire</span>
            <ArrowUpRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#221F1D] hover:text-[#57534E] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F6F3EC] border-b border-[#E8E2D5] px-6 py-4 flex flex-col gap-3 shadow-md z-30 relative"
          >
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('home'); }}
              className="font-['Cormorant_Garamond',_serif] text-lg text-left text-[#57534E] hover:text-[#221F1D] py-1 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('about'); }}
              className="font-['Cormorant_Garamond',_serif] text-lg text-left text-[#57534E] hover:text-[#221F1D] py-1 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('services'); }}
              className="font-['Cormorant_Garamond',_serif] text-lg text-left text-[#57534E] hover:text-[#221F1D] py-1 transition-colors"
            >
              Services
            </button>
            <span className="font-['Cormorant_Garamond',_serif] text-lg text-[#221F1D] font-medium border-l-2 border-[#221F1D] pl-2.5 py-1">
              Portfolio (Current)
            </span>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('contact'); }}
              className="font-['Cormorant_Garamond',_serif] text-lg text-left text-[#57534E] hover:text-[#221F1D] py-1 transition-colors"
            >
              Contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO / EDITORIAL HEADER */}
      <section className="relative px-4 sm:px-12 lg:px-16 pt-10 sm:pt-24 pb-10 sm:pb-16 max-w-7xl mx-auto border-b border-[#E8E2D5]">
        {/* Breadcrumb / Return */}
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C857B]">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#221F1D] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
          <span>/</span>
          <span className="text-[#221F1D] font-medium">Selected Works</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#8C857B] uppercase">
                Archive & Selected Commissions
              </span>
              <span className="w-5 sm:w-8 h-[1px] bg-[#8C857B]/40" />
              <span className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest text-[#78716C] uppercase">
                2020 — 2026
              </span>
            </div>

            <h1 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-normal text-[#221F1D] tracking-tight leading-[1.08]">
              Curated Photographic Works
            </h1>
          </div>

          <div className="lg:col-span-4">
            <p className="font-['Cormorant_Garamond',_serif] text-base sm:text-xl text-[#57534E] font-light italic leading-relaxed">
              A continuous study of natural luminescence, medium-format silver gelatin grain, and unscripted intimacy preserved across Europe, Asia, and the Americas.
            </p>
          </div>
        </div>

        {/* Studio Specs Ribbon */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E8E2D5]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono uppercase tracking-wider text-[#78716C]">
          <div>
            <span className="block text-[#A8A29E] text-[10px]">Annual Limit</span>
            <span className="text-[#221F1D] font-medium">14 Commissions</span>
          </div>
          <div>
            <span className="block text-[#A8A29E] text-[10px]">Primary Media</span>
            <span className="text-[#221F1D] font-medium">120 Film & 35mm Analog</span>
          </div>
          <div>
            <span className="block text-[#A8A29E] text-[10px]">Base Studio</span>
            <span className="text-[#221F1D] font-medium">Chittagong, Bangladesh</span>
          </div>
          <div>
            <span className="block text-[#A8A29E] text-[10px]">Commissions Open</span>
            <span className="text-[#221F1D] font-medium">2026 / 2027 Calendar</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURED EDITORIAL SPOTLIGHT */}
      {featuredSpotlight && (
        <section className="px-4 sm:px-12 lg:px-16 py-8 sm:py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8C857B]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#8C857B]">
                Curator's Spotlight
              </span>
            </div>
            <span className="font-['Cormorant_Garamond',_serif] italic text-xs text-[#78716C]">
              Featured Frame · {featuredSpotlight.year}
            </span>
          </div>

          <div
            onClick={() => onSelectPhoto(featuredSpotlight)}
            className="group cursor-pointer bg-[#221F1D] border border-[#E0DACB] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-md transition-shadow duration-300 hover:shadow-xl"
          >
            <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto overflow-hidden min-h-[250px] sm:min-h-[460px]">
              <img
                src={featuredSpotlight.imageUrl}
                alt={featuredSpotlight.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-[1.08] transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 film-grain pointer-events-none opacity-30 mix-blend-overlay" />
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-black/70 backdrop-blur-sm px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs text-[#F6F3EC] font-mono tracking-wider">
                {featuredSpotlight.filmStock}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 sm:p-10 flex flex-col justify-between bg-[#1D1A18] text-[#F6F3EC]">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#A8A29E] border border-[#44403C] px-2.5 py-1 inline-block mb-3 sm:mb-4">
                  {featuredSpotlight.category}
                </span>
                <h3 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl font-normal leading-snug mb-2 sm:mb-3 group-hover:text-[#E8E2D5] transition-colors">
                  {featuredSpotlight.title}
                </h3>
                <p className="font-['Cormorant_Garamond',_serif] italic text-sm text-[#A8A29E] mb-4 sm:mb-6 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{featuredSpotlight.location}</span>
                </p>
                <p className="font-['Cormorant_Garamond',_serif] text-sm sm:text-base text-[#D6D0C2] font-light leading-relaxed mb-6">
                  {featuredSpotlight.description}
                </p>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-[#332F2C]">
                <div className="text-xs font-mono text-[#8C857B] mb-3 sm:mb-4">
                  <span>CAMERA: </span>
                  <span className="text-[#D6D0C2]">{featuredSpotlight.camera}</span>
                </div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans text-[#F6F3EC] group-hover:translate-x-1 transition-transform">
                  <span>Open Full Examination</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FILTER BAR & VIEW TOGGLE */}
      <section className="sticky top-[56px] sm:top-[73px] z-30 bg-[#F6F3EC]/95 backdrop-blur-md border-y border-[#E8E2D5] px-4 sm:px-12 lg:px-16 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1.5 sm:pb-0 no-scrollbar">
            <span className="text-xs uppercase tracking-widest text-[#8C857B] font-sans flex items-center gap-1 mr-2 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Series:
            </span>
            {CATEGORIES.map((cat) => {
              const count = cat === 'All'
                ? itemsToDisplay.length
                : itemsToDisplay.filter((item) => item.category === cat).length;
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-['Cormorant_Garamond',_serif] transition-all whitespace-nowrap cursor-pointer rounded-none ${
                    isActive
                      ? 'bg-[#221F1D] text-[#F6F3EC] font-medium'
                      : 'bg-transparent text-[#78716C] hover:text-[#221F1D] hover:bg-[#ECE8DE]'
                  }`}
                >
                  {cat} <span className="text-[10px] opacity-70 ml-1 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* View controls */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C857B]">
            <span>Layout:</span>
            <button
              onClick={() => setColumnsView('standard')}
              className={`px-2 py-1 border transition-colors cursor-pointer ${
                columnsView === 'standard'
                  ? 'border-[#221F1D] text-[#221F1D] bg-[#ECE8DE]'
                  : 'border-[#D6D0C2] text-[#8C857B] hover:text-[#221F1D]'
              }`}
            >
              3 Columns
            </button>
            <button
              onClick={() => setColumnsView('large')}
              className={`px-2 py-1 border transition-colors cursor-pointer ${
                columnsView === 'large'
                  ? 'border-[#221F1D] text-[#221F1D] bg-[#ECE8DE]'
                  : 'border-[#D6D0C2] text-[#8C857B] hover:text-[#221F1D]'
              }`}
            >
              2 Columns
            </button>
          </div>
        </div>
      </section>

      {/* 5. MAIN PHOTOGRAPHY GALLERY GRID */}
      <section className="px-4 sm:px-12 lg:px-16 py-8 sm:py-20 max-w-7xl mx-auto">
        <div
          className={`grid gap-8 sm:gap-10 ${
            columnsView === 'large'
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                onClick={() => onSelectPhoto(item)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div
                  className={`relative overflow-hidden bg-[#221F1D] mb-4 shadow-sm ${
                    columnsView === 'large'
                      ? 'aspect-[16/11]'
                      : item.aspectRatio === 'landscape'
                      ? 'aspect-[4/3]'
                      : 'aspect-[3/4]'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-[1.08] brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-103"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 film-grain pointer-events-none opacity-30 mix-blend-overlay" />

                  {/* Top tags */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-[#171513]/85 backdrop-blur-sm px-2.5 py-1 text-[10px] text-[#E7E2D7] font-sans tracking-wider uppercase flex items-center gap-1 opacity-90">
                      <Film className="w-2.5 h-2.5 text-[#A8A29E]" />
                      <span>{item.filmStock}</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="bg-[#FAF8F3]/90 text-[#221F1D] backdrop-blur-sm p-1.5 flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Cormorant_Garamond',_serif] text-xl sm:text-2xl text-[#221F1D] font-normal leading-snug group-hover:underline underline-offset-4 decoration-[#8C857B] truncate">
                      {item.title}
                    </h3>
                    <p className="font-['Cormorant_Garamond',_serif] italic text-xs sm:text-sm text-[#78716C] mt-0.5">
                      {item.location} · {item.year}
                    </p>
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-[#8C857B] shrink-0 border border-[#D6D0C2] px-2 py-0.5">
                    {item.category}
                  </span>
                </div>

                {/* Camera Technical Footnote */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C857B] font-mono mt-2 pt-2 border-t border-[#E8E2D5]/60">
                  <Camera className="w-3 h-3 text-[#A8A29E] shrink-0" />
                  <span className="truncate">{item.camera}</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* 6. EDITORIAL PHILOSOPHY INTERLUDE */}
      <section className="bg-[#EFEBE1] border-y border-[#E0DACB] py-14 sm:py-28 px-4 sm:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#8C857B] uppercase block mb-3 sm:mb-4">
            The Analog Philosophy
          </span>
          <blockquote className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-xl sm:text-3xl lg:text-4xl font-light text-[#221F1D] leading-relaxed italic mb-4 sm:mb-6">
            “We believe the truest photographs are not manufactured, but witnessed. Luminous, honest, and preserved for generations in silver halide.”
          </blockquote>
          <p className="font-['Cormorant_Garamond',_serif] text-xs sm:text-base text-[#78716C] font-light">
            Tahzib — Lead Documentarian & Medium Format Specialist
          </p>
        </div>
      </section>

      {/* 7. INVITATION & COMMISSION RESERVATION CALLOUT */}
      <section className="px-4 sm:px-12 lg:px-16 py-12 sm:py-28 max-w-7xl mx-auto">
        <div className="border border-[#221F1D] bg-[#FAF8F3] p-6 sm:p-14 lg:p-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#8C857B] block mb-2">
              Limited 2026 & 2027 Calendar
            </span>
            <h3 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-4xl lg:text-5xl text-[#221F1D] font-normal tracking-tight mb-3 sm:mb-4">
              Planning a Destination Celebration?
            </h3>
            <p className="font-['Cormorant_Garamond',_serif] text-base sm:text-lg text-[#57534E] font-light italic leading-relaxed">
              We photograph a strictly limited calendar of 14 destination weddings each year across Europe, the Americas, and worldwide. Inquire early to secure your date.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <button
              onClick={onInquire}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#221F1D] text-[#F6F3EC] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#3D3835] transition-colors rounded-none text-center cursor-pointer"
            >
              Initiate Date Reservation
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 sm:px-6 py-3.5 sm:py-4 border border-[#D6D0C2] text-xs uppercase tracking-widest font-sans font-medium text-[#221F1D] hover:border-[#221F1D] transition-colors text-center cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER WITH SECTION 2 BACKGROUND & SOCIAL ICONS */}
      <Footer
        onNavigate={onNavigate}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
};
