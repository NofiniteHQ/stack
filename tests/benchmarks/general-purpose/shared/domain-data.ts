export interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
  plan: 'Enterprise' | 'Pro' | 'Starter';
  status: 'active' | 'pending' | 'past_due' | 'suspended';
  mrr: number;
  users: number;
  renewalDate: string;
}

export interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: 'security' | 'billing' | 'account' | 'deployment';
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  target: number;
}

// 1. SaaS Dashboard Data
export const SAAS_METRICS: MetricCard[] = [
  {
    id: 'm1',
    title: 'Total ARR',
    value: '$1,482,900',
    change: '+14.2%',
    trend: 'up',
    description: 'vs. last month ($1,298,400)',
  },
  {
    id: 'm2',
    title: 'Active Customers',
    value: '3,842',
    change: '+8.1%',
    trend: 'up',
    description: '284 added this quarter',
  },
  {
    id: 'm3',
    title: 'Net Retention',
    value: '118.4%',
    change: '+2.3%',
    trend: 'up',
    description: 'Expansion revenue outpaces churn',
  },
  {
    id: 'm4',
    title: 'Gross Churn',
    value: '1.18%',
    change: '-0.3%',
    trend: 'down',
    description: 'Lowest in 6 rolling quarters',
  },
];

export const SAAS_VELOCITY_CHART: ChartDataPoint[] = [
  { month: 'Jan', revenue: 98, target: 90 },
  { month: 'Feb', revenue: 104, target: 95 },
  { month: 'Mar', revenue: 112, target: 100 },
  { month: 'Apr', revenue: 108, target: 105 },
  { month: 'May', revenue: 122, target: 110 },
  { month: 'Jun', revenue: 130, target: 115 },
  { month: 'Jul', revenue: 128, target: 120 },
  { month: 'Aug', revenue: 135, target: 125 },
  { month: 'Sep', revenue: 142, target: 130 },
  { month: 'Oct', revenue: 148, target: 135 },
  { month: 'Nov', revenue: 154, target: 140 },
  { month: 'Dec', revenue: 162, target: 145 },
];

export const SAAS_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Elena Rostova',
    email: 'elena@novatech.io',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
    company: 'NovaTech Solutions',
    plan: 'Enterprise',
    status: 'active',
    mrr: 4800,
    users: 142,
    renewalDate: '2027-04-15',
  },
  {
    id: 'CUST-002',
    name: 'Marcus Vance',
    email: 'm.vance@apexcloud.com',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
    company: 'Apex Cloud Architecture',
    plan: 'Enterprise',
    status: 'active',
    mrr: 7200,
    users: 310,
    renewalDate: '2027-01-30',
  },
  {
    id: 'CUST-003',
    name: 'Sophia Chen',
    email: 'sophia@hyperflow.dev',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
    company: 'HyperFlow Systems',
    plan: 'Pro',
    status: 'pending',
    mrr: 1850,
    users: 48,
    renewalDate: '2026-11-20',
  },
  {
    id: 'CUST-004',
    name: 'David Okafor',
    email: 'd.okafor@kynetix.ai',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop',
    company: 'Kynetix Intelligence',
    plan: 'Enterprise',
    status: 'active',
    mrr: 5900,
    users: 184,
    renewalDate: '2027-08-10',
  },
  {
    id: 'CUST-005',
    name: 'Amara Lindqvist',
    email: 'amara@nordicpay.fi',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop',
    company: 'NordicPay Gateway',
    plan: 'Pro',
    status: 'past_due',
    mrr: 2400,
    users: 64,
    renewalDate: '2026-10-31',
  },
  {
    id: 'CUST-006',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@vertexsec.ae',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop',
    company: 'Vertex Security Ops',
    plan: 'Enterprise',
    status: 'active',
    mrr: 8400,
    users: 420,
    renewalDate: '2027-06-01',
  },
  {
    id: 'CUST-007',
    name: 'Chloe Tremblay',
    email: 'chloe@stratawave.ca',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&fit=crop',
    company: 'StrataWave Dynamics',
    plan: 'Starter',
    status: 'suspended',
    mrr: 450,
    users: 12,
    renewalDate: '2026-09-15',
  },
  {
    id: 'CUST-008',
    name: 'Liam Gallagher',
    email: 'liam@celticlogistics.ie',
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=128&fit=crop',
    company: 'Celtic Freight & Air',
    plan: 'Pro',
    status: 'active',
    mrr: 2100,
    users: 55,
    renewalDate: '2027-03-22',
  },
];

