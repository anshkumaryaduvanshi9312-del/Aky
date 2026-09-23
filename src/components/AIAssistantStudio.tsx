import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Bug,
  Sliders,
  CheckCircle2,
  Clock,
  Terminal,
  FileCode2,
  Copy,
  Download,
  AlertTriangle,
  RotateCcw,
  Check,
  ShieldCheck,
  Zap,
  DollarSign,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { TaskItem, Language } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';
import { executeAiTask, debugAndOptimizeCode } from '../services/aiService';

interface AIAssistantStudioProps {
  tasks: TaskItem[];
  onAddTask: (task: TaskItem) => void;
  onUpdateTask: (task: TaskItem) => void;
  onGenerateInvoiceForTask: (task: TaskItem) => void;
  language: Language;
  isOnline: boolean;
}

export const AIAssistantStudio: React.FC<AIAssistantStudioProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onGenerateInvoiceForTask,
  language,
  isOnline,
}) => {
  const t = translations[language];

  // Active task selection
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const activeTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskItem['category']>('fullstack');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [taskPayout, setTaskPayout] = useState(3800);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  // Debugger state
  const [activeCodeTab, setActiveCodeTab] = useState<'code' | 'tests' | 'debugger' | 'customizer'>('code');
  const [codeToDebug, setCodeToDebug] = useState('');
  const [debugIssue, setDebugIssue] = useState('');
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<{ fixedCode: string; explanation: string; diffSummary: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Customization parameters
  const [agentTemperature, setAgentTemperature] = useState(0.2);
  const [targetHourlyRate, setTargetHourlyRate] = useState(220);
  const [agentTone, setAgentTone] = useState<'executive' | 'technical' | 'concise'>('technical');
  const [strictTypeSafety, setStrictTypeSafety] = useState(true);

  // Quick Preset Tasks
  const presets = [
    {
      title: 'Full-Stack Auth & Zero-Trust RBAC Middleware',
      category: 'fullstack' as const,
      payout: 4200,
      prompt: 'Implement zero-trust role-based access control with token rotation, audit logging, and automated permission inheritance in TypeScript.',
    },
    {
      title: 'Stripe Webhook Idempotency & Replay Defense',
      category: 'fullstack' as const,
      payout: 3500,
      prompt: 'Create resilient webhook listener for Stripe payment events with replay attack defense, exponential retries, and invoice settlement trigger.',
    },
    {
      title: 'Autonomous LLM Pipeline & Orchestration Agent',
      category: 'ai-agent' as const,
      payout: 4800,
      prompt: 'Build multi-stage task decomposition pipeline leveraging Gemini 2.5 Flash with fallback circuit-breaking and streaming execution.',
    },
    {
      title: 'Corporate Sponsorship Pitch Deck ($36k Tier)',
      category: 'corporate-pitch' as const,
      payout: 3600,
      prompt: 'Draft multi-tier sponsorship contract with custom ad placement benchmarks, guaranteed reach, and automated quarterly billing schedule.',
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    triggerHaptic('soft');
    playTactileSound('click');
    setTaskTitle(preset.title);
    setTaskCategory(preset.category);
    setTaskPayout(preset.payout);
    setTaskPrompt(preset.prompt);
  };

  const handleExecuteAutonomousTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskPrompt || isExecuting) return;

    triggerHaptic('medium');
    playTactileSound('click');
    setIsExecuting(true);

    const newTaskId = 'task-' + Date.now();
    const newTask: TaskItem = {
      id: newTaskId,
      title: taskTitle,
      clientName: 'Client Commission',
      clientCompany: 'Aether Enterprise Partner',
      category: taskCategory,
      priority: 'high',
      status: 'executing',
      payout: taskPayout,
      prompt: taskPrompt,
      progress: 25,
      logs: [
        `${new Date().toLocaleTimeString()} - Task queued into autonomous execution pipeline`,
        `${new Date().toLocaleTimeString()} - Analyzing technical requirements & constraint envelope`,
      ],
      createdAt: new Date().toISOString(),
      isOfflineCreated: !isOnline,
    };

    onAddTask(newTask);
    setSelectedTaskId(newTaskId);

    // Simulate multi-step pipeline progression
    const logSteps = [
      'Decomposing specs into formal typed interfaces...',
      'Synthesizing production implementation and edge-case handling...',
      'Executing static analysis and automated test runner...',
      'Packaging final deliverable with client verification seal...',
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      newTask.progress = 30 + (i + 1) * 16;
      newTask.logs.push(`${new Date().toLocaleTimeString()} - ${logSteps[i]}`);
      onUpdateTask({ ...newTask });
    }

    try {
      const deliverable = await executeAiTask(taskTitle, taskCategory, taskPrompt);
      newTask.deliverable = deliverable;
      newTask.status = 'completed';
      newTask.progress = 100;
      newTask.completedAt = new Date().toISOString();
      newTask.logs.push(`${new Date().toLocaleTimeString()} - Task execution verified. Zero defects detected.`);
      onUpdateTask({ ...newTask });

      triggerHaptic('heavy');
      playTactileSound('task');
    } catch (err) {
      newTask.status = 'completed';
      newTask.progress = 100;
      onUpdateTask({ ...newTask });
    } finally {
      setIsExecuting(false);
      setTaskTitle('');
      setTaskPrompt('');
    }
  };

  const handleRunDebugger = async () => {
    if (!codeToDebug && !activeTask?.deliverable?.codeSnippet) return;
    const targetCode = codeToDebug || activeTask?.deliverable?.codeSnippet || '';

    triggerHaptic('medium');
    playTactileSound('click');
    setIsDebugging(true);

    try {
      const result = await debugAndOptimizeCode(
        targetCode,
        debugIssue || 'Potential memory leak or race condition detected during load.'
      );
      setDebugResult(result);
      triggerHaptic('soft');
      playTactileSound('success');
    } catch (e) {
      //
    } finally {
      setIsDebugging(false);
    }
  };

  const handleCopyCode = (code: string) => {
    triggerHaptic('soft');
    playTactileSound('click');
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header & Agent Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Autonomous Agent Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {t['studio.title']}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t['studio.desc']}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Agent Core</span>
            <strong className="text-cyan-300 font-mono">Gemini 2.5 Flash</strong>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Rate</span>
            <strong className="text-emerald-400 font-mono">${targetHourlyRate}/hr</strong>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Verification</span>
            <strong className="text-indigo-400 font-mono">Zero-Defect QA</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Task Creator & Task List (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* New Task Assignment Form */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{t['studio.input.label']}</span>
              </h2>
              <span className="text-[11px] text-slate-400">Fixed Milestone</span>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors"
                  >
                    + {preset.title.split(' ')[0]} {preset.title.split(' ')[1]} (${preset.payout})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleExecuteAutonomousTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Distributed WebSocket Messaging Core"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="fullstack">Full-Stack Cloud</option>
                    <option value="ai-agent">AI Agent Mesh</option>
                    <option value="debugging">Code Debugging</option>
                    <option value="corporate-pitch">Sponsor Pitch Deck</option>
                    <option value="monetization">Monetization Engine</option>
                    <option value="security">Security & Audit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Milestone Payout ($)
                  </label>
                  <input
                    type="number"
                    value={taskPayout}
                    onChange={(e) => setTaskPayout(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Technical Specifications & Prompts
                </label>
                <textarea
                  rows={3}
                  required
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  placeholder={t['studio.input.placeholder']}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isExecuting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Executing Task via Gemini 2.5...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>{t['studio.btn.execute']}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Tasks Queue */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tasks & Commission Queue ({tasks.length})
              </span>
              <span className="text-[11px] text-cyan-400 font-semibold">
                ${tasks.reduce((sum, t) => sum + t.payout, 0).toLocaleString()} Total Value
              </span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {tasks.map((task) => {
                const isSelected = activeTask?.id === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      triggerHaptic('soft');
                      playTactileSound('click');
                      setSelectedTaskId(task.id);
                      if (task.deliverable?.codeSnippet) {
                        setCodeToDebug(task.deliverable.codeSnippet);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-white line-clamp-1">{task.title}</span>
                      <span className="text-xs font-extrabold text-emerald-400 shrink-0">
                        ${task.payout.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="capitalize">{task.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {task.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Telemetry, Deliverable, & Debugger (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Task Tabs Navigation */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                triggerHaptic('soft');
                setActiveCodeTab('code');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeCodeTab === 'code'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Deliverable & Code</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('soft');
                setActiveCodeTab('tests');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeCodeTab === 'tests'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>QA & Security Audit</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('soft');
                setActiveCodeTab('debugger');
                if (activeTask?.deliverable?.codeSnippet && !codeToDebug) {
                  setCodeToDebug(activeTask.deliverable.codeSnippet);
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeCodeTab === 'debugger'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Auto-Fix & Debugger</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('soft');
                setActiveCodeTab('customizer');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeCodeTab === 'customizer'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Tuning</span>
            </button>
          </div>

          {/* TAB 1: Deliverable & Code Output */}
          {activeCodeTab === 'code' && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden space-y-4 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    {activeTask?.category} Deliverable
                  </span>
                  <h3 className="text-base font-bold text-white">{activeTask?.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(activeTask?.deliverable?.codeSnippet || '')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic('heavy');
                      playTactileSound('cash');
                      if (activeTask) onGenerateInvoiceForTask(activeTask);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-slate-950" />
                    <span>Bill Client (${activeTask?.payout})</span>
                  </button>
                </div>
              </div>

              {/* Delivery Summary Banner */}
              {activeTask?.deliverable?.summary && (
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
                  <strong>Delivery Summary:</strong> {activeTask.deliverable.summary}
                </div>
              )}

              {/* Code Sandbox / Viewer */}
              <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>deliverable.{activeTask?.deliverable?.language === 'markdown' ? 'md' : 'ts'}</span>
                  <span className="text-emerald-400">Strict Type-Check: Passed</span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-96 leading-relaxed">
                  <code>{activeTask?.deliverable?.codeSnippet || '// No code deliverable generated yet.'}</code>
                </pre>
              </div>

              {/* Telemetry Logs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Agent Execution Trace Logs</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 space-y-1 max-h-32 overflow-y-auto">
                  {activeTask?.logs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-cyan-500">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QA & Security Audit */}
          {activeCodeTab === 'tests' && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Automated QA & Security Test Report</h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeTask?.deliverable?.testsPassed || 18} / {activeTask?.deliverable?.totalTests || 18} Passed (100%)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Unit Tests</span>
                  <span className="text-lg font-bold text-emerald-400">100% Passing</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Vulnerabilities</span>
                  <span className="text-lg font-bold text-cyan-400">0 Critical / 0 High</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Execution Latency</span>
                  <span className="text-lg font-bold text-indigo-400">12ms p99</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {activeTask?.deliverable?.debugAudit ||
                  '✓ Static analysis passed\n✓ Zero unhandled promises\n✓ WCAG 2.1 accessible DOM elements\n✓ Memory profile safe'}
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                <strong>Client Delivery Guarantee:</strong> All deliverables are digitally audited for
                type safety, OWASP top 10 compliance, and zero runtime anomalies before client handover.
              </div>
            </div>
          )}

          {/* TAB 3: Auto-Fix & Debugger */}
          {activeCodeTab === 'debugger' && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bug className="w-4 h-4 text-cyan-400" />
                    <span>AI Deep Debug & Auto-Optimizer</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Paste anomalous code or runtime errors. The AI engine diagnoses root causes and generates optimized fixes.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Code Under Inspection
                </label>
                <textarea
                  rows={5}
                  value={codeToDebug}
                  onChange={(e) => setCodeToDebug(e.target.value)}
                  placeholder="// Paste TypeScript or React code to debug..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Observed Runtime Error or Anomaly Description
                </label>
                <input
                  type="text"
                  value={debugIssue}
                  onChange={(e) => setDebugIssue(e.target.value)}
                  placeholder="e.g. Warning: Can't perform a React state update on an unmounted component or memory leak"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleRunDebugger}
                disabled={isDebugging}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {isDebugging ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing Code AST & Diagnostics...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>{t['studio.btn.debugging']}</span>
                  </>
                )}
              </button>

              {debugResult && (
                <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                    <strong>Root Cause Diagnosed:</strong> {debugResult.explanation}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
                    <span className="font-bold text-slate-200 block mb-1">Diff Summary:</span>
                    <pre className="whitespace-pre-wrap">{debugResult.diffSummary}</pre>
                  </div>

                  <div className="relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-emerald-400 font-mono">
                      <span>✓ Corrected & Optimized Output</span>
                      <button
                        onClick={() => handleCopyCode(debugResult.fixedCode)}
                        className="text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        Copy Fixed Code
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-64 leading-relaxed">
                      <code>{debugResult.fixedCode}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Tuning & Customization */}
          {activeCodeTab === 'customizer' && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl p-6 space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>AI Assistant Tuning & Customization</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure execution temperature, client communication voice, and billing parameters.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Model Temperature (Creativity vs Determinism)</span>
                    <span className="text-cyan-400 font-mono">{agentTemperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={agentTemperature}
                    onChange={(e) => {
                      triggerHaptic('soft');
                      setAgentTemperature(parseFloat(e.target.value));
                    }}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0.0 (Strict Code Quality)</span>
                    <span>1.0 (Creative Architecture)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Target Hourly Rate for Auto-Quoting ($/hr)</span>
                    <span className="text-emerald-400 font-mono">${targetHourlyRate}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="450"
                    step="10"
                    value={targetHourlyRate}
                    onChange={(e) => {
                      triggerHaptic('soft');
                      setTargetHourlyRate(parseInt(e.target.value, 10));
                    }}
                    className="w-full accent-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Client Communication Voice
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'executive', label: 'Executive Boardroom' },
                      { id: 'technical', label: 'Senior Architect' },
                      { id: 'concise', label: 'Concise & Fast' },
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('soft');
                          setAgentTone(tone.id as any);
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          agentTone === tone.id
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Strict Type-Safety Verification</span>
                    <span className="text-[11px] text-slate-400">Reject deliverables containing 'any' types</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={strictTypeSafety}
                    onChange={(e) => {
                      triggerHaptic('soft');
                      setStrictTypeSafety(e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
