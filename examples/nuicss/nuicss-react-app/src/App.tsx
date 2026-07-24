'use client';

import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const getThemeValue = (category: string, key: string, fallback?: string): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return fallback || '';
  return getComputedStyle(document.documentElement).getPropertyValue(`--nui-${category}-${key}`).trim() || fallback || '';
};

const DARK_MODE_SCRIPT = `
!(function () {
  try {
    var saved = localStorage.getItem('theme');
    var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`.trim();

// ============ NAVBAR ============
function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? 'hidden' : '';
  }, [mobileMenu]);

  const navItems = ['Features', 'Solutions', 'Pricing', 'Resources'];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-surface/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-default/50 dark:border-zinc-800/50 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group no-underline">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-info rounded-xl text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-default dark:text-white tracking-tight">NUI<span className="text-primary">CSS</span></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2 bg-surface-raised/50 dark:bg-zinc-800/50 backdrop-blur-md px-2 py-1 rounded-full border border-default/50 dark:border-zinc-700/50">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium text-subtle dark:text-zinc-400 hover:text-default dark:hover:text-white hover:bg-surface/80 dark:hover:bg-zinc-700/50 rounded-full transition-all no-underline"
                >
                  {item}
                </Link>
              ))}
              <Link to="/compliance" className="px-4 py-2 text-sm font-medium text-primary hover:text-white hover:bg-primary/80 rounded-full transition-all no-underline">
                Compliance Tests
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-subtle dark:text-zinc-400 hover:text-default dark:hover:text-white hover:bg-surface-raised dark:hover:bg-zinc-800 border border-transparent hover:border-default/50 dark:hover:border-zinc-700/50 transition-all"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
              <Link to="/signin" className="text-sm font-medium text-subtle dark:text-zinc-400 hover:text-default dark:hover:text-white transition-colors no-underline">
                Sign in
              </Link>
              <Link to="/signup" className="btn-brand">
                Start Free Trial
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(true)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-subtle dark:text-zinc-400 bg-surface-raised/50 dark:bg-zinc-800/50 backdrop-blur-md border border-default/50 dark:border-zinc-700/50 transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-max lg:hidden transition-all duration-300 ${mobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenu(false)}
          />
          <div className={`absolute right-0 top-0 h-full w-80 max-w-full bg-surface/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-2xl border-l border-default/50 dark:border-zinc-800/50 transition-transform duration-300 ${mobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b border-default/50 dark:border-zinc-800/50">
              <span className="text-lg font-semibold text-default dark:text-white">Menu</span>
              <button
                onClick={() => setMobileMenu(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-raised dark:bg-zinc-800 text-subtle dark:text-zinc-400 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  onClick={() => setMobileMenu(false)}
                  className="px-4 py-3 rounded-xl text-subtle dark:text-zinc-400 font-medium hover:bg-surface-raised dark:hover:bg-zinc-800 hover:text-default dark:hover:text-white transition-colors flex items-center justify-between no-underline"
                >
                  {item}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-default/50 dark:border-zinc-800/50 flex flex-col gap-3 bg-surface dark:bg-zinc-900">
              <Link to="/signin" className="btn w-full justify-center text-default dark:text-white">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary w-full justify-center">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
    </>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-3xl -z-10 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-info/20 rounded-full blur-3xl -z-10 opacity-40"></div>
      
      <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface/50 dark:bg-zinc-900/50 backdrop-blur-md border border-primary/20 shadow-sm mb-8 group cursor-pointer hover:bg-surface/80 dark:hover:bg-zinc-800/80 hover:scale-[1.02] transition-all animate-fade-in">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary group-hover:text-default dark:group-hover:text-white dark:hover:text-white dark:text-white transition-colors">
                NUI CSS v2.0 is live
              </span>
              <svg className="w-4 h-4 text-subtle dark:text-zinc-400 group-hover:text-default dark:group-hover:text-white dark:hover:text-white dark:text-white transition-colors group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-default dark:text-white leading-tight tracking-tighter">
              Ship products
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-info to-success">
                10x faster
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              The premium, aesthetic utility-first CSS framework for building modern interfaces. Includes built-in glassmorphism, semantic components, and absolute pixel perfection.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/features" className="btn-brand w-full sm:w-auto">
                Get Started
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/solutions" className="btn btn-lg w-full sm:w-auto rounded-full bg-surface/50 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-surface-raised dark:hover:bg-zinc-800 transition-all border border-default/50 dark:border-zinc-700/50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch demo
              </Link>
            </div>

            {/* Semantic Components Showcase */}
            <div className="mt-12 flex flex-col gap-4 p-6 rounded-2xl bg-surface/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-default/30 dark:border-zinc-800/50 shadow-xl">
               <div className="flex items-center justify-between">
                  <label className="label">Subscribe to Updates</label>
                  <span className="text-xs text-zinc-400">Join 50k+ devs</span>
               </div>
               <div className="flex gap-2">
                 <input type="email" placeholder="Email address..." className="input bg-surface-raised/50 dark:bg-zinc-800/50 dark:text-white dark:border-zinc-700" />
                 <button className="btn-primary shrink-0">Subscribe</button>
               </div>
               <div className="alert bg-success/10 text-success border-success/20 mt-2">
                 <span className="font-semibold">Success!</span> You've been added to the waitlist.
               </div>
            </div>

          </div>

          {/* Premium Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-info rounded-[2rem] blur-xl opacity-30 animate-pulse"></div>
            
            <div className="relative bg-surface/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-default/50 dark:border-zinc-700/50">
              
              {/* Glass Header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-default/30 dark:border-zinc-700/50 bg-surface-raised/30 dark:bg-zinc-800/30">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 hover:bg-error transition-colors" />
                  <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 hover:bg-warning transition-colors" />
                  <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 hover:bg-success transition-colors" />
                </div>
                <div className="flex flex-1 items-center gap-2 px-4 py-2 bg-surface/50 dark:bg-zinc-950/50 rounded-lg text-sm text-subtle dark:text-zinc-400">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search components...</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-default dark:text-white">Analytics</h3>
                    <p className="text-sm text-zinc-500">Real-time performance metrics</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                      AL
                    </div>
                  </div>
                </div>

                {/* Glass Cards */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-gradient-to-br from-surface dark:from-zinc-800 to-surface-raised dark:to-zinc-900 rounded-2xl border border-default/30 dark:border-zinc-700/50 shadow-lg group hover:-translate-y-1 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-500 font-medium mb-1 block">Total Revenue</span>
                    <span className="text-3xl font-bold text-default dark:text-white">$124,500</span>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success text-xs font-semibold">
                      +14.5%
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-surface dark:from-zinc-800 to-surface-raised dark:to-zinc-900 rounded-2xl border border-default/30 dark:border-zinc-700/50 shadow-lg group hover:-translate-y-1 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-500 font-medium mb-1 block">Active Users</span>
                    <span className="text-3xl font-bold text-default dark:text-white">84,392</span>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-info/10 text-info text-xs font-semibold">
                      +5.2%
                    </div>
                  </div>
                </div>

                {/* Animated Chart Placeholder */}
                <div className="h-[160px] w-full flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 100, 80, 120, 95].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-primary to-info rounded-t-lg opacity-80 hover:opacity-100 transition-all cursor-pointer"
                      style={{ height: `${(h / 120) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Build deployed component removed. */}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ FEATURES SECTION ============
function FeaturesSection() {
  const features = [
    {
      title: 'Zero Configuration',
      desc: 'No complex build steps or massive config files. Just drop in the script and start building immediately.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
      color: 'primary'
    },
    {
      title: 'JIT Compiler',
      desc: 'Lightning fast on-demand CSS generation that ensures your bundle size stays incredibly small.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />,
      color: 'success'
    },
    {
      title: 'Dynamic Variables',
      desc: 'Powered entirely by CSS variables. Change your theme on the fly without ever recompiling.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />,
      color: 'warning'
    },
    {
      title: 'Glassmorphism Built-in',
      desc: 'Premium glass effects, backdrop blurs, and translucent surfaces are available out of the box.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      color: 'info'
    },
    {
      title: 'Strictly Typed',
      desc: 'Built with TypeScript and strict interfaces so your autocomplete experience is always perfect.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
      color: 'error'
    },
    {
      title: 'Dark Mode Ready',
      desc: 'Seamlessly toggle between light and dark modes with a simple class change on your root element.',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
      color: 'default'
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-surface-raised/50 dark:bg-zinc-950 pt-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-default dark:text-white mb-4">Everything you need to build faster</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">NUI CSS gives you all the primitives required to build beautiful, accessible, and responsive interfaces without writing custom CSS.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-8 bg-surface dark:bg-zinc-900 rounded-2xl border border-default/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`w-12 h-12 rounded-xl bg-${f.color}/10 text-${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-default dark:text-white mb-3">{f.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FORMS SECTION ============
function FormsSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 -left-64 w-[600px] h-[600px] bg-warning/10 rounded-full blur-3xl -z-10 opacity-50"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-default dark:text-white mb-4">Pixel-perfect form controls</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">Build complex, accessible forms with beautifully styled inputs, checkboxes, radios, and switches. All fully themeable via CSS variables.</p>
            
            <ul className="space-y-4 mb-10">
              {['Accessible by default', 'Consistent cross-browser rendering', 'Built-in focus rings and validation states'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-default dark:text-zinc-300">
                  <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface dark:bg-zinc-900 p-8 md:p-10 rounded-3xl border border-default/50 dark:border-zinc-800/50 shadow-2xl">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label text-[12px] font-bold tracking-wider text-default dark:text-zinc-300">First Name</label>
                  <input type="text" className="input focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#18181b] dark:bg-zinc-950 dark:text-white dark:border-zinc-800" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label className="label text-[12px] font-bold tracking-wider text-default dark:text-zinc-300">Last Name</label>
                  <input type="text" className="input focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#18181b] dark:bg-zinc-950 dark:text-white dark:border-zinc-800" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label text-[12px] font-bold tracking-wider text-default dark:text-zinc-300">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input type="email" className="input focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#18181b] pl-10 dark:bg-zinc-950 dark:text-white dark:border-zinc-800" placeholder="jane@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="label text-sm font-medium text-default dark:text-zinc-300">Project Budget</label>
                <div className="relative">
                  <select className="input pr-10 dark:bg-zinc-950 dark:text-white dark:border-zinc-800 appearance-none">
                    <option>$5k - $10k</option>
                    <option>$10k - $25k</option>
                    <option>$25k+</option>
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button type="submit" className="btn-primary w-full">Create Account</button>
                <button type="button" className="btn w-full dark:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ SOLUTIONS SECTION ============
function SolutionsSection() {
  return (
    <section className="py-24 lg:py-32 bg-surface dark:bg-zinc-950 pt-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-default dark:text-white mb-4">Built for every use case</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">From marketing sites to complex dashboards, NUI CSS scales with your needs.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-primary/5 to-info/5 border border-primary/10">
            <h3 className="text-2xl font-bold text-default dark:text-white mb-4">Marketing & Landing Pages</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Build high-converting landing pages with beautiful gradients, glassmorphism, and smooth animations built right into the utility classes.</p>
            <div className="h-48 rounded-xl bg-surface/50 border border-default/50 dark:border-zinc-800 flex items-center justify-center">
              <span className="text-sm font-medium text-zinc-400">Landing Page Preview</span>
            </div>
          </div>
          <div className="p-10 rounded-3xl bg-gradient-to-br from-success/5 to-warning/5 border border-success/10">
            <h3 className="text-2xl font-bold text-default dark:text-white mb-4">Dashboards & Web Apps</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Construct dense data-heavy interfaces with perfect grid layouts, predictable spacing scales, and form controls.</p>
            <div className="h-48 rounded-xl bg-surface/50 border border-default/50 dark:border-zinc-800 flex items-center justify-center">
              <span className="text-sm font-medium text-zinc-400">Dashboard App Preview</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ LOGOS SECTION ============
function LogosSection() {
  const logos = ['Vercel', 'Stripe', 'Linear', 'Notion', 'Figma', 'Discord', 'Shopify', 'Slack'];

  return (
    <section className="py-16 border-y border-default/30 dark:border-zinc-800/50 bg-surface-raised/30 dark:bg-zinc-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <p className="text-center text-xs font-bold text-zinc-400 mb-10 uppercase tracking-widest">
          Trusted by industry leaders worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 gap-y-8">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-2xl font-bold text-zinc-500/50 hover:text-zinc-500 transition-colors cursor-pointer"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ PRICING SECTION ============
function PricingSection() {
  return (
    <section className="py-24 lg:py-32 bg-surface-raised/30 dark:bg-zinc-900/30 pt-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-default dark:text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">Start for free, upgrade when you need more power.</p>
        </div>
        <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
          <div className="p-8 rounded-3xl bg-surface dark:bg-zinc-900 border border-default/50 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold text-default dark:text-white mb-2">Community</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">Perfect for side projects.</p>
            <div className="mb-6"><span className="text-4xl font-extrabold text-default dark:text-white">$0</span><span className="text-zinc-500"> / forever</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-default dark:text-zinc-300">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Core CSS Engine
              </li>
              <li className="flex items-center gap-3 text-default dark:text-zinc-300">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Community Support
              </li>
            </ul>
            <Link to="/signup" className="btn w-full justify-center no-underline text-default dark:text-white">Get Started Free</Link>
          </div>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-info/5 border border-primary/20 shadow-xl relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">MOST POPULAR</div>
            <h3 className="text-xl font-bold text-default dark:text-white mb-2">Pro</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">For professional teams.</p>
            <div className="mb-6"><span className="text-4xl font-extrabold text-default dark:text-white">$49</span><span className="text-zinc-500"> / month</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-default dark:text-zinc-300">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                All Community features
              </li>
              <li className="flex items-center gap-3 text-default dark:text-zinc-300">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Premium Component Library
              </li>
              <li className="flex items-center gap-3 text-default dark:text-zinc-300">
                <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Priority Support
              </li>
            </ul>
            <Link to="/signup" className="btn-primary w-full justify-center no-underline">Upgrade to Pro</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ RESOURCES SECTION ============
function ResourcesSection() {
  return (
    <section className="py-24 lg:py-32 bg-surface dark:bg-zinc-950 border-t border-default/30 dark:border-zinc-800/50 pt-32 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-default dark:text-white mb-4">Resources & Guides</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">Everything you need to master NUI CSS.</p>
          </div>
          <button className="btn-brand">Browse all resources</button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="h-48 bg-surface-raised dark:bg-zinc-900 rounded-2xl mb-4 overflow-hidden border border-default/50 dark:border-zinc-800">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-info/20 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-default dark:text-white text-lg mb-2 group-hover:text-primary transition-colors">How to build a SaaS Dashboard</h3>
              <p className="text-zinc-500 text-sm">Learn the best practices for structuring complex dashboard layouts using CSS Grid and Flexbox.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ AUTH PAGE ============
function AuthPage({ type }: { type: 'signin' | 'signup' }) {
  return (
    <section className="py-32 flex items-center justify-center min-h-screen bg-surface-raised/30 dark:bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -z-10 opacity-50"></div>
      <div className="w-full max-w-md p-8 sm:p-10 bg-surface dark:bg-zinc-900 rounded-3xl border border-default/50 dark:border-zinc-800 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 inline-flex items-center justify-center bg-primary rounded-xl text-white mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-default dark:text-white">{type === 'signin' ? 'Welcome back' : 'Create an account'}</h1>
          <p className="text-zinc-500 mt-2">{type === 'signin' ? 'Enter your details to sign in.' : 'Start your 14-day free trial.'}</p>
        </div>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {type === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label text-sm font-medium">First Name</label>
                <input type="text" className="input dark:bg-zinc-950 dark:border-zinc-800 dark:text-white" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="label text-sm font-medium">Last Name</label>
                <input type="text" className="input dark:bg-zinc-950 dark:border-zinc-800 dark:text-white" placeholder="Doe" />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="label text-sm font-medium">Email</label>
            <input type="email" className="input dark:bg-zinc-950 dark:border-zinc-800 dark:text-white" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="label text-sm font-medium">Password</label>
            <input type="password" className="input dark:bg-zinc-950 dark:border-zinc-800 dark:text-white" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-3">{type === 'signin' ? 'Sign in' : 'Start free trial'}</button>
        </form>
        <p className="text-center mt-6 text-sm text-zinc-500">
          {type === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <Link to={type === 'signin' ? '/signup' : '/signin'} className="text-primary hover:underline">{type === 'signin' ? 'Sign up' : 'Sign in'}</Link>
        </p>
      </div>
    </section>
  );
}

// ============ CAROUSEL SECTION ============
function CarouselSection() {
  const items = [
    { title: "Dashboard Layout", color: "from-primary to-info" },
    { title: "Authentication Flows", color: "from-success to-warning" },
    { title: "Marketing Sites", color: "from-error to-primary" }
  ];

  return (
    <section className="py-24 bg-surface dark:bg-zinc-950 border-t border-default/30 dark:border-zinc-800/50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-default dark:text-white mb-4">Native Scroll-Snap Carousel</h2>
          <p className="text-zinc-500">Zero JavaScript state. Hardware accelerated scroll snapping built entirely with CSS primitives.</p>
        </div>
        
        <div className="relative rounded-3xl overflow-hidden border border-default/50 dark:border-zinc-800 shadow-2xl group bg-surface-raised dark:bg-zinc-900">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full h-[300px] scroll-smooth">
            {items.map((item, idx) => (
              <div 
                key={idx}
                className="w-full h-full flex-none snap-center flex flex-col items-center justify-center relative p-8 group/slide cursor-grab active:cursor-grabbing"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover/slide:opacity-30 transition-opacity duration-300`} />
                <h3 className="relative z-10 text-4xl font-extrabold text-default dark:text-white tracking-tight group-hover/slide:scale-105 transition-transform duration-300">{item.title}</h3>
              </div>
            ))}
          </div>
          <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {items.map((_, idx) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-default/30 dark:bg-zinc-700 backdrop-blur-md" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ MODAL SECTION ============
function ModalSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => dialogRef.current?.showModal();
  
  const closeModal = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.classList.add('closing');
    setTimeout(() => {
      dialog.close();
      dialog.classList.remove('closing');
    }, 200); 
  };

  return (
    <section className="py-24 bg-surface-raised/30 dark:bg-zinc-900/30">
      <div className="container mx-auto px-6 text-center">
        <button onClick={openModal} className="btn-primary hover:scale-105 transition-transform duration-200 hover:shadow-lg">
          Open Native Dialog
        </button>
      </div>

      <dialog 
        ref={dialogRef}
        className="backdrop:bg-black/40 backdrop:backdrop-blur-sm p-0 m-auto bg-transparent border-none outline-none max-w-md w-full z-modal"
        onClick={(e) => e.target === dialogRef.current && closeModal()}
      >
        <style>{`
          dialog[open] { animation: zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          dialog.closing { animation: zoomOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          dialog::backdrop { animation: fadeIn 0.2s ease-out forwards; }
          dialog.closing::backdrop { animation: fadeOut 0.2s ease-in forwards; }
        `}</style>
        <div className="relative w-full bg-surface dark:bg-zinc-900 rounded-2xl shadow-2xl border border-default/30 dark:border-zinc-700/50 p-6" onClick={e => e.stopPropagation()}>
          <h3 className="text-xl font-bold text-default dark:text-white mb-2">Deploy Application</h3>
          <p className="text-zinc-500 text-sm mb-6">Are you sure you want to deploy to production? This action will override the current build and takes effect immediately.</p>
          
          <div className="flex gap-3 justify-end">
            <button onClick={closeModal} className="btn dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-95 transition-all duration-200">Cancel</button>
            <button onClick={closeModal} className="btn-primary hover:scale-105 transition-transform duration-200 shadow-md">Confirm Deploy</button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

// ============ COMPLIANCE TESTS ============
function ComplianceSection() {
  return (
    <section className="py-32 bg-surface-raised dark:bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-12 border-b border-default/30 pb-6">
          <h1 className="text-4xl font-extrabold text-default dark:text-white mb-2 view-transition-[title]">Compliance Test Suite</h1>
          <p className="text-zinc-500">End-to-end testing of NUI CSS v2 modern features including container queries, subgrid, and logic-driven states.</p>
        </div>

        <div className="space-y-16">
          {/* 1. Container Queries Test */}
          <div>
            <h2 className="text-2xl font-bold mb-4">1. Container Queries (@container)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border border-primary/30 p-4 rounded-xl @container">
                <div className="bg-surface dark:bg-zinc-900 rounded-lg p-6 @sm:bg-primary/10 @md:bg-info/10 transition-colors">
                  <h3 className="font-bold @sm:text-xl @md:text-2xl">Narrow Container</h3>
                  <p className="text-sm mt-2">I change background color based on my container width, not the screen!</p>
                </div>
              </div>
              <div className="md:col-span-2 border border-info/30 p-4 rounded-xl @container">
                <div className="bg-surface dark:bg-zinc-900 rounded-lg p-6 flex flex-col @md:flex-row gap-4 @sm:bg-primary/10 @md:bg-info/10 transition-colors">
                  <div className="h-24 w-full @md:w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                  <div className="flex-1">
                    <h3 className="font-bold @sm:text-xl @md:text-2xl text-balance">Wide Container</h3>
                    <p className="text-sm mt-2 text-pretty">When this container hits the @md breakpoint, the layout changes to a row automatically without relying on standard media queries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Logic-Driven CSS (has) */}
          <div>
            <h2 className="text-2xl font-bold mb-4">2. Logic-Driven States (:has & group-has)</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="group flex items-start gap-4 p-6 rounded-2xl border border-default/50 hover:bg-surface/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                <input type="checkbox" className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary" />
                <div>
                  <div className="font-semibold group-has-[:checked]:text-primary transition-colors">Selectable Card</div>
                  <div className="text-sm text-zinc-500">I use the parent 'has-[:checked]' selector to highlight the entire card and 'group-has-[:checked]' to color this text. No JS required!</div>
                </div>
              </label>

              <div className="p-6 rounded-2xl border border-default/50 group flex flex-col gap-4">
                 <input type="text" placeholder="Type to trigger..." className="input peer" />
                 <div className="hidden peer-placeholder-shown:block text-sm text-zinc-500">Start typing above...</div>
                 <div className="hidden peer-focus:block text-sm text-info font-bold">Input is focused! (peer-focus)</div>
              </div>
            </div>
          </div>

          {/* 3. Advanced Layout & Snapping */}
          <div>
            <h2 className="text-2xl font-bold mb-4">3. Scroll Snapping & Masks</h2>
            <div className="relative">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 mask-image-[linear-gradient(to_right,black_80%,transparent)] hide-scrollbar">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="shrink-0 w-80 h-48 bg-gradient-to-br from-surface to-surface-raised rounded-2xl border border-default/50 shadow-lg snap-center flex items-center justify-center">
                    <span className="text-4xl font-extrabold text-zinc-300 dark:text-zinc-700">Card {item}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-zinc-500 mt-2">Horizontal scrolling uses 'snap-x snap-mandatory' and fades out at the right edge via 'mask-image'.</p>
          </div>

          {/* 4. Glassmorphism & Blend Modes */}
          <div>
            <h2 className="text-2xl font-bold mb-4">4. Glassmorphism & Blends</h2>
            <div className="relative h-64 rounded-3xl overflow-hidden flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
               {/* Overlay */}
               <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
               {/* Glass Box */}
               <div className="relative z-10 p-8 rounded-2xl bg-white/10 backdrop-blur-md backdrop-saturate-200 border border-white/20 shadow-2xl">
                 <h3 className="text-3xl font-black text-white text-shadow-md">Pure Glass</h3>
                 <p className="text-white/80 font-medium">Using mix-blend-multiply & backdrop-saturate</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ============ DEVELOPER DX SHOWCASE ============
function DeveloperSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Demo of getThemeValue API working with HTML Canvas API
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Fetch raw CSS variables dynamically from NUI CSS at runtime
        const primaryColor = getThemeValue('color', 'primary', '#2563eb');
        const successColor = getThemeValue('color', 'success', '#22c55e');

        ctx.clearRect(0, 0, 300, 150);
        
        // Draw primary circle
        ctx.beginPath();
        ctx.arc(100, 75, 40, 0, 2 * Math.PI);
        ctx.fillStyle = primaryColor;
        ctx.fill();

        // Draw success circle
        ctx.beginPath();
        ctx.arc(200, 75, 40, 0, 2 * Math.PI);
        ctx.fillStyle = successColor;
        ctx.fill();
        
        ctx.font = '12px sans-serif';
        ctx.fillStyle = getThemeValue('fg', 'default', '#000000');
        ctx.fillText('Canvas drawing using JS theme resolver!', 40, 140);
      }
    }
  }, []);

  return (
    <section className="py-24 bg-surface dark:bg-zinc-950">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-default dark:text-white mb-4">Elite Developer Experience</h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">NUI CSS v2 ships with powerful hooks, plugins, and deep configuration options.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* JS Theme Hook Demo */}
          <div className="p-8 bg-surface-raised dark:bg-zinc-900 rounded-3xl border border-default/50 dark:border-zinc-800 shadow-xl">
            <h3 className="text-xl font-bold mb-2">JS Theme Resolution</h3>
            <p className="text-sm text-zinc-500 mb-6">Need to draw on a Canvas or use a charting library? Our 'getThemeValue' helper retrieves live CSS properties natively.</p>
            <div className="bg-surface dark:bg-zinc-950 rounded-xl border border-default/30 flex items-center justify-center p-4">
               <canvas ref={canvasRef} width={300} height={150} className="max-w-full" />
            </div>
          </div>

          {/* Custom RegExp Plugin API Demo */}
          <div className="p-8 bg-surface-raised dark:bg-zinc-900 rounded-3xl border border-default/50 dark:border-zinc-800 shadow-xl">
            <h3 className="text-xl font-bold mb-2">Custom RegEx Plugins</h3>
            <p className="text-sm text-zinc-500 mb-6">We injected 'nui-hero-text' and 'popout-[color]' directly into the 'nuicss.config.ts' rules array. The JIT engine instantly compiles it!</p>
            <div className="bg-surface dark:bg-zinc-950 rounded-xl border border-default/30 flex items-center justify-center p-8 overflow-hidden h-[180px]">
               {/* Custom classes injected via plugin */}
               <h1 className="nui-hero-text text-primary popout-[#000000] dark:popout-[#3b82f6]">Wow!</h1>
            </div>
          </div>

          {/* Arbitrary Value Complex Grid */}
          <div className="md:col-span-2 p-8 bg-surface-raised dark:bg-zinc-900 rounded-3xl border border-default/50 dark:border-zinc-800 shadow-xl">
            <h3 className="text-xl font-bold mb-2">Complex Arbitrary Compilation</h3>
            <p className="text-sm text-zinc-500 mb-6">NUI CSS instantly compiles ultra-complex arbitrary syntax at runtime (e.g. grid-cols-[200px_minmax(0,1fr)_100px]).</p>
            
            {/* The showcase of Arbitrary Value layout */}
            <div className="grid grid-cols-[100px_minmax(0,1fr)_150px] gap-4 h-32">
               <div className="bg-primary/20 border border-primary/50 rounded-lg flex items-center justify-center text-xs font-bold text-primary">100px fixed</div>
               <div className="bg-success/20 border border-success/50 rounded-lg flex items-center justify-center text-xs font-bold text-success">minmax(0, 1fr) fluid</div>
               <div className="bg-info/20 border border-info/50 rounded-lg flex items-center justify-center text-xs font-bold text-info">150px fixed</div>
            </div>
          </div>

          {/* Anti-FOUC Dark Mode Code snippet showcase */}
          <div className="md:col-span-2 p-8 bg-surface-raised dark:bg-zinc-900 rounded-3xl border border-default/50 dark:border-zinc-800 shadow-xl overflow-hidden">
             <h3 className="text-xl font-bold mb-2">Anti-FOUC Script String</h3>
             <p className="text-sm text-zinc-500 mb-6">Prevent the dreaded Flash of Unstyled Content by dropping this exported string straight into your document head.</p>
             <pre className="bg-zinc-950 p-4 rounded-xl text-zinc-400 text-xs overflow-x-auto select-all">
                {`<script dangerouslySetInnerHTML={{ __html: DARK_MODE_SCRIPT }} />`}
                {`\n\n// Generates:\n`}
                {DARK_MODE_SCRIPT}
             </pre>
          </div>

        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="bg-surface dark:bg-zinc-950 border-t border-default/50 dark:border-zinc-800/50 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 no-underline">
              <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-default dark:text-white">NUI CSS</span>
            </Link>
            <p className="text-zinc-500 text-sm mb-6 max-w-xs">
              The premium, aesthetic utility-first CSS framework for modern web development.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-default dark:text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link to="/resources" className="hover:text-primary transition-colors no-underline">Documentation</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors no-underline">Components</Link></li>
              <li><Link to="/solutions" className="hover:text-primary transition-colors no-underline">Templates</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-default/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Nofinite. All rights reserved.
          </p>
          <div className="flex gap-4 text-zinc-500">
             <Link to="#" className="hover:text-default dark:hover:text-white transition-colors no-underline">Twitter</Link>
             <Link to="#" className="hover:text-default dark:hover:text-white transition-colors no-underline">GitHub</Link>
             <Link to="#" className="hover:text-default dark:hover:text-white transition-colors no-underline">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-page dark:bg-zinc-950 text-default dark:text-white font-sans selection:bg-primary/30 selection:text-primary flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<><HeroSection /><LogosSection /><FormsSection /><CarouselSection /><ModalSection /><DeveloperSection /></>} />
            <Route path="/features" element={<FeaturesSection />} />
            <Route path="/solutions" element={<SolutionsSection />} />
            <Route path="/pricing" element={<PricingSection />} />
            <Route path="/resources" element={<ResourcesSection />} />
            <Route path="/signin" element={<AuthPage type="signin" />} />
            <Route path="/signup" element={<AuthPage type="signup" />} />
            <Route path="/compliance" element={<ComplianceSection />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}