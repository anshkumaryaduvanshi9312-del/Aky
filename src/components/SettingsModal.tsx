import React from 'react';
import {
  Sliders,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Vibrate,
  Bell,
  Eye,
  Type,
  Globe,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Theme, Language, HapticIntensity, TextScale } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeToggle: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  hapticIntensity: HapticIntensity;
  onHapticChange: (intensity: HapticIntensity) => void;
  audioEnabled: boolean;
  onAudioToggle: () => void;
  highContrast: boolean;
  onHighContrastToggle: () => void;
  textScale: TextScale;
  onTextScaleChange: (scale: TextScale) => void;
  pushEnabled: boolean;
  onRequestPush: () => void;
  onRestartTour: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeToggle,
  language,
  onLanguageChange,
  hapticIntensity,
  onHapticChange,
  audioEnabled,
  onAudioToggle,
  highContrast,
  onHighContrastToggle,
  textScale,
  onTextScaleChange,
  pushEnabled,
  onRequestPush,
  onRestartTour,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-dialog-title"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 id="settings-dialog-title" className="text-base font-bold text-white">
              {t['settings.title']}
            </h2>
          </div>
          <button
            onClick={() => {
              triggerHaptic('soft');
              playTactileSound('click');
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            aria-label="Close Settings"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 text-xs">
          {/* Haptic Feedback */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
              <Vibrate className="w-4 h-4 text-cyan-400" />
              <span>{t['settings.haptic']}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['off', 'soft', 'medium', 'heavy'] as HapticIntensity[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    onHapticChange(level);
                    triggerHaptic(level);
                    playTactileSound('click');
                  }}
                  className={`py-2 rounded-xl border text-center capitalize font-semibold transition-all ${
                    hapticIntensity === level
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Tactile Audio Cues */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <span className="font-semibold text-slate-200 block">{t['settings.audio']}</span>
                <span className="text-[10px] text-slate-500">Subtle Web Audio micro-chimes</span>
              </div>
            </div>
            <button
              onClick={() => {
                onAudioToggle();
                triggerHaptic('soft');
                playTactileSound('click', !audioEnabled);
              }}
              className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                audioEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
              aria-label="Toggle Audio Cues"
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  audioEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="font-semibold text-slate-200 block">{t['settings.push']}</span>
                <span className="text-[10px] text-slate-500">
                  {pushEnabled ? 'Enabled for task milestones & payouts' : 'Instant client alerts & payments'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHaptic('medium');
                onRequestPush();
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-[11px]"
            >
              {pushEnabled ? 'Active' : 'Enable'}
            </button>
          </div>

          {/* Theme & High Contrast Mode (WCAG) */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Theme & Visual Accessibility (WCAG 2.1)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('soft');
                  onThemeToggle();
                }}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 hover:border-slate-700 flex items-center justify-center gap-2"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('soft');
                  onHighContrastToggle();
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 ${
                  highContrast
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <span>Contrast: {highContrast ? 'AAA' : 'Standard'}</span>
              </button>
            </div>
          </div>

          {/* Text Size Scaler */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>{t['settings.textSize']}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { scale: 'sm' as TextScale, label: 'Default (100%)' },
                { scale: 'md' as TextScale, label: 'Comfortable (115%)' },
                { scale: 'lg' as TextScale, label: 'Large (130%)' },
              ].map((item) => (
                <button
                  key={item.scale}
                  type="button"
                  onClick={() => {
                    triggerHaptic('soft');
                    onTextScaleChange(item.scale);
                  }}
                  className={`py-2 px-1 rounded-xl border text-center font-semibold text-[11px] ${
                    textScale === item.scale
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guided Tour Launcher */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('soft');
                onClose();
                onRestartTour();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{t['settings.tour']}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