export const SAAS_AUDIT_STREAM: Activity[] = [
  {
    id: 'act-1',
    user: 'Elena Rostova',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop',
    action: 'upgraded subscription to',
    target: 'Enterprise 500-seat tier',
    time: '8 minutes ago',
    type: 'billing',
  },
  {
    id: 'act-2',
    user: 'Tariq Al-Mansoor',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop',
    action: 'configured SAML 2.0 Okta SSO in',
    target: 'Production Tenant',
    time: '24 minutes ago',
    type: 'security',
  },
  {
    id: 'act-3',
    user: 'Sophia Chen',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop',
    action: 'invited 14 team collaborators to',
    target: 'Analytics Workspace',
    time: '1 hour ago',
    type: 'account',
  },
  {
    id: 'act-4',
    user: 'System Bot',
    avatar:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop',
    action: 'automated SOC2 compliance scan',
    target: 'Passed (0 vulnerabilities)',
    time: '2 hours ago',
    type: 'deployment',
  },
  {
    id: 'act-5',
    user: 'Marcus Vance',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop',
    action: 'generated production API key',
    target: 'Ingest Pipeline #3',
    time: '3 hours ago',
    type: 'security',
  },
];

// 2. Marketing Site Data
export interface MarketingFeature {
  id: string;
  icon: string;
  tag: string;
  title: string;
  description: string;
}

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  highlighted?: boolean;
  features: string[];
  cta: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const MARKETING_FEATURES: MarketingFeature[] = [
  {
    id: 'feat-1',
    icon: 'Zap',
    tag: 'Sub-Millisecond',
    title: 'Real-Time Edge Telemetry',
    description:
      'Stream metrics with zero buffering over ultra-low-latency WebSockets directly from cloud edge nodes.',
  },
  {
    id: 'feat-2',
    icon: 'ShieldCheck',
    tag: 'Enterprise Grade',
    title: 'SOC2 Type II & GDPR Ready',
    description:
      'Hardware-backed encryption with KMS keys, automated access audit trails, and strict role segregation.',
  },
  {
    id: 'feat-3',
    icon: 'Layers',
    tag: 'Zero Ingestion Tax',
    title: 'Columnar Analytics Engine',
    description:
      'Execute ad-hoc aggregation queries over billions of event rows without paying punitive data scan penalties.',
  },
  {
    id: 'feat-4',
    icon: 'GitBranch',
    tag: 'Developer Native',
    title: 'GitOps Pipeline Integration',
    description:
      'Declare monitors and alerting thresholds as code in YAML, synchronized through native GitHub and GitLab actions.',
  },
];

export const MARKETING_PRICING_TIERS: PricingTier[] = [
  {
    id: 'tier-starter',
    name: 'Starter',
    tagline: 'Ideal for independent developers and seed-stage startups.',
    monthlyPrice: 29,
    annualPrice: 24,
    features: [
      'Up to 3 team members',
      '500,000 monthly telemetry events',
      '7-day data retention',
      'Community Discord support',
      'Basic dashboard exports',
    ],
    cta: 'Start 14-Day Free Trial',
  },
  {
    id: 'tier-pro',
    name: 'Growth Pro',
    tagline: 'The sweet spot for rapidly scaling SaaS and fintech companies.',
    monthlyPrice: 99,
    annualPrice: 79,
    highlighted: true,
    features: [
      'Up to 25 team members',
      '10,000,000 monthly telemetry events',
      '90-day columnar data retention',
      'Priority Slack & email response (1h SLA)',
      'Custom dashboards & alerting webhooks',
      'Role-based access control (RBAC)',
    ],
    cta: 'Claim Growth Pro',
  },
  {
    id: 'tier-enterprise',
    name: 'Enterprise Grid',
    tagline:
      'Full autonomy, compliance sovereignty, and bespoke dedicated clusters.',
    monthlyPrice: 349,
    annualPrice: 299,
    features: [
      'Unlimited workspace members',
      'Uncapped multi-region event pipelines',
      '7-year cold immutable audit archive',
      'Dedicated Customer Success Architect',
      'SAML 2.0 / Okta / Azure AD SSO',
      'Custom VPC peering & self-hosted agent',
    ],
    cta: 'Contact Sales',
  },
];

