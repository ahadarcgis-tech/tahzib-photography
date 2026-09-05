import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle, Mail, MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';
import { InquiryFormData } from '../types';
import { useContent } from '../context/ContentContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackage?: string;
}

const INITIAL_FORM: InquiryFormData = {
  names: '',
  email: '',
  phone: '',
  eventDate: '',
  location: '',
  serviceType: 'The Destination Weekend',
  estimatedBudget: '$10,000 – $15,000',
  guestCount: '50 - 120 guests',
  storyAndVision: '',
  howFound: 'Vogue Weddings',
};

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  preselectedPackage,
}) => {
  const { content } = useContent();
  const [formData, setFormData] = useState<InquiryFormData>(INITIAL_FORM);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedPackage) {
      setFormData((prev) => ({ ...prev, serviceType: preselectedPackage }));
    }
  }, [preselectedPackage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData(INITIAL_FORM);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-40 bg-[#F6F3EC] overflow-y-auto"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#F6F3EC]/90 backdrop-blur-md border-b border-[#E8E2D5] px-4 sm:px-12 py-4 sm:py-5 flex items-center justify-between">
        <div>
          <span className="font-['Cormorant_Garamond',_serif] italic text-xs tracking-widest uppercase text-[#78716C] block">
            Bespoke Inquiries & Commissions
          </span>
          <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-xl sm:text-3xl text-[#221F1D]">
            Get In Touch
          </h2>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D6D0C2] hover:border-[#221F1D] text-[#221F1D] flex items-center justify-center transition-colors focus:outline-none"
          aria-label="Close Contact"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-12 py-8 sm:py-12">
        {isSubmitted ? (
          /* Confirmation View */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-14 border border-[#221F1D] bg-[#EFEBE1] text-center space-y-6"
          >
            <div className="w-14 h-14 rounded-full bg-[#221F1D] text-[#F6F3EC] mx-auto flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>

            <h3 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-3xl sm:text-4xl text-[#221F1D]">
              Thank You, {formData.names || 'Warm Friend'}
            </h3>

            <p className="font-['Cormorant_Garamond',_serif] text-xl text-[#44403C] max-w-xl mx-auto font-light leading-relaxed">
              Your inquiry has been personally received by Tahzib. We review every couple's story with profound care and will respond within 24 to 48 hours with our comprehensive brochure and date availability.
            </p>

            <div className="pt-6 border-t border-[#D6D0C2] flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#78716C]">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#221F1D]" /> studio@tahzibphotography.com
              </span>
              <span>·</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#221F1D]" /> Chittagong, Bangladesh
              </span>
            </div>

            <div className="pt-4">
              <button
                onClick={handleReset}
                className="text-xs uppercase tracking-widest font-sans font-medium text-[#221F1D] underline underline-offset-4"
              >
                Send Another Note
              </button>
            </div>
          </motion.div>
        ) : (
          /* Inquiry Form */
          <div>
            <div className="mb-10 text-center sm:text-left">
              <span className="text-xs uppercase tracking-[0.25em] font-sans text-[#8C857B] block mb-2">
                2026 & 2027 Calendar Open
              </span>
              <h3 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-3xl sm:text-4xl text-[#221F1D]">
                Tell Us Your Story
              </h3>
              <p className="font-['Cormorant_Garamond',_serif] text-lg sm:text-xl text-[#57534E] font-light mt-2 max-w-2xl leading-relaxed">
                Whether you are gathering eighty guests in an Italian villa or running off to the Scottish coastline for two, we would be honored to know more about you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Row 1: Names & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                    Your Names (You & Your Partner) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.names}
                    onChange={(e) => setFormData({ ...formData, names: e.target.value })}
                    placeholder="e.g. Clara Dupont & Julian Vance"
                    className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                  />
                </div>

                <div>
                  <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@domain.com"
                    className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Celebration Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                  />
                </div>

                <div>
                  <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                    Celebration Date (or approximate timeframe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    placeholder="e.g. September 18, 2026"
                    className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                  />
                </div>
              </div>

              {/* Row 3: Location / Venue & Service Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                    Location & Venue / Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Villa Balbiano, Lake Como, Italy"
                    className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                  />
                </div>

                <div>
                  <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                    Desired Experience
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                  >
                    {content.services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title} ({s.investment})
                      </option>
                    ))}
                    <option value="Bespoke Commission">Bespoke / Multi-Day Commission</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Guest Count & Budget Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                    Estimated Guest Count
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                  >
                    <option value="Just the two of us (Elopement)">Just the two of us (Elopement)</option>
                    <option value="Under 40 guests (Intimate Gathering)">Under 40 guests (Intimate Gathering)</option>
                    <option value="50 - 120 guests">50 - 120 guests</option>
                    <option value="120 - 250+ guests">120 - 250+ guests</option>
                  </select>
                </div>

                <div>
                  <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                    Estimated Photography Investment
                  </label>
                  <select
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                  >
                    <option value="$6,000 – $9,000">$6,000 – $9,000</option>
                    <option value="$10,000 – $15,000">$10,000 – $15,000</option>
                    <option value="$15,000 – $25,000+">$15,000 – $25,000+</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Story & Vision */}
              <div>
                <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                  Tell Us About Your Vision & What You Value Most *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.storyAndVision}
                  onChange={(e) => setFormData({ ...formData, storyAndVision: e.target.value })}
                  placeholder="Share a glimpse of your aesthetic, what drew you to Tahzib's film work, or a favorite memory together..."
                  className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] p-4 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                />
              </div>

              {/* Row 6: How you found us */}
              <div>
                <label className="block font-['Cormorant_Garamond',_serif] text-base text-[#221F1D] mb-1.5">
                  How did you discover Tahzib Photography?
                </label>
                <input
                  type="text"
                  value={formData.howFound}
                  onChange={(e) => setFormData({ ...formData, howFound: e.target.value })}
                  placeholder="e.g. Vogue Weddings, Instagram, Wedding Planner, Friend Referral"
                  className="w-full bg-[#FAF8F3] border border-[#D6D0C2] focus:border-[#221F1D] px-4 py-3 text-sm text-[#221F1D] outline-none transition-colors font-sans rounded-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 bg-[#221F1D] text-[#F6F3EC] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#3D3835] transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span>Transmitting To Studio...</span>
                  ) : (
                    <>
                      <span>Transmit Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
};
