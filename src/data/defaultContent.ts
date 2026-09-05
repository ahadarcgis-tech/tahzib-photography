import { SiteContent } from '../types';
import { PORTFOLIO_ITEMS, SERVICE_PACKAGES, PRESS_ACCOLADES } from './portfolioData';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    name: 'Tahzib',
    title: 'Tahzib Photography',
    tagline: 'Fine Art & Analog Archive',
    location: 'Chittagong, Bangladesh',
    email: 'atelier@tahzib.studio',
    phone: '+880 1800-000000',
    instagram: '@tahzib.archive',
    whatsapp: '+8801800000000',
    availability: 'Accepting 14 Select Commissions Annually · Worldwide Travel',
    colophonText: 'Preserving intimate moments, quiet beauty, and generational celebrations through medium format film and poetic restraint. Based in Chittagong, Bangladesh, available for destination weddings and editorial assignments worldwide.',
  },
  hero: {
    title: 'Tahzib Photography',
    subtitle: 'Timeless Heirloom Imagery',
    location: 'Based in Chittagong, Bangladesh · Available Worldwide',
    leftImage: {
      url: '/images/tahzib_crimson_veil.jpg',
      caption: 'The Crimson Veil · Fine Art Study',
      year: '2026',
      location: 'Dhaka · Private Haveli Estate',
    },
    rightImage: {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      caption: 'Camilla in Draped Silk',
      year: '2025',
      location: 'Villa Balbiano, Lake Como',
    },
  },
  about: {
    portraitUrl: '/images/tahzib.jpg',
    title: 'Meet Tahzib',
    subtitle: 'Editorial Eye · Analog Soul',
    headlineQuote: '"We don\'t manufacture moments; we make quiet space for them to breathe."',
    bioParagraph1: 'Hello, I am Tahzib. Based in Chittagong, Bangladesh, my work is devoted to documenting love stories, generational celebrations, and human devotion through medium-format film and intentional digital framing.',
    bioParagraph2: 'Trained in classical fine art and documentary photography, I view every wedding as an unrepeatable visual poem. Rather than orchestrating stiff poses or interrupting natural rituals with artificial direction, I observe with quiet intuition—waiting for the spontaneous clasp of hands under the dinner table, the tear caught on a mother\'s cheek, and the untamed joy on the dance floor.',
    baseStudio: 'Chittagong, Bangladesh',
    accolades: PRESS_ACCOLADES,
  },
  editorial: {
    welcomeText: 'Based in Chittagong, Bangladesh, Tahzib documents authentic human emotions, heirloom ceremonies, and editorial narratives through analog film and intentional digital framing. Traveling across Bangladesh and worldwide for discerning couples and private commissions.',
    badgeSubtitle: 'Photography · Chittagong, Bangladesh',
  },
  portfolio: PORTFOLIO_ITEMS,
  services: SERVICE_PACKAGES,
  faqs: [
    {
      q: 'How does shooting analog film work for a wedding?',
      a: 'We carry both medium-format cameras (Contax 645, Hasselblad) and modern digital bodies side by side. Tahzib photographs the key emotional moments, bridal details, and couple portraits on film for that incomparable painterly grain and luminous depth. After the celebration, the rolls are hand-delivered to our partner pro laboratory, developed in fresh chemistry, and high-resolution drum scanned.',
    },
    {
      q: 'Are travel and accommodations included in your pricing?',
      a: 'For our signature Destination Weekend collection, travel and accommodation within Europe and nationwide in Bangladesh are fully included with zero surprise expenses. For bespoke regional commissions, we provide a flat, transparent travel quote upfront.',
    },
    {
      q: 'When will we receive our photographs?',
      a: 'You will receive a curated Editorial Preview of 40–60 fully graded images within 5 business days of your celebration to share with family and friends. Your full complete gallery and scanned film negatives are delivered within 6 to 8 weeks.',
    },
    {
      q: 'How far in advance should we reserve our date?',
      a: 'Because we limit our calendar to 14 commissions annually to maintain our highest standards of craft, most couples reserve their date 9 to 18 months in advance.',
    },
    {
      q: 'Do you provide black & white as well as color imagery?',
      a: 'Yes, every commission incorporates a deliberate curation of Kodak Tri-X / Ilford 400 black-and-white analog frames alongside rich, natural Fuji 400H and Portra 400 color tones, carefully matched to the emotional cadence of your celebration.',
    },
  ],
};