export const MARKETING_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote:
      'Switching our analytics pipeline reduced our P99 dashboard render latency from 3.4 seconds down to 85 milliseconds.',
    author: 'Sarah Jenkins',
    role: 'Chief Technology Officer',
    company: 'HyperCloud Technologies',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop',
    rating: 5,
  },
  {
    id: 'test-2',
    quote:
      'The semantic token system and developer-first ergonomics made it painless to unify 18 internal apps without style drift.',
    author: 'Kenji Takahashi',
    role: 'Head of Core Infrastructure',
    company: 'Monolith Logistics',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
    rating: 5,
  },
  {
    id: 'test-3',
    quote:
      'Our SOC2 auditor was blown away by the clarity and immutability of the audit trails. It saved our compliance team 4 weeks.',
    author: 'Rachel Steinberg',
    role: 'VP Information Security',
    company: 'FinGuard Global',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop',
    rating: 5,
  },
];

export const MARKETING_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Billing',
    question: 'How do annual and monthly billing options compare?',
    answer:
      'Annual subscriptions receive an automatic 20% discount applied across all seats and usage tiers. You can switch anytime with prorated credit.',
  },
  {
    id: 'faq-2',
    category: 'Architecture',
    question: 'Where is telemetry data stored and processed?',
    answer:
      'Data is ingested and processed in your chosen cloud region (US-East, EU-Central, or AP-Southeast) with end-to-end KMS envelope encryption.',
  },
  {
    id: 'faq-3',
    category: 'Security',
    question: 'Do you offer custom Data Processing Agreements (DPA)?',
    answer:
      'Yes! Enterprise customers receive our standard BAA and EU-standard contractual clauses (SCC) pre-reviewed by privacy counsel.',
  },
  {
    id: 'faq-4',
    category: 'Integration',
    question: 'Can we self-host the ingestion collector behind our VPC?',
    answer:
      'Enterprise Grid includes containerized OpenTelemetry collector sidecars that run directly in your Kubernetes clusters or AWS ECS tasks.',
  },
  {
    id: 'faq-5',
    category: 'Support',
    question: 'What is the standard SLA response time for incident tickets?',
    answer:
      'Pro tier includes a guaranteed 1-hour initial response for Sev-1 issues; Enterprise includes a 15-minute SLA with dedicated hotline access.',
  },
];

