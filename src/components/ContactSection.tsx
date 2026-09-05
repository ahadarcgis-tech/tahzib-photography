import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Mail, MapPin, Calendar, Heart, ArrowRight, ArrowUp } from 'lucide-react';
import { InquiryFormData } from '../types';
import { useContent } from '../context/ContentContext';

interface ContactSectionProps {
  preselectedPackage?: string;
  onScrollToTop: () => void;
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

export const ContactSection: React.FC<ContactSectionProps> = ({
  preselectedPackage,
  onScrollToTop,
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
    <section
      id="contact"
      className="relative min-h-screen w-full bg-[#F6F3EC] text-[#221F1D] py-10 sm:py-32 px-3 sm:px-12 lg:px-20 border-t border-[#E8E2D5] select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-20 gap-4 sm:gap-6 border-b border-[#E0DACB] pb-4 sm:pb-8">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-3 mb-1.5 sm:mb-2">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.25em] text-[#8C857B] uppercase">
                05 / Connect & Reserve
              </span>
              <span className="w-4 sm:w-8 h-[1px] bg-[#8C857B]/40" />
              <span className="font-['Cormorant_Garamond',_serif] italic text-[11px] sm:text-xs tracking-wider sm:tracking-widest text-[#78716C] uppercase">
                Worldwide Commissions
              </span>
            </div>
            <h2 className="font-['Bodoni_Moda',_'Italiana',_'Cormorant_Garamond',_serif] text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#221F1D]">
              Get In Touch
            </h2>
          </div>
          <p className="font-['Cormorant_Garamond',_serif] text-xs sm:text-lg text-[#78716C] max-w-md font-light italic">
            Currently accepting limited bespoke commissions worldwide for the 2026 and 2027 seasons.
          </p>
        </div>

        {/* Dual Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Studio Details & Philosophy */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-10">
            <div>
              <h3 className="font-['Bodoni_Moda',_'Italiana',_serif] text-xl sm:text-3xl text-[#221F1D] mb-2 sm:mb-4 font-normal">
                Let Us Preserve Your Legacy
              </h3>
              <p className="font-['Cormorant_Garamond',_serif] text-xs sm:text-xl text-[#57534E] leading-relaxed font-light mb-4 sm:mb-8">
                Whether you are gathering along the olive groves of Puglia, an ancient château in Provence, or a private terrace overlooking the Seine, we would be honored to tell your story with honesty and editorial reverence.
              </p>

              {/* Studio Info List - Compact Bento Tiles on Mobile */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 gap-2.5 sm:gap-0 sm:space-y-6 border-t border-[#E0DACB] pt-4 sm:pt-6 font-['Cormorant_Garamond',_serif]">
                <div className="p-2.5 sm:p-0 bg-[#FAF8F3] sm:bg-transparent border border-[#E0DACB] sm:border-0 flex items-start gap-2.5 sm:gap-3.5">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#78716C] shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] sm:text-xs uppercase font-mono tracking-wider sm:tracking-widest text-[#8C857B]">
                      Primary Studio
                    </div>
                    <div className="text-xs sm:text-lg text-[#221F1D] font-medium sm:font-normal">
                      Chittagong, Bangladesh
                    </div>
                    <div className="text-[10px] sm:text-xs italic text-[#78716C]">
                      Available for travel nationwide & worldwide
                    </div>
                  </div>
                </div>

                <div className="p-2.5 sm:p-0 bg-[#FAF8F3] sm:bg-transparent border border-[#E0DACB] sm:border-0 flex items-start gap-2.5 sm:gap-3.5">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#78716C] shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] sm:text-xs uppercase font-mono tracking-wider sm:tracking-widest text-[#8C857B]">
                      Direct Dispatch
                    </div>
                    <a
                      href="mailto:contact@tahzibphotography.com"
                      className="text-xs sm:text-lg text-[#221F1D] hover:underline underline-offset-4 break-all xs:break-normal"
                    >
                      contact@tahzibphotography.com
                    </a>
                  </div>
                </div>

                <div className="p-2.5 sm:p-0 bg-[#FAF8F3] sm:bg-transparent border border-[#E0DACB] sm:border-0 xs:col-span-2 sm:col-span-1 flex items-start gap-2.5 sm:gap-3.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#78716C] shrink-0 mt-1" />
                  <div>
                    <div className="text-[10px] sm:text-xs uppercase font-mono tracking-wider sm:tracking-widest text-[#8C857B]">
                      Calendar Notice
                    </div>
                    <div className="text-xs sm:text-lg text-[#221F1D]">
                      Limited to 14 commissions per annum
                    </div>
                    <div className="text-[10px] sm:text-xs italic text-[#78716C]">
                      Now reserving dates through Autumn 2027
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Badge */}
            <div className="p-3.5 sm:p-6 bg-[#EFEBE1] border border-[#D6D0C2] text-xs font-['Cormorant_Garamond',_serif] text-[#57534E] leading-relaxed">
              <span className="font-sans font-medium uppercase tracking-wider sm:tracking-widest text-[#221F1D] block mb-1 text-[10px] sm:text-xs">
                A Note On Our Process
              </span>
              We treat every correspondence with personal care. Tahzib reviews every inquiry personally and responds within 24 to 48 business hours with custom portfolio selections and availability.
            </div>
          </div>

          {/* Right Column: Inquiry Form - Bento Grid on Mobile */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF8F3] border border-[#E0DACB] p-3.5 sm:p-12 shadow-sm">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 sm:py-12 text-center space-y-4 sm:space-y-6"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#221F1D] text-[#F6F3EC] mx-auto flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h4 className="font-['Bodoni_Moda',_'Italiana',_serif] text-2xl sm:text-3xl text-[#221F1D]">
                    Inquiry Received
                  </h4>
                  <p className="font-['Cormorant_Garamond',_serif] text-sm sm:text-lg text-[#57534E] max-w-md mx-auto font-light leading-relaxed">
                    Thank you for sharing your vision, {formData.names || 'cherished friend'}. We have received your notes and will be in touch within 24 to 48 hours.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 sm:px-6 sm:py-2.5 border border-[#221F1D] text-[11px] sm:text-xs uppercase tracking-[0.2em] font-sans font-medium hover:bg-[#221F1D] hover:text-[#F6F3EC] transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 sm:gap-6">
                  {/* Bento Tile 1: Names */}
                  <div className="col-span-2 sm:col-span-1 p-2 sm:p-0 bg-[#F6F3EC] sm:bg-transparent border border-[#E0DACB] sm:border-0">
                    <label className="block text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-mono text-[#78716C] mb-1 sm:mb-2">
                      Your Names *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clara & Alexander"
                      value={formData.names}
                      onChange={(e) =>
                        setFormData({ ...formData, names: e.target.value })
                      }
                      className="w-full bg-[#FAF8F3] sm:bg-[#F6F3EC] border border-[#D6D0C2] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#221F1D] placeholder-[#A8A29E] focus:outline-none focus:border-[#221F1D] transition-colors font-['Cormorant_Garamond',_serif]"
                    />
                  </div>

                  {/* Bento Tile 2: Email */}
                  <div className="col-span-2 sm:col-span-1 p-2 sm:p-0 bg-[#F6F3EC] sm:bg-transparent border border-[#E0DACB] sm:border-0">
                    <label className="block text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-mono text-[#78716C] mb-1 sm:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="clara@domain.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#FAF8F3] sm:bg-[#F6F3EC] border border-[#D6D0C2] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#221F1D] placeholder-[#A8A29E] focus:outline-none focus:border-[#221F1D] transition-colors font-['Cormorant_Garamond',_serif]"
                    />
                  </div>

                  {/* Bento Tile 3: Date */}
                  <div className="col-span-1 p-2 sm:p-0 bg-[#F6F3EC] sm:bg-transparent border border-[#E0DACB] sm:border-0">
                    <label className="block text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-mono text-[#78716C] mb-1 sm:mb-2 truncate">
                      Date / Month *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sept 18, 2026"
                      value={formData.eventDate}
                      onChange={(e) =>
                        setFormData({ ...formData, eventDate: e.target.value })
                      }
                      className="w-full bg-[#FAF8F3] sm:bg-[#F6F3EC] border border-[#D6D0C2] px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#221F1D] placeholder-[#A8A29E] focus:outline-none focus:border-[#221F1D] transition-colors font-['Cormorant_Garamond',_serif]"
                    />
                  </div>

                  {/* Bento Tile 4: Location */}
                  <div className="col-span-1 p-2 sm:p-0 bg-[#F6F3EC] sm:bg-transparent border border-[#E0DACB] sm:border-0">
                    <label className="block text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-mono text-[#78716C] mb-1 sm:mb-2 truncate">
                      Venue / City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Lake Como"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-[#FAF8F3] sm:bg-[#F6F3EC] border border-[#D6D0C2] px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#221F1D] placeholder-[#A8A29E] focus:outline-none focus:border-[#221F1D] transition-colors font-['Cormorant_Garamond',_serif]"
                    />
                  </div>

                  {/* Bento Tile 5: Desired Commission */}
                  <div className="col-span-2 sm:col-span-1 p-2 sm:p-0 bg-[#F6F3EC] sm:bg-transparent border border-[#E0DACB] sm:border-0">
                    <label className="block text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-mono text-[#78716C] mb-1 sm:mb-2">
                      Desired Commission
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                      }
                      className="w-full bg-[#FAF8F3] sm:bg-[#F6F3EC] border border-[#D6D0C2] px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#221F1D] focus:outline-none focus:border-[#221F1D] transition-colors font-['Cormorant_Garamond',_serif]"
                    >
                      {content.services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title} ({s.investment})
                        </option>
                      ))}
                      <option value="Bespoke Commission">
                        Bespoke / Multi-Day Commission
                      </option>
                    </select>
                  </div>

                  {/* Bento Tile 6: Budget */}
                  <div className="col-span-2 sm:col-span-1 p-2 sm:p-0 bg-[#F6F3EC] sm:bg-transparent border border-[#E0DACB] sm:border-0">
                    <label className="block text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-mono text-[#78716C] mb-1 sm:mb-2">
                      Estimated Budget Range
                    </label>
                    <select
                      value={formData.estimatedBudget}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedBudget: e.target.value })
                      }
                      className="w-full bg-[#FAF8F3] sm:bg-[#F6F3EC] border border-[#D6D0C2] px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#221F1D] focus:outline-none focus:border-[#221F1D] transition-colors font-['Cormorant_Garamond',_serif]"
                    >
                      <option value="$5,000 – $8,000">$5,000 – $8,000</option>
                      <option value="$8,000 – $12,000">$8,000 – $12,000</option>
                      <option value="$12,000 – $18,000">$12,000 – $18,000</option>
                      <option value="$18,000+">$18,000+</option>
                    </select>
                  </div>

                  {/* Bento Tile 7: Story and Vision */}
                  <div className="col-span-2 p-2 sm:p-0 bg-[#F6F3EC] sm:bg-transparent border border-[#E0DACB] sm:border-0">
                    <label className="block text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-mono text-[#78716C] mb-1 sm:mb-2">
                      Tell Us About Your Vision & Story
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share details about the aesthetic, guest experience, the energy of the day, or why analog medium format appeals to you..."
                      value={formData.storyAndVision}
                      onChange={(e) =>
                        setFormData({ ...formData, storyAndVision: e.target.value })
                      }
                      className="w-full bg-[#FAF8F3] sm:bg-[#F6F3EC] border border-[#D6D0C2] px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#221F1D] placeholder-[#A8A29E] focus:outline-none focus:border-[#221F1D] transition-colors font-['Cormorant_Garamond',_serif]"
                    />
                  </div>

                  {/* Bento Tile 8: Submit Action */}
                  <div className="col-span-2 pt-1 sm:pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 sm:py-4 bg-[#221F1D] text-[#F6F3EC] text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-sans font-medium hover:bg-[#3D3835] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{isSubmitting ? 'Transmitting Inquiries...' : 'Send Inquiry To Tahzib'}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
