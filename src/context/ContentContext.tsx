import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteContent,
  BrandInfo,
  HeroInfo,
  AboutInfo,
  EditorialInfo,
  PortfolioItem,
  ServicePackage,
  FaqItem,
} from '../types';
import { DEFAULT_SITE_CONTENT } from '../data/defaultContent';
import { fetchRemoteContent, persistContentToServer, uploadImageToServer } from '../utils/api';

const STORAGE_KEY = 'tahzib_site_content_v2';
const AUTH_KEY = 'tahzib_admin_auth_v2';
const CREDS_KEY = 'tahzib_admin_creds_v2';

interface ContentContextType {
  content: SiteContent;
  updateBrand: (partial: Partial<BrandInfo>) => void;
  updateHero: (partial: Partial<HeroInfo>) => void;
  updateAbout: (partial: Partial<AboutInfo>) => void;
  updateEditorial: (partial: Partial<EditorialInfo>) => void;
  updatePortfolio: (items: PortfolioItem[]) => void;
  updatePortfolioItem: (id: string, updated: Partial<PortfolioItem>) => void;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  deletePortfolioItem: (id: string) => void;
  updateServices: (services: ServicePackage[]) => void;
  updateServicePackage: (id: string, updated: Partial<ServicePackage>) => void;
  addServicePackage: (pkg: Omit<ServicePackage, 'id'>) => void;
  deleteServicePackage: (id: string) => void;
  updateFaqs: (faqs: FaqItem[]) => void;
  updateFaq: (index: number, updated: FaqItem) => void;
  addFaq: (faq: FaqItem) => void;
  deleteFaq: (index: number) => void;
  resetToDefaults: () => void;
  exportJson: () => string;
  importJson: (jsonString: string) => boolean;
  uploadImage: (file: File) => Promise<string>;

