import React, { useState } from 'react';
import {
  Globe,
  Bell,
  Sun,
  Moon,
  Shield,
  Wifi,
  WifiOff,
  Sparkles,
  Sliders,
  DollarSign,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Language, Theme, PushNotification } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  viewMode: 'public' | 'studio';
  onViewModeChange: (mode: 'public' | 'studio') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  isOnline: boolean;
  notifications: PushNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onOpenSettings: () => void;
  onOpenTour: () => void;
  onSendTestNotification: () => void;
  hapticsEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  isOnline,
  notifications,
  onMarkNotificationAsRead,
  onOpenSettings,
  onOpenTour,
  onSendTestNotification,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const t = translations[language];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-colors dark:bg-slate-950/90 light:bg-white/90 light:border-slate-200">
      {/* WCAG Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:font-bold focus:rounded-md focus:shadow-xl"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Online Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerHaptic('soft');
                playTactileSound('click');
                onTabChange(viewMode === 'public' ? 'portfolio' : 'studio');
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
              aria-label="Aether AI Studio Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-xl tracking-tighter group-hover:scale-105 transition-transform">
                Æ
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-slate-100 text-lg sm:text-xl light:text-slate-900">
                    Aether<span className="text-cyan-400">Portfolio</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    AI Autonomous
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 light:text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    {isOnline ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <Wifi className="w-3 h-3 text-emerald-400" />
                        <span className="text-[11px] text-emerald-400 font-medium">
                          {t['nav.online']}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <WifiOff className="w-3 h-3 text-amber-400" />
                        <span className="text-[11px] text-amber-400 font-medium">
                          {t['nav.offline']}
                        </span>
                      </>
                    )}
                  </span>
                  <span className="hidden md:inline text-slate-600">|</span>
                  <span className="hidden md:inline text-slate-400">
                    $148,920 earned YTD
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* View Mode Toggle: Public Portfolio vs Executive Studio */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 light:bg-slate-100 light:border-slate-300">
            <button
              onClick={() => {
                triggerHaptic('soft');
                playTactileSound('click');
                onViewModeChange('public');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'public'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:text-slate-600'
              }`}
              aria-pressed={viewMode === 'public'}
            >
              🌐 {t['nav.portfolio']}
            </button>
            <button
              onClick={() => {
                triggerHaptic('soft');
                playTactileSound('click');
                onViewModeChange('studio');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'studio'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 light:text-slate-600'
              }`}
              aria-pressed={viewMode === 'studio'}
            >
              ⚡ {t['nav.studio']} (Manager)
            </button>
          </div>

          {/* Right Action Icons: Language, Notifications, Theme, Settings, Quick Hire */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Guided Tour Launcher */}
            <button
              onClick={() => {
                triggerHaptic('soft');
                playTactileSound('click');
                onOpenTour();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 text-xs font-semibold transition-colors focus:ring-2 focus:ring-indigo-400"
              title="Launch interactive tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tour</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  triggerHaptic('soft');
                  setShowLangMenu(!showLangMenu);
                }}
                className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 light:bg-slate-100 light:border-slate-200 light:text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
                aria-label="Select Language"
                aria-expanded={showLangMenu}
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="uppercase text-[11px] font-bold">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95"
                  role="menu"
                >
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        triggerHaptic('soft');
                        playTactileSound('click');
                        onLanguageChange(item.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                        language === item.code ? 'text-cyan-400 font-bold bg-slate-800/40' : 'text-slate-300'
                      }`}
                      role="menuitem"
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {language === item.code && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  triggerHaptic('soft');
                  setShowNotifMenu(!showNotifMenu);
                }}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 light:bg-slate-100 light:border-slate-200 light:text-slate-700 transition-colors"
                aria-label={`Notifications: ${unreadCount} unread`}
              >
                <Bell className="w-4 h-4 text-slate-300 light:text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-sm text-slate-100">Live Push Alerts</span>
                    <button
                      onClick={() => {
                        triggerHaptic('soft');
                        onSendTestNotification();
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
                    >
                      + Test Real Push
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            triggerHaptic('soft');
                            onMarkNotificationAsRead(n.id);
                          }}
                          className={`py-2.5 px-1 cursor-pointer transition-colors hover:bg-slate-800/40 rounded-lg ${
                            !n.read ? 'bg-cyan-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-500 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle (Dark/Light) */}
            <button
              onClick={() => {
                triggerHaptic('soft');
                playTactileSound('click');
                onThemeToggle();
              }}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 light:bg-slate-100 light:border-slate-200 light:text-slate-700 transition-colors"
              aria-label={`Toggle theme (currently ${theme})`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Settings & Accessibility Button */}
            <button
              onClick={() => {
                triggerHaptic('soft');
                playTactileSound('click');
                onOpenSettings();
              }}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 light:bg-slate-100 light:border-slate-200 light:text-slate-700 transition-colors"
              aria-label="Settings and Accessibility"
              title="Settings & Accessibility"
            >
              <Sliders className="w-4 h-4 text-slate-300 light:text-slate-700" />
            </button>

            {/* Primary Hire CTA Button */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                playTactileSound('cash');
                onTabChange('portfolio');
                const el = document.getElementById('contact-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-cyan-400"
            >
              <DollarSign className="w-4 h-4" />
              <span>{t['nav.hire']}</span>
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Bar when in Studio Mode */}
        {viewMode === 'studio' && (
          <nav
            aria-label="Studio Navigation"
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar text-xs"
          >
            {[
              { id: 'studio', label: t['nav.studio'], icon: Sparkles },
              { id: 'monetization', label: t['nav.monetization'], icon: DollarSign },
              { id: 'billing', label: t['nav.billing'], icon: ExternalLink },
              { id: 'analytics', label: t['nav.analytics'], icon: CheckCircle2 },
              { id: 'vault', label: t['nav.vault'], icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    triggerHaptic('soft');
                    playTactileSound('click');
                    onTabChange(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
