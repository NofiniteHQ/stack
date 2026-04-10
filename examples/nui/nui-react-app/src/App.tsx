'use client';

import React from 'react';
import {
  useTheme,
  Badge,
  Button,
  Card,
  Breadcrumbs,
  DatePicker,
  Drawer,
  Stepper,
  nui,
} from '@nofinite/nui';


// ============ HERO SECTION ============
function HeroSection() {
  const handleInstall = async () => {
    const confirmed = await nui.confirm(
      'Run `npm install @nofinite/nui` and wrap your app with NUIProvider.',
      {
        title: 'Install NUI',
        confirmText: 'Copy command',
      }
    );

    if (!confirmed) return;

    navigator.clipboard.writeText('npm install @nofinite/nui');
    nui.success('Command copied to clipboard');
  };

  return (
    <section className="hero">
      {/* Background effects */}
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />
      <div className="hero-grid" />

      <div className="hero-content">
        <div className="hero-badge-row">
          <Badge variant="success" className="hero-badge">
            <span className="pulse-dot" />
            Open Source
          </Badge>
          <Badge variant="outline" className="hero-badge">v2.0 Released</Badge>
        </div>

        <h1 className="hero-title">
          Build interfaces
          <br />
          <span className="gradient-text">that feel alive</span>
        </h1>

        <p className="hero-description">
          A meticulously crafted React component library with built-in theming,
          accessibility, and the flexibility to build anything from landing pages
          to complex dashboards.
        </p>

        <div className="hero-actions">
          <Button size="lg" onClick={() => window.open("https://opensource.nofinite.com/docs/nui", "_blank")}>
            Get Started &rarr;
          </Button>

          <Button size="lg" variant="ghost" onClick={handleInstall} className="install-btn">
            <code>npm i @nofinite/nui</code>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 11V3H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">40+</span>
            <span className="stat-label">Components</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">3kb</span>
            <span className="stat-label">Gzipped</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">Accessible</span>
          </div>
        </div>
      </div>

      {/* Floating code preview */}
      <div className="hero-preview">
        <div className="code-window">
          <div className="code-header">
            <div className="code-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="code-filename">App.tsx</span>
          </div>
          <pre className="code-body">
            <code>
              <span className="code-keyword">import</span> {'{'} Button, Card {'}'} <span className="code-keyword">from</span> <span className="code-string">'@nofinite/nui'</span>
              {'\n\n'}
              <span className="code-keyword">export default function</span> <span className="code-function">App</span>() {'{'}
              {'\n'}  <span className="code-keyword">return</span> (
              {'\n'}    <span className="code-tag">&lt;Card&gt;</span>
              {'\n'}      <span className="code-tag">&lt;Button&gt;</span>Click me<span className="code-tag">&lt;/Button&gt;</span>
              {'\n'}    <span className="code-tag">&lt;/Card&gt;</span>
              {'\n'}  )
              {'\n'}{'}'}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

// ============ FEATURES BENTO GRID ============
function FeaturesSection() {
  const { theme, resolved, setTheme } = useTheme() as any
  const [step, setStep] = React.useState(1);

  return (
    <section className="features">
      <div className="section-header">
        <Badge variant="outline">Features</Badge>
        <h2 className="section-title">Everything you need</h2>
        <p className="section-description">
          Thoughtfully designed components that work together seamlessly
        </p>
      </div>

      <div className="bento-grid">
        {/* Theme Card - Large */}
        <div className="bento-card bento-large theme-card">
          <div className="bento-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
              <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3>Adaptive Theming</h3>
          <p>Seamlessly switch between light, dark, and system themes with CSS variables.</p>

          <div className="theme-demo">
            <div className="theme-preview">
              <div className={`theme-sample light ${resolved === 'light' ? 'active' : ''}`}>
                <div className="sample-header" />
                <div className="sample-content">
                  <div className="sample-line" />
                  <div className="sample-line short" />
                </div>
              </div>
              <div className={`theme-sample dark ${resolved === 'dark' ? 'active' : ''}`}>
                <div className="sample-header" />
                <div className="sample-content">
                  <div className="sample-line" />
                  <div className="sample-line short" />
                </div>
              </div>
            </div>
            <div className="theme-controls">
              {['light', 'dark', 'system'].map((t) => (
                <button
                  key={t}
                  className={`theme-btn ${theme === t ? 'active' : ''}`}
                  onClick={() => setTheme(t as 'light' | 'dark' | 'system')}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stepper Card */}
        <div className="bento-card stepper-card">
          <div className="bento-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" />
              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2" />
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>Multi-step Flows</h3>
          <p>Guide users through complex processes</p>

          <div className="stepper-demo">
            <Stepper
              steps={['Details', 'Confirm', 'Done']}
              active={step}
              onChange={setStep}
            />
          </div>
        </div>

        {/* Buttons Card */}
        <div className="bento-card buttons-card">
          <div className="bento-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="8" width="18" height="8" rx="4" stroke="currentColor" strokeWidth="2" />
              <circle cx="8" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <h3>Button Variants</h3>

          <div className="buttons-demo">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="outline">Outline</Button>
            <Button size="sm" variant="ghost">Ghost</Button>
          </div>
        </div>

        {/* Badges Card */}
        <div className="bento-card badges-card">
          <div className="bento-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 15L8.5 21L9.5 16L5 15L8.5 9L7.5 14L12 15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 15L15.5 21L14.5 16L19 15L15.5 9L16.5 14L12 15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h3>Status Badges</h3>

          <div className="badges-demo">
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="outline">Draft</Badge>
          </div>
        </div>

        {/* Toast Card - Wide */}
        <div className="bento-card bento-wide toast-card">
          <div className="bento-content">
            <div className="bento-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Toast Notifications</h3>
            <p>Provide instant feedback with beautiful, stackable notifications</p>
          </div>

          <div className="toast-demo">
            <Button
              variant="outline"
              onClick={() => nui.success('Action completed successfully!')}
            >
              Success Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => nui.warn('Please review your changes')}
            >
              Warning Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => nui.toast('Here\'s some information')}
            >
              Info Toast
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ COMPONENTS SHOWCASE ============
function ShowcaseSection() {
  const [date, setDate] = React.useState('2026-10-24');
  const [drawer, setDrawer] = React.useState(false);

  return (
    <section className="showcase">
      <div className="section-header">
        <Badge variant="outline">Components</Badge>
        <h2 className="section-title">Production ready</h2>
        <p className="section-description">
          Every component is designed with real-world use cases in mind
        </p>
      </div>

      <div className="showcase-grid">
        <Card className="showcase-card">
          <Card.Header>
            <div className="showcase-card-header">
              <div className="showcase-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10H17M3 10L7 6M3 10L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Navigation</h3>
                <p className="showcase-subtitle">Breadcrumbs & routing</p>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/' },
                { label: 'Projects', href: '/projects' },
                { label: 'Settings' },
              ]}
            />
          </Card.Body>
        </Card>

        <Card className="showcase-card">
          <Card.Header>
            <div className="showcase-card-header">
              <div className="showcase-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 8H17" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 4V8" stroke="currentColor" strokeWidth="2" />
                  <path d="M13 4V8" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Date Picker</h3>
                <p className="showcase-subtitle">Intuitive date selection</p>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="Select a date"
            />
          </Card.Body>
        </Card>

        <Card className="showcase-card">
          <Card.Header>
            <div className="showcase-card-header">
              <div className="showcase-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M6 3V17" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Drawer</h3>
                <p className="showcase-subtitle">Slide-out panels</p>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Button onClick={() => setDrawer(true)} variant="outline" style={{ width: '100%' }}>
              Open Drawer
            </Button>
            <Drawer open={drawer} onClose={() => setDrawer(false)} position="left">
              <div className="drawer-content">
                <div className="drawer-header">
                  <h3>Navigation</h3>
                  <Button variant="ghost" size="sm" onClick={() => setDrawer(false)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </Button>
                </div>
                <nav className="drawer-nav">
                  <a href="#" className="drawer-link active">Dashboard</a>
                  <a href="#" className="drawer-link">Projects</a>
                  <a href="#" className="drawer-link">Team</a>
                  <a href="#" className="drawer-link">Settings</a>
                </nav>
              </div>
            </Drawer>
          </Card.Body>
        </Card>
      </div>
    </section>
  );
}

// ============ CTA SECTION ============
function CTASection() {
  return (
    <section className="cta">
      <div className="cta-glow" />
      <div className="cta-content">
        <h2>Ready to build something beautiful?</h2>
        <p>
          Join thousands of developers building with NUI. Open source, forever free.
        </p>
        <div className="cta-actions">
          <Button size="lg" onClick={() => window.open("https://opensource.nofinite.com/docs/nui", "_blank")}>
            Start Building
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.open("https://github.com/NofiniteHQ/stack/tree/main/packages/nui", "_blank")}>
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.1" />
              <path d="M10 16L14 20L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>NUI</span>
          </div>
          <p>Beautiful, accessible React components for modern web applications.</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank'>Components</a>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank'>Documentation</a>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank'>Examples</a>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank'>Changelog</a>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank'>Getting Started</a>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank'>API Reference</a>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank'>Theming Guide</a>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank'>Accessibility</a>
          </div>
          <div className="footer-column">
            <h4>Community</h4>
            <a href="https://github.com/NofiniteHQ/stack/tree/main/packages/nui" target='_blank'>GitHub</a>
            <a href="#">Discord</a>
            <a href="#">Twitter</a>
            <a href="#">Discussions</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p >Built with NUI</p>
      </div>
    </footer>
  );
}

// ============ MAIN APP ============
export default function App() {
  return (
    <main className="landing">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="var(--nui-fg-default)" />
              <path d="M8 14L12 18L20 10" stroke="var(--nui-bg-page)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>NUI</span>
          </div>
          <div className="nav-links">
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank' className="nav-link">Docs</a>
            <a href="https://opensource.nofinite.com/docs/nui" target='_blank' className="nav-link">Components</a>
            <a href="#" className="nav-link">Examples</a>
          </div>
          <div className="nav-actions">
            <Button variant="ghost" size="sm" onClick={() => window.open("https://github.com/NofiniteHQ/stack/tree/main/packages/nui", "_blank")}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </Button>
            <Button size="sm" onClick={() => window.open("https://opensource.nofinite.com/docs/nui", "_blank")}>Get Started</Button>
          
          </div>
        </div>
      </nav>

      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <CTASection />
      <Footer />
    </main>
  );
}