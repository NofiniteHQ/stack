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
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'dark bg-slate-950 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      } antialiased transition-colors duration-200 flex flex-col font-sans`}
    >
      {/* Persistent Top View Switcher Bar */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Brand Logo & Engine Indicator */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>PulseMetrics</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    Tailwind v4.3.3
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Port 5200 • Benchmark Suite
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
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls: Theme Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggleTheme}
                id="theme-toggle"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
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
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PulseMetrics General Purpose Multi-Domain Benchmark • Tailwind CSS
            Edition
          </div>
          <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
            6 Domains • 100% Feature Parity
          </div>
        </div>
      </footer>
    </div>
  );
}