// 3. Ecommerce Store Data
export interface Product {
  id: string;
  title: string;
  category: 'Laptops' | 'Audio' | 'Wearables' | 'Accessories';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  inStock: boolean;
  description: string;
  specs: { [key: string]: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export const ECOMMERCE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'AeroBook Pro Carbon 16"',
    category: 'Laptops',
    price: 2199,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 312,
    badge: 'Best Seller',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=450&fit=crop',
    inStock: true,
    description:
      'Ultra-thin carbon fiber chassis powered by the M4 Max architecture with 120Hz Liquid OLED display.',
    specs: {
      Processor: '16-Core M-Silicon',
      RAM: '64GB Unified',
      Storage: '2TB NVMe PCIe 5.0',
      Battery: '22 Hours',
    },
  },
  {
    id: 'prod-2',
    title: 'AcousticPure Wireless ANC Headphones',
    category: 'Audio',
    price: 349,
    originalPrice: 399,
    rating: 4.8,
    reviewsCount: 540,
    badge: 'Popular',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=450&fit=crop',
    inStock: true,
    description:
      'Active hybrid noise-cancelling with custom beryllium drivers and 40-hour lossless Bluetooth streaming.',
    specs: {
      Driver: '40mm Beryllium',
      Battery: '40 Hours ANC on',
      Weight: '240g',
      Codec: 'LDAC / aptX HD',
    },
  },
  {
    id: 'prod-3',
    title: 'PulseChronos Titanium Smartwatch',
    category: 'Wearables',
    price: 499,
    originalPrice: 549,
    rating: 4.7,
    reviewsCount: 188,
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=450&fit=crop',
    inStock: true,
    description:
      'Grade-5 titanium case with dual-frequency GPS, medical ECG sensor, and sapphire crystal glass.',
    specs: {
      Case: 'Grade-5 Titanium',
      WaterResist: '100m ISO',
      Sensors: 'ECG + SpO2 + Temp',
      Battery: '7 Days',
    },
  },
  {
    id: 'prod-4',
    title: 'PrecisionFlow Mechanical Keyboard',
    category: 'Accessories',
    price: 189,
    originalPrice: 219,
    rating: 4.9,
    reviewsCount: 420,
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=450&fit=crop',
    inStock: true,
    description:
      'Hot-swappable gasket-mounted keyboard with sound-dampening brass weight and CNC aluminum enclosure.',
    specs: {
      Switches: 'Gateron Oil King',
      Mount: 'Double Gasket',
      Keycaps: 'PBT Dye-Sub',
      Connectivity: 'Tri-Mode',
    },
  },
  {
    id: 'prod-5',
    title: 'StudioSound Reference Desk Monitor Speakers',
    category: 'Audio',
    price: 599,
    originalPrice: 699,
    rating: 4.8,
    reviewsCount: 115,
    badge: 'Audiophile Choice',
    image:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=450&fit=crop',
    inStock: true,
    description:
      'Bi-amplified nearfield monitors delivering surgical phase accuracy and ruler-flat frequency response.',
    specs: {
      Power: '120W Class-D',
      Woofer: '5.25" Kevlar',
      Tweeter: '1" Silk Dome',
      Inputs: 'XLR / TRS / USB-C',
    },
  },
  {
    id: 'prod-6',
    title: 'ApexBook Ultra Thin 14"',
    category: 'Laptops',
    price: 1699,
    originalPrice: 1899,
    rating: 4.6,
    reviewsCount: 204,
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=450&fit=crop',
    inStock: false,
    description:
      'Weighing just 1.1kg with all-day battery life and thunderbolt 4 expansion ports.',
    specs: {
      Processor: 'Intel Core Ultra 7',
      RAM: '32GB LPDDR5X',
      Storage: '1TB NVMe',
      Weight: '1.14 kg',
    },
  },
  {
    id: 'prod-7',
    title: 'ErgoComfort Vertical Ergonomic Mouse',
    category: 'Accessories',
    price: 89,
    originalPrice: 109,
    rating: 4.5,
    reviewsCount: 340,
    image:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=450&fit=crop',
    inStock: true,
    description:
      'Natural 57-degree handshake angle reduces wrist muscle strain by 40% with high-precision optical tracking.',
    specs: {
      DPI: '8000 Darkfield',
      Battery: '90 Days USB-C',
      Buttons: '6 Programmable',
      Weight: '135g',
    },
  },
  {
    id: 'prod-8',
    title: 'FitBand Pulse Active Tracker',
    category: 'Wearables',
    price: 129,
    originalPrice: 159,
    rating: 4.4,
    reviewsCount: 96,
    badge: 'Sale',
    image:
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=450&fit=crop',
    inStock: true,
    description:
      'Featherlight sleep and continuous HRV tracker with waterproof silicone band and solar boost charging.',
    specs: {
      Battery: '14 Days',
      WaterProof: '5ATM',
      Display: 'Curved AMOLED',
      Sensors: 'HRV + Sleep Score',
    },
  },
];

// 4. Documentation Site Data
export interface DocSection {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    path: string;
    badge?: string;
  }[];
}

export interface ApiParam {
  name: string;
  type: string;
  defaultValue: string;
  required: boolean;
  description: string;
}

export const DOCS_NAVIGATION: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      {
        id: 'overview',
        title: 'Architecture Overview',
        path: '/docs/overview',
        badge: 'Updated',
      },
      {
        id: 'quickstart',
        title: 'Zero-Config Quickstart',
        path: '/docs/quickstart',
      },
      {
        id: 'installation',
        title: 'Vite & Next.js Setup',
        path: '/docs/installation',
      },
    ],
  },
  {
    id: 'core-concepts',
    title: 'Core Design System',
    items: [
      { id: 'tokens', title: 'Semantic OKLCH Tokens', path: '/docs/tokens' },
      {
        id: 'superclasses',
        title: 'Superclasses (btn, card, input)',
        path: '/docs/superclasses',
        badge: 'Core',
      },
      {
        id: 'theming',
        title: 'Dark / Light / Custom Themes',
        path: '/docs/theming',
      },
    ],
  },
  {
    id: 'component-reference',
    title: 'API Reference',
    items: [
      { id: 'table', title: 'TableContainer & DataGrid', path: '/docs/table' },
      { id: 'modal', title: 'Glassmorphic Dialog Modal', path: '/docs/modal' },
      { id: 'badge', title: 'Badges & Status Tags', path: '/docs/badge' },
    ],
  },
];

