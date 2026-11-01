import React, { useState } from 'react';
import {
  DOCS_NAVIGATION,
  DOCS_API_PARAMS,
  DOCS_SAMPLE_CODE,
} from '../../../shared/domain-data';
import {
  BookOpen,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Info,
  CheckCircle2,
  Search,
  Code2,
  ExternalLink,
} from 'lucide-react';

export function DocsView() {
  const [activePageId, setActivePageId] = useState('superclasses');
  const [paramSearch, setParamSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const filteredParams = DOCS_API_PARAMS.filter(
    (p) =>
      p.name.toLowerCase().includes(paramSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(paramSearch.toLowerCase()) ||
      p.type.toLowerCase().includes(paramSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn pb-12">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="card p-4 border border-subtle bg-surface shadow-sm">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted mb-4 pb-2 border-b border-subtle">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Documentation Hub</span>
          </div>

          <div className="space-y-5">
            {DOCS_NAVIGATION.map((section) => (
              <div key={section.id} className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted px-2">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActivePageId(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer min-h-[44px] lg:min-h-[32px] ${
                        activePageId === item.id
                          ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary'
                          : 'text-muted hover:bg-subtle'
                      }`}
                    >
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="badge badge-primary text-[10px]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community / Help Card */}
        <div className="card p-4 border border-primary/20 bg-primary/5 text-xs">
          <div className="font-semibold text-primary">
            Need architectural guidance?
          </div>
          <p className="text-muted mt-1">
            Join the Antigravity engineering channel on Discord for live peer
            reviews.
          </p>
          <a
            href="#discord"
            className="inline-flex items-center gap-1 font-semibold text-primary mt-2 hover:underline min-h-[44px] lg:min-h-0"
          >
            <span>Join Community</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Documentation Article Content */}
      <div className="flex-1 max-w-4xl space-y-8">
        {/* Breadcrumb Header */}
        <div className="space-y-3 pb-6 border-b border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span>Docs</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Core Design System</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-medium capitalize">
              {activePageId}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Component Superclasses & OKLCH Semantic Tokens
            </h1>
            <span className="badge badge-success text-xs font-semibold">
              Spec v3.2.0
            </span>
          </div>

          <p className="text-sm text-muted leading-relaxed">
            Eliminate utility clutter with unified semantic classes (`btn`,
            `card`, `input`, `badge`). This architecture replaces fragile
            20-utility strings with single high-level primitives that
            automatically map into calibrated OKLCH surface and border tokens.
          </p>
        </div>

        {/* Alert Callouts */}
        <div className="space-y-3">
          <div className="card p-4 border border-primary/30 bg-primary/5 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-primary leading-relaxed">
              <span className="font-bold">W3C Cascade Layers Notice:</span>{' '}
              Component superclasses are placed into the `@layer components`
              cascade. Atomic utility overrides like `p-6` or `opacity-80` will
              always win over default superclass properties without requiring
              `!important`.
            </div>
          </div>

          <div className="card p-4 border border-warning/30 bg-warning/5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-xs text-primary leading-relaxed">
              <span className="font-bold">Zero Hardcoded Hex Rule:</span> Never
              author raw hex or sRGB strings in production styles. Always
              reference semantic OKLCH design variables (`var(--color-primary)`,
              `var(--bg-surface)`) to guarantee mathematical contrast ratios.
            </div>
          </div>
        </div>

        {/* Code Snippet 1: Vite Config */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Code2 className="w-4 h-4 text-primary" />
              <span>Step 1: Bundler Integration (vite.config.ts)</span>
            </div>
            <button
              onClick={() => handleCopy('vite', DOCS_SAMPLE_CODE.viteConfig)}
              className="btn btn-outline py-1 px-2.5 text-xs font-semibold transition-colors cursor-pointer min-h-[44px] lg:min-h-[32px] inline-flex items-center justify-center"
            >
              {copiedKey === 'vite' ? (
                <span className="flex items-center gap-1.5 text-success">
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Config</span>
                </span>
              )}
            </button>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Vite bundler configuration code block"
            className="card rounded-xl overflow-hidden border border-subtle bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed overflow-x-auto focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <pre>{DOCS_SAMPLE_CODE.viteConfig}</pre>
          </div>
        </div>

        {/* Code Snippet 2: Component Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Code2 className="w-4 h-4 text-primary" />
              <span>Step 2: Consuming Superclasses in React</span>
            </div>
            <button
              onClick={() =>
                handleCopy('comp', DOCS_SAMPLE_CODE.componentUsage)
              }
              className="btn btn-outline py-1 px-2.5 text-xs font-semibold transition-colors cursor-pointer min-h-[44px] lg:min-h-[32px] inline-flex items-center justify-center"
            >
              {copiedKey === 'comp' ? (
                <span className="flex items-center gap-1.5 text-success">
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </span>
              )}
            </button>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="React component superclasses code block"
            className="card rounded-xl overflow-hidden border border-subtle bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed overflow-x-auto focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <pre>{DOCS_SAMPLE_CODE.componentUsage}</pre>
          </div>
        </div>

        {/* Interactive API Params Table */}
        <div className="space-y-4 pt-4 border-t border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-primary">
                Component Props & API Contract
              </h2>
              <p className="text-xs text-muted">
                Supported properties on the core button and card superclasses.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                aria-label="Filter properties"
                placeholder="Filter properties..."
                value={paramSearch}
                onChange={(e) => setParamSearch(e.target.value)}
                className="input pl-8 pr-3 py-1.5 text-xs w-48 min-h-[44px] lg:min-h-[36px]"
              />
            </div>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Component props and API contract table"
            className="card border border-subtle bg-surface overflow-x-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-subtle text-muted uppercase tracking-wider font-semibold border-b border-subtle">
                <tr>
                  <th className="py-3 px-4">Prop</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Default</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle font-sans">
                {filteredParams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted">
                      No parameters found matching "{paramSearch}"
                    </td>
                  </tr>
                ) : (
                  filteredParams.map((p) => (
                    <tr
                      key={p.name}
                      className="hover:bg-subtle/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-primary font-semibold">
                        {p.type}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted">
                        {p.defaultValue}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${
                            p.required ? 'badge-danger' : 'badge-secondary'
                          } text-[10px] font-bold`}
                        >
                          {p.required ? 'Required' : 'Optional'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted leading-relaxed">
                        {p.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
