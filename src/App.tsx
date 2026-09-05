import React, { useState, useEffect } from 'react';
import { ActiveView, PortfolioItem } from './types';
import { Header } from './components/Header';
import { HeroCenterpiece } from './components/HeroCenterpiece';
import { NavList } from './components/NavList';
import { EditorialStatementSection } from './components/EditorialStatementSection';
import { FaqSection } from './components/FaqSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LightboxModal, LightboxData } from './components/LightboxModal';
import { PortfolioPage } from './components/PortfolioPage';
import { AboutModal } from './components/AboutModal';
import { ServicesModal } from './components/ServicesModal';
import { JournalModal } from './components/JournalModal';
import { ShopModal } from './components/ShopModal';
import { ContactModal } from './components/ContactModal';
import { AdminPage } from './components/admin/AdminPage';
import { useContent } from './context/ContentContext';

export default function App() {
  const { content } = useContent();

  const [currentView, setCurrentView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      if (
        window.location.pathname === '/admin' ||
        window.location.pathname.endsWith('/admin') ||
        window.location.hash === '#admin'
      ) {
        return 'admin';
      }
      if (window.location.hash === '#portfolio') {
        return 'portfolio';
      }
    }
    return 'home';
  });
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // Lightbox State
  const [lightboxItem, setLightboxItem] = useState<LightboxData | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  // Preselected package when navigating from Services to Contact
  const [preselectedPackage, setPreselectedPackage] = useState<string | undefined>(undefined);

  // Sync hash and pathname routing for portfolio and admin views
  useEffect(() => {
    const handleRouteSync = () => {
      if (
        window.location.pathname === '/admin' ||
        window.location.pathname.endsWith('/admin') ||
        window.location.hash === '#admin'
      ) {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#portfolio') {
        setCurrentView('portfolio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!window.location.hash || window.location.hash === '#') {
        setCurrentView((prev) => (prev === 'portfolio' || prev === 'admin' ? 'home' : prev));
      }
    };

    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, []);

  const handleNavigate = (view: ActiveView) => {
    if (view === 'home') {
      setCurrentView('home');
      if (window.location.hash === '#portfolio' || window.location.hash === '#admin') {
        window.history.pushState(null, '', window.location.pathname.replace(/\/admin\/?$/, '') || '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      setCurrentView('admin');
      window.location.hash = 'admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'portfolio') {
      setCurrentView('portfolio');
      window.location.hash = 'portfolio';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'services') {
      if (currentView === 'portfolio' || currentView === 'admin') {
        setCurrentView('home');
        if (window.location.hash === '#portfolio' || window.location.hash === '#admin') {
          window.history.pushState(null, '', window.location.pathname.replace(/\/admin\/?$/, '') || '/');
        }
        setTimeout(() => {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (view === 'contact') {
      if (currentView === 'portfolio' || currentView === 'admin') {
        setCurrentView('home');
        if (window.location.hash === '#portfolio' || window.location.hash === '#admin') {
          window.history.pushState(null, '', window.location.pathname.replace(/\/admin\/?$/, '') || '/');
        }
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setCurrentView(view);
    }
  };

  const handleScrollToStatement = () => {
    document.getElementById('editorial-statement')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHeroLightbox = (imageUrl: string, title: string, subtitle: string) => {
    setLightboxItem({
      imageUrl,
      title,
      description: subtitle,
      filmStock: 'Kodak Tri-X 400',
      camera: 'Contax 645 · 80mm f/2',
      location: content.brand.location || 'Dhaka / Chittagong',
      year: '2026',
    });
    setLightboxIndex(-1);
  };

  const handleSelectPortfolioPhoto = (item: PortfolioItem) => {
    const list = content.portfolio;
    const idx = list.findIndex((p) => p.id === item.id);
    setLightboxIndex(idx);
    setLightboxItem({
      imageUrl: item.imageUrl,
      title: item.title,
      category: item.category,
      location: item.location,
      year: item.year,
      camera: item.camera,
      filmStock: item.filmStock,
      description: item.description,
    });
  };

  const handleNextLightbox = () => {
    const list = content.portfolio;
    if (list.length === 0) return;
    if (lightboxIndex >= 0 && lightboxIndex < list.length - 1) {
      const nextIdx = lightboxIndex + 1;
      const nextItem = list[nextIdx];
      setLightboxIndex(nextIdx);
      setLightboxItem({
        imageUrl: nextItem.imageUrl,
        title: nextItem.title,
        category: nextItem.category,
        location: nextItem.location,
        year: nextItem.year,
        camera: nextItem.camera,
        filmStock: nextItem.filmStock,
        description: nextItem.description,
      });
    } else if (lightboxIndex >= 0) {
      // Loop back to start
      const nextIdx = 0;
      const nextItem = list[nextIdx];
      setLightboxIndex(nextIdx);
      setLightboxItem({
        imageUrl: nextItem.imageUrl,
        title: nextItem.title,
        category: nextItem.category,
        location: nextItem.location,
        year: nextItem.year,
        camera: nextItem.camera,
        filmStock: nextItem.filmStock,
        description: nextItem.description,
      });
    }
  };

  const handlePrevLightbox = () => {
    const list = content.portfolio;
    if (list.length === 0) return;
    if (lightboxIndex > 0) {
      const prevIdx = lightboxIndex - 1;
      const prevItem = list[prevIdx];
      setLightboxIndex(prevIdx);
      setLightboxItem({
        imageUrl: prevItem.imageUrl,
        title: prevItem.title,
        category: prevItem.category,
        location: prevItem.location,
        year: prevItem.year,
        camera: prevItem.camera,
        filmStock: prevItem.filmStock,
        description: prevItem.description,
      });
    } else if (lightboxIndex === 0) {
      // Loop to end
      const prevIdx = list.length - 1;
      const prevItem = list[prevIdx];
      setLightboxIndex(prevIdx);
      setLightboxItem({
        imageUrl: prevItem.imageUrl,
        title: prevItem.title,
        category: prevItem.category,
        location: prevItem.location,
        year: prevItem.year,
        camera: prevItem.camera,
        filmStock: prevItem.filmStock,
        description: prevItem.description,
      });
    }
  };

  const handleInquireFromServices = (packageTitle?: string) => {
    setPreselectedPackage(packageTitle);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // DEDICATED PRIVATE ADMIN DASHBOARD
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-[#1A1816] text-[#F6F3EC]">
        <AdminPage onBackToSite={() => handleNavigate('home')} />
      </div>
    );
  }

  // DEDICATED SEPARATE PAGE: PORTFOLIO
  if (currentView === 'portfolio') {
    return (
      <div className="min-h-screen bg-[#F6F3EC] text-[#221F1D] relative overflow-y-auto selection:bg-[#221F1D] selection:text-[#F6F3EC]">
        <PortfolioPage
          onNavigate={handleNavigate}
          onSelectPhoto={handleSelectPortfolioPhoto}
          onInquire={() => handleNavigate('contact')}
        />

        {/* Modals accessible from Portfolio Page if invoked */}
        <AboutModal
          isOpen={currentView === 'about'}
          onClose={() => setCurrentView('portfolio')}
          onInquire={() => handleNavigate('contact')}
        />

        <ContactModal
          isOpen={currentView === 'contact'}
          onClose={() => setCurrentView('portfolio')}
          preselectedPackage={preselectedPackage}
        />

        {/* Fullscreen Lightbox Modal */}
        <LightboxModal
          isOpen={!!lightboxItem}
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onNext={lightboxIndex >= 0 ? handleNextLightbox : undefined}
          onPrev={lightboxIndex >= 0 ? handlePrevLightbox : undefined}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#221F1D] relative overflow-y-auto scroll-smooth select-none">
      {/* SECTION 1: HERO VIEW - Fits completely in a single window on desktop */}
      <section className="min-h-[100dvh] h-auto md:h-screen md:min-h-[600px] flex flex-col justify-between relative overflow-x-hidden md:overflow-hidden">
        {/* Background ambient subtle film grain */}
        <div className="absolute inset-0 film-grain pointer-events-none opacity-25 z-0" />

        {/* Top Header Bar */}
        <Header
          onNavigate={handleNavigate}
        />

        {/* Hero Section: Left Nav Buttons, Centerpiece Image Container, and Right Contact Button */}
        <NavList
          currentView={currentView}
          onNavigate={handleNavigate}
          onHoverNav={(key) => setHoveredNav(key)}
        >
          <HeroCenterpiece
            hoveredNav={hoveredNav}
            onOpenLightbox={handleOpenHeroLightbox}
          />
        </NavList>

        {/* Subtle scroll indicator to the next section */}
        <div className="w-full flex justify-center pb-3 pt-1 z-20 shrink-0">
          <button
            onClick={handleScrollToStatement}
            className="group p-2 text-[#8C857B] hover:text-[#221F1D] transition-colors cursor-pointer"
            aria-label="Scroll to next section"
          >
            <span className="text-base block group-hover:translate-y-1 transition-transform">↓</span>
          </button>
        </div>
      </section>

      {/* SECTION 2: NEW EDITORIAL STATEMENT SECTION */}
      <EditorialStatementSection
        onNavigate={handleNavigate}
        onScrollToTop={handleScrollToTop}
      />

      {/* SECTION 3: FREQUENTLY INQUIRED (FAQ) */}
      <FaqSection
        onScrollToServices={() => {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* SECTION 4: SERVICES & INVESTMENT */}
      <ServicesSection
        onInquire={handleInquireFromServices}
      />

      {/* SECTION 5: CONTACT US */}
      <ContactSection
        preselectedPackage={preselectedPackage}
        onScrollToTop={handleScrollToTop}
      />

      {/* FOOTER SECTION: Deep Crimson Film Aesthetic with Social Media Icons */}
      <Footer
        onNavigate={handleNavigate}
        onScrollToTop={handleScrollToTop}
      />

      {/* MODAL VIEWS */}
      <AboutModal
        isOpen={currentView === 'about'}
        onClose={() => setCurrentView('home')}
        onInquire={() => setCurrentView('contact')}
      />

      <ServicesModal
        isOpen={currentView === 'services'}
        onClose={() => setCurrentView('home')}
        onInquire={handleInquireFromServices}
      />

      <JournalModal
        isOpen={currentView === 'journal'}
        onClose={() => setCurrentView('home')}
        onSelectPhoto={(imageUrl, title) => {
          setLightboxItem({
            imageUrl,
            title,
            category: 'Journal Gallery',
            filmStock: 'Kodak Portra 400',
            camera: 'Contax 645',
          });
          setLightboxIndex(-1);
        }}
      />

      <ShopModal
        isOpen={currentView === 'shop'}
        onClose={() => setCurrentView('home')}
      />

      <ContactModal
        isOpen={currentView === 'contact'}
        onClose={() => setCurrentView('home')}
        preselectedPackage={preselectedPackage}
      />

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        isOpen={!!lightboxItem}
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
        onNext={lightboxIndex >= 0 ? handleNextLightbox : undefined}
        onPrev={lightboxIndex >= 0 ? handlePrevLightbox : undefined}
      />
    </div>
  );
}
