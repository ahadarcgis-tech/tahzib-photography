import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Sparkles,
  User,
  Image as ImageIcon,
  DollarSign,
  HelpCircle,
  Settings,
  ExternalLink,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  RotateCcw,
  Download,
  Upload as UploadIcon,
  Eye,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ImageUploadField } from './ImageUploadField';
import { PortfolioCategory, PortfolioItem, ServicePackage, FaqItem } from '../../types';

interface AdminDashboardProps {
  onViewLiveSite: () => void;
}

type TabType = 'overview' | 'hero' | 'about' | 'portfolio' | 'services' | 'faqs' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewLiveSite }) => {
  const {
    content,
    updateBrand,
    updateHero,
    updateAbout,
    updateEditorial,
    updatePortfolioItem,
    addPortfolioItem,
    deletePortfolioItem,
    updateServicePackage,
    addServicePackage,
    deleteServicePackage,
    updateFaq,
    addFaq,
    deleteFaq,
    resetToDefaults,
    exportJson,
    importJson,
    logout,
    adminUsername,
    changeCredentials,
  } = useContent();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Portfolio item editing / creating state
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Omit<PortfolioItem, 'id'>>({
    title: '',
    category: 'Weddings',
    location: 'Chittagong, Bangladesh',
    year: '2026',
    imageUrl: '',
    aspectRatio: 'portrait',
    filmStock: 'Kodak Portra 400',
    camera: 'Contax 645 · Zeiss 80mm f/2',
    description: '',
    featured: true,
  });

  // Services editing / creating state
  const [editingService, setEditingService] = useState<ServicePackage | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState<Omit<ServicePackage, 'id'>>({
    title: '',
    tagline: '',
    investment: 'Starting at $5,000',
    duration: 'Full Day',
    description: '',
    features: ['Lead photographer coverage', 'High resolution online gallery'],
    idealFor: 'Intimate and destination celebrations',
  });

  // Security Credentials state
  const [newUsername, setNewUsername] = useState(adminUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  // JSON Import state
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const categories: PortfolioCategory[] = [
    'All',
    'Weddings',
    'Editorial & Fashion',
    'Portraits',
    'Destination & Travel',
    '35mm & 120 Film',
  ];
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioCategory>('All');

  const filteredPortfolio =
    portfolioFilter === 'All'
      ? content.portfolio
      : content.portfolio.filter((item) => item.category === portfolioFilter);

  const handleSavePortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updatePortfolioItem(editingItem.id, editingItem);
      setEditingItem(null);
      showToast('Portfolio work updated successfully');
    }
  };

  const handleCreatePortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.imageUrl) {
      alert('Please provide at least a title and an image.');
      return;
    }
    addPortfolioItem(newItem);
    setIsAddingItem(false);
    setNewItem({
      title: '',
      category: 'Weddings',
      location: 'Chittagong, Bangladesh',
      year: '2026',
      imageUrl: '',
      aspectRatio: 'portrait',
      filmStock: 'Kodak Portra 400',
      camera: 'Contax 645 · Zeiss 80mm f/2',
      description: '',
      featured: true,
    });
    showToast('New work added to portfolio archives');
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateServicePackage(editingService.id, editingService);
      setEditingService(null);
      showToast('Service package updated');
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim()) return;
    addServicePackage(newService);
    setIsAddingService(false);
    showToast('New service package added');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setSecurityMessage('Passwords do not match');
      return;
    }
    changeCredentials(newUsername, newPassword || 'tahzib2026');
    setSecurityMessage('Admin credentials updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Credentials updated');
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tahzib_content_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Content backup downloaded');
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    const success = importJson(jsonInput);
    if (success) {
      setImportStatus('Content successfully restored from backup!');
      setJsonInput('');
      showToast('Backup imported successfully');
    } else {
      setImportStatus('Invalid JSON data. Please verify your backup file.');
    }
  };

  return (
    <div className="min-h-screen bg-[#12100E] text-[#F6F3EC] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#DFB15B] text-[#12100E] px-4 py-3 rounded shadow-2xl font-mono text-xs flex items-center gap-2 border border-[#F6F3EC]/20">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#171412]/95 backdrop-blur-md border-b border-[#2E2925] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#DFB15B]/60 bg-[#221B16] text-[#DFB15B] flex items-center justify-center font-['Italiana',_serif] text-sm font-semibold">
            tc
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Italiana',_'Cormorant_Garamond',_serif] text-lg sm:text-xl text-[#F6F3EC]">
                Tahzib Studio CMS
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#2E2925] text-[#DFB15B] px-1.5 py-0.5 rounded tracking-wider">
                Admin
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#78716C] block">
              Private Management Dashboard · Changes save automatically
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onViewLiveSite}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider bg-[#241F1C] hover:bg-[#342D28] text-[#DFB15B] border border-[#3E3834] px-3.5 py-2 rounded transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider bg-transparent hover:bg-red-950/40 text-red-300 hover:text-red-200 border border-red-900/40 px-3 py-2 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar / Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row gap-8">
        {/* Navigation Tabs */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <div className="pb-3 px-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#78716C] block">
              Sections & Content
            </span>
          </div>

          {[
            { id: 'overview', label: 'Studio & Brand', icon: LayoutDashboard },
            { id: 'hero', label: 'Hero Centerpiece', icon: Sparkles },
            { id: 'about', label: 'Meet Tahzib (About)', icon: User },
            { id: 'portfolio', label: 'Portfolio Works', icon: ImageIcon, badge: content.portfolio.length },
            { id: 'services', label: 'Investment & Rates', icon: DollarSign, badge: content.services.length },
            { id: 'faqs', label: 'Questions & Answers', icon: HelpCircle, badge: content.faqs.length },
            { id: 'settings', label: 'Security & Backup', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#DFB15B] text-[#12100E] font-semibold shadow-md'
                    : 'text-[#A8A29E] hover:bg-[#1E1B18] hover:text-[#F6F3EC]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-[#12100E]/20 text-[#12100E]' : 'bg-[#2E2925] text-[#78716C]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 border-t border-[#2E2925]/60 mt-6">
            <div className="p-3 bg-[#1A1715] border border-[#2E2925] rounded text-[11px] font-mono text-[#78716C] space-y-1">
              <span className="text-[#DFB15B] font-semibold block">Secret URL</span>
              <p className="text-[10px] leading-relaxed">
                Remember: Keep your bookmark for <code className="text-[#F6F3EC]">/admin</code> saved. There are no public links on the live website.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#1A1715] border border-[#2E2925] p-5 sm:p-8 rounded shadow-xl">
          {/* 1. OVERVIEW & BRAND */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DFB15B] block mb-1">
                  General Studio Profile
                </span>
                <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl text-[#F6F3EC]">
                  Brand & Contact Settings
                </h2>
                <p className="text-xs text-[#78716C] font-mono mt-0.5">
                  Update your artist identity, studio home base, inquiry contact channels, and footer statement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Photographer Name
                  </label>
                  <input
                    type="text"
                    value={content.brand.name}
                    onChange={(e) => updateBrand({ name: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Studio Brand Title
                  </label>
                  <input
                    type="text"
                    value={content.brand.title}
                    onChange={(e) => updateBrand({ title: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={content.brand.tagline}
                    onChange={(e) => updateBrand({ tagline: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Studio Location
                  </label>
                  <input
                    type="text"
                    value={content.brand.location}
                    onChange={(e) => updateBrand({ location: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={content.brand.email}
                    onChange={(e) => updateBrand({ email: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    value={content.brand.phone}
                    onChange={(e) => updateBrand({ phone: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={content.brand.instagram}
                    onChange={(e) => updateBrand({ instagram: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={content.brand.whatsapp}
                    onChange={(e) => updateBrand({ whatsapp: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Annual Availability / Commission Badge
                </label>
                <input
                  type="text"
                  value={content.brand.availability}
                  onChange={(e) => updateBrand({ availability: e.target.value })}
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Colophon & Footer Statement
                </label>
                <textarea
                  rows={3}
                  value={content.brand.colophonText}
                  onChange={(e) => updateBrand({ colophonText: e.target.value })}
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] p-3 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-[#2E2925] flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Brand profile updated')}
                  className="inline-flex items-center gap-2 bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. HERO CENTERPIECE */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DFB15B] block mb-1">
                  Homepage Focal Point
                </span>
                <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl text-[#F6F3EC]">
                  Hero Centerpiece & Headlines
                </h2>
                <p className="text-xs text-[#78716C] font-mono mt-0.5">
                  Configure the prominent split photograph display on your homepage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => updateHero({ title: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={content.hero.subtitle}
                    onChange={(e) => updateHero({ subtitle: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Location Header Label
                </label>
                <input
                  type="text"
                  value={content.hero.location}
                  onChange={(e) => updateHero({ location: e.target.value })}
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none"
                />
              </div>

              {/* Left & Right Hero Centerpiece Photos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#2E2925]">
                {/* Left Photo */}
                <div className="p-4 bg-[#141210] border border-[#2E2925] rounded space-y-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#DFB15B] block font-semibold">
                    Left Centerpiece Frame
                  </span>
                  <ImageUploadField
                    label="Left Image File or URL"
                    value={content.hero.leftImage.url}
                    onChange={(url) =>
                      updateHero({
                        leftImage: { ...content.hero.leftImage, url },
                      })
                    }
                    aspectRatioLabel="Landscape (16:9 / 4:3)"
                  />
                  <div>
                    <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                      Caption
                    </label>
                    <input
                      type="text"
                      value={content.hero.leftImage.caption}
                      onChange={(e) =>
                        updateHero({
                          leftImage: { ...content.hero.leftImage, caption: e.target.value },
                        })
                      }
                      className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={content.hero.leftImage.year}
                        onChange={(e) =>
                          updateHero({
                            leftImage: { ...content.hero.leftImage, year: e.target.value },
                          })
                        }
                        className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                        Location Tag
                      </label>
                      <input
                        type="text"
                        value={content.hero.leftImage.location}
                        onChange={(e) =>
                          updateHero({
                            leftImage: { ...content.hero.leftImage, location: e.target.value },
                          })
                        }
                        className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Photo */}
                <div className="p-4 bg-[#141210] border border-[#2E2925] rounded space-y-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#DFB15B] block font-semibold">
                    Right Centerpiece Frame
                  </span>
                  <ImageUploadField
                    label="Right Image File or URL"
                    value={content.hero.rightImage.url}
                    onChange={(url) =>
                      updateHero({
                        rightImage: { ...content.hero.rightImage, url },
                      })
                    }
                    aspectRatioLabel="Portrait (3:4)"
                  />
                  <div>
                    <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                      Caption
                    </label>
                    <input
                      type="text"
                      value={content.hero.rightImage.caption}
                      onChange={(e) =>
                        updateHero({
                          rightImage: { ...content.hero.rightImage, caption: e.target.value },
                        })
                      }
                      className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={content.hero.rightImage.year}
                        onChange={(e) =>
                          updateHero({
                            rightImage: { ...content.hero.rightImage, year: e.target.value },
                          })
                        }
                        className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                        Location Tag
                      </label>
                      <input
                        type="text"
                        value={content.hero.rightImage.location}
                        onChange={(e) =>
                          updateHero({
                            rightImage: { ...content.hero.rightImage, location: e.target.value },
                          })
                        }
                        className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Editorial Welcome Paragraph */}
              <div className="pt-4 border-t border-[#2E2925]">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Editorial Statement Paragraph (Below Centerpiece)
                </label>
                <textarea
                  rows={3}
                  value={content.editorial.welcomeText}
                  onChange={(e) => updateEditorial({ welcomeText: e.target.value })}
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] p-3 text-xs text-[#F6F3EC] focus:outline-none font-mono leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-[#2E2925] flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('Hero section updated')}
                  className="inline-flex items-center gap-2 bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Hero Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. MEET TAHZIB (ABOUT) */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DFB15B] block mb-1">
                  Artist Biography & Statement
                </span>
                <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl text-[#F6F3EC]">
                  Meet Tahzib Profile
                </h2>
                <p className="text-xs text-[#78716C] font-mono mt-0.5">
                  Upload your portrait photograph, change your artistic philosophy, and refine biography text.
                </p>
              </div>

              {/* Portrait Photo Upload */}
              <div className="p-4 bg-[#141210] border border-[#2E2925] rounded space-y-3">
                <ImageUploadField
                  label="Artist Portrait Photo"
                  value={content.about.portraitUrl}
                  onChange={(url) => updateAbout({ portraitUrl: url })}
                  aspectRatioLabel="Portrait (3:4)"
                  description="This portrait is displayed in the 'Meet Tahzib' section. You can upload your original image here or drop your file."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={content.about.title}
                    onChange={(e) => updateAbout({ title: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                    Artist Eyebrow Tagline
                  </label>
                  <input
                    type="text"
                    value={content.about.subtitle}
                    onChange={(e) => updateAbout({ subtitle: e.target.value })}
                    className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Headline Quote
                </label>
                <input
                  type="text"
                  value={content.about.headlineQuote}
                  onChange={(e) => updateAbout({ headlineQuote: e.target.value })}
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Biography Paragraph 1
                </label>
                <textarea
                  rows={4}
                  value={content.about.bioParagraph1}
                  onChange={(e) => updateAbout({ bioParagraph1: e.target.value })}
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] p-3 text-xs text-[#F6F3EC] focus:outline-none font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Biography Paragraph 2
                </label>
                <textarea
                  rows={4}
                  value={content.about.bioParagraph2}
                  onChange={(e) => updateAbout({ bioParagraph2: e.target.value })}
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] p-3 text-xs text-[#F6F3EC] focus:outline-none font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Base Studio Location
                </label>
                <input
                  type="text"
                  value={content.about.baseStudio}
                  onChange={(e) => updateAbout({ baseStudio: e.target.value })}
                  className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3.5 py-2.5 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-[#2E2925] flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('About profile saved')}
                  className="inline-flex items-center gap-2 bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. PORTFOLIO GALLERY */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DFB15B] block mb-1">
                    Curated Archives
                  </span>
                  <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl text-[#F6F3EC]">
                    Portfolio Gallery ({content.portfolio.length} Works)
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingItem(true)}
                  className="inline-flex items-center gap-2 bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer shadow-md hover:bg-[#C99E4B] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Work</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[#2E2925]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPortfolioFilter(cat)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      portfolioFilter === cat
                        ? 'bg-[#DFB15B] text-[#12100E] font-semibold'
                        : 'bg-[#141210] text-[#78716C] hover:text-[#F6F3EC] border border-[#2E2925]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Add New Work Form Modal */}
              {isAddingItem && (
                <div className="p-5 bg-[#141210] border-2 border-[#DFB15B]/60 rounded space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#DFB15B] font-semibold">
                      Add New Photograph / Project
                    </span>
                    <button
                      onClick={() => setIsAddingItem(false)}
                      className="text-[#78716C] hover:text-[#F6F3EC] text-xs font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleCreatePortfolioItem} className="space-y-4">
                    <ImageUploadField
                      label="Image File or URL"
                      value={newItem.imageUrl}
                      onChange={(url) => setNewItem({ ...newItem, imageUrl: url })}
                      aspectRatioLabel="Select Portrait, Landscape or Square"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={newItem.title}
                          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                          placeholder="e.g. The Scent of Orange Blossoms"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Category</label>
                        <select
                          value={newItem.category}
                          onChange={(e) => setNewItem({ ...newItem, category: e.target.value as PortfolioCategory })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        >
                          <option value="Weddings">Weddings</option>
                          <option value="Editorial & Fashion">Editorial & Fashion</option>
                          <option value="Portraits">Portraits</option>
                          <option value="Destination & Travel">Destination & Travel</option>
                          <option value="35mm & 120 Film">35mm & 120 Film</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Location</label>
                        <input
                          type="text"
                          value={newItem.location}
                          onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Year</label>
                        <input
                          type="text"
                          value={newItem.year}
                          onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Camera Body</label>
                        <input
                          type="text"
                          value={newItem.camera}
                          onChange={(e) => setNewItem({ ...newItem, camera: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Film Stock</label>
                        <input
                          type="text"
                          value={newItem.filmStock}
                          onChange={(e) => setNewItem({ ...newItem, filmStock: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Story / Description</label>
                      <textarea
                        rows={2}
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="w-full bg-[#12100E] border border-[#2E2925] p-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#A8A29E]">
                        <input
                          type="checkbox"
                          checked={newItem.featured}
                          onChange={(e) => setNewItem({ ...newItem, featured: e.target.checked })}
                          className="rounded text-[#DFB15B] focus:ring-0 bg-[#12100E]"
                        />
                        <span>Feature on Spotlight Carousel</span>
                      </label>

                      <button
                        type="submit"
                        className="bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Publish to Portfolio
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Work Modal */}
              {editingItem && (
                <div className="p-5 bg-[#141210] border-2 border-[#DFB15B] rounded space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#DFB15B] font-semibold">
                      Edit Photograph: {editingItem.title}
                    </span>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="text-[#78716C] hover:text-[#F6F3EC] text-xs font-mono"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSavePortfolioItem} className="space-y-4">
                    <ImageUploadField
                      label="Image File or URL"
                      value={editingItem.imageUrl}
                      onChange={(url) => setEditingItem({ ...editingItem, imageUrl: url })}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Title</label>
                        <input
                          type="text"
                          value={editingItem.title}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Category</label>
                        <select
                          value={editingItem.category}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as PortfolioCategory })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        >
                          <option value="Weddings">Weddings</option>
                          <option value="Editorial & Fashion">Editorial & Fashion</option>
                          <option value="Portraits">Portraits</option>
                          <option value="Destination & Travel">Destination & Travel</option>
                          <option value="35mm & 120 Film">35mm & 120 Film</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Location</label>
                        <input
                          type="text"
                          value={editingItem.location}
                          onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Year</label>
                        <input
                          type="text"
                          value={editingItem.year}
                          onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Camera Body</label>
                        <input
                          type="text"
                          value={editingItem.camera}
                          onChange={(e) => setEditingItem({ ...editingItem, camera: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Film Stock</label>
                        <input
                          type="text"
                          value={editingItem.filmStock}
                          onChange={(e) => setEditingItem({ ...editingItem, filmStock: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Story / Description</label>
                      <textarea
                        rows={2}
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full bg-[#12100E] border border-[#2E2925] p-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#A8A29E]">
                        <input
                          type="checkbox"
                          checked={editingItem.featured}
                          onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                          className="rounded text-[#DFB15B] focus:ring-0 bg-[#12100E]"
                        />
                        <span>Feature on Spotlight Carousel</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="px-3 py-1.5 text-xs font-mono text-[#78716C] hover:text-[#F6F3EC]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                        >
                          Save Work
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Portfolio Grid Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#141210] border border-[#2E2925] rounded overflow-hidden flex flex-col justify-between group hover:border-[#DFB15B]/50 transition-colors"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#12100E]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.opacity = '0.3';
                        }}
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="bg-[#12100E]/80 backdrop-blur-sm text-[10px] font-mono px-2 py-0.5 rounded text-[#DFB15B] uppercase">
                          {item.category}
                        </span>
                        {item.featured && (
                          <span className="bg-[#DFB15B] text-[#12100E] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-base text-[#F6F3EC] truncate">
                          {item.title}
                        </h4>
                        <span className="text-[11px] font-mono text-[#78716C] block truncate">
                          {item.location} · {item.year}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-[#2E2925]/80 flex items-center justify-between text-xs font-mono">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="text-[#DFB15B] hover:text-[#C99E4B] flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${item.title}" from portfolio?`)) {
                              deletePortfolioItem(item.id);
                              showToast('Photo removed from archives');
                            }
                          }}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. SERVICES & INVESTMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DFB15B] block mb-1">
                    Commissions & Pricing
                  </span>
                  <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl text-[#F6F3EC]">
                    Services & Packages ({content.services.length})
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingService(true)}
                  className="inline-flex items-center gap-2 bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Package</span>
                </button>
              </div>

              {/* Add Package */}
              {isAddingService && (
                <div className="p-5 bg-[#141210] border-2 border-[#DFB15B]/60 rounded space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#DFB15B] font-semibold">
                      New Collection / Commission
                    </span>
                    <button
                      onClick={() => setIsAddingService(false)}
                      className="text-[#78716C] hover:text-[#F6F3EC] text-xs font-mono"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleCreateService} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Package Title</label>
                        <input
                          type="text"
                          required
                          value={newService.title}
                          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                          placeholder="e.g. The Signature Day"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Investment / Price</label>
                        <input
                          type="text"
                          value={newService.investment}
                          onChange={(e) => setNewService({ ...newService, investment: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                          placeholder="Starting at $8,500 / BDT..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Duration</label>
                      <input
                        type="text"
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                        className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        placeholder="e.g. 10 Hours / Full Weekend"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        className="w-full bg-[#12100E] border border-[#2E2925] p-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Create Package
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Package */}
              {editingService && (
                <div className="p-5 bg-[#141210] border-2 border-[#DFB15B] rounded space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#DFB15B] font-semibold">
                      Edit Package: {editingService.title}
                    </span>
                    <button
                      onClick={() => setEditingService(null)}
                      className="text-[#78716C] hover:text-[#F6F3EC] text-xs font-mono"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Package Title</label>
                        <input
                          type="text"
                          value={editingService.title}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Investment / Price</label>
                        <input
                          type="text"
                          value={editingService.investment}
                          onChange={(e) => setEditingService({ ...editingService, investment: e.target.value })}
                          className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Duration</label>
                      <input
                        type="text"
                        value={editingService.duration}
                        onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                        className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full bg-[#12100E] border border-[#2E2925] p-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-3 py-1.5 text-xs font-mono text-[#78716C]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                      >
                        Save Package
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* List of Services */}
              <div className="space-y-3">
                {content.services.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 bg-[#141210] border border-[#2E2925] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-lg text-[#F6F3EC]">
                          {pkg.title}
                        </h4>
                        <span className="text-xs font-mono text-[#DFB15B] font-semibold bg-[#2E2925] px-2 py-0.5 rounded">
                          {pkg.investment}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#78716C] block">
                        Duration: {pkg.duration}
                      </span>
                      <p className="text-xs text-[#A8A29E] font-mono line-clamp-2 max-w-2xl">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingService(pkg)}
                        className="p-2 border border-[#2E2925] hover:border-[#DFB15B] text-[#DFB15B] rounded text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete package "${pkg.title}"?`)) {
                            deleteServicePackage(pkg.id);
                            showToast('Package deleted');
                          }
                        }}
                        className="p-2 border border-[#2E2925] hover:border-red-500 text-red-400 rounded text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DFB15B] block mb-1">
                    Client Inquiries
                  </span>
                  <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl text-[#F6F3EC]">
                    Frequently Inquired Questions ({content.faqs.length})
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newQ: FaqItem = {
                      q: 'New question title',
                      a: 'Answer explanation here...',
                    };
                    addFaq(newQ);
                    showToast('New question added to FAQ');
                  }}
                  className="inline-flex items-center gap-2 bg-[#DFB15B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-[#141210] border border-[#2E2925] rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFB15B]">
                        Question #{idx + 1}
                      </span>
                      <button
                        onClick={() => {
                          deleteFaq(idx);
                          showToast('Question removed');
                        }}
                        className="text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => updateFaq(idx, { ...faq, q: e.target.value })}
                        className="w-full bg-[#12100E] border border-[#2E2925] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-semibold"
                        placeholder="Question title..."
                      />
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        value={faq.a}
                        onChange={(e) => updateFaq(idx, { ...faq, a: e.target.value })}
                        className="w-full bg-[#12100E] border border-[#2E2925] p-2.5 text-xs text-[#F6F3EC] focus:outline-none font-mono leading-relaxed"
                        placeholder="Answer explanation..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DFB15B] block mb-1">
                  Access & Data Integrity
                </span>
                <h2 className="font-['Italiana',_'Cormorant_Garamond',_serif] text-2xl text-[#F6F3EC]">
                  Security & Backup Settings
                </h2>
                <p className="text-xs text-[#78716C] font-mono mt-0.5">
                  Change your login credentials, export JSON backups, and restore factory defaults.
                </p>
              </div>

              {/* Change Credentials Form */}
              <div className="p-5 bg-[#141210] border border-[#2E2925] rounded space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#DFB15B] font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>Update Admin Login Credentials</span>
                </div>

                {securityMessage && (
                  <div className="p-2.5 bg-[#1E1B18] border border-[#DFB15B]/40 rounded text-xs font-mono text-[#DFB15B]">
                    {securityMessage}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                      Admin Username
                    </label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                    />
                  </div>

                  {newPassword && (
                    <div>
                      <label className="block text-[11px] font-mono text-[#A8A29E] mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#12100E] border border-[#2E2925] focus:border-[#DFB15B] px-3 py-2 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-[#DFB15B] hover:bg-[#C99E4B] text-[#12100E] px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                  >
                    Save Login Credentials
                  </button>
                </form>
              </div>

              {/* Data Export & Backup */}
              <div className="p-5 bg-[#141210] border border-[#2E2925] rounded space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F6F3EC] font-semibold">
                  <Download className="w-4 h-4 text-[#DFB15B]" />
                  <span>Export Content Backup (JSON)</span>
                </div>
                <p className="text-xs font-mono text-[#78716C] leading-relaxed">
                  Download a complete copy of all your custom portfolio texts, prices, and uploaded photos as a backup file.
                </p>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 bg-[#2E2925] hover:bg-[#3E3834] text-[#DFB15B] px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              {/* Import Backup */}
              <div className="p-5 bg-[#141210] border border-[#2E2925] rounded space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F6F3EC] font-semibold">
                  <UploadIcon className="w-4 h-4 text-[#DFB15B]" />
                  <span>Restore from Backup</span>
                </div>
                {importStatus && (
                  <div className="p-2.5 bg-[#1E1B18] border border-[#DFB15B]/40 rounded text-xs font-mono text-[#DFB15B]">
                    {importStatus}
                  </div>
                )}
                <textarea
                  rows={3}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste JSON content here..."
                  className="w-full bg-[#12100E] border border-[#2E2925] p-2.5 text-xs text-[#F6F3EC] focus:outline-none font-mono"
                />
                <button
                  onClick={handleImport}
                  className="bg-[#2E2925] hover:bg-[#3E3834] text-[#F6F3EC] px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Restore Content
                </button>
              </div>

              {/* Factory Reset */}
              <div className="p-5 bg-red-950/20 border border-red-900/40 rounded space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-300 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Factory Reset</span>
                </div>
                <p className="text-xs font-mono text-red-200/70">
                  Reverts all portfolio works, services, FAQs, and brand copy back to the original studio defaults.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all website content back to defaults?')) {
                      resetToDefaults();
                      showToast('Content restored to initial defaults');
                    }
                  }}
                  className="bg-red-900/40 hover:bg-red-900/70 text-red-200 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border border-red-800/60 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
