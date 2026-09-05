export type ActiveView = 
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'journal'
  | 'contact'
  | 'shop'
  | 'admin';

export type PortfolioCategory = 
  | 'All'
  | 'Weddings'
  | 'Editorial & Fashion'
  | 'Portraits'
  | 'Destination & Travel'
  | '35mm & 120 Film';

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  location: string;
  year: string;
  imageUrl: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  filmStock: string;
  camera: string;
  description: string;
  featured?: boolean;
}

export interface JournalArticle {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  location: string;
  coverImage: string;
  excerpt: string;
  body: string[];
  galleryImages: string[];
}

export interface ServicePackage {
  id: string;
  title: string;
  tagline: string;
  investment: string;
  duration: string;
  description: string;
  features: string[];
  idealFor: string;
}

export interface ShopItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  type: 'presets' | 'guide' | 'mentorship';
  imageUrl: string;
  description: string;
  included: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface BrandInfo {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  instagram: string;
  whatsapp: string;
  availability: string;
  colophonText: string;
}

export interface HeroInfo {
  title: string;
  subtitle: string;
  location: string;
  leftImage: {
    url: string;
    caption: string;
    year: string;
    location: string;
  };
  rightImage: {
    url: string;
    caption: string;
    year: string;
    location: string;
  };
}

export interface AboutInfo {
  portraitUrl: string;
  title: string;
  subtitle: string;
  headlineQuote: string;
  bioParagraph1: string;
  bioParagraph2: string;
  baseStudio: string;
  accolades: string[];
}

export interface EditorialInfo {
  welcomeText: string;
  badgeSubtitle: string;
}

export interface SiteContent {
  brand: BrandInfo;
  hero: HeroInfo;
  about: AboutInfo;
  editorial: EditorialInfo;
  portfolio: PortfolioItem[];
  services: ServicePackage[];
  faqs: FaqItem[];
}

export interface InquiryFormData {
  names: string;
  email: string;
  phone: string;
  eventDate: string;
  location: string;
  serviceType: string;
  estimatedBudget: string;
  guestCount: string;
  storyAndVision: string;
  howFound: string;
}

