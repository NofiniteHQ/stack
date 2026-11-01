import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Rocket,
  ShoppingBag,
  BookOpen,
  Newspaper,
  Settings,
  Sun,
  Moon,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { DashboardView } from './views/DashboardView';
import { MarketingView } from './views/MarketingView';
import { EcommerceView } from './views/EcommerceView';
import { DocsView } from './views/DocsView';
import { EditorialView } from './views/EditorialView';
import { SettingsView } from './views/SettingsView';

type ViewMode =
  | 'dashboard'
  | 'marketing'
  | 'ecommerce'
  | 'docs'
  | 'editorial'
  | 'settings';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [brand, setBrand] = useState<'neutral' | 'blue' | 'violet' | 'emerald'>(
    'neutral'
  );

  // Handle live consumer brand customization
  useEffect(() => {
    const root = document.documentElement;
    if (brand === 'neutral') {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-primary-hover');
      root.style.removeProperty('--color-primary-fg');
    } else if (brand === 'blue') {
      root.style.setProperty('--color-primary', 'oklch(0.55 0.22 255)');
      root.style.setProperty('--color-primary-hover', 'oklch(0.48 0.24 255)');
      root.style.setProperty('--color-primary-fg', '#ffffff');
    } else if (brand === 'violet') {
      root.style.setProperty('--color-primary', 'oklch(0.55 0.24 290)');
      root.style.setProperty('--color-primary-hover', 'oklch(0.48 0.25 290)');
      root.style.setProperty('--color-primary-fg', '#ffffff');
    } else if (brand === 'emerald') {
      root.style.setProperty('--color-primary', 'oklch(0.58 0.18 150)');
      root.style.setProperty('--color-primary-hover', 'oklch(0.50 0.19 150)');
      root.style.setProperty('--color-primary-fg', '#ffffff');
    }
  }, [brand]);

  // Sync with browser URL / hash
  useEffect(() => {
    const handleLocation = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const path = window.location.pathname.replace('/', '');
      const candidate = (hash || path) as ViewMode;
      if (
        [
          'dashboard',
          'marketing',
          'ecommerce',
          'docs',
          'editorial',
          'settings',
        ].includes(candidate)
      ) {
        setActiveView(candidate);
      }
    };

    handleLocation();
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);

  const switchView = (view: ViewMode) => {
    setActiveView(view);
    window.location.hash = `#/${view}`;
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-canvas text-primary antialiased transition-colors duration-200 flex flex-col font-sans"
    >
      {/* Persistent Top View Switcher Bar */}
      <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-subtle transition-colors">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Brand Logo & Engine Indicator */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary text-inverse flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-black tracking-tight text-primary flex items-center gap-2">
                  <span>PulseMetrics</span>
                  <span className="badge badge-primary text-[10px] font-mono font-bold">
                    NUICSS v3.2.0
                  </span>
                </div>
                <div className="text-[10px] text-muted font-mono">
                  Port 5201 • Benchmark Suite
                </div>
              </div>
            </div>

            {/* 6 View Switcher Tabs */}
            <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none min-w-0">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'marketing', label: 'Marketing', icon: Rocket },
                { id: 'ecommerce', label: 'Ecommerce', icon: ShoppingBag },
                { id: 'docs', label: 'Documentation', icon: BookOpen },
                { id: 'editorial', label: 'Editorial', icon: Newspaper },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => switchView(tab.id as ViewMode)}
                    className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[44px] lg:min-h-[32px] ${
                      isActive
                        ? 'btn btn-primary text-xs'
                        : 'btn btn-ghost text-xs text-muted hover:text-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls: Brand Theme & Dark Mode Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Brand Color Selector */}
              <div className="hidden lg:flex items-center gap-1 bg-surface-raised border border-subtle p-1 rounded-xl text-xs">
                {(['neutral', 'blue', 'violet', 'emerald'] as const).map(
                  (b) => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all capitalize cursor-pointer ${
                        brand === b
                          ? 'bg-primary text-inverse shadow-sm'
                          : 'text-muted hover:text-primary'
                      }`}
                      title={`Brand: ${b}`}
                    >
                      {b}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={toggleTheme}
                id="theme-toggle"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                className="btn btn-outline p-2 rounded-xl text-muted hover:text-primary transition-colors cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 pt-6 sm:pt-8 min-w-0">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'marketing' && <MarketingView />}
        {activeView === 'ecommerce' && <EcommerceView />}
        {activeView === 'docs' && <DocsView />}
        {activeView === 'editorial' && <EditorialView />}
        {activeView === 'settings' && <SettingsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-subtle py-6 text-center text-xs text-muted bg-surface transition-colors">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PulseMetrics General Purpose Multi-Domain Benchmark • NUICSS Edition
          </div>
          <div className="font-mono text-[11px] text-muted">
            6 Domains • 100% Feature Parity
          </div>
        </div>
      </footer>
    </div>
  );
}
