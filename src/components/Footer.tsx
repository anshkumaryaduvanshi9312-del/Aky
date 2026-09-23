import React from 'react';
import { ShieldCheck, Heart, Sparkles, Terminal } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FooterProps {
  language: Language;
  onOpenSettings: () => void;
  onOpenTour: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenSettings, onOpenTour }) => {
  const t = translations[language];

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              Æ
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">
                AetherPortfolio <span className="text-cyan-400">AI Studio</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Autonomous Task Execution • Programmatic Monetization • Client Management
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button onClick={onOpenTour} className="hover:text-cyan-400 transition-colors">
              Product Tour
            </button>
            <button onClick={onOpenSettings} className="hover:text-cyan-400 transition-colors">
              Accessibility Settings
            </button>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WCAG 2.1 AAA Compliant</span>
            </span>
            <span className="inline-flex items-center gap-1 text-cyan-400 font-semibold">
              <span>AES-GCM Encrypted</span>
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Aether AI Architecture Studio. Engineered for high performance & reliability.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Zero-defect autonomous delivery pipeline</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
