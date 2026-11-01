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
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Documentation Hub</span>
          </div>

          <div className="space-y-5">
            {DOCS_NAVIGATION.map((section) => (
              <div key={section.id} className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-2">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActivePageId(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer min-h-[44px] lg:min-h-[32px] ${
                        activePageId === item.id
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-600'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
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
        <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 text-xs">
          <div className="font-semibold text-blue-900 dark:text-blue-200">
            Need architectural guidance?
          </div>
          <p className="text-blue-700/80 dark:text-blue-300/80 mt-1">
            Join the Antigravity engineering channel on Discord for live peer
            reviews.
          </p>
          <a
            href="#discord"
            className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 mt-2 hover:underline min-h-[44px] lg:min-h-0"
          >
            <span>Join Community</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Documentation Article Content */}
      <div className="flex-1 max-w-4xl space-y-8">
        {/* Breadcrumb Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Docs</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Core Design System</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 dark:text-slate-200 font-medium capitalize">
              {activePageId}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Component Superclasses & OKLCH Semantic Tokens
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Spec v3.2.0
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Eliminate utility clutter with unified semantic classes (`btn`,
            `card`, `input`, `badge`). This architecture replaces fragile
            20-utility strings with single high-level primitives that
            automatically map into calibrated OKLCH surface and border tokens.
          </p>
        </div>

        {/* Alert Callouts */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <span className="font-bold">W3C Cascade Layers Notice:</span>{' '}
              Component superclasses are placed into the `@layer components`
              cascade. Atomic utility overrides like `p-6` or `opacity-80` will
              always win over default superclass properties without requiring
              `!important`.
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
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
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Step 1: Bundler Integration (vite.config.ts)</span>
            </div>
            <button
              onClick={() => handleCopy('vite', DOCS_SAMPLE_CODE.viteConfig)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer min-h-[44px] lg:min-h-[32px] justify-center"
            >
              {copiedKey === 'vite' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Config</span>
                </>
              )}
            </button>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Vite bundler configuration code block"
            className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed overflow-x-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <pre>{DOCS_SAMPLE_CODE.viteConfig}</pre>
          </div>
        </div>

        {/* Code Snippet 2: Component Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Step 2: Consuming Superclasses in React</span>
            </div>
            <button
              onClick={() =>
                handleCopy('comp', DOCS_SAMPLE_CODE.componentUsage)
              }
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer min-h-[44px] lg:min-h-[32px] justify-center"
            >
              {copiedKey === 'comp' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="React component superclasses code block"
            className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed overflow-x-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <pre>{DOCS_SAMPLE_CODE.componentUsage}</pre>
          </div>
        </div>

        {/* Interactive API Params Table */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Component Props & API Contract
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Supported properties on the core button and card superclasses.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                aria-label="Filter properties"
                placeholder="Filter properties..."
                value={paramSearch}
                onChange={(e) => setParamSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 min-h-[44px] lg:min-h-[36px]"
              />
            </div>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Component props and API contract table"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Prop</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Default</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                {filteredParams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No parameters found matching "{paramSearch}"
                    </td>
                  </tr>
                ) : (
                  filteredParams.map((p) => (
                    <tr
                      key={p.name}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
                        {p.type}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {p.defaultValue}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.required
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {p.required ? 'Required' : 'Optional'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed">
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
