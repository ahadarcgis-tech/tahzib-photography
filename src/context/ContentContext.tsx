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
import initialSiteContent from '../data/siteContent.json';
import { fetchRemoteContent, persistContentToServer, uploadImageToServer } from '../utils/api';

const AUTH_KEY = 'tahzib_admin_auth_v2';
const CREDS_KEY = 'tahzib_admin_creds_v2';
const BROADCAST_NAME = 'tahzib_live_sync_v1';

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
  // Initialize directly from saved siteContent.json file on disk (single source of truth)
  const [content, setContent] = useState<SiteContent>(() => {
    return mergeContent(DEFAULT_SITE_CONTENT, initialSiteContent as Partial<SiteContent>);
  });

  const lastServerTimestamp = useRef<number>(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef<boolean>(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Queue server save whenever user edits content in the admin interface
  const queueServerSave = useCallback((newContent: SiteContent) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      isSavingRef.current = true;
      try {
        const result = await persistContentToServer(newContent);
        if (result.success) {
          if (result.timestamp) {
            lastServerTimestamp.current = result.timestamp;
          }
          // If the server extracted any base64 images into physical files, update state with clean URLs
          if (result.content) {
            setContent(result.content);
            if (broadcastChannelRef.current) {
              broadcastChannelRef.current.postMessage({
                type: 'CONTENT_UPDATED',
                content: result.content,
                timestamp: result.timestamp || Date.now(),
              });
            }
          }
          console.log('✅ Content saved to server & GitHub auto-sync triggered.');
        }
      } catch (err) {
        console.error('Failed to persist content to server:', err);
      } finally {
        isSavingRef.current = false;
      }
    }, 600);
  }, []);

  // ─── 2. Cross-Tab Live Synchronization (Same Browser) ──────────────
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel(BROADCAST_NAME);
        broadcastChannelRef.current = bc;
        bc.onmessage = (event) => {
          if (event.data?.type === 'CONTENT_UPDATED' && event.data.content) {
            setContent(event.data.content);
            if (event.data.timestamp) {
              lastServerTimestamp.current = event.data.timestamp;
            }
          }
        };
        return () => {
          bc.close();
        };
      } catch (e) {}
    }
  }, []);

  // ─── 3. Multi-Device Live Synchronization (All Devices & Browsers) ──
  useEffect(() => {
    let isMounted = true;

    const syncWithServer = async () => {
      // Avoid overwriting state if currently saving local edits
      if (isSavingRef.current) return;

      try {
        const remote = await fetchRemoteContent();
        if (!isMounted || !remote) return;

        // If server timestamp is newer than our local timestamp, update smoothly
        if (remote.timestamp > lastServerTimestamp.current) {
          lastServerTimestamp.current = remote.timestamp;
          setContent(mergeContent(DEFAULT_SITE_CONTENT, remote.content));
        }
      } catch (err) {
        // Network offline or server starting
      }
    };

    // Initial fetch on mount
    syncWithServer();

    // Poll every 3 seconds for live multi-device updates across all browsers & phones
    const interval = setInterval(syncWithServer, 3000);

    // Sync immediately when user switches tabs or wakes phone
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncWithServer();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', syncWithServer);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', syncWithServer);
    };
  }, []);

  // ─── 4. Auth Credentials & Session ─────────────────────────────────
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

  // ─── 5. Content Modifier Methods ───────────────────────────────────
  const updateBrand = useCallback((partial: Partial<BrandInfo>) => {
    setContent((prev) => {
      const next = { ...prev, brand: { ...prev.brand, ...partial } };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updateHero = useCallback((partial: Partial<HeroInfo>) => {
    setContent((prev) => {
      const next = { ...prev, hero: { ...prev.hero, ...partial } };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updateAbout = useCallback((partial: Partial<AboutInfo>) => {
    setContent((prev) => {
      const next = { ...prev, about: { ...prev.about, ...partial } };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updateEditorial = useCallback((partial: Partial<EditorialInfo>) => {
    setContent((prev) => {
      const next = { ...prev, editorial: { ...prev.editorial, ...partial } };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updatePortfolio = useCallback((items: PortfolioItem[]) => {
    setContent((prev) => {
      const next = { ...prev, portfolio: items };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updatePortfolioItem = useCallback((id: string, updated: Partial<PortfolioItem>) => {
    setContent((prev) => {
      const next = {
        ...prev,
        portfolio: prev.portfolio.map((item) => (item.id === id ? { ...item, ...updated } : item)),
      };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const addPortfolioItem = useCallback((item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `p_${Date.now()}`,
    };
    setContent((prev) => {
      const next = {
        ...prev,
        portfolio: [newItem, ...prev.portfolio],
      };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const deletePortfolioItem = useCallback((id: string) => {
    setContent((prev) => {
      const next = {
        ...prev,
        portfolio: prev.portfolio.filter((item) => item.id !== id),
      };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updateServices = useCallback((services: ServicePackage[]) => {
    setContent((prev) => {
      const next = { ...prev, services };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updateServicePackage = useCallback((id: string, updated: Partial<ServicePackage>) => {
    setContent((prev) => {
      const next = {
        ...prev,
        services: prev.services.map((pkg) => (pkg.id === id ? { ...pkg, ...updated } : pkg)),
      };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const addServicePackage = useCallback((pkg: Omit<ServicePackage, 'id'>) => {
    const newPkg: ServicePackage = {
      ...pkg,
      id: `s_${Date.now()}`,
    };
    setContent((prev) => {
      const next = {
        ...prev,
        services: [...prev.services, newPkg],
      };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const deleteServicePackage = useCallback((id: string) => {
    setContent((prev) => {
      const next = {
        ...prev,
        services: prev.services.filter((pkg) => pkg.id !== id),
      };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updateFaqs = useCallback((faqs: FaqItem[]) => {
    setContent((prev) => {
      const next = { ...prev, faqs };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const updateFaq = useCallback((index: number, updated: FaqItem) => {
    setContent((prev) => {
      const nextFaqs = [...prev.faqs];
      nextFaqs[index] = updated;
      const next = { ...prev, faqs: nextFaqs };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const addFaq = useCallback((faq: FaqItem) => {
    setContent((prev) => {
      const next = {
        ...prev,
        faqs: [...prev.faqs, faq],
      };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const deleteFaq = useCallback((index: number) => {
    setContent((prev) => {
      const next = {
        ...prev,
        faqs: prev.faqs.filter((_, i) => i !== index),
      };
      queueServerSave(next);
      return next;
    });
  }, [queueServerSave]);

  const resetToDefaults = useCallback(() => {
    setContent(DEFAULT_SITE_CONTENT);
    queueServerSave(DEFAULT_SITE_CONTENT);
  }, [queueServerSave]);

  const exportJson = (): string => {
    return JSON.stringify(content, null, 2);
  };

  const importJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const next = mergeContent(DEFAULT_SITE_CONTENT, parsed);
        setContent(next);
        queueServerSave(next);
        return true;
      }
    } catch (e) {
      console.error('Import JSON parse failed:', e);
    }
    return false;
  }, [queueServerSave]);

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