export const DOCS_API_PARAMS: ApiParam[] = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
    defaultValue: "'primary'",
    required: false,
    description:
      'Visual stylistic hierarchy mapped to semantic OKLCH surface and border tokens.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg' | 'icon'",
    defaultValue: "'md'",
    required: false,
    description:
      'Controls internal padding, font size, and min-height bounding boxes.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    defaultValue: 'false',
    required: false,
    description:
      'Renders an accessible animated spinner and disables pointer interactions.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    defaultValue: 'undefined',
    required: false,
    description:
      'Leading icon element automatically spaced with semantic gap tokens.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    required: false,
    description:
      'HTML disabled state applying opacity-50 and cursor-not-allowed.',
  },
];

export const DOCS_SAMPLE_CODE = {
  viteConfig: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nuicss from '@nofinite/nuicss/vite';

export default defineConfig({
  plugins: [react(), nuicss()],
});`,
  componentUsage: `import React, { useState } from 'react';

export function ActionPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card p-6 border border-subtle bg-surface">
      <h3 className="text-lg font-semibold text-primary">Deployment Target</h3>
      <p className="text-sm text-secondary mt-1">Configure your edge regions.</p>
      
      <div className="mt-4 flex gap-3">
        <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
          Deploy to Fleet
        </button>
        <button className="btn btn-outline">
          Cancel
        </button>
      </div>
    </div>
  );
}`,
};

// 5. Editorial Site Data
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  likesCount: number;
}

export interface AuthorProfile {
  name: string;
  handle: string;
  role: string;
  avatar: string;
  bio: string;
  articlesCount: number;
  followersCount: string;
}

export const EDITORIAL_LEAD_STORY: Article = {
  id: 'lead-1',
  title:
    'The Post-Tailwind Paradigm: How Zero-Runtime Semantic CSS Engines Are Winning The Web',
  excerpt:
    'As front-end design systems scale into hundreds of micro-frontends, the maintenance tax of chaotic utility strings is prompting engineering teams to demand semantic superclasses with OKLCH color spaces.',
  category: 'Deep Architecture',
  readTime: '9 min read',
  publishedAt: 'October 31, 2026',
  coverImage:
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
  author: {
    name: 'Devon St. Claire',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
    role: 'Principal Systems Editor',
  },
  likesCount: 1420,
};

export const EDITORIAL_AUTHOR: AuthorProfile = {
  name: 'Devon St. Claire',
  handle: '@devonstclaire',
  role: 'Principal Systems Editor & Compiler Theorist',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
  bio: 'Covering browser rendering engines, JIT compiler primitives, OKLCH color science, and the evolving physics of large-scale web applications.',
  articlesCount: 48,
  followersCount: '24.8K',
};

export const EDITORIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title:
      'OKLCH: The Physics and Perceptual Uniformity of Next-Gen Color Systems',
    excerpt:
      'Why sRGB fails modern display gamut standards and how OKLCH mathematically guarantees consistent contrast ratios across all theme modes.',
    category: 'Color Science',
    readTime: '6 min read',
    publishedAt: 'Oct 28, 2026',
    coverImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    author: {
      name: 'Dr. Alistair Vance',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
      role: 'Staff Color Scientist',
    },
    likesCount: 890,
  },
  {
    id: 'art-2',
    title: 'Why Monorepos Need A Single Downstream CSS Engine Contract',
    excerpt:
      'Eliminating the duplicate stylesheet cascade: analyzing memory footprint and layout thrashing in enterprise multi-package applications.',
    category: 'Engineering',
    readTime: '8 min read',
    publishedAt: 'Oct 25, 2026',
    coverImage:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop',
    author: {
      name: 'Devon St. Claire',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
      role: 'Principal Systems Editor',
    },
    likesCount: 1120,
  },
  {
    id: 'art-3',
    title:
      'The Death of the 20-Utility Div: The Rise of Component Superclasses',
    excerpt:
      'Comparing DOM inspection ergonomics and CSS bundle sizes when moving from arbitrary utility clusters to unified semantic definitions.',
    category: 'UI Patterns',
    readTime: '5 min read',
    publishedAt: 'Oct 22, 2026',
    coverImage:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    author: {
      name: 'Maya Lin',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
      role: 'Design Technologist',
    },
    likesCount: 975,
  },
  {
    id: 'art-4',
    title: 'Benchmarking Web Vitals: Largest Contentful Paint Across 500 Apps',
    excerpt:
      'Empirical data on how utility stylesheet size impacts render blocking, time-to-first-byte, and hydration latency on mobile devices.',
    category: 'Performance',
    readTime: '11 min read',
    publishedAt: 'Oct 18, 2026',
    coverImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    author: {
      name: 'Marcus Vance',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop',
      role: 'Infra Architect',
    },
    likesCount: 654,
  },
  {
    id: 'art-5',
    title: 'Designing Accessible Glassmorphism Without Sacrificing WCAG AAA',
    excerpt:
      'The delicate harmony of backdrop-blur, subtle borders, and high-contrast foreground text across dark and high-contrast operating systems.',
    category: 'Accessibility',
    readTime: '7 min read',
    publishedAt: 'Oct 14, 2026',
    coverImage:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop',
    author: {
      name: 'Maya Lin',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
      role: 'Design Technologist',
    },
    likesCount: 840,
  },
  {
    id: 'art-6',
    title: 'JIT Compiler Strategies for Vite 7 and Modern Bundlers',
    excerpt:
      'How on-demand token resolution reduces hot-module replacement (HMR) cycle time to under 12 milliseconds in 100k-line codebases.',
    category: 'Tooling',
    readTime: '10 min read',
    publishedAt: 'Oct 10, 2026',
    coverImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    author: {
      name: 'Dr. Alistair Vance',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
      role: 'Staff Color Scientist',
    },
    likesCount: 1380,
  },
];

// 6. Settings App Data
export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  timezone: string;
  bio: string;
  language: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  createdDate: string;
  lastUsed: string;
  permissions: 'Full Access' | 'Read Only' | 'Ingest Only';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer';
  status: 'Active' | 'Invited';
  avatar: string;
  lastActive: string;
}

export const SETTINGS_PROFILE: UserProfile = {
  name: 'Devon St. Claire',
  email: 'devon.stclaire@vertexops.com',
  role: 'Senior Staff Infrastructure Engineer',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  timezone: 'UTC-08:00 (Pacific Time)',
  bio: 'Building hyper-resilient edge telemetry systems and high-throughput columnar ingestion engines.',
  language: 'English (United States)',
};

export const SETTINGS_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Production Ingestion Gateway',
    prefix: 'nui_live_7x9Q...8mK2',
    createdDate: '2026-04-12',
    lastUsed: '3 minutes ago',
    permissions: 'Ingest Only',
  },
  {
    id: 'key-2',
    name: 'GitHub CI/CD Automation Bot',
    prefix: 'nui_live_3yB1...9xT0',
    createdDate: '2026-08-20',
    lastUsed: '1 hour ago',
    permissions: 'Read Only',
  },
  {
    id: 'key-3',
    name: 'Admin Telemetry Diagnostic Key',
    prefix: 'nui_live_8pM4...1zW9',
    createdDate: '2026-10-01',
    lastUsed: 'Yesterday',
    permissions: 'Full Access',
  },
];

export const SETTINGS_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Devon St. Claire',
    email: 'devon.stclaire@vertexops.com',
    role: 'Owner',
    status: 'Active',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop',
    lastActive: 'Just now',
  },
  {
    id: 'tm-2',
    name: 'Marcus Vance',
    email: 'm.vance@apexcloud.com',
    role: 'Admin',
    status: 'Active',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
    lastActive: '18 minutes ago',
  },
  {
    id: 'tm-3',
    name: 'Elena Rostova',
    email: 'elena@novatech.io',
    role: 'Member',
    status: 'Active',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop',
    lastActive: '3 hours ago',
  },
  {
    id: 'tm-4',
    name: 'Chloe Tremblay',
    email: 'chloe@stratawave.ca',
    role: 'Viewer',
    status: 'Invited',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&fit=crop',
    lastActive: 'Pending invite',
  },
];
