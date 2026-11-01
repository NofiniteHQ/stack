import React, { useState } from 'react';
import {
  MARKETING_FEATURES,
  MARKETING_PRICING_TIERS,
  MARKETING_TESTIMONIALS,
  MARKETING_FAQS,
} from '../../../shared/domain-data';
import {
  Zap,
  ShieldCheck,
  Layers,
  GitBranch,
  Check,
  ChevronDown,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  ShieldCheck,
  Layers,
  GitBranch,
};

export function MarketingView() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'annual'
  );
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');
  const [ctaSuccess, setCtaSuccess] = useState(false);

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto pt-6 pb-8 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold badge badge-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>v3.2 Engine Released • Zero-Runtime OKLCH</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-primary leading-[1.15]">
          Hyper-Scale Observability for the Modern Edge
        </h1>

        <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Stream billions of high-cardinality telemetry events per second
          without ingestion penalties, powered by distributed columnar indexing
          and mathematically unified semantic design tokens.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setCtaSuccess(true)}
            className="w-full sm:w-auto btn btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer shadow-lg min-h-[44px]"
          >
            Start Free 14-Day Fleet Trial
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('Architecture sandbox loaded in demo mode.')}
            className="w-full sm:w-auto btn btn-outline px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer min-h-[44px] inline-flex items-center justify-center"
          >
            Explore Interactive Demo
          </button>
        </div>

        {ctaSuccess && (
          <div className="p-3 max-w-md mx-auto rounded-lg badge badge-success text-xs">
            🎉 Enterprise trial provisioned! Check your developer inbox for
            immediate credentials.
          </div>
        )}

        {/* Social Proof Stats */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-subtle max-w-2xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">
              99.999%
            </div>
            <div className="text-xs text-muted mt-0.5">
              High-Availability SLA
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">
              &lt;1.2ms
            </div>
            <div className="text-xs text-muted mt-0.5">P99 Query Latency</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">
              50B+
            </div>
            <div className="text-xs text-muted mt-0.5">Events Daily</div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Engineered for Extreme Throughput
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Built from scratch for teams that have outgrown rigid SaaS logging
            quotas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MARKETING_FEATURES.map((feat) => {
            const IconComp = ICON_MAP[feat.icon] || Zap;
            return (
              <div
                key={feat.id}
                className="card p-6 border border-subtle bg-surface shadow-sm hover:shadow-md hover:border-primary transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {feat.tag}
                </span>
                <h3 className="text-base font-bold text-primary mt-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Pricing Section */}
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Simple, Transparent Seat & Ingest Pricing
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
            Scale seamlessly from local development clusters to multi-region
            global failover clusters.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-subtle border border-subtle">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-[44px] lg:min-h-[32px] inline-flex items-center justify-center ${
                billingCycle === 'monthly'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-muted hover:text-primary'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] lg:min-h-[32px] ${
                billingCycle === 'annual'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-muted hover:text-primary'
              }`}
            >
              <span>Annual Billing</span>
              <span className="badge badge-success text-[10px]">Save 20%</span>
            </button>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MARKETING_PRICING_TIERS.map((tier) => {
            const price =
              billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  tier.highlighted
                    ? 'card border-2 border-primary bg-surface shadow-xl scale-[1.02]'
                    : 'card border border-subtle bg-surface shadow-sm hover:shadow-md'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider badge badge-primary shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="font-bold text-lg text-primary">
                    {tier.name}
                  </div>
                  <p className="text-xs text-muted mt-1 min-h-[32px]">
                    {tier.tagline}
                  </p>

                  <div className="mt-4 mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-primary">
                      ${price}
                    </span>
                    <span className="text-xs text-muted">/ seat / month</span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-subtle">
                    {tier.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-muted"
                      >
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    alert(`Selected ${tier.name} with ${billingCycle} billing!`)
                  }
                  className={`mt-8 w-full py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer min-h-[44px] flex items-center justify-center ${
                    tier.highlighted ? 'btn btn-primary' : 'btn btn-outline'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Trusted by Principal Systems Architects
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            See why high-growth engineering teams run on our telemetry engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MARKETING_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="card p-6 border border-subtle bg-surface shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-warning mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-primary italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-subtle">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-9 h-9 rounded-full object-cover border border-subtle"
                />
                <div>
                  <div className="font-semibold text-xs text-primary">
                    {t.author}
                  </div>
                  <div className="text-[10px] text-muted">
                    {t.role} • {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-muted mt-1">
            Everything you need to know about compliance, VPC peering, and
            billing models.
          </p>
        </div>

        <div className="space-y-3">
          {MARKETING_FAQS.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-subtle rounded-xl bg-surface overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-primary hover:bg-subtle transition-colors cursor-pointer min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <span className="badge badge-secondary text-[10px]">
                      {faq.category}
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    className="px-4 pb-4 pt-1 text-xs text-muted border-t border-subtle leading-relaxed bg-subtle/30"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
