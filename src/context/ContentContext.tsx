import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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

/**
 * Merge loaded content over defaults, keeping defaults for any missing keys.
 */
function mergeContent(base: SiteContent, override: Partial<SiteContent>): SiteContent {
  return {
    ...base,
    ...override,
    brand: { ...base.brand, ...(override.brand || {}) },
    hero: { ...base.hero, ...(override.hero || {}) },
    about: { ...base.about, ...(override.about || {}) },
    editorial: { ...base.editorial, ...(override.editorial || {}) },
    portfolio: Array.isArray(override.portfolio) && override.portfolio.length > 0
      ? override.portfolio
      : base.portfolio,
    services: Array.isArray(override.services) && override.services.length > 0
      ? override.services
      : base.services,
    faqs: Array.isArray(override.faqs) && override.faqs.length > 0
      ? override.faqs
      : base.faqs,
  };
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ─── 1. Content State ──────────────────────────────────────────────
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return mergeContent(DEFAULT_SITE_CONTENT, JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to parse stored content:', e);
      }
    }
    return DEFAULT_SITE_CONTENT;
  });

  // Track whether we've already loaded remote content this session
  const hasLoadedRemote = useRef(false);

  // On first mount only, load latest from siteContent.json on disk
  // This brings in content saved to Git from previous sessions
  useEffect(() => {
    if (hasLoadedRemote.current) return;
    hasLoadedRemote.current = true;

    fetchRemoteContent().then((remote) => {
      if (remote) {
        setContent((prev) => {
          // Only apply remote if localStorage doesn't have custom edits
          const localStored = localStorage.getItem(STORAGE_KEY);
          if (localStored) {
            // Merge: localStorage wins for fields it has, remote fills gaps
            const local = JSON.parse(localStored);
            return mergeContent(DEFAULT_SITE_CONTENT, { ...remote, ...local });
          }
          return mergeContent(DEFAULT_SITE_CONTENT, remote);
        });
      }
    });
  }, []);

  // Persist to localStorage + server file (→ Git Auto-Sync) on every change
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Save to localStorage immediately
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {
      console.error('Failed to persist content to localStorage:', e);
    }

    // Debounce server save to avoid rapid-fire writes
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      persistContentToServer(content).then((ok) => {
        if (ok) console.log('✅ Content saved to server files → Git auto-sync will commit.');
      });
    }, 1500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [content]);

  // ─── 2. Auth Credentials & Session ─────────────────────────────────
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

  // ─── 3. Content Modifier Methods ───────────────────────────────────
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

  const updatePortfolioItem = useCallback((id: string, updated: Partial<PortfolioItem>) => {
    setContent((prev) => ({
      ...prev,
      portfolio: prev.portfolio.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    }));
  }, []);

  const addPortfolioItem = useCallback((item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `p_${Date.now()}`,
    };
    setContent((prev) => ({
      ...prev,
      portfolio: [newItem, ...prev.portfolio],
    }));
  }, []);

  const deletePortfolioItem = useCallback((id: string) => {
    setContent((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((item) => item.id !== id),
    }));
  }, []);

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