  // Authentication
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  adminUsername: string;
  changeCredentials: (newUsername: string, newPassword: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Content State with LocalStorage & Server persistence
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...DEFAULT_SITE_CONTENT,
            ...parsed,
            brand: { ...DEFAULT_SITE_CONTENT.brand, ...(parsed.brand || {}) },
            hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
            about: { ...DEFAULT_SITE_CONTENT.about, ...(parsed.about || {}) },
            editorial: { ...DEFAULT_SITE_CONTENT.editorial, ...(parsed.editorial || {}) },
            portfolio: Array.isArray(parsed.portfolio) && parsed.portfolio.length > 0 ? parsed.portfolio : DEFAULT_SITE_CONTENT.portfolio,
            services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : DEFAULT_SITE_CONTENT.services,
            faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : DEFAULT_SITE_CONTENT.faqs,
          };
        }
      } catch (e) {
        console.error('Failed to parse stored content:', e);
      }
    }
    return DEFAULT_SITE_CONTENT;
  });

  // On mount, load latest content from published Git repository JSON file
  useEffect(() => {
    fetchRemoteContent().then((remote) => {
      if (remote) {
        setContent((prev) => ({
          ...DEFAULT_SITE_CONTENT,
          ...remote,
          brand: { ...DEFAULT_SITE_CONTENT.brand, ...(remote.brand || {}) },
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...(remote.hero || {}) },
          about: { ...DEFAULT_SITE_CONTENT.about, ...(remote.about || {}) },
          editorial: { ...DEFAULT_SITE_CONTENT.editorial, ...(remote.editorial || {}) },
          portfolio: Array.isArray(remote.portfolio) && remote.portfolio.length > 0 ? remote.portfolio : prev.portfolio,
          services: Array.isArray(remote.services) && remote.services.length > 0 ? remote.services : prev.services,
          faqs: Array.isArray(remote.faqs) && remote.faqs.length > 0 ? remote.faqs : prev.faqs,
        }));
      }
    });
  }, []);

  // Sync content state to localStorage and server file (triggers Git Auto-Sync)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('Failed to persist content to localStorage:', e);
    }

    const timer = setTimeout(() => {
      persistContentToServer(content);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content]);

  // 2. Auth Credentials & Session
  const [adminCreds, setAdminCreds] = useState<{ username: string; password: string }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CREDS_KEY);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return { username: 'tahzib', password: 'tahzib2026' };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(AUTH_KEY) === 'true' || localStorage.getItem(AUTH_KEY) === 'true';
    }
    return false;
  });

  const login = (username: string, password: string): boolean => {
    const trimmedUser = username.trim().toLowerCase();
    const expectedUser = adminCreds.username.trim().toLowerCase();
    if (trimmedUser === expectedUser && password === adminCreds.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  };

  const changeCredentials = (newUsername: string, newPassword: string) => {
    const creds = { username: newUsername.trim() || 'tahzib', password: newPassword || 'tahzib2026' };
    setAdminCreds(creds);
    localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
  };

  // 3. Content Modifier Methods
  const updateBrand = (partial: Partial<BrandInfo>) => {
    setContent((prev) => ({
      ...prev,
      brand: { ...prev.brand, ...partial },
    }));
  };

  const updateHero = (partial: Partial<HeroInfo>) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...partial },
    }));
  };

  const updateAbout = (partial: Partial<AboutInfo>) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, ...partial },
    }));
  };

  const updateEditorial = (partial: Partial<EditorialInfo>) => {
    setContent((prev) => ({
      ...prev,
      editorial: { ...prev.editorial, ...partial },
    }));
  };

  const updatePortfolio = (items: PortfolioItem[]) => {
    setContent((prev) => ({
      ...prev,
      portfolio: items,
    }));
  };

  const updatePortfolioItem = (id: string, updated: Partial<PortfolioItem>) => {
    setContent((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    }));
  };

  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `p_${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      portfolio: [newItem, ...prev.portfolio],
    }));
  };

  const deletePortfolioItem = (id: string) => {
    setContent((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((item) => item.id !== id),
    }));
  };

  const updateServices = (services: ServicePackage[]) => {
    setContent((prev) => ({
      ...prev,
      services,
    }));
  };

  const updateServicePackage = (id: string, updated: Partial<ServicePackage>) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services.map((pkg) => (pkg.id === id ? { ...pkg, ...updated } : pkg)),
    }));
  };

  const addServicePackage = (pkg: Omit<ServicePackage, 'id'>) => {
    const newPkg: ServicePackage = {
      ...pkg,
      id: `s_${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      services: [...prev.services, newPkg],
    }));
  };

  const deleteServicePackage = (id: string) => {
    setContent((prev) => ({
      ...prev,
      services: prev.services.filter((pkg) => pkg.id !== id),
    }));
  };

  const updateFaqs = (faqs: FaqItem[]) => {
    setContent((prev) => ({
      ...prev,
      faqs,
    }));
  };

  const updateFaq = (index: number, updated: FaqItem) => {
    setContent((prev) => {
      const next = [...prev.faqs];
      next[index] = updated;
      return { ...prev, faqs: next };
    });
  };

  const addFaq = (faq: FaqItem) => {
    setContent((prev) => ({
      ...prev,
      faqs: [...prev.faqs, faq],
    }));
  };

  const deleteFaq = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const resetToDefaults = () => {
    setContent(DEFAULT_SITE_CONTENT);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportJson = (): string => {
    return JSON.stringify(content, null, 2);
  };

  const importJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        setContent({
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
        });
        return true;
      }
    } catch (e) {
      console.error('Import JSON parse failed:', e);
    }
    return false;
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateBrand,
        updateHero,
        updateAbout,
        updateEditorial,
        updatePortfolio,
        updatePortfolioItem,
        addPortfolioItem,
        deletePortfolioItem,
        updateServices,
        updateServicePackage,
        addServicePackage,
        deleteServicePackage,
        updateFaqs,
        updateFaq,
        addFaq,
        deleteFaq,
        resetToDefaults,
        exportJson,
        importJson,
        uploadImage: uploadImageToServer,
        isAuthenticated,
        login,
        logout,
        adminUsername: adminCreds.username,
        changeCredentials,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
