import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Check,
  Star,
  ExternalLink,
  Code2,
  DollarSign,
  Send,
  Building,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ProjectShowcase, CorporatePartner, Language, TaskItem } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';

interface PublicPortfolioProps {
  projects: ProjectShowcase[];
  partners: CorporatePartner[];
  language: Language;
  onHireSubmit: (taskData: Partial<TaskItem>) => void;
  onSwitchToStudio: () => void;
  onOpenPitchModal: (partner?: CorporatePartner) => void;
  onOpenCalculatorInvoice: (calculatedTotal: number, selectedServices: string[]) => void;
}

export const PublicPortfolio: React.FC<PublicPortfolioProps> = ({
  projects,
  partners,
  language,
  onHireSubmit,
  onSwitchToStudio,
  onOpenPitchModal,
  onOpenCalculatorInvoice,
}) => {
  const t = translations[language];

  // Pricing calculator state
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Full-Stack Architecture & API Core',
    'Automated Billing & Stripe Webhook Integration',
  ]);
  const [timelineUrgency, setTimelineUrgency] = useState<'standard' | 'express' | 'urgent'>('standard');
  const [hasSponsorshipSlot, setHasSponsorshipSlot] = useState(true);

  // Contact form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectBudget, setProjectBudget] = useState('5000');
  const [projectDetails, setProjectDetails] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Active project demo modal
  const [activeDemo, setActiveDemo] = useState<ProjectShowcase | null>(null);

  const serviceOptions = [
    { id: 'Full-Stack Architecture & API Core', price: 4200, icon: Layers },
    { id: 'Automated Billing & Stripe Webhook Integration', price: 2800, icon: DollarSign },
    { id: 'Autonomous AI Agent & LLM Workflow Mesh', price: 4800, icon: Sparkles },
    { id: 'Zero-Trust RBAC & Cryptographic Security Audit', price: 3200, icon: ShieldCheck },
    { id: 'WebGL / Three.js 3D Interactive Visualizer', price: 3600, icon: Code2 },
  ];

  // Calculate pricing
  const basePrice = selectedServices.reduce((sum, sId) => {
    const s = serviceOptions.find((opt) => opt.id === sId);
    return sum + (s ? s.price : 0);
  }, 0);

  const urgencyMultiplier = timelineUrgency === 'urgent' ? 1.35 : timelineUrgency === 'express' ? 1.15 : 1.0;
  const sponsorshipDiscount = hasSponsorshipSlot ? 0.9 : 1.0; // 10% discount if co-sponsored with portfolio ad
  const calculatedTotal = Math.round(basePrice * urgencyMultiplier * sponsorshipDiscount);

  const toggleService = (serviceId: string) => {
    triggerHaptic('soft');
    playTactileSound('click');
    if (selectedServices.includes(serviceId)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== serviceId));
      }
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !clientName) return;

    triggerHaptic('heavy');
    playTactileSound('cash');

    onHireSubmit({
      title: projectTitle,
      clientName: clientName,
      clientCompany: clientName + ' Ventures',
      category: 'fullstack',
      payout: parseInt(projectBudget, 10) || 4500,
      prompt: projectDetails || `Client request: ${projectTitle}`,
      priority: 'high',
    });

    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 5000);
    setProjectTitle('');
    setProjectDetails('');
  };

  return (
    <div className="space-y-24 py-8">
      {/* Top Programmatic Ad Banner Simulation (Monetization Engine) */}
      <section aria-label="Sponsored Technology Banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Sponsor Network
            </span>
            <p className="text-xs text-slate-300">
              ⚡ Accelerated with <span className="font-bold text-white">Supabase Cloud</span> &{' '}
              <span className="font-bold text-white">Cloudflare Edge</span>. Monetized via programmatic tech slots.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs shrink-0">
            <span className="text-slate-400 text-[11px]">
              eCPM: <strong className="text-emerald-400">$18.50</strong> • Today: <strong className="text-cyan-400">+$48.20</strong>
            </span>
            <button
              onClick={() => {
                triggerHaptic('soft');
                onOpenPitchModal();
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
            >
              Advertise Here <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section aria-label="Hero Introduction" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Availability Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{t['hero.badge']}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            High-Converting Platforms.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              AI-Managed Velocity.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {t['hero.subtitle']}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#contact-section"
              onClick={() => {
                triggerHaptic('medium');
                playTactileSound('click');
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>{t['hero.cta.hire']}</span>
            </a>

            <a
              href="#pricing-calculator"
              onClick={() => {
                triggerHaptic('soft');
                playTactileSound('click');
              }}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span>{t['hero.cta.calculate']}</span>
            </a>

            <button
              onClick={() => {
                triggerHaptic('soft');
                playTactileSound('click');
                onSwitchToStudio();
              }}
              className="px-5 py-3.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Open AI Task Console</span>
            </button>
          </div>

          {/* Verified Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-xs text-slate-400 font-medium block">{t['hero.stat.earnings']}</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 block">
                $148,920+
              </span>
              <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> 100% verified settlement
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-xs text-slate-400 font-medium block">{t['hero.stat.rating']}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">4.98</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-xs text-slate-400 font-medium block">{t['hero.stat.turnaround']}</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1 block">
                4.2 Hours
              </span>
              <span className="text-[11px] text-slate-500 mt-1">vs 48h traditional agency</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <span className="text-xs text-slate-400 font-medium block">Autonomous QA Defect Rate</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1 block">
                0.00%
              </span>
              <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400" /> Strict type & lint guards
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section aria-label="Portfolio Work" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">
              {t['portfolio.projects']}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Production Architecture & ROI Case Studies
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Every project delivered with complete source code, automated test harnesses, and measurable client revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  {project.category}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                  {project.earningsGenerated}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">ROI</span>
                    <span className="text-xs font-bold text-white">{project.metrics.roi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Speedup</span>
                    <span className="text-xs font-bold text-cyan-400">{project.metrics.speedup}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Reliability</span>
                    <span className="text-xs font-bold text-emerald-400">{project.metrics.uptime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Client: <strong className="text-slate-200">{project.client}</strong>
                  </span>
                  <button
                    onClick={() => {
                      triggerHaptic('soft');
                      setActiveDemo(project);
                    }}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    View Case Study <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Scope & Pricing Calculator */}
      <section
        id="pricing-calculator"
        aria-label="Interactive Pricing Calculator"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <DollarSign className="w-72 h-72 text-cyan-400" />
          </div>

          <div className="max-w-3xl">
            <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">
              {t['portfolio.calculator']}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Select Your Scope & Generate an Automated Quote
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Transparent, fixed milestone billing. Zero surprise overages. Fully managed by our autonomous AI task assistant.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* Service Selection List */}
            <div className="lg:col-span-7 space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                1. Select Architecture Modules Needed:
              </label>

              {serviceOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedServices.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleService(opt.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center border text-xs ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                            : 'border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="text-sm font-semibold">{opt.id}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-cyan-300 shrink-0">
                      ${opt.price.toLocaleString()}
                    </span>
                  </div>
                );
              })}

              {/* Delivery Speed / Urgency */}
              <div className="pt-4">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  2. Delivery Velocity Guarantee:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'standard', label: 'Standard (7-10 Days)', mult: '1.0x' },
                    { id: 'express', label: 'Express (72h AI Sprint)', mult: '1.15x' },
                    { id: 'urgent', label: 'Urgent (24h Autonomous)', mult: '1.35x' },
                  ].map((speed) => (
                    <button
                      key={speed.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('soft');
                        setTimelineUrgency(speed.id as any);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        timelineUrgency === speed.id
                          ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>{speed.label}</div>
                      <span className="text-[10px] text-slate-500">{speed.mult} rate</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Co-Sponsorship Placement Option */}
              <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sponsor-checkbox"
                    checked={hasSponsorshipSlot}
                    onChange={(e) => {
                      triggerHaptic('soft');
                      setHasSponsorshipSlot(e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="sponsor-checkbox" className="text-xs text-slate-300">
                    Feature project in Aether Portfolio Marquee (10% partner discount applied)
                  </label>
                </div>
                <span className="text-xs font-bold text-emerald-400">-10% Save</span>
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    Instant Milestone Estimate
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                    Verified Scope
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Selected Modules ({selectedServices.length}):</span>
                    <span>${basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Velocity Factor:</span>
                    <span>{timelineUrgency.toUpperCase()} ({urgencyMultiplier}x)</span>
                  </div>
                  {hasSponsorshipSlot && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Co-Sponsorship Partner Credit:</span>
                      <span>-10%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Tax (Zero on export):</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Guaranteed Payout:</span>
                  <div className="text-3xl sm:text-4xl font-black text-cyan-400 mt-1">
                    ${calculatedTotal.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Escrow protected • Automated milestone release upon verification
                  </span>
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <button
                  onClick={() => {
                    triggerHaptic('heavy');
                    playTactileSound('cash');
                    onOpenCalculatorInvoice(calculatedTotal, selectedServices);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-slate-950" />
                  <span>Generate Automated Invoice & Agreement</span>
                </button>

                <p className="text-[11px] text-slate-500 text-center">
                  Instant Stripe, Crypto (USDC), or Wire payment link generated immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Partnerships Portal */}
      <section aria-label="Corporate Partnerships" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">
            {t['portfolio.partners']}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Corporate Technology Partnerships & Brand Sponsors
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Reach 140,000+ technical founders, senior engineering leads, and cloud architects monthly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl">
                    {partner.logo}
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {partner.tier}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-3">{partner.company}</h3>
                <p className="text-xs text-slate-400">{partner.industry}</p>

                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-slate-500">Deliverables:</span>
                  {partner.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Annual Contract</span>
                  <span className="text-sm font-extrabold text-emerald-400">
                    ${partner.dealValue.toLocaleString()} / yr
                  </span>
                </div>
                <button
                  onClick={() => {
                    triggerHaptic('soft');
                    onOpenPitchModal(partner);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
                >
                  View Agreement
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sponsor Pitch Generator Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-base">Want to sponsor or partner with Aether?</h4>
            <p className="text-xs text-slate-400 mt-1">
              Generate an instant customized corporate pitch deck tailored to your product stack.
            </p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              playTactileSound('click');
              onOpenPitchModal();
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Custom Sponsor Pitch Deck</span>
          </button>
        </div>
      </section>

      {/* Client Testimonials */}
      <section aria-label="Client Testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">
            {t['portfolio.reviews']}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Endorsed by Technical Executives & Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah Jenkins',
              role: 'VP of Engineering, TechCorp Global',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
              text: 'Aether built our zero-trust auth system in 48 hours. What impressed us most was the zero-defect test suite and automated milestone billing. Flawless execution.',
              rating: 5,
            },
            {
              name: 'Marcus Vance',
              role: 'CTO, SaaS Rocket Ltd',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
              text: 'The autonomous AI agent diagnosed and rectified a silent payment drop issue that cost us $40k/month. Worth every single penny of our retainer.',
              rating: 5,
            },
            {
              name: 'Elena Rostova',
              role: 'Head of Partnerships, Apex Cloud',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              text: 'Our corporate sponsorship returned 8x in qualified enterprise developer pipeline within the first quarter. Truly the premier technical showcase in the ecosystem.',
              rating: 5,
            },
          ].map((review, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, r) => (
                    <Star key={r} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{review.name}</h4>
                  <p className="text-[11px] text-slate-400">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hire & Project Submission Section */}
      <section
        id="contact-section"
        aria-label="Direct Hire and Project Commission"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl relative">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Autonomous Commission
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Commission a Project or Retainer
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Submit your project specifications directly to the AI Assistant. It will immediately analyze requirements, generate a scope breakdown, and begin execution upon verification.
            </p>
          </div>

          {submittedSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                Task received! Queued into the AI Autonomous Task Engine. Switching to Studio view to track live execution...
              </span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Your Full Name / Company
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. David Sterling (Sterling Health)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="david@sterlinghealth.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Project Title / Mission Goal
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Distributed WebSocket Messaging Core"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Allocated Budget (USD)
                </label>
                <select
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="3500">$3,500 - Rapid Sprint</option>
                  <option value="5000">$5,000 - Core Architecture</option>
                  <option value="9500">$9,500 - Full-Stack Enterprise</option>
                  <option value="18000">$18,000 - Corporate Retainer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Technical Specifications & Requirements
              </label>
              <textarea
                rows={3}
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                placeholder="Include details regarding required tech stack, authentication, cloud services, and expected delivery dates..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>Submit Task to AI Assistant & Generate Milestone Invoice</span>
            </button>
          </form>
        </div>
      </section>

      {/* Case Study Modal */}
      {activeDemo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="max-w-2xl w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase">Case Study In-Depth</span>
                <h3 className="text-xl font-bold text-white mt-1">{activeDemo.title}</h3>
                <p className="text-xs text-slate-400">{activeDemo.tagline}</p>
              </div>
              <button
                onClick={() => setActiveDemo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close Case Study"
              >
                ✕
              </button>
            </div>

            <img
              src={activeDemo.image}
              alt={activeDemo.title}
              className="w-full h-56 object-cover rounded-xl border border-slate-800"
            />

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeDemo.description} Engineered with strict zero-defect standards, multi-tenant database partitions, and enterprise SLA observability.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Verified Revenue / ROI:</span>
                <strong className="text-emerald-400 text-sm">{activeDemo.earningsGenerated}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Client:</span>
                <strong className="text-white text-sm">{activeDemo.client}</strong>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('soft');
                  setActiveDemo(null);
                  const el = document.getElementById('contact-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Commission Similar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
