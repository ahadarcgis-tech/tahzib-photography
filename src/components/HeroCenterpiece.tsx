import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_NAV_IMAGES } from '../data/portfolioData';
import { useContent } from '../context/ContentContext';

interface HeroCenterpieceProps {
  hoveredNav: string | null;
  onOpenLightbox: (imageUrl: string, title: string, subtitle: string) => void;
}

interface SlideItem {
  url: string;
  title: string;
  subtitle: string;
  location: string;
}

export const HeroCenterpiece: React.FC<HeroCenterpieceProps> = ({
  hoveredNav,
  onOpenLightbox,
}) => {
  const { content } = useContent();

  const slideItems: SlideItem[] = useMemo(() => {
    const items: SlideItem[] = [];
    if (content.hero.leftImage?.url) {
      items.push({
        url: content.hero.leftImage.url,
        title: content.hero.leftImage.caption || content.hero.title,
        subtitle: content.hero.leftImage.location || content.hero.subtitle,
        location: content.hero.leftImage.location || content.brand.location,
      });
    }
    if (content.hero.rightImage?.url) {
      items.push({
        url: content.hero.rightImage.url,
        title: content.hero.rightImage.caption || content.hero.title,
        subtitle: content.hero.rightImage.location || content.hero.subtitle,
        location: content.hero.rightImage.location || content.brand.location,
      });
    }
    content.portfolio.forEach((p) => {
      if (p.imageUrl && !items.some((i) => i.url === p.imageUrl)) {
        items.push({
          url: p.imageUrl,
          title: p.title,
          subtitle: p.description || p.category,
          location: p.location,
        });
      }
    });

    return items.length > 0
      ? items
      : [
          {
            url: '/images/tahzib_crimson_veil.jpg',
            title: 'On Earth, We Exist',
            subtitle: 'Ceremonial Drapes & Heirloom Gold',
            location: 'Dhaka · Private Haveli Estate',
          },
        ];
  }, [content]);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Preload all slideshow images on mount for instant transitions
  useEffect(() => {
    slideItems.forEach((item) => {
      const img = new Image();
      img.src = item.url;
    });
  }, [slideItems]);

  // Automatically advance slideshow every 1.5 seconds
  useEffect(() => {
    if (hoveredNav || slideItems.length <= 1) return;

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slideItems.length);
    }, 1500);

    return () => clearInterval(timer);
  }, [hoveredNav, slideItems.length]);

  // Dynamic nav images overlay
  const dynamicNavImages: Record<string, { url: string; title: string; subtitle: string; location: string }> = {
    ...HERO_NAV_IMAGES,
    about: {
      url: content.about.portraitUrl || '/images/tahzib.jpg',
      title: content.brand.name || 'Tahzib',
      subtitle: content.about.subtitle || 'Behind The Lens',
      location: content.about.baseStudio || content.brand.location,
    },
  };

  const currentImage: SlideItem =
    hoveredNav && dynamicNavImages[hoveredNav]
      ? dynamicNavImages[hoveredNav]
      : slideItems[activeSlideIndex] || slideItems[0];


  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slideItems.length === 0) return;
    setActiveSlideIndex((prev) => (prev + 1) % slideItems.length);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slideItems.length === 0) return;
    setActiveSlideIndex((prev) => (prev - 1 + slideItems.length) % slideItems.length);
  };

  const handleImageClick = () => {
    onOpenLightbox(currentImage.url, currentImage.title, currentImage.subtitle);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || slideItems.length === 0) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      setActiveSlideIndex((prev) => (prev + 1) % slideItems.length);
    } else if (diff < -45) {
      setActiveSlideIndex((prev) => (prev - 1 + slideItems.length) % slideItems.length);
    }
    setTouchStart(null);
  };

  return (
    <div className="relative flex flex-col items-center justify-center px-1 sm:px-2 py-1 z-10 w-full max-h-full">
      {/* Centered Photographic Frame - Vertically Elongated Portrait Proportions */}
      <div 
        className="relative group cursor-pointer w-auto h-[46vh] xs:h-[50vh] sm:h-[60vh] md:h-[67vh] lg:h-[71vh] max-h-[630px] aspect-[2/3] max-w-[85vw] shadow-md"
        onClick={handleImageClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        title="Click to expand photograph (Swipe on mobile)"
      >
        <div className="w-full h-full relative overflow-hidden bg-[#221F1D] rounded-[1px]">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImage.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.42, 0, 0.58, 1], // ease-in ease-out curve
              }}
              className="absolute inset-0 w-full h-full"
            >
              {/* The Photograph - Fills portrait container completely */}
              <img
                src={currentImage.url}
                alt={currentImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover contrast-[1.08] brightness-[0.98]"
                loading="eager"
              />

              {/* Authentic fine film grain texture overlay */}
              <div className="absolute inset-0 film-grain pointer-events-none opacity-30 mix-blend-overlay" />

              {/* Subtle vignette border */}
              <div className="absolute inset-0 ring-1 ring-black/10 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Prev / Next slide controls (Accessible on touch, hover on desktop) */}
        <button
          onClick={handlePrevSlide}
          className="absolute -left-3 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F6F3EC]/95 border border-[#D6D0C2] text-[#221F1D] flex items-center justify-center opacity-85 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-sm z-20 focus:outline-none"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNextSlide}
          className="absolute -right-3 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F6F3EC]/95 border border-[#D6D0C2] text-[#221F1D] flex items-center justify-center opacity-85 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-sm z-20 focus:outline-none"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
