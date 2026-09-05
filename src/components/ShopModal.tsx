import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, ShoppingBag, Download, ArrowRight } from 'lucide-react';
import { SHOP_ITEMS } from '../data/portfolioData';
import { ShopItem } from '../types';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePurchase = (item: ShopItem) => {
    setSelectedItem(item);
    setCheckoutSuccess(true);
    setTimeout(() => {
      // Keep state for viewing receipt
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-40 bg-[#F6F3EC] overflow-y-auto"
    >
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-30 bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#E8E2D5] px-6 sm:px-12 py-5 flex items-center justify-between">
        <div>
          <span className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest uppercase text-[#78716C] block">
            The Educational Studio
          </span>
          <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#221F1D]">
            Resources For Photographers
          </h2>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-[#D6D0C2] hover:border-[#221F1D] text-[#221F1D] flex items-center justify-center transition-colors focus:outline-none"
          aria-label="Close Shop"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-12">
        {/* Intro */}
        <div className="max-w-2xl mb-12">
          <p className="font-['Cormorant_Garamond',_serif] text-2xl sm:text-3xl text-[#221F1D] font-light leading-snug">
            Tools, analog grading profiles, and strategic mentorship cultivated over a decade of shooting international commissions.
          </p>
          <p className="font-['Cormorant_Garamond',_serif] italic text-base text-[#78716C] mt-2">
            Instant digital access delivered immediately after reservation.
          </p>
        </div>

        {checkoutSuccess && selectedItem && (
          <div className="mb-10 p-6 sm:p-8 bg-[#EFEBE1] border border-[#221F1D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#221F1D] text-[#F6F3EC] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-xl text-[#221F1D]">
                  Access Granted for {selectedItem.title}
                </h4>
                <p className="font-['Cormorant_Garamond',_serif] italic text-sm text-[#57534E]">
                  Receipt and instant download keys sent to your inbox.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCheckoutSuccess(false)}
              className="text-xs uppercase tracking-widest font-sans font-medium text-[#221F1D] underline underline-offset-4"
            >
              Continue Browsing
            </button>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SHOP_ITEMS.map((item) => (
            <div
              key={item.id}
              className="border border-[#E0DACB] bg-[#FAF8F3] flex flex-col justify-between p-8 hover:border-[#221F1D] transition-colors"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#221F1D] mb-6 shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-[1.1]"
                  />
                  <div className="absolute inset-0 film-grain pointer-events-none opacity-30 mix-blend-overlay" />
                  <div className="absolute top-3 right-3 bg-[#171513]/80 backdrop-blur-sm text-[#F6F3EC] px-2.5 py-1 text-xs font-sans tracking-wider font-semibold">
                    {item.price}
                  </div>
                </div>

                <span className="text-[10px] uppercase font-sans tracking-widest text-[#8C857B] block mb-1">
                  {item.type === 'presets' ? 'Lightroom & Capture One Suite' : item.type === 'guide' ? 'Comprehensive Digital Guide' : 'Private Masterclass'}
                </span>

                <h3 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl text-[#221F1D] leading-snug mb-2">
                  {item.title}
                </h3>

                <p className="font-['Cormorant_Garamond',_serif] italic text-sm text-[#57534E] mb-4">
                  {item.subtitle}
                </p>

                <p className="font-['Cormorant_Garamond',_serif] text-base text-[#44403C] leading-relaxed mb-6 font-light">
                  {item.description}
                </p>

                <div className="border-t border-[#E8E2D5] pt-4 mb-6">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-[#78716C] block mb-2 font-semibold">
                    What Is Included:
                  </span>
                  <ul className="space-y-2">
                    {item.included.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-['Cormorant_Garamond',_serif] text-[#332F2C]">
                        <Check className="w-3 h-3 text-[#221F1D] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E2D5]">
                <button
                  onClick={() => handleSimulatePurchase(item)}
                  className="w-full py-3 bg-[#221F1D] text-[#F6F3EC] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#3D3835] transition-colors flex items-center justify-center gap-2 rounded-none"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Reserve {item.type === 'mentorship' ? 'Mentorship' : 'Download'} ({item.price})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Guarantee */}
        <div className="mt-16 p-8 border border-[#E0DACB] bg-[#EFEBE1] text-center max-w-2xl mx-auto">
          <Download className="w-6 h-6 text-[#57534E] mx-auto mb-2" />
          <h4 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-xl text-[#221F1D]">
            Instant Digital Delivery
          </h4>
          <p className="font-['Cormorant_Garamond',_serif] italic text-sm text-[#57534E] mt-1">
            All presets and guides are delivered with permanent cloud access and lifetime updates as new camera bodies and film profiles emerge.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
