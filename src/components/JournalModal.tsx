import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Clock, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { JournalArticle } from '../types';
import { JOURNAL_ARTICLES } from '../data/portfolioData';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (imageUrl: string, title: string) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
}) => {
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-40 bg-[#F6F3EC] overflow-y-auto"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#E8E2D5] px-6 sm:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {activeArticle && (
            <button
              onClick={() => setActiveArticle(null)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-sans text-[#78716C] hover:text-[#221F1D] mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back To Notes</span>
            </button>
          )}
          <div>
            <span className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest uppercase text-[#78716C] block">
              Galleries & Travel Notes
            </span>
            <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#221F1D]">
              {activeArticle ? activeArticle.title : 'The Journal'}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-[#D6D0C2] hover:border-[#221F1D] text-[#221F1D] flex items-center justify-center transition-colors focus:outline-none"
          aria-label="Close Journal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-12 py-12">
        <AnimatePresence mode="wait">
          {!activeArticle ? (
            /* Journal Index */
            <motion.div
              key="index"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              <div className="max-w-2xl">
                <p className="font-['Cormorant_Garamond',_serif] text-xl sm:text-2xl text-[#44403C] font-light leading-relaxed">
                  Field observations, love stories documented on medium format film, and notes from our travels across Europe and beyond.
                </p>
              </div>

              <div className="space-y-12 sm:space-y-16">
                {JOURNAL_ARTICLES.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => {
                      setActiveArticle(article);
                    }}
                    className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center border-b border-[#E8E2D5] pb-12 sm:pb-16"
                  >
                    <div className="md:col-span-5 relative aspect-[16/10] overflow-hidden bg-[#221F1D]">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale contrast-[1.1] transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 film-grain pointer-events-none opacity-30 mix-blend-overlay" />
                    </div>

                    <div className="md:col-span-7">
                      <div className="flex items-center gap-4 text-xs font-sans text-[#8C857B] mb-2 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {article.location}
                        </span>
                      </div>

                      <h3 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#221F1D] group-hover:underline underline-offset-4 decoration-[#8C857B] transition-all">
                        {article.title}
                      </h3>

                      <p className="font-['Cormorant_Garamond',_serif] italic text-base sm:text-lg text-[#57534E] mt-2 mb-3">
                        {article.subtitle}
                      </p>

                      <p className="font-['Cormorant_Garamond',_serif] text-base text-[#44403C] leading-relaxed line-clamp-3 font-light">
                        {article.excerpt}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest font-sans font-medium text-[#221F1D] group-hover:translate-x-1 transition-transform">
                        Read Story & View Gallery →
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Single Article View */
            <motion.div
              key="article"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="max-w-3xl mx-auto"
            >
              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs font-sans text-[#8C857B] mb-4 uppercase tracking-wider">
                <span>{activeArticle.date}</span>
                <span>·</span>
                <span>{activeArticle.readTime}</span>
                <span>·</span>
                <span>{activeArticle.location}</span>
              </div>

              <h1 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-3xl sm:text-4xl lg:text-5xl text-[#221F1D] leading-tight mb-4">
                {activeArticle.title}
              </h1>

              <p className="font-['Cormorant_Garamond',_serif] italic text-xl text-[#57534E] mb-8">
                {activeArticle.subtitle}
              </p>

              {/* Cover Photo */}
              <div 
                className="relative aspect-[16/10] overflow-hidden bg-[#221F1D] mb-10 cursor-pointer group shadow-sm"
                onClick={() => {
                  onSelectPhoto(activeArticle.coverImage, activeArticle.title);
                }}
              >
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-[1.1]"
                />
                <div className="absolute inset-0 film-grain pointer-events-none opacity-30 mix-blend-overlay" />
                <div className="absolute bottom-3 right-3 bg-[#171513]/70 text-[#F6F3EC] px-2.5 py-1 text-[10px] uppercase font-sans tracking-wider flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                  View Full Resolution
                </div>
              </div>

              {/* Story Body */}
              <div className="space-y-6 font-['Cormorant_Garamond',_serif] text-lg sm:text-xl text-[#332F2C] leading-relaxed font-light">
                {activeArticle.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Embedded Gallery */}
              {activeArticle.galleryImages.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[#E8E2D5]">
                  <span className="text-xs uppercase tracking-widest font-sans text-[#8C857B] block mb-4">
                    Photo Essay Selection
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeArticle.galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onSelectPhoto(img, `${activeArticle.title} — Frame ${idx + 1}`);
                        }}
                        className="relative aspect-[3/4] overflow-hidden bg-[#221F1D] cursor-pointer group"
                      >
                        <img
                          src={img}
                          alt="Gallery item"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale contrast-[1.1] transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 film-grain pointer-events-none opacity-30 mix-blend-overlay" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to top / back button */}
              <div className="mt-14 pt-8 border-t border-[#E8E2D5] flex justify-between items-center">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-medium text-[#221F1D] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" /> Back To All Journal Notes
                </button>
                <button
                  onClick={onClose}
                  className="text-xs uppercase tracking-widest font-sans text-[#78716C] hover:text-[#221F1D]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
