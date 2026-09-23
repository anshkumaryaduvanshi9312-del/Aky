export type Language = 'en' | 'es' | 'de' | 'fr' | 'ja' | 'hi';

export type Theme = 'dark' | 'light';

export type HapticIntensity = 'off' | 'soft' | 'medium' | 'heavy';

export type TextScale = 'sm' | 'md' | 'lg';

export interface TaskDeliverable {
  summary: string;
  codeSnippet: string;
  language: string;
  testsPassed: number;
  totalTests: number;
  debugAudit: string;
  clientNotes: string;
}

export interface TaskItem {
  id: string;
  title: string;
  clientName: string;
  clientCompany: string;
  category: 'fullstack' | 'ai-agent' | 'debugging' | 'monetization' | 'corporate-pitch' | 'security';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'queued' | 'executing' | 'debugging' | 'completed' | 'invoiced';
  payout: number;
  prompt: string;
  progress: number;
  logs: string[];
  deliverable?: TaskDeliverable;
  createdAt: string;
  completedAt?: string;
  isOfflineCreated?: boolean;
}

export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  avatar: string;
  tier: 'Enterprise' | 'Growth' | 'Sponsor' | 'Retainer';
  totalSpend: number;
  activeTasks: number;
  status: 'active' | 'lead' | 'completed';
  rating: number;
}

export interface InvoiceItemLine {
  id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  items: InvoiceItemLine[];
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'paid' | 'pending' | 'draft';
  dueDate: string;
  issuedDate: string;
  paymentMethod: 'Stripe Instant' | 'USDC Crypto' | 'Wire Transfer' | 'Apple Pay';
  notes: string;
}

export interface AdUnit {
  id: string;
  name: string;
  type: 'banner' | 'native-card' | 'sidebar-sponsor' | 'tech-marquee';
  network: 'Carbon Network' | 'Aether Ads Engine' | 'TechSponsor Direct';
  impressions: number;
  clicks: number;
  cpm: number;
  totalEarned: number;
  todayEarned: number;
  enabled: boolean;
}

export interface CorporatePartner {
  id: string;
  company: string;
  logo: string;
  industry: string;
  dealValue: number;
  tier: 'Platinum Founding' | 'Infrastructure Partner' | 'Gold Sponsor' | 'Ecosystem';
  deliverables: string[];
  status: 'Signed & Active' | 'Proposal Review' | 'Drafting';
  renewalDate: string;
  contactPerson: string;
}

export interface EncryptedVaultItem {
  id: string;
  title: string;
  type: 'nda' | 'contract' | 'api-secret' | 'revenue-ledger';
  iv: string;
  ciphertext: string;
  plainSummary: string;
  timestamp: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'money' | 'task' | 'alert' | 'system';
  timestamp: string;
  read: boolean;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  tagline: string;
  category: string;
  earningsGenerated: string;
  client: string;
  image: string;
  techStack: string[];
  description: string;
  liveDemoUrl: string;
  metrics: {
    roi: string;
    speedup: string;
    uptime: string;
  };
}
