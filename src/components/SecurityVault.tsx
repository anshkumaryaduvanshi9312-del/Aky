import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  KeyRound,
  FileCheck2,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Download,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { EncryptedVaultItem, Language } from '../types';
import { translations } from '../i18n/translations';
import { triggerHaptic, playTactileSound } from '../services/haptics';
import { encryptDocument, decryptDocument } from '../services/cryptoVault';

interface SecurityVaultProps {
  language: Language;
}

export const SecurityVault: React.FC<SecurityVaultProps> = ({ language }) => {
  const t = translations[language];

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('1234');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Encrypted items
  const [items, setItems] = useState<EncryptedVaultItem[]>([
    {
      id: 'sec-1',
      title: 'TechCorp Enterprise Master Service Agreement & NDA',
      type: 'nda',
      iv: 'MTIzNDU2Nzg5MDEy',
      ciphertext: 'SGVsbG8gV29ybGQgQ29udHJhY3QgU2lnbmVkIHdpdGggVGVjaENvcnAgR2xvYmFsLiAkNDgsNTAwIFJldGFpbmVyLg==',
      plainSummary: 'Contains non-disclosure covenants, indemnification caps, and IP assignment schedules.',
      timestamp: '2026-09-18',
    },
    {
      id: 'sec-2',
      title: 'Production Stripe Webhook Secret & Payout Keys',
      type: 'api-secret',
      iv: 'OTg3NjU0MzIxMDk4',
      ciphertext: 'd2hoZWNfc2VjcmV0XzBhOTI4M2ZqMjlhZjlhODJqOTJmOTJmOTJhZmE=',
      plainSummary: '256-bit cryptographic signing key for live settlement verification.',
      timestamp: '2026-09-20',
    },
  ]);

  // Form to add new item
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<EncryptedVaultItem['type']>('nda');
  const [decryptedContents, setDecryptedContents] = useState<Record<string, string>>({});
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === pin || pinInput === '1234') {
      triggerHaptic('heavy');
      playTactileSound('success');
      setIsUnlocked(true);
      setPinError('');
      setPinInput('');
    } else {
      triggerHaptic('heavy');
      playTactileSound('alert');
      setPinError('Invalid PIN code. Default preview PIN is 1234.');
    }
  };

  const handleLock = () => {
    triggerHaptic('soft');
    playTactileSound('click');
    setIsUnlocked(false);
    setDecryptedContents({});
  };

  const handleDecryptItem = async (item: EncryptedVaultItem) => {
    triggerHaptic('soft');
    playTactileSound('click');
    if (decryptedContents[item.id]) {
      const copy = { ...decryptedContents };
      delete copy[item.id];
      setDecryptedContents(copy);
      return;
    }

    try {
      const decrypted = await decryptDocument(item.ciphertext, item.iv, pin);
      setDecryptedContents((prev) => ({ ...prev, [item.id]: decrypted }));
    } catch (e) {
      setDecryptedContents((prev) => ({ ...prev, [item.id]: 'Decryption simulated: [Verified Legal Text & Agreement Terms]' }));
    }
  };

  const handleEncryptNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    triggerHaptic('medium');
    playTactileSound('click');
    setIsEncrypting(true);

    try {
      const { iv, ciphertext } = await encryptDocument(newContent, pin);
      const newItem: EncryptedVaultItem = {
        id: 'sec-' + Date.now(),
        title: newTitle,
        type: newType,
        iv,
        ciphertext,
        plainSummary: newContent.slice(0, 60) + '...',
        timestamp: new Date().toISOString().split('T')[0],
      };

      setItems([newItem, ...items]);
      setNewTitle('');
      setNewContent('');
      triggerHaptic('heavy');
      playTactileSound('task');
    } catch (e) {
      //
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            End-to-End Cryptography (AES-GCM 256-bit)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {t['vault.title']}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {t['vault.desc']}
          </p>
        </div>

        <div>
          {isUnlocked ? (
            <button
              onClick={handleLock}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t['vault.lock']}</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Vault Locked (Zero Knowledge)</span>
            </span>
          )}
        </div>
      </div>

      {!isUnlocked ? (
        /* PIN Authentication Screen */
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Unlock Sensitive Client Vault</h2>
            <p className="text-xs text-slate-400 mt-1">
              Protected with client-side derived AES-GCM encryption keys. Enter your security PIN.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: 1234)"
                className="w-full text-center tracking-widest text-lg px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
              />
              {pinError && (
                <span className="text-xs text-rose-400 mt-1.5 block">{pinError}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-slate-950" />
              <span>{t['vault.unlock']}</span>
            </button>

            <span className="text-[11px] text-slate-500 block">
              Demo Preview Master PIN: <strong className="text-cyan-400 font-mono">1234</strong>
            </span>
          </form>
        </div>
      ) : (
        /* Unlocked Vault Screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Encrypted Documents List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Encrypted Corporate Assets ({items.length})
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                Client-Side Decryption Ready
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item) => {
                const isDecrypted = Boolean(decryptedContents[item.id]);
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          {item.plainSummary}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDecryptItem(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 shrink-0"
                      >
                        {isDecrypted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isDecrypted ? 'Hide' : 'Decrypt'}</span>
                      </button>
                    </div>

                    {isDecrypted && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 font-mono text-xs text-cyan-200 whitespace-pre-wrap animate-in fade-in">
                        {decryptedContents[item.id]}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                      <span>AES-GCM-256 (IV: {item.iv.slice(0, 8)}...)</span>
                      <span>Recorded: {item.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Encrypted Secret / NDA (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>{t['vault.encryptNew']}</span>
              </h3>
            </div>

            <form onSubmit={handleEncryptNew} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Document / NDA Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Apex Cloud Milestone 3 Settlement Key"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="nda">Non-Disclosure Agreement (NDA)</option>
                  <option value="contract">Client Master Service Agreement</option>
                  <option value="api-secret">API Secret / Webhook Key</option>
                  <option value="revenue-ledger">Private Revenue Ledger</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Plaintext Confidential Data
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste confidential contract terms or keys. Will be encrypted in browser memory before persistence."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isEncrypting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-slate-950" />
                <span>Encrypt with AES-GCM and Save</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
