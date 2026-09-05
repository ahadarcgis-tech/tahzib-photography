import React from 'react';
import { Instagram, Twitter, Youtube, Globe, Mail, ArrowUp } from 'lucide-react';
import { ActiveView } from '../types';
import { useContent } from '../context/ContentContext';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
  onScrollToTop: () => void;
}

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://instagram.com',
    handle: '@tahzibphotography',
  },
  {
    name: 'Twitter / X',
    icon: Twitter,
    href: 'https://twitter.com',
    handle: '@tahzibphoto',
  },
  {
    name: 'YouTube Archive',
    icon: Youtube,
    href: 'https://youtube.com',
    handle: 'Tahzib Cinematography',
  },
  {
    name: 'Worldwide Dispatch',
    icon: Globe,
    href: 'https://tahzibphotography.com',
    handle: 'tahzibphotography.com',
  },
  {
    name: 'Electronic Mail',
    icon: Mail,
    href: 'mailto:contact@tahzibphotography.com',
    handle: 'contact@tahzibphotography.com',
  },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToTop }) => {
  const { content } = useContent();

  return (
    <footer className="relative w-full overflow-hidden bg-[#2D060B] text-[#F6F3EC] select-none border-t border-[#DFB15B]/20">
      {/* Background Image Layer matching Section 2 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/tahzib_crimson_veil.jpg"
          alt="Tahzib Photography - Background"
          className="w-full h-full object-cover object-bottom brightness-[0.75] contrast-[1.1] saturate-[1.15]"
        />
        {/* Deep Crimson & Burgundy Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#200307]/98 via-[#2D060B]/85 to-[#200307]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#200307]/95 via-transparent to-[#200307]/95" />
        {/* Authentic analog film grain */}
        <div className="absolute inset-0 film-grain opacity-35 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-12 lg:px-20 py-14 sm:py-20 flex flex-col justify-between">
        {/* Top Header / Insignia Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 sm:pb-12 border-b border-[#F6F3EC]/15">
          {/* Brand Seal matching Section 2 watermark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#DFB15B]/60 flex items-center justify-center bg-[#200307]/80 backdrop-blur-sm shadow-md shrink-0">
              <span className="font-['Italiana',_serif] text-[#DFB15B] text-sm italic font-medium leading-none">
                {content.brand.name.charAt(0).toLowerCase()}
              </span>
            </div>
            <div>
              <div className="font-['Cormorant_Garamond',_serif] tracking-[0.25em] text-xs uppercase text-[#DFB15B] font-medium">
                {content.brand.name}
              </div>
              <div className="font-['Cormorant_Garamond',_serif] italic text-[11px] tracking-[0.18em] text-[#F6F3EC]/60 uppercase">
                Fine Art & Analog Archive · {content.brand.location}
              </div>
            </div>
          </div>

          {/* Social Media Icons with Tooltips */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={`${social.name}: ${social.handle}`}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#F6F3EC]/25 hover:border-[#DFB15B] bg-[#200307]/60 hover:bg-[#DFB15B]/15 text-[#F6F3EC]/80 hover:text-[#DFB15B] flex items-center justify-center transition-all duration-300 backdrop-blur-sm group cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Middle Columns: Brand Statement & Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 py-10 sm:py-14 border-b border-[#F6F3EC]/15">
          {/* Column 1: Editorial Presence */}
          <div className="md:col-span-6 space-y-4">
            <h2 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-3xl sm:text-4xl lg:text-5xl text-[#F6F3EC] tracking-tight font-normal leading-none">
              Tahzib Photography
            </h2>
            <p className="font-['Cormorant_Garamond',_serif] text-sm sm:text-base text-[#F6F3EC]/75 leading-relaxed font-light max-w-md">
              Preserving intimate moments, quiet beauty, and generational celebrations through medium format film and poetic restraint. Based in Chittagong, Bangladesh, available for destination weddings and editorial assignments worldwide.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-['Cormorant_Garamond',_serif] tracking-widest text-[#DFB15B] uppercase">
              <span>Chittagong</span>
              <span>·</span>
              <span>Dhaka</span>
              <span>·</span>
              <span>Bangladesh</span>
              <span>·</span>
              <span>Worldwide</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#DFB15B] font-medium">
              Navigation
            </div>
            <ul className="space-y-2 font-['Cormorant_Garamond',_serif] text-sm sm:text-base">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-[#F6F3EC]/80 hover:text-[#DFB15B] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-[#F6F3EC]/80 hover:text-[#DFB15B] transition-colors cursor-pointer"
                >
                  About Tahzib
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="text-[#F6F3EC]/80 hover:text-[#DFB15B] transition-colors cursor-pointer"
                >
                  Curated Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="text-[#F6F3EC]/80 hover:text-[#DFB15B] transition-colors cursor-pointer"
                >
                  Services & Investment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-[#F6F3EC]/80 hover:text-[#DFB15B] transition-colors cursor-pointer"
                >
                  Inquire & Reserve
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-[#DFB15B]/70 hover:text-[#DFB15B] transition-colors cursor-pointer font-mono text-xs flex items-center gap-1 mt-1"
                >
                  <span>✦ Studio CMS Admin</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Inquiries & Dispatch */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#DFB15B] font-medium">
              Commissions
            </div>
            <p className="font-['Cormorant_Garamond',_serif] text-xs sm:text-sm text-[#F6F3EC]/70 leading-relaxed font-light">
              Limited to 14 private commissions annually to ensure undivided devotion to each heirloom gallery.
            </p>
            <div className="pt-1">
              <a
                href="mailto:contact@tahzibphotography.com"
                className="font-['Cormorant_Garamond',_serif] text-sm sm:text-base text-[#DFB15B] hover:underline underline-offset-4 break-all block"
              >
                contact@tahzibphotography.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-[#F6F3EC]/50 font-['Cormorant_Garamond',_serif] tracking-wider uppercase gap-3 text-center sm:text-left">
          <div>
            <span>© 2026 Tahzib Photography. All rights reserved.</span>
            <span className="hidden sm:inline mx-2">·</span>
            <span className="block sm:inline mt-0.5 sm:mt-0">Analog Medium Format & Digital Archival Storytelling</span>
          </div>

          <button
            onClick={onScrollToTop}
            className="group inline-flex items-center gap-1.5 text-[#F6F3EC]/80 hover:text-[#DFB15B] transition-colors cursor-pointer uppercase tracking-[0.2em] font-mono text-[10px] sm:text-xs"
            aria-label="Scroll to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
};
