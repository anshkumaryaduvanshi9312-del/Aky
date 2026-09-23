import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Building,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Check,
  Copy,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { AdUnit, CorporatePartner, Language } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';
import { requestGeminiAi } from '../services/aiService';

interface MonetizationHubProps {
  adUnits: AdUnit[];
  partners: CorporatePartner[];
  onToggleAd: (id: string) => void;
  onAddPartner: (partner: CorporatePartner) => void;
  language: Language;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  adUnits,
  partners,
  onToggleAd,
  onAddPartner,
  language,
}) => {
  const t = translations[language];

  // Ad network aggregates
  const totalTodayAds = adUnits.reduce((acc, a) => acc + (a.enabled ? a.todayEarned : 0), 0);
  const totalLifetimeAds = adUnits.reduce((acc, a) => acc + a.totalEarned, 0);
  const totalPartnerArr = partners.reduce((acc, p) => acc + (p.status === 'Signed & Active' ? p.dealValue : 0), 0);
  const totalImpressions = adUnits.reduce((acc, a) => acc + a.impressions, 0);

  // Pitch Deck Generator State
  const [pitchCompany, setPitchCompany] = useState('');
  const [pitchIndustry, setPitchIndustry] = useState('Developer Infrastructure & Cloud');
  const [pitchTier, setPitchTier] = useState<CorporatePartner['tier']>('Platinum Founding');
  const [pitchBudget, setPitchBudget] = useState(28000);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [generatedPitch, setGeneratedPitch] = useState<string | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Traffic Estimator Slider
  const [dailyTraffic, setDailyTraffic] = useState(4500);
  const estimatedDailyAdRevenue = ((dailyTraffic * 1.8 * 18.5) / 1000).toFixed(2);
  const estimatedMonthlyAdRevenue = (parseFloat(estimatedDailyAdRevenue) * 30).toFixed(2);

  const handleGeneratePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchCompany || isGeneratingPitch) return;

    triggerHaptic('medium');
    playTactileSound('click');
    setIsGeneratingPitch(true);

    const prompt = `Generate a high-converting, professional Corporate Sponsorship & Strategic Partnership Pitch Deck for:
Target Partner: ${pitchCompany}
Industry: ${pitchIndustry}
Sponsorship Tier: ${pitchTier}
Annual Deal Value: $${pitchBudget.toLocaleString()}
Prepared by: AetherPortfolio AI Architecture Studio

Include:
1. Executive Strategic Synergy (Why Aether's 140,000+ developer audience matches their product)
2. Guaranteed Core Deliverables (Portfolio banner placement, technical deep-dive articles, sandbox integrations)
3. Quantitative Reach & Conversion Benchmarks (Impression guarantees, click-through rates)
4. Automated Milestone Billing Schedule ($${Math.round(pitchBudget / 4).toLocaleString()} quarterly)`;

    try {
      const result = await requestGeminiAi(prompt);
      if (result) {
        setGeneratedPitch(result);
      } else {
        // High quality built-in pitch
        setGeneratedPitch(`# CORPORATE SPONSORSHIP AGREEMENT & PITCH DECK
**Partner:** ${pitchCompany}
**Sponsorship Tier:** ${pitchTier} ($${pitchBudget.toLocaleString()} / Annual ARR)
**Publisher:** AetherPortfolio AI Architecture Studio

## 1. Executive Summary & Audience Alignment
AetherPortfolio hosts high-intent software engineering leads, cloud architects, and CTOs seeking enterprise-grade development patterns. Partnering with ${pitchCompany} provides authentic, deep-context developer endorsement rather than generic ad banners.

## 2. Guaranteed Strategic Placements
- Priority Leaderboard & Tech Stack Marquee (140,000+ monthly targeted views)
- Custom Interactive Sandbox demo integrated with ${pitchCompany} APIs
- 4x Technical Architecture Case Studies with source code published to GitHub
- Executive Placement in quarterly developer infrastructure briefings

## 3. Measurable ROI Metrics
- Minimum Annual Developer Impressions: 1.68 Million
- Average Target CTR: 3.4%
- Dedicated Tracking URL with UTM attribution telemetry

## 4. Automated Settlement Terms
- Quarterly billing of $${Math.round(pitchBudget / 4).toLocaleString()} via automated invoice link (Stripe / USDC)
- 30-day cancellation notice with prorated reimbursement`);
      }

      // Add to partner list as Proposal Review
      onAddPartner({
        id: 'part-' + Date.now(),
        company: pitchCompany,
        logo: '🚀',
        industry: pitchIndustry,
        dealValue: pitchBudget,
        tier: pitchTier,
        deliverables: [
          'Priority Leaderboard Placement',
          'Co-Authored Architecture Deep Dive',
          'Quarterly Performance Telemetry',
        ],
        status: 'Proposal Review',
        renewalDate: '2027-09-30',
        contactPerson: 'Strategic Alliances Team',
      });

      triggerHaptic('heavy');
      playTactileSound('cash');
    } catch (e) {
      //
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleCopyPitch = () => {
    if (!generatedPitch) return;
    triggerHaptic('soft');
    playTactileSound('click');
    navigator.clipboard.writeText(generatedPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Passive & Corporate Income Engines
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {t['monetization.title']}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t['monetization.desc']}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Today's Ad Revenue</span>
            <strong className="text-lg font-black text-emerald-400 font-mono">
              +${totalTodayAds.toFixed(2)}
            </strong>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Corporate ARR</span>
            <strong className="text-lg font-black text-cyan-400 font-mono">
              ${totalPartnerArr.toLocaleString()}
            </strong>
          </div>
        </div>
      </div>

      {/* Grid: Ad Inventory Manager & Corporate Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ad Units & Programmatic Revenue (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Programmatic Ad Inventory & eCPM Metrics</span>
              </h2>
              <span className="text-xs text-emerald-400 font-semibold">
                Network Avg eCPM: $18.40
              </span>
            </div>

            <div className="space-y-3">
              {adUnits.map((unit) => (
                <div
                  key={unit.id}
                  className={`p-4 rounded-xl border transition-all ${
                    unit.enabled
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-950/30 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{unit.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                          {unit.network}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {unit.impressions.toLocaleString()} impressions • {unit.clicks} clicks ({( (unit.clicks / unit.impressions) * 100 ).toFixed(1)}% CTR)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 block font-mono">
                          +${unit.todayEarned.toFixed(2)} today
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ${unit.totalEarned.toFixed(2)} lifetime
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          triggerHaptic('soft');
                          onToggleAd(unit.id);
                        }}
                        className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                          unit.enabled ? 'bg-cyan-500' : 'bg-slate-700'
                        }`}
                        aria-label={`Toggle ad ${unit.name}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                            unit.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Traffic & Ad Revenue Estimator */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Daily Traffic & Ad Revenue Simulator
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {dailyTraffic.toLocaleString()} daily visitors
                </span>
              </div>

              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={dailyTraffic}
                onChange={(e) => {
                  triggerHaptic('soft');
                  setDailyTraffic(parseInt(e.target.value, 10));
                }}
                className="w-full accent-cyan-400"
              />

              <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated Daily Ads</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">+${estimatedDailyAdRevenue}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated Monthly Ads</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">+${estimatedMonthlyAdRevenue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Sponsorships & Pitch Deck Generator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Partners List */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>{t['monetization.partnersTitle']}</span>
              </h2>
              <span className="text-xs font-bold text-emerald-400">
                ${totalPartnerArr.toLocaleString()} ARR
              </span>
            </div>

            <div className="space-y-3">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.logo}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.company}</h4>
                      <span className="text-[10px] text-slate-400 block">{p.tier}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">
                      ${p.dealValue.toLocaleString()}/yr
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-300 block mt-0.5">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Automated Sponsor Pitch Generator */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{t['monetization.pitchGenerator']}</span>
              </h3>
            </div>

            <form onSubmit={handleGeneratePitch} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Company / Sponsor Name
                </label>
                <input
                  type="text"
                  required
                  value={pitchCompany}
                  onChange={(e) => setPitchCompany(e.target.value)}
                  placeholder="e.g. Vercel, Supabase, Neon, Cloudflare"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Sponsor Tier
                  </label>
                  <select
                    value={pitchTier}
                    onChange={(e) => setPitchTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Platinum Founding">Platinum Founding ($28k+)</option>
                    <option value="Infrastructure Partner">Infrastructure ($36k+)</option>
                    <option value="Gold Sponsor">Gold Sponsor ($18k+)</option>
                    <option value="Ecosystem">Ecosystem Sponsor ($10k+)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Annual Value ($)
                  </label>
                  <input
                    type="number"
                    value={pitchBudget}
                    onChange={(e) => setPitchBudget(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingPitch}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingPitch ? 'Drafting with Gemini AI...' : t['monetization.pitchBtn']}</span>
              </button>
            </form>

            {generatedPitch && (
              <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">✓ Proposal Draft Ready</span>
                  <button
                    onClick={handleCopyPitch}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPitch ? 'Copied!' : 'Copy Proposal'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {generatedPitch}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
