import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface OfflineBannerProps {
  isOnline: boolean;
  language: Language;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, language }) => {
  if (isOnline) return null;
  const t = translations[language];

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-amber-200 text-xs backdrop-blur-md flex items-center justify-between z-30"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>{t['nav.offline']}:</strong> You are currently working without internet connectivity.
            All client tasks, invoices, and settings are saved locally to persistent storage and will automatically synchronize upon reconnection.
          </span>
        </div>
        <span className="shrink-0 text-[11px] font-bold bg-amber-500/30 px-2 py-0.5 rounded text-amber-200">
          Local Storage Active
        </span>
      </div>
    </div>
  );
};
