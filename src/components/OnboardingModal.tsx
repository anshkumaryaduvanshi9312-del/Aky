import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Bot,
  DollarSign,
  FileCheck2,
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to AetherPortfolio AI',
      subtitle: 'The autonomous monetization & engineering studio',
      icon: Globe,
      color: 'text-cyan-400',
      description:
        'Aether is an end-to-end platform combining a client-facing portfolio that commands high-ticket rates ($4.5k+ average deal) with an autonomous AI execution engine that delivers verified software deliverables.',
    },
    {
      title: 'Autonomous AI Task & Debugging Assistant',
      subtitle: 'Continuous task execution with zero defects',
      icon: Bot,
      color: 'text-indigo-400',
      description:
        'Assign any complex specification. The AI decomposes requirements, writes strictly typed code, runs automated test suites (100% pass guarantee), and auto-fixes runtime anomalies before client handover.',
    },
    {
      title: 'Programmatic Ads & Corporate Partnerships',
      subtitle: 'Diversified passive & enterprise revenue streams',
      icon: DollarSign,
      color: 'text-emerald-400',
      description:
        'Monetize your technical audience through integrated tech stack ad units (eCPM $18.40) and high-value corporate brand sponsorships ($78,000+ ARR with automated pitch generation).',
    },
    {
      title: 'Automated Milestone Billing & Client CRM',
      subtitle: 'Instant payments via Stripe, USDC, and Wire',
      icon: FileCheck2,
      color: 'text-teal-400',
      description:
        'Manage enterprise clients through a unified pipeline. Generate automated milestone invoices with tax calculation, escrow milestones, and 1-click shareable checkout links.',
    },
    {
      title: 'Zero-Knowledge Security Vault & Offline PWA',
      subtitle: 'AES-GCM encryption & offline resilience',
      icon: Shield,
      color: 'text-purple-400',
      description:
        'All client contracts and financial records can be encrypted with client-side 256-bit AES-GCM. Plus, full offline PWA support ensures you can review and draft tasks even without network access.',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    triggerHaptic('soft');
    playTactileSound('click');
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    triggerHaptic('soft');
    playTactileSound('click');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    triggerHaptic('heavy');
    playTactileSound('success');
    localStorage.setItem('aether_onboarding_completed', 'true');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-step-title"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header with Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Interactive Guide
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="text-xs text-slate-400 hover:text-white font-semibold underline"
          >
            {t['tour.skip']}
          </button>
        </div>

        {/* Step Visual & Content */}
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto shadow-inner">
            <StepIcon className={`w-8 h-8 ${step.color}`} />
          </div>

          <div className="space-y-1">
            <h2 id="onboarding-step-title" className="text-xl font-black text-white">
              {step.title}
            </h2>
            <p className="text-xs font-semibold text-cyan-400">{step.subtitle}</p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {step.description}
          </p>
        </div>

        {/* Dots progress indicator */}
        <div className="flex justify-center items-center gap-1.5 pt-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-6 bg-cyan-400' : 'w-1.5 bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t['tour.prev']}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
          >
            <span>{currentStep === steps.length - 1 ? t['tour.finish'] : t['tour.next']}</span>
            {currentStep === steps.length - 1 ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
