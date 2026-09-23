/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_AD_UNITS,
  INITIAL_CORPORATE_PARTNERS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import {
  Language,
  Theme,
  HapticIntensity,
  TextScale,
  TaskItem,
  ClientProfile,
  Invoice,
  AdUnit,
  CorporatePartner,
  PushNotification,
} from './types';
import { Header } from './components/Header';
import { PublicPortfolio } from './components/PublicPortfolio';
import { AIAssistantStudio } from './components/AIAssistantStudio';
import { MonetizationHub } from './components/MonetizationHub';
import { BillingAndCRM } from './components/BillingAndCRM';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SecurityVault } from './components/SecurityVault';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { OfflineBanner } from './components/OfflineBanner';
import { Footer } from './components/Footer';
import { triggerHaptic, playTactileSound } from './services/haptics';
import {
  Globe,
  Sparkles,
  DollarSign,
  FileText,
  BarChart3,
  Shield,
  Send,
  X,
  Copy,
  Check,
} from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'public' | 'studio'>('public');
  const [currentTab, setCurrentTab] = useState<string>('portfolio');

  // Accessibility & Settings
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [hapticIntensity, setHapticIntensity] = useState<HapticIntensity>('medium');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textScale, setTextScale] = useState<TextScale>('sm');
  const [pushEnabled, setPushEnabled] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Pitch Deck Modal from Portfolio
  const [selectedPartnerForPitch, setSelectedPartnerForPitch] = useState<CorporatePartner | null>(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [copiedPitchModal, setCopiedPitchModal] = useState(false);

  // Application Data States (persistent in localStorage)
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('aether_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('aether_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('aether_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [adUnits, setAdUnits] = useState<AdUnit[]>(() => {
    const saved = localStorage.getItem('aether_ad_units');
    return saved ? JSON.parse(saved) : INITIAL_AD_UNITS;
  });

  const [partners, setPartners] = useState<CorporatePartner[]>(() => {
    const saved = localStorage.getItem('aether_partners');
    return saved ? JSON.parse(saved) : INITIAL_CORPORATE_PARTNERS;
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem('aether_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Screen Reader Live Announcements (WCAG 2.1)
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Setup Online/Offline listeners & PWA Service Worker
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      setLiveAnnouncement('Application is back online. Syncing local changes.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setLiveAnnouncement('Application is now in offline mode. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('ServiceWorker registered'))
        .catch((err) => console.log('SW registration error:', err));
    }

    // First time check for onboarding tour
    const completedTour = localStorage.getItem('aether_onboarding_completed');
    if (!completedTour) {
      setIsOnboardingOpen(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save changes to localStorage for offline persistence
  useEffect(() => {
    localStorage.setItem('aether_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('aether_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('aether_ad_units', JSON.stringify(adUnits));
  }, [adUnits]);
  useEffect(() => {
    localStorage.setItem('aether_partners', JSON.stringify(partners));
  }, [partners]);
  useEffect(() => {
    localStorage.setItem('aether_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Push notification permission request
  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setPushEnabled(true);
          new Notification('Aether AI Studio Alerts Enabled', {
            body: 'You will receive instant alerts for client payments and AI task completion.',
            icon: '/icon-192.png',
          });
        }
      } catch (e) {
        setPushEnabled(true);
      }
    } else {
      setPushEnabled(true);
    }
  };

  const handleSendTestNotification = () => {
    const newNotif: PushNotification = {
      id: 'notif-' + Date.now(),
      title: 'Payment Received: +$4,200.00',
      body: 'Client TechCorp Global verified milestone. Settlement transferred to ledger.',
      type: 'money',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications([newNotif, ...notifications]);
    setLiveAnnouncement('New payment notification received: $4,200.00');
    playTactileSound('cash', audioEnabled);
    triggerHaptic('heavy');

    if (pushEnabled && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        new Notification(newNotif.title, {
          body: newNotif.body,
          icon: '/icon-192.png',
        });
      } catch (e) {
        //
      }
    }
  };

  // Handlers for Tasks, Invoices, Partners
  const handleAddTask = (newTask: TaskItem) => {
    setTasks([newTask, ...tasks]);
    setLiveAnnouncement(`New autonomous task assigned: ${newTask.title}`);
  };

  const handleUpdateTask = (updatedTask: TaskItem) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleHireSubmit = (taskData: Partial<TaskItem>) => {
    const newTask: TaskItem = {
      id: 'task-' + Date.now(),
      title: taskData.title || 'Client Commission',
      clientName: taskData.clientName || 'Inbound Partner',
      clientCompany: taskData.clientCompany || 'Enterprise Client',
      category: taskData.category || 'fullstack',
      priority: taskData.priority || 'high',
      status: 'queued',
      payout: taskData.payout || 4500,
      prompt: taskData.prompt || 'Custom specifications submitted via portfolio form.',
      progress: 0,
      logs: [
        `${new Date().toLocaleTimeString()} - Commission ingested from public portfolio`,
        `${new Date().toLocaleTimeString()} - Ready for autonomous execution`,
      ],
      createdAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);

    // Create corresponding pending invoice
    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newTask.clientName,
      clientCompany: newTask.clientCompany,
      clientEmail: `${newTask.clientName.toLowerCase().replace(/\s+/g, '.')}@client.com`,
      items: [
        {
          id: 'item-' + Date.now(),
          description: newTask.title,
          hours: Math.round(newTask.payout / 220),
          rate: 220,
          amount: newTask.payout,
        },
      ],
      taxRate: 0.08,
      subtotal: newTask.payout,
      taxAmount: newTask.payout * 0.08,
      total: newTask.payout * 1.08,
      status: 'pending',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Stripe Instant',
      notes: 'Milestone commissioning agreement. Automated release upon test verification.',
    };

    setInvoices([newInvoice, ...invoices]);

    // Switch to studio to watch execution
    setTimeout(() => {
      setViewMode('studio');
      setCurrentTab('studio');
    }, 1200);
  };

  const handleGenerateInvoiceForTask = (task: TaskItem) => {
    const existing = invoices.find((i) => i.items.some((it) => it.description.includes(task.title)));
    if (existing) {
      setCurrentTab('billing');
      setViewMode('studio');
      return;
    }

    const newInv: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: task.clientName,
      clientCompany: task.clientCompany,
      clientEmail: `${task.clientName.toLowerCase().replace(/\s+/g, '.')}@enterprise.com`,
      items: [
        {
          id: 'item-' + Date.now(),
          description: `${task.title} - Autonomous Verified Deliverable`,
          hours: Math.round(task.payout / 220) || 8,
          rate: 220,
          amount: task.payout,
        },
      ],
      taxRate: 0.08,
      subtotal: task.payout,
      taxAmount: task.payout * 0.08,
      total: task.payout * 1.08,
      status: 'pending',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Stripe Instant',
      notes: 'Deliverable complete and verified with zero defects. Ready for instant payout.',
    };

    setInvoices([newInv, ...invoices]);
    setViewMode('studio');
    setCurrentTab('billing');
  };

  const handleCalculatorInvoice = (total: number, selectedServices: string[]) => {
    const newInv: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: 'Enterprise Client',
      clientCompany: 'Custom Scope Commission',
      clientEmail: 'lead@enterprise.com',
      items: selectedServices.map((s, idx) => ({
        id: 'item-' + idx,
        description: s,
        hours: Math.round((total / selectedServices.length) / 220),
        rate: 220,
        amount: Math.round(total / selectedServices.length),
      })),
      taxRate: 0.0,
      subtotal: total,
      taxAmount: 0,
      total: total,
      status: 'pending',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Stripe Instant',
      notes: 'Generated from Interactive Scope Calculator. Includes partner co-sponsorship discount.',
    };

    setInvoices([newInv, ...invoices]);
    setViewMode('studio');
    setCurrentTab('billing');
  };

  const handleToggleAd = (id: string) => {
    setAdUnits((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, enabled: !ad.enabled } : ad))
    );
  };

  const handleUpdateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
    if (status === 'paid') {
      const inv = invoices.find((i) => i.id === id);
      setLiveAnnouncement(`Invoice ${inv?.invoiceNumber || ''} marked as paid!`);
    }
  };

  const handleAddPartner = (partner: CorporatePartner) => {
    setPartners([partner, ...partners]);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } ${highContrast ? 'contrast-high' : ''} ${
        textScale === 'sm' ? 'text-scale-sm' : textScale === 'md' ? 'text-scale-md' : 'text-scale-lg'
      }`}
    >
      {/* WCAG Screen Reader Live Region */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
        aria-atomic="true"
      >
        {liveAnnouncement}
      </div>

      {/* Offline Status Alert Banner */}
      <OfflineBanner isOnline={isOnline} language={language} />

      {/* Primary Header & Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'portfolio') {
            setViewMode('public');
          } else {
            setViewMode('studio');
          }
        }}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          if (mode === 'public') {
            setCurrentTab('portfolio');
          } else if (currentTab === 'portfolio') {
            setCurrentTab('studio');
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        isOnline={isOnline}
        notifications={notifications}
        onMarkNotificationAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTour={() => setIsOnboardingOpen(true)}
        onSendTestNotification={handleSendTestNotification}
        hapticsEnabled={hapticIntensity !== 'off'}
      />

      {/* Main Content Area */}
      <main id="main-content" className="pb-24 sm:pb-16 min-h-[80vh]">
        {viewMode === 'public' || currentTab === 'portfolio' ? (
          /* Public Portfolio View */
          <PublicPortfolio
            projects={INITIAL_PROJECTS}
            partners={partners}
            language={language}
            onHireSubmit={handleHireSubmit}
            onSwitchToStudio={() => {
              setViewMode('studio');
              setCurrentTab('studio');
            }}
            onOpenPitchModal={(p) => {
              setSelectedPartnerForPitch(p || partners[0]);
              setShowPitchModal(true);
            }}
            onOpenCalculatorInvoice={handleCalculatorInvoice}
          />
        ) : (
          /* Executive AI Studio Tabs */
          <>
            {currentTab === 'studio' && (
              <AIAssistantStudio
                tasks={tasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onGenerateInvoiceForTask={handleGenerateInvoiceForTask}
                language={language}
                isOnline={isOnline}
              />
            )}

            {currentTab === 'monetization' && (
              <MonetizationHub
                adUnits={adUnits}
                partners={partners}
                onToggleAd={handleToggleAd}
                onAddPartner={handleAddPartner}
                language={language}
              />
            )}

            {currentTab === 'billing' && (
              <BillingAndCRM
                invoices={invoices}
                clients={clients}
                onAddInvoice={(newInv) => setInvoices([newInv, ...invoices])}
                onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                onAddClient={(newCli) => setClients([newCli, ...clients])}
                language={language}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsDashboard language={language} />
            )}

            {currentTab === 'vault' && (
              <SecurityVault language={language} />
            )}
          </>
        )}
      </main>

      {/* Accessible Footer */}
      <Footer
        language={language}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTour={() => setIsOnboardingOpen(true)}
      />

      {/* Mobile Floating Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around text-[10px] font-semibold"
      >
        <button
          onClick={() => {
            triggerHaptic('soft');
            setViewMode('public');
            setCurrentTab('portfolio');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            viewMode === 'public' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Portfolio</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('soft');
            setViewMode('studio');
            setCurrentTab('studio');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            viewMode === 'studio' && currentTab === 'studio' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Tasks</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('soft');
            setViewMode('studio');
            setCurrentTab('billing');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            viewMode === 'studio' && currentTab === 'billing' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Billing</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('soft');
            setViewMode('studio');
            setCurrentTab('monetization');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            viewMode === 'studio' && currentTab === 'monetization' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Monetize</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('soft');
            setViewMode('studio');
            setCurrentTab('analytics');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            viewMode === 'studio' && currentTab === 'analytics' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Metrics</span>
        </button>
      </nav>

      {/* Settings & Accessibility Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        language={language}
        onLanguageChange={setLanguage}
        hapticIntensity={hapticIntensity}
        onHapticChange={setHapticIntensity}
        audioEnabled={audioEnabled}
        onAudioToggle={() => setAudioEnabled(!audioEnabled)}
        highContrast={highContrast}
        onHighContrastToggle={() => setHighContrast(!highContrast)}
        textScale={textScale}
        onTextScaleChange={setTextScale}
        pushEnabled={pushEnabled}
        onRequestPush={handleRequestPushPermission}
        onRestartTour={() => setIsOnboardingOpen(true)}
      />

      {/* Guided Skippable Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        language={language}
      />

      {/* Partner Pitch Deck Modal */}
      {showPitchModal && selectedPartnerForPitch && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="max-w-xl w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPartnerForPitch.logo}</span>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {selectedPartnerForPitch.company} Sponsorship Proposal
                  </h3>
                  <span className="text-xs text-indigo-400 font-semibold">
                    {selectedPartnerForPitch.tier} • ${selectedPartnerForPitch.dealValue.toLocaleString()} ARR
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPitchModal(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
{`# CORPORATE SPONSORSHIP AGREEMENT
Party 1: ${selectedPartnerForPitch.company} (${selectedPartnerForPitch.industry})
Party 2: AetherPortfolio AI Architecture Studio

1. Scope: High-intent developer showcase across header marquee and AI agent deliverable templates.
2. Guaranteed Reach: 1.4M+ annual technical views. Target CTR: 3.4%.
3. Annual Contract: $${selectedPartnerForPitch.dealValue.toLocaleString()} (Disbursed quarterly via automated Stripe/Wire link).
4. Cancellation: 30-day mutual notice with pro-rated refund.`}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  triggerHaptic('soft');
                  playTactileSound('click');
                  navigator.clipboard.writeText(`Aether Sponsorship Deck for ${selectedPartnerForPitch.company}`);
                  setCopiedPitchModal(true);
                  setTimeout(() => setCopiedPitchModal(false), 2000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
              >
                {copiedPitchModal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitchModal ? 'Copied Deck!' : 'Copy Pitch Deck'}</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('medium');
                  setShowPitchModal(false);
                  setViewMode('studio');
                  setCurrentTab('monetization');
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20"
              >
                Open Monetization Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
