import React, { useState } from 'react';
import {
  DollarSign,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  Share2,
  Send,
  AlertCircle,
  Copy,
  Check,
  Building,
  CreditCard,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Invoice, ClientProfile, Language } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';

interface BillingAndCRMProps {
  invoices: Invoice[];
  clients: ClientProfile[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  onAddClient: (client: ClientProfile) => void;
  language: Language;
}

export const BillingAndCRM: React.FC<BillingAndCRMProps> = ({
  invoices,
  clients,
  onAddInvoice,
  onUpdateInvoiceStatus,
  onAddClient,
  language,
}) => {
  const t = translations[language];

  // Active view: Invoices or Clients
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'clients'>('invoices');

  // New Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newClientName, setNewClientName] = useState(clients[0]?.name || '');
  const [newClientCompany, setNewClientCompany] = useState(clients[0]?.company || '');
  const [newItemDesc, setNewItemDesc] = useState('Full-Stack Cloud Architecture & API Milestone');
  const [newItemHours, setNewItemHours] = useState(16);
  const [newItemRate, setNewItemRate] = useState(220);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Invoice['paymentMethod']>('Stripe Instant');

  // Preview / Receipt Modal
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Financial aggregates
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices.filter((i) => i.status === 'pending').reduce((sum, i) => sum + i.total, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('heavy');
    playTactileSound('cash');

    const subtotal = newItemHours * newItemRate;
    const taxRate = 0.08;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const newInv: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newClientName,
      clientCompany: newClientCompany,
      clientEmail: `${newClientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      items: [
        {
          id: 'item-' + Date.now(),
          description: newItemDesc,
          hours: newItemHours,
          rate: newItemRate,
          amount: subtotal,
        },
      ],
      taxRate,
      subtotal,
      taxAmount,
      total,
      status: 'pending',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      paymentMethod: newPaymentMethod,
      notes: 'Automated milestone disbursement via Aether AI Studio. Escrow released upon verification.',
    };

    onAddInvoice(newInv);
    setShowInvoiceModal(false);
  };

  const handleCopyPaymentLink = (invoice: Invoice) => {
    triggerHaptic('soft');
    playTactileSound('click');
    const dummyLink = `https://pay.aether.studio/checkout/${invoice.id}?amt=${invoice.total}&cur=usd`;
    navigator.clipboard.writeText(dummyLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Automated Financial Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {t['billing.title']}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t['billing.desc']}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Collected</span>
            <strong className="text-lg font-black text-emerald-400 font-mono">
              ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </strong>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Awaiting Settlement</span>
            <strong className="text-lg font-black text-amber-400 font-mono">
              ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>
      </div>

      {/* Sub Tabs: Invoices vs Client Pipeline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              triggerHaptic('soft');
              setActiveSubTab('invoices');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'invoices'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t['billing.invoices']} ({invoices.length})</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('soft');
              setActiveSubTab('clients');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'clients'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t['billing.clients']} ({clients.length})</span>
          </button>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            setShowInvoiceModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>{t['billing.newInvoice']}</span>
        </button>
      </div>

      {/* TAB 1: Invoices Ledger */}
      {activeSubTab === 'invoices' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client & Company</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Rail</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{inv.clientName}</div>
                      <div className="text-[11px] text-slate-400">{inv.clientCompany}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-sm text-white">
                      ${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {inv.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {inv.status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{inv.status.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {inv.status === 'pending' && (
                          <button
                            onClick={() => {
                              triggerHaptic('heavy');
                              playTactileSound('cash');
                              onUpdateInvoiceStatus(inv.id, 'paid');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-colors"
                            title="Mark as Paid"
                          >
                            Mark Paid
                          </button>
                        )}

                        <button
                          onClick={() => handleCopyPaymentLink(inv)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Copy Direct Payment Link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            triggerHaptic('soft');
                            setPreviewInvoice(inv);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="View Invoice Receipt"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Clients Pipeline CRM */}
      {activeSubTab === 'clients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clients.map((cli) => (
            <div
              key={cli.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={cli.avatar}
                    alt={cli.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{cli.name}</h3>
                    <p className="text-xs text-slate-400">{cli.company}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Relationship Tier:</span>
                    <span className="font-bold text-cyan-300">{cli.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Spend (LTV):</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      ${cli.totalSpend.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Commissions:</span>
                    <span className="font-bold text-white">{cli.activeTasks}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    triggerHaptic('soft');
                    setNewClientName(cli.name);
                    setNewClientCompany(cli.company);
                    setShowInvoiceModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Generate Invoice for {cli.name.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Creation Modal */}
      {showInvoiceModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="max-w-lg w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Generate Automated Milestone Invoice</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Deliverable Line Item Description
                </label>
                <input
                  type="text"
                  required
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Hours / Units
                  </label>
                  <input
                    type="number"
                    value={newItemHours}
                    onChange={(e) => setNewItemHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    value={newItemRate}
                    onChange={(e) => setNewItemRate(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Payment Rail
                  </label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Stripe Instant">Stripe</option>
                    <option value="USDC Crypto">USDC</option>
                    <option value="Wire Transfer">Wire</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400">Total with 8% Tax:</span>
                <strong className="text-base text-emerald-400 font-mono">
                  ${(newItemHours * newItemRate * 1.08).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </strong>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Issue and Generate Payment Link
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Preview Modal */}
      {previewInvoice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="max-w-xl w-full rounded-3xl bg-white text-slate-900 p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Aether<span className="text-cyan-600">AI Studio</span>
                </h3>
                <p className="text-xs text-slate-500">Autonomous Architecture & Monetization</p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-bold text-slate-400 block">INVOICE</span>
                <strong className="font-mono text-sm text-slate-900">{previewInvoice.invoiceNumber}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Billed To:</span>
                <strong className="text-slate-800 block text-sm">{previewInvoice.clientName}</strong>
                <span className="text-slate-600">{previewInvoice.clientCompany}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Issued: {previewInvoice.issuedDate}</span>
                <span className="text-slate-400 block">Due: {previewInvoice.dueDate}</span>
                <span className="font-bold text-cyan-600 block mt-1">{previewInvoice.paymentMethod}</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-center">Hours</th>
                    <th className="p-2.5 text-right">Rate</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-medium">{item.description}</td>
                      <td className="p-2.5 text-center">{item.hours}</td>
                      <td className="p-2.5 text-right">${item.rate}</td>
                      <td className="p-2.5 text-right font-mono font-bold">${item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-slate-500">Status: <strong className="uppercase text-emerald-600">{previewInvoice.status}</strong></span>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Due:</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  ${previewInvoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={() => setPreviewInvoice(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
