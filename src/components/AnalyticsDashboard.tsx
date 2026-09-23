import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Zap,
  BarChart3,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Flame,
  Activity,
  Play,
  Pause,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';

interface AnalyticsDashboardProps {
  language: Language;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ language }) => {
  const t = translations[language];

  // Real-time live earnings ticker state
  const [liveGross, setLiveGross] = useState(148920.5);
  const [isLiveTickerActive, setIsLiveTickerActive] = useState(true);
  const [microTicks, setMicroTicks] = useState(0);

  useEffect(() => {
    if (!isLiveTickerActive) return;
    const interval = setInterval(() => {
      // Simulate real-time programmatic ad impression micro-payouts
      const increment = +(Math.random() * 0.45 + 0.05).toFixed(2);
      setLiveGross((prev) => +(prev + increment).toFixed(2));
      setMicroTicks((prev) => prev + 1);
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveTickerActive]);

  const monthlyData = [
    { month: 'Apr', client: 12400, ads: 420, total: 12820 },
    { month: 'May', client: 18200, ads: 640, total: 18840 },
    { month: 'Jun', client: 24500, ads: 910, total: 25410 },
    { month: 'Jul', client: 31000, ads: 1250, total: 32250 },
    { month: 'Aug', client: 38400, ads: 1680, total: 40080 },
    { month: 'Sep', client: 42800, ads: 2150, total: 44950 },
  ];

  const maxTotal = Math.max(...monthlyData.map((d) => d.total));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Live Ticker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Financial Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {t['analytics.title']}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t['analytics.desc']}
          </p>
        </div>

        {/* Live Revenue Ticker Widget */}
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 shadow-lg text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Real-Time Gross Earnings (YTD)
              </span>
              <button
                onClick={() => {
                  triggerHaptic('soft');
                  setIsLiveTickerActive(!isLiveTickerActive);
                }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                title="Toggle Real-Time Simulation"
              >
                {isLiveTickerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isLiveTickerActive ? 'Active' : 'Paused'}</span>
              </button>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight flex items-baseline gap-1 mt-0.5">
              <span>${liveGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-xs text-emerald-500 font-bold animate-bounce">▲</span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              +$0.18/sec average velocity • {microTicks} impressions ingested
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Net Operating Margin</span>
            <span className="text-emerald-400 font-bold flex items-center">
              +4.2% <TrendingUp className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">91.4%</div>
          <p className="text-[11px] text-slate-500">
            Near-zero marginal cost of autonomous delivery.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Client Retainers & Contracts</span>
            <span className="text-cyan-400 font-bold">+18.5%</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">$133,029</div>
          <p className="text-[11px] text-slate-500">
            Across 14 recurring enterprise accounts.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Ad & Sponsorship ARR</span>
            <span className="text-indigo-400 font-bold">$78k locked</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">$81,240</div>
          <p className="text-[11px] text-slate-500">
            Carbon Ads + 3 corporate tech stack sponsors.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Autonomous Task Velocity</span>
            <span className="text-emerald-400 font-bold">11.4x Faster</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">4.2 Hours</div>
          <p className="text-[11px] text-slate-500">
            Zero defects verified across 48 automated test suites.
          </p>
        </div>
      </div>

      {/* Revenue Trajectory Chart & Stream Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Monthly Revenue Trajectory & Growth</span>
              </h2>
              <p className="text-xs text-slate-400">
                Compounded growth driven by autonomous agent scale and corporate partnerships.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span> Client Contracts
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span> Ads & Sponsors
              </span>
            </div>
          </div>

          {/* Interactive CSS Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-60 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {monthlyData.map((d) => {
                const clientHeightPct = Math.round((d.client / maxTotal) * 100);
                const adsHeightPct = Math.round((d.ads / maxTotal) * 100);

                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${(d.total / 1000).toFixed(1)}k
                    </div>

                    <div className="w-full max-w-[48px] flex flex-col justify-end h-44 rounded-t-xl overflow-hidden bg-slate-950/60 p-1">
                      <div
                        className="w-full bg-indigo-500 rounded-t transition-all group-hover:brightness-110"
                        style={{ height: `${adsHeightPct}%` }}
                        title={`Ads: $${d.ads.toLocaleString()}`}
                      ></div>
                      <div
                        className="w-full bg-cyan-500 transition-all group-hover:brightness-110 mt-0.5"
                        style={{ height: `${clientHeightPct}%` }}
                        title={`Client Work: $${d.client.toLocaleString()}`}
                      ></div>
                    </div>

                    <span className="text-xs font-bold text-slate-300">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue Streams Distribution (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Revenue Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">Diversified monetization portfolio</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                <span>Enterprise Custom Architecture</span>
                <span className="font-mono text-cyan-400">62% ($92.3k)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[62%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                <span>Corporate Tech Sponsorships</span>
                <span className="font-mono text-indigo-400">24% ($35.7k)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[24%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                <span>Programmatic Developer Ads</span>
                <span className="font-mono text-emerald-400">9% ($13.4k)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[9%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                <span>Autonomous Code Audits</span>
                <span className="font-mono text-amber-400">5% ($7.5k)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[5%]"></div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-white block">Key Takeaway:</span>
            <span>
              High developer traffic seamlessly monetizes both at the enterprise services tier ($4.5k+ average deal) and through passive programmatic ad slots.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
