'use client';

import { useState, useEffect } from 'react';

// ============ NAVBAR ============
function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? 'hidden' : '';
  }, [mobileMenu]);

  const navItems = ['Features', 'Solutions', 'Pricing', 'Resources'];

  return (
    <>
      <nav
        className={`nui-fixed nui-top-0 nui-left-0 nui-right-0 nui-z-50 nui-transition ${scrolled ? 'nui-bg-surface nui-border-b nui-border-default nui-shadow-md' : ''
          }`}
      >
        <div className="nui-container nui-mx-auto nui-px-6 nui-py-4">
          <div className="nui-flex nui-items-center nui-justify-between nui-gap-8">
            {/* Logo */}
            <a href="#" className="nui-flex nui-items-center nui-gap-3">
              <div className="nui-w-10 nui-h-10 nui-flex nui-items-center nui-justify-center nui-bg-primary nui-rounded-xl nui-text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="nui-text-xl nui-font-bold nui-text-default">NUI CSS</span>
            </a>

            {/* Desktop Nav */}
            <div className="md:nui-hidden lg:nui-flex nui-items-center nui-gap-1">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="nui-px-4 nui-py-2 nui-text-sm nui-font-medium nui-text-subtle nui-rounded-lg nui-transition"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="md:nui-hidden lg:nui-flex nui-items-center nui-gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="nui-w-10 nui-h-10 nui-flex nui-items-center nui-justify-center nui-rounded-lg nui-text-subtle nui-border nui-border-default nui-transition"
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
              <a href="#" className="nui-px-4 nui-py-2 nui-text-sm nui-font-medium nui-text-subtle nui-transition">
                Sign in
              </a>
              <a href="#" className="nui-btn nui-btn-primary nui-btn-sm">
                Start Free Trial
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(true)}
              className="lg:nui-hidden nui-w-11 nui-h-11 nui-flex nui-items-center nui-justify-center nui-rounded-lg nui-text-subtle nui-border nui-border-default nui-transition"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div className="nui-fixed nui-inset-0 nui-z-100 lg:nui-hidden">
          <div
            className="nui-absolute nui-inset-0 nui-bg-black nui-opacity-60"
            onClick={() => setMobileMenu(false)}
          />
          <div className="nui-absolute nui-right-0 nui-top-0 nui-h-full nui-w-80 nui-max-w-full nui-bg-surface nui-shadow-xl">
            <div className="nui-flex nui-items-center nui-justify-between nui-p-6 nui-border-b nui-border-default">
              <span className="nui-text-lg nui-font-semibold nui-text-default">Menu</span>
              <button
                onClick={() => setMobileMenu(false)}
                className="nui-w-10 nui-h-10 nui-flex nui-items-center nui-justify-center nui-rounded-lg nui-text-subtle nui-transition"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="nui-p-6 nui-flex nui-flex-col nui-gap-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenu(false)}
                  className="nui-px-4 nui-py-3 nui-rounded-xl nui-text-subtle nui-font-medium nui-transition nui-flex nui-items-center nui-justify-between"
                >
                  {item}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              ))}
            </nav>
            <div className="nui-absolute nui-bottom-0 nui-left-0 nui-right-0 nui-p-6 nui-border-t nui-border-default nui-flex nui-flex-col nui-gap-3 nui-bg-surface">
              <a href="#" className="nui-btn nui-btn-outline nui-w-full">
                Sign in
              </a>
              <a href="#" className="nui-btn nui-btn-primary nui-w-full">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  return (
    <section className="nui-relative nui-min-h-screen nui-flex nui-items-center nui-pt-20 nui-pl-12 nui-pr-12 nui-overflow-hidden">
      
      <div className="nui-container nui-mx-auto nui-px-6 nui-py-20 lg:nui-py-32 nui-relative nui-z-10">
        <div className="nui-grid lg:nui-grid-cols-2 nui-gap-16 lg:nui-gap-24 nui-items-center">
          {/* Content */}
          <div className="nui-text-center ">
            {/* Badge */}
            <div className="nui-inline-flex nui-items-center nui-gap-3 nui-px-5 nui-py-2 nui-rounded-full nui-bg-surface nui-border nui-border-default nui-shadow-sm nui-mb-8">
              <span className="nui-w-2 nui-h-2 nui-rounded-full nui-bg-success" />
              <span className="nui-text-sm nui-font-semibold nui-text-default">
                🎉 Version 2.0 is here
              </span>
            </div>

            {/* Headline */}
            <h1 className="nui-text-4xl sm:nui-text-5xl lg:nui-text-6xl nui-font-bold nui-text-default nui-leading-tight">
              Ship products
              <span className="nui-inline-block nui-mx-2 nui-text-primary">10x</span>
              faster
              <span className="nui-block nui-mt-3 nui-text-primary">
                with NUI CSS
              </span>
            </h1>

            {/* Description */}
            <p className="nui-mt-8 nui-text-lg lg:nui-text-xl nui-text-subtle nui-leading-relaxed nui-max-w-xl nui-mx-auto lg:nui-mx-0">
              The all-in-one platform that empowers teams to build, deploy, and scale modern applications with unprecedented speed.
            </p>

            {/* CTAs */}
            <div className="nui-mt-10 nui-flex nui-flex-col sm:nui-flex-row nui-items-center nui-gap-4 nui-justify-center border ">
              <a href="#" className="nui-btn nui-btn-primary nui-btn-lg nui-w-full sm:nui-w-auto">
                Start building free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a href="#" className="nui-btn nui-btn-outline nui-btn-lg nui-w-full sm:nui-w-auto">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch demo
              </a>
            </div>

            {/* Stats */}
            <div className="nui-mt-14 nui-pt-8 nui-border-t nui-border-default">
              <div className="nui-grid nui-grid-cols-3 nui-gap-8">
                {[
                  { value: '50K+', label: 'Developers' },
                  { value: '99.99%', label: 'Uptime' },
                  { value: '150ms', label: 'Avg. Response' },
                ].map((stat, i) => (
                  <div key={i} className="nui-text-center ">
                    <div className="nui-text-2xl lg:nui-text-3xl nui-font-bold nui-text-default">{stat.value}</div>
                    <div className="nui-text-sm nui-text-muted nui-mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="nui-relative nui-hidden lg:nui-block">
            <div className="nui-card nui-rounded-2xl nui-overflow-hidden nui-shadow-xl nui-border nui-border-default">
              {/* Browser Header */}
              <div className="nui-flex nui-items-center nui-gap-4 nui-px-5 nui-py-4 nui-bg-subtle nui-border-b nui-border-default">
                <div className="nui-flex nui-gap-2">
                  <span className="nui-w-3 nui-h-3 nui-rounded-full nui-bg-error" />
                  <span className="nui-w-3 nui-h-3 nui-rounded-full nui-bg-warning" />
                  <span className="nui-w-3 nui-h-3 nui-rounded-full nui-bg-success" />
                </div>
                <div className="nui-flex nui-flex-1 nui-items-center nui-gap-2 nui-px-4 nui-py-2 nui-bg-surface nui-border nui-border-default nui-rounded-lg">
                  <svg className="nui-w-4 nui-h-4 nui-text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="nui-text-sm nui-text-muted">app.NUI CSS.dev/dashboard</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="nui-p-6 nui-bg-surface">
                {/* Welcome */}
                <div className="nui-flex nui-items-center nui-justify-between nui-mb-6">
                  <div>
                    <h3 className="nui-text-lg nui-font-semibold nui-text-default">Welcome back, Alex</h3>
                    <p className="nui-text-sm nui-text-muted">Your projects are performing great</p>
                  </div>
                  <div className="nui-flex nui-gap-2">
                    <button className="nui-btn nui-btn-outline nui-btn-sm">Export</button>
                    <button className="nui-btn nui-btn-primary nui-btn-sm">+ New</button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="nui-grid nui-grid-cols-3 nui-gap-4 nui-mb-6">
                  {[
                    { label: 'Revenue', value: '$128.4K', change: '+23.5%', positive: true },
                    { label: 'Users', value: '24,891', change: '+12.2%', positive: true },
                    { label: 'Conversion', value: '4.28%', change: '+0.8%', positive: true },
                  ].map((stat, i) => (
                    <div key={i} className="nui-p-4 nui-bg-subtle nui-rounded-xl nui-border nui-border-default">
                      <span className="nui-text-xs nui-text-muted nui-font-medium nui-block nui-mb-2">
                        {stat.label}
                      </span>
                      <span className="nui-text-xl nui-font-bold nui-text-default nui-block">{stat.value}</span>
                      <span className={`nui-text-xs nui-font-semibold ${stat.positive ? 'nui-text-success' : 'nui-text-error'}`}>
                        {stat.change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chart Placeholder */}
                <div className="nui-p-5 nui-bg-subtle nui-rounded-xl nui-border nui-border-default">
                  <div className="nui-flex nui-items-center nui-justify-between nui-mb-4">
                    <span className="nui-text-sm nui-font-semibold nui-text-default">Revenue Overview</span>
                    <div className="nui-flex nui-gap-1">
                      {['7D', '30D', '90D'].map((period, i) => (
                        <button
                          key={period}
                          className={`nui-px-3 nui-py-1 nui-text-xs nui-font-medium nui-rounded-md ${i === 1 ? 'nui-bg-primary nui-text-white' : 'nui-text-muted'
                            }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="nui-flex nui-items-end nui-gap-1" style={{ height: '100px' }}>
                    {[35, 52, 48, 72, 58, 85, 68, 92, 75, 88, 82, 95].map((h, i) => (
                      <div
                        key={i}
                        className="nui-flex-1 nui-bg-primary nui-rounded-t"
                        style={{ height: `${h}%`, opacity: 0.7 + (h / 300) }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Notification - Success */}
            <div
              className="nui-absolute nui-card nui-p-4 nui-rounded-xl nui-shadow-lg nui-border nui-border-default nui-bg-surface"
              style={{ top: '60px', right: '-40px' }}
            >
              <div className="nui-flex nui-items-center nui-gap-3">
                <div className="nui-w-10 nui-h-10 nui-rounded-full nui-bg-success nui-bg-opacity-10 nui-flex nui-items-center nui-justify-center nui-text-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <span className="nui-text-sm nui-font-semibold nui-text-default nui-block">Build successful</span>
                  <span className="nui-text-xs nui-text-muted">Just now</span>
                </div>
              </div>
            </div>

            {/* Floating Notification - Users */}
            <div
              className="nui-absolute nui-card nui-p-4 nui-rounded-xl nui-shadow-lg nui-border nui-border-default nui-bg-surface"
              style={{ bottom: '80px', left: '-40px' }}
            >
              <div className="nui-flex nui-items-center nui-gap-3">
                <div className="nui-w-10 nui-h-10 nui-rounded-full nui-bg-primary nui-bg-opacity-10 nui-flex nui-items-center nui-justify-center nui-text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <span className="nui-text-sm nui-font-semibold nui-text-default nui-block">+847 new users</span>
                  <span className="nui-text-xs nui-text-muted">Last 24 hours</span>
                </div>
              </div>
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
    <section className="nui-py-16 nui-border-y nui-border-default nui-bg-subtle">
      <div className="nui-container nui-mx-auto nui-px-6">
        <p className="nui-text-center nui-text-sm nui-font-medium nui-text-muted nui-mb-10 nui-uppercase nui-tracking-wide">
          Trusted by industry leaders worldwide
        </p>
        <div className="nui-flex nui-flex-wrap nui-items-center nui-justify-center nui-gap-12 nui-gap-y-6">
          {logos.map((logo) => (
            <div
              key={logo}
              className="nui-text-2xl nui-font-bold nui-text-muted nui-opacity-50 nui-transition"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FEATURES SECTION ============
function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Lightning Fast',
      description: 'Edge-first architecture delivering sub-50ms response times globally.',
      color: 'warning',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Enterprise Security',
      description: 'SOC2 Type II, HIPAA compliant with end-to-end encryption.',
      color: 'success',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Real-time Analytics',
      description: 'Live dashboards with custom metrics and AI-powered insights.',
      color: 'info',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Team Collaboration',
      description: 'Real-time editing with granular permissions and audit logs.',
      color: 'primary',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Developer First',
      description: 'Type-safe SDKs, webhooks, and comprehensive API documentation.',
      color: 'secondary',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: 'Auto Scaling',
      description: 'Intelligent infrastructure that scales from 0 to millions seamlessly.',
      color: 'error',
    },
  ];

  return (
    <section id="features" className="nui-py-24 lg:nui-py-32">
      <div className="nui-container nui-px-6">
        {/* Header */}
        <div className="nui-text-center nui-max-w-3xl nui-mx-auto nui-mb-16">
          <span className="nui-badge nui-badge-primary nui-mb-6">Powerful Features</span>
          <h2 className="nui-text-3xl sm:nui-text-4xl lg:nui-text-5xl nui-font-bold nui-text-default">
            Everything you need to
            <span className="nui-block nui-mt-2 nui-text-primary">
              build at any scale
            </span>
          </h2>
          <p className="nui-mt-6 nui-text-lg nui-text-subtle nui-max-w-2xl nui-mx-auto">
            A complete toolkit designed to help you ship faster, iterate quickly, and delight your users.
          </p>
        </div>

        {/* Features Grid */}
        <div className="nui-container nui-mx-auto nui-items-center nui-px-6">
          <div className="nui-flex nui-flex-wrap justify-center items-center   nui-gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              style={{maxWidth:"400px"}}
              className=" nui-p-6 md:nui-p-8 nui-rounded-2xl nui-border nui-mx-auto nui-border-default nui-transition hover:nui-shadow-lg"
            >
              {/* Icon */}
              <div
                className={`nui-w-12 nui-h-12 md:nui-w-14 md:nui-h-14 nui-rounded-xl nui-flex nui-items-center nui-justify-center nui-mb-5 md:nui-mb-6 nui-bg-${feature.color}/10 nui-text-${feature.color}`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="nui-text-lg md:nui-text-xl nui-font-semibold nui-mb-2 md:nui-mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="nui-text-sm md:nui-text-base nui-text-subtle nui-leading-relaxed nui-mb-5 md:nui-mb-6">
                {feature.description}
              </p>

              {/* CTA */}
              <a
                href="#"
                className="nui-inline-flex nui-items-center nui-gap-2 nui-text-sm nui-font-semibold nui-text-primary"
              >
                Learn more
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>
        </div>
        </div>
    </section>
  );
}

// ============ HOW IT WORKS SECTION ============
function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Deploy', icon: '🚀' },
    { name: 'Monitor', icon: '📊' },
    { name: 'Optimize', icon: '⚡' },
  ];

  const content = [
    {
      title: 'Deploy with confidence',
      description: 'One-click deployments with automatic rollbacks, preview environments, and instant CDN propagation.',
      features: ['Zero-downtime deployments', 'Automatic SSL certificates', 'Edge caching worldwide'],
    },
    {
      title: 'Monitor everything',
      description: 'Real-time metrics, error tracking, and performance insights all in one unified dashboard.',
      features: ['Live error tracking', 'Performance metrics', 'Custom alerting'],
    },
    {
      title: 'Optimize for growth',
      description: 'AI-powered recommendations to improve performance, reduce costs, and scale efficiently.',
      features: ['Cost optimization', 'Auto-scaling rules', 'Performance suggestions'],
    },
  ];

  return (
    <section className="nui-py-24 lg:nui-py-32 nui-bg-subtle">
      <div className="nui-container nui-mx-auto nui-px-6">
        {/* Header */}
        <div className="nui-text-center nui-max-w-3xl nui-mx-auto nui-mb-16">
          <span className="nui-badge nui-badge-success nui-mb-6">How it works</span>
          <h2 className="nui-text-3xl sm:nui-text-4xl lg:nui-text-5xl nui-font-bold nui-text-default">
            From code to production in minutes
          </h2>
          <p className="nui-mt-4 nui-text-lg nui-text-subtle">
            See how easy it is to build, deploy, and scale with NUI CSS
          </p>
        </div>

        {/* Tabs */}
        <div className="nui-flex nui-items-center nui-justify-center nui-gap-2 nui-mb-12">
          <div className="nui-inline-flex nui-items-center nui-gap-1 nui-p-1 nui-rounded-xl nui-bg-surface nui-border nui-border-default">
            {tabs.map((tab, i) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(i)}
                className={`nui-flex nui-items-center nui-gap-2 nui-px-5 nui-py-2 nui-rounded-lg nui-text-sm nui-font-medium nui-transition ${activeTab === i
                    ? 'nui-bg-primary nui-text-white'
                    : 'nui-text-subtle'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="nui-container nui-mx-auto nui-items-center nui-px-6">
          <div className="nui-grid nui-text-center nui-justify-center nui-items-center " >
            <h3 className="nui-text-2xl lg:nui-text-3xl nui-font-bold nui-text-default nui-mb-4">
              {content[activeTab].title}
            </h3>
            <p className="nui-text-lg nui-text-subtle nui-mb-8">{content[activeTab].description}</p>

            <ul className="nui-flex nui-flex-col nui-items-center nui-p-0" >
              {content[activeTab].features.map((feature, i) => (
                <li key={i} className="nui-flex nui-items-center nui-gap-3">
                  <div className="nui-w-6 nui-h-6 nui-rounded-full nui-bg-success nui-bg-opacity-10 nui-flex nui-items-center nui-justify-center nui-text-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="nui-text-default nui-font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <a href="#" className="nui-btn nui-btn-primary nui-my-8">
              Get started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Terminal */}
          <div className="nui-order-1 lg:nui-order-2">
            <div className="nui-rounded-2xl nui-shadow-xl nui-overflow-hidden nui-border nui-border-default" style={{ backgroundColor: '#0d1117' }}>
              <div className="nui-flex nui-items-center nui-gap-3 nui-px-4 nui-py-3 nui-border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="nui-flex nui-gap-2">
                  <span className="nui-w-3 nui-h-3 nui-rounded-full" style={{ backgroundColor: '#ff5f56' }} />
                  <span className="nui-w-3 nui-h-3 nui-rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
                  <span className="nui-w-3 nui-h-3 nui-rounded-full" style={{ backgroundColor: '#27c93f' }} />
                </div>
                <span className="nui-text-xs nui-text-white nui-opacity-40">Terminal</span>
              </div>
              <div className="nui-p-5" style={{ fontFamily: 'monospace' }}>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#10b981' }}>➜</span>
                  <span style={{ color: '#06b6d4' }}> ~/my-app</span>
                </div>
                <div className="nui-mt-2" style={{ color: 'white' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>$</span> npx NUI CSS deploy
                </div>
                <div className="nui-mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <div>▸ Building project...</div>
                  <div>▸ Optimizing assets...</div>
                  <div>▸ Deploying to edge...</div>
                </div>
                <div className="nui-mt-3">
                  <span style={{ color: '#10b981' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}> Deployed to </span>
                  <span style={{ color: '#06b6d4', textDecoration: 'underline' }}>my-app.NUI CSS.dev</span>
                </div>
                <div className="nui-mt-4 nui-flex nui-items-center nui-gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="nui-w-2 nui-h-2 nui-rounded-full nui-bg-success" />
                  <span>Ready in 2.3s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ TESTIMONIALS SECTION ============
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "NUI CSS completely transformed how we ship products. What used to take weeks now takes hours.",
      author: "Sarah Chen",
      role: "CTO",
      company: "TechFlow",
      avatar: "SC",
    },
    {
      quote: "The developer experience is unmatched. Our team productivity has increased by 300%.",
      author: "Marcus Rodriguez",
      role: "Lead Engineer",
      company: "ScaleAI",
      avatar: "MR",
    },
    {
      quote: "We reduced infrastructure costs by 60% while significantly improving performance.",
      author: "Emily Watson",
      role: "VP Engineering",
      company: "Bloom",
      avatar: "EW",
    },
  ];

  return (
    <section id="testimonials" className="nui-py-24 lg:nui-py-32">
      <div className="nui-container nui-mx-auto nui-px-6">
        {/* Header */}
        <div className="nui-text-center nui-max-w-3xl nui-mx-auto nui-mb-16">
          <span className="nui-badge nui-badge-warning nui-mb-6">⭐ Testimonials</span>
          <h2 className="nui-text-3xl sm:nui-text-4xl lg:nui-text-5xl nui-font-bold nui-text-default">
            Loved by teams worldwide
          </h2>
          <p className="nui-mt-4 nui-text-lg nui-text-subtle">
            See why thousands of developers choose NUI CSS
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="nui-container nui-mx-auto nui-items-center nui-px-6">
          <div className="nui-flex nui-flex-wrap nui-items-center nui-justify-center nui-gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{ maxWidth: "300px", backgroundColor:"#E0E0E0"}}
              className=" nui-p-8 nui-shadow-lg nui-rounded-2xl nui-border nui-border-default nui-relative"
            >
              {/* Quote Icon */}
              <div className="nui-absolute nui-top-6 nui-right-6 nui-w-12 nui-h-12 nui-rounded-full nui-bg-subtle nui-flex nui-items-center nui-justify-center nui-text-muted">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="nui-flex nui-gap-1 nui-mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="nui-w-5 nui-h-5 nui-text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="nui-text-lg nui-text-default nui-leading-relaxed nui-mb-8">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="nui-flex nui-items-center nui-gap-4">
                <div className="nui-w-12 nui-h-12 nui-rounded-full nui-bg-primary nui-flex nui-items-center nui-justify-center nui-text-white nui-font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <span className="nui-font-semibold nui-text-default nui-block">{testimonial.author}</span>
                  <span className="nui-text-sm nui-text-secondary">
                    {testimonial.role} at {testimonial.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="nui-mt-16 nui-flex nui-flex-wrap nui-items-center nui-justify-center nui-gap-8 nui-pt-12 nui-border-t nui-border-default">
          {[
            { icon: '🏆', label: 'Product of the Year', sublabel: 'Product Hunt' },
            { icon: '⭐', label: '4.9/5 Rating', sublabel: 'G2 Crowd' },
            { icon: '🎯', label: '99.99% Uptime', sublabel: 'Last 12 months' },
            { icon: '🚀', label: '10B+ Requests', sublabel: 'Monthly' },
          ].map((item, i) => (
            <div key={i} className="nui-text-center">
              <span className="nui-text-2xl nui-block nui-mb-1">{item.icon}</span>
              <span className="nui-text-sm nui-font-semibold nui-text-default nui-block">{item.label}</span>
              <span className="nui-text-xs nui-text-muted">{item.sublabel}</span>
            </div>
          ))}
        </div>
        </div>
        </div>
    </section>
  );
}

// ============ PRICING SECTION ============
function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Hobby',
      description: 'Perfect for side projects',
      price: { monthly: 0, annual: 0 },
      features: ['3 projects', '1GB storage', 'Community support', 'Basic analytics', 'Deploy previews'],
      cta: 'Get started free',
      popular: false,
    },
    {
      name: 'Pro',
      description: 'For professionals and teams',
      price: { monthly: 29, annual: 24 },
      features: [
        'Unlimited projects',
        '100GB storage',
        'Priority support',
        'Advanced analytics',
        'Custom domains',
        'Team collaboration',
        'API access',
        'SSO authentication',
      ],
      cta: 'Start free trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      price: { monthly: 99, annual: 79 },
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Dedicated support',
        'Custom SLA',
        'On-premise option',
        'Advanced security',
        'Audit logs',
        'Custom contracts',
      ],
      cta: 'Contact sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="nui-py-24 lg:nui-py-32 nui-bg-subtle">
      <div className="nui-container nui-mx-auto nui-px-6 nui-max-w-6xl">
        {/* Header */}
        <div className="nui-text-center nui-max-w-3xl nui-mx-auto nui-mb-12">
          <span className="nui-badge nui-badge-info nui-mb-6">💎 Pricing</span>
          <h2 className="nui-text-3xl sm:nui-text-4xl lg:nui-text-5xl nui-font-bold nui-text-default">
            Simple, transparent pricing
          </h2>
          <p className="nui-mt-4 nui-text-lg nui-text-subtle">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Toggle */}
        <div className="nui-flex nui-items-center nui-justify-center nui-gap-4 nui-mb-12">
          <span className={`nui-text-sm nui-font-medium ${!annual ? 'nui-text-default' : 'nui-text-muted'}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`nui-relative nui-w-14 nui-h-8 nui-rounded-full nui-transition ${annual ? 'nui-bg-primary' : 'nui-bg-muted nui-opacity-30'
              }`}
          >
            <span
              className="nui-absolute nui-top-1 nui-w-6 nui-h-6 nui-rounded-full nui-bg-white nui-shadow-md nui-transition"
              style={{ left: annual ? '28px' : '4px' }}
            />
          </button>
          <span className={`nui-text-sm nui-font-medium ${annual ? 'nui-text-default' : 'nui-text-muted'}`}>
            Annual
          </span>
          <span className="nui-badge nui-badge-success nui-badge-sm">Save 20%</span>
        </div>

        {/* Pricing Cards */}
        <div className="nui-container  nui-items-center nui-px-6">
          <div className="nui-flex nui-flex-wrap nui-items-center nui-justify-center nui-gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="nui-relative nui-p-8 nui-rounded-2xl nui-transition nui-bg-primary nui-text-white nui-shadow-xl "   >
              

              <div className="nui-mb-6">
                <h3 className="nui-text-xl nui-font-bold nui-mb-2 ">
                  {plan.name}
                </h3>
                <p className="nui-text-sm ">
                  {plan.description}
                </p>
              </div>

              <div className="nui-mb-8">
                <span className={`nui-text-5xl nui-font-bold ${plan.popular ? '' : 'nui-text-default'}`}>
                  ${annual ? plan.price.annual : plan.price.monthly}
                </span>
                {plan.price.monthly > 0 && (
                  <span className={plan.popular ? 'nui-opacity-70' : 'nui-text-muted'}>/month</span>
                )}
              </div>

              <ul className="nui-space-y-3 nui-mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="nui-flex nui-items-start nui-gap-3">
                    <svg
                      className="nui-w-5 nui-h-5 nui-flex-shrink-0 nui-mt-0.5 nui-text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="nui-text-sm nui-text-subtle">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className="nui-w-full nui-py-3 nui-px-6 nui-rounded-xl nui-font-semibold nui-transition
                    
                    nui-bg-primary nui-text-white"
              >
                {plan.cta}
              </button>
            </div>
          ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="nui-mt-16 nui-text-center">
          <p className="nui-text-sm nui-text-muted nui-mb-4">Trusted payment & security</p>
          <div className="nui-flex nui-items-center nui-justify-center nui-gap-6">
            {['🔒 SSL Secure', '💳 Stripe', '🛡️ SOC2'].map((badge, i) => (
              <span key={i} className="nui-text-sm nui-text-muted nui-opacity-60">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ FAQ SECTION ============
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does the free trial work?',
      answer:
        'Start with a 14-day free trial of our Pro plan. No credit card required. You get full access to all features during the trial period.',
    },
    {
      question: 'Can I change my plan later?',
      answer:
        "Absolutely! You can upgrade, downgrade, or cancel your plan at any time from your dashboard. Changes take effect immediately.",
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for Enterprise plans.',
    },
    {
      question: 'Is there a setup fee?',
      answer:
        'No setup fees, ever. You only pay for your monthly or annual subscription. All plans include free onboarding.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.",
    },
  ];

  return (
    <section id="faq" className="nui-py-24 lg:nui-py-32">
      <div className="nui-container nui-mx-auto nui-px-6 nui-max-w-3xl">
        {/* Header */}
        <div className="nui-text-center nui-mb-16">
          <span className="nui-badge nui-badge-error nui-mb-6">❓ FAQ</span>
          <h2 className="nui-text-3xl sm:nui-text-4xl nui-font-bold nui-text-default">
            Frequently asked questions
          </h2>
          <p className="nui-mt-4 nui-text-lg nui-text-subtle">
            Can't find what you're looking for?{' '}
            <a href="#" className="nui-text-primary nui-font-medium">
              Contact our team
            </a>
          </p>
        </div>

        {/* Accordion */}
        <div className="nui-space-y-4 nui-px-6 nui-w-max">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`nui-rounded-xl nui-border nui-transition ${openIndex === index ? 'nui-border-primary nui-bg-primary nui-bg-opacity-5' : 'nui-border-default nui-bg-surface'
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="nui-w-full nui-flex nui-items-center nui-justify-between nui-px-6 nui-py-5 nui-text-left"
              >
                <span className="nui-text-default nui-font-semibold nui-pr-4">{faq.question}</span>
                <span
                  className={`nui-flex-shrink-0 nui-w-8 nui-h-8 nui-rounded-full nui-flex nui-items-center nui-justify-center nui-transition ${openIndex === index ? 'nui-bg-primary nui-text-white' : 'nui-bg-subtle nui-text-muted'
                    }`}
                  style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {openIndex === index && (
                <div className="nui-px-6 nui-pb-5">
                  <p className="nui-text-subtle nui-leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ CTA SECTION ============
function CTASection() {
  return (
    <section className="nui-py-24 lg:nui-py-32">
      <div className="nui-container nui-mx-auto nui-px-6">
        <div className="nui-relative nui-overflow-hidden nui-rounded-3xl nui-bg-primary nui-p-12 sm:nui-p-16 lg:nui-p-24">
          
          {/* Content */}
          <div className="nui-relative nui-text-center nui-max-w-3xl nui-mx-auto">
            <div className="nui-inline-flex nui-items-center nui-gap-2 nui-px-4 nui-py-2 nui-rounded-full nui-bg-white nui-bg-opacity-20 nui-text-white nui-text-sm nui-font-semibold nui-mb-8">
              <span className="nui-w-2 nui-h-2 nui-rounded-full nui-bg-white" />
              Limited time: Get 3 months free
            </div>

            <h2 className="nui-text-3xl sm:nui-text-4xl lg:nui-text-5xl nui-font-bold nui-text-white nui-leading-tight">
              Ready to transform your development workflow?
            </h2>

            <p className="nui-mt-6 nui-text-lg lg:nui-text-xl nui-text-white nui-opacity-85 nui-leading-relaxed">
              Join over 50,000 developers building faster with NUI CSS. Start your free trial today.
            </p>

            <div className="nui-mt-10 nui-flex nui-flex-col sm:nui-flex-row nui-items-center nui-justify-center nui-gap-4">
              <a
                href="#"
                className="nui-inline-flex nui-items-center nui-gap-2 nui-px-8 nui-py-4 nui-font-semibold nui-rounded-xl nui-shadow-xl nui-text-default  nui-transition"
              >
                Start building free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#"
                className="nui-inline-flex nui-items-center nui-gap-2 nui-px-8 nui-py-4 nui-font-semibold nui-rounded-xl nui-shadow-xl nui-text-default nui-no-underline nui-transition"
              >
                Schedule a demo
              </a>
            </div>

            <p className="nui-mt-8 nui-text-sm nui-text-white nui-opacity-60">
              Free forever for small projects • No credit card required • Setup in 5 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap', 'API'],
    Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
    Resources: ['Documentation', 'Guides', 'Help Center', 'Community', 'Status'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies', 'Licenses'],
  };

  return (
    <footer  className="nui-text-white">
      <div className="nui-container nui-mx-auto nui-px-6 nui-py-16 lg:nui-py-20">
        <div className="nui-flex nui-flex-wrap nui-gap-8 lg:nui-gap-12">
          {/* Brand */}
          <div className="nui-col-span-2">
            <a href="#" className="nui-flex nui-items-center nui-gap-3 nui-mb-6">
              <div className="nui-w-11 nui-h-11 nui-flex nui-items-center nui-justify-center nui-bg-primary nui-rounded-xl nui-text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="nui-text-xl nui-font-bold">NUI CSS</span>
            </a>
            <p className="nui-text-white nui-opacity-50 nui-mb-8 nui-max-w-xs nui-leading-relaxed">
              The modern platform for building and scaling applications with unprecedented speed.
            </p>
            <div className="nui-flex nui-gap-3">
              {['X', '◆', '◈', '▶'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="nui-w-10 nui-h-10 nui-flex nui-items-center nui-justify-center nui-rounded-lg nui-text-white nui-opacity-60 nui-transition"
                
                >
                  <span className="nui-text-lg">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="nui-container  nui-items-center nui-px-6">
            <div className="nui-flex nui-flex-wrap nui-items-center nui-justify-center nui-gap-6 ">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="nui-font-semibold nui-text-white nui-mb-4">{category}</h4>
              <ul className=" list-none">
                {links.map((link) => (
                  <li key={link} >
                    <a href="#" className="nui-text-sm nui-text-white nui-opacity-50 nui-transition nui-text-default ">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="nui-mt-16 nui-pt-8 nui-border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="nui-flex nui-flex-col nui-items-center nui-justify-between nui-gap-6">
            <div className='nui-text-center'>
              <h4 className="nui-font-semibold nui-text-white nui-mb-1">Stay updated</h4>
              <p className="nui-text-sm nui-text-white nui-opacity-50">Get the latest news delivered to your inbox.</p>
            </div>
            <div className="nui-flex nui-gap-3 nui-w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="nui-flex-1 lg:nui-w-64 nui-px-4 nui-py-3 nui-rounded-lg nui-border nui-text-white"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              />
              <button className="nui-px-6 nui-py-3 nui-bg-primary nui-text-white nui-font-semibold nui-rounded-lg nui-transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="nui-flex nui-flex-col sm:nui-flex-row nui-items-center nui-justify-between nui-gap-4 nui-mt-12 nui-pt-8 nui-border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="nui-text-sm nui-text-white nui-opacity-40">
            © {new Date().getFullYear()} NUI CSS Inc. All rights reserved.
          </p>
          <div className="nui-flex nui-items-center nui-gap-2 nui-text-sm nui-text-white nui-opacity-40">
            <span className="nui-w-2 nui-h-2 nui-bg-success nui-rounded-full" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN APP ============
export default function LandingPage() {
  return (
    <div className="nui-min-h-screen nui-bg-page nui-text-default">
      <Navbar />
      <main className='nui-m-0 nui-p-0 box-sizing'>
        <HeroSection />
        <LogosSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}