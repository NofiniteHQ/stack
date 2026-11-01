# General-Purpose Web Application Benchmark: NUICSS vs. Tailwind CSS v4

> **Version:** 2.0.0-final  
> **Status:** Version-Controlled Certified Regression Benchmark Suite  
> **Location:** `D:\stack\tests\benchmarks\general-purpose`  
> **Frameworks Evaluated:** NUICSS (`@nofinite/nuicss` v3.2.0) vs. Tailwind CSS v4 (`@tailwindcss/vite` v4.3.3)

---

## 1. Overview & Architectural Purpose

This directory contains the permanent, version-controlled source code for the **General-Purpose Multi-Domain Benchmark Suite**. It evaluates the real-world developer experience, runtime performance, responsive layout fidelity, and accessibility compliance of **NUICSS** directly against **Tailwind CSS v4** across six symmetrical, production-grade application domains.

Every application is implemented with 100% functional, visual, and state parity, consuming the exact same shared data models (`shared/domain-data.ts`).

---

## 2. The 6 Symmetrical Domain Archetypes

| Domain                          | Application Key   | Views & Functional Mechanics                                                                                                                                                                                              |
| :------------------------------ | :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. SaaS Analytics Dashboard** | `saas-dashboard`  | Real-time ARR metrics, KPI stat cards, 12-month revenue velocity chart, searchable/filterable customer directory table, provision modal.                                                                                  |
| **2. Marketing Website**        | `marketing-site`  | High-conversion hero masthead, feature grid, interactive annual/monthly pricing matrix, social proof metrics, expandable FAQ accordion.                                                                                   |
| **3. Ecommerce Storefront**     | `ecommerce-store` | Product catalog grid with stock indicators, dynamic category filter pills, price sorting, interactive sliding cart drawer with live subtotal calculation.                                                                 |
| **4. Documentation Platform**   | `docs-site`       | Hierarchical sidebar navigation with badges, active route highlighting, multi-token search filtering, code blocks with syntax highlighting and copy-to-clipboard, callout alerts.                                         |
| **5. Editorial Publication**    | `editorial-site`  | Publication masthead, featured lead story with reading time, author avatars, 3-column articles grid with category tags, newsletter subscription form.                                                                     |
| **6. Complex Settings Suite**   | `settings-app`    | Multi-tab configuration (Profile, Notifications, API Keys, Team RBAC, Danger Zone), toggle switches, secret key generator modal with copy-to-clipboard, scrollable team directory table, destructive confirmation dialog. |

---

## 3. Directory Layout

```text
tests/benchmarks/general-purpose/
├── README.md                      <-- This document
├── shared/
│   └── domain-data.ts             <-- Canonical domain models & mock telemetry datasets
├── nuicss-app/                    <-- Full NUICSS 6-domain SPA (clean source only)
│   ├── src/views/                 <-- Dashboard, Docs, Ecommerce, Editorial, Marketing, Settings
│   ├── App.tsx                    <-- App shell, view switcher tabs, live brand theme selector
│   ├── main.tsx, index.html
│   ├── nuicss.config.ts           <-- Semantic design token configuration
│   ├── vite.config.ts, package.json, tsconfig.json
├── tailwind-app/                  <-- Symmetrical Tailwind CSS v4 SPA (clean source only)
│   ├── src/views/                 <-- Symmetrical view components in Tailwind utilities
│   ├── App.tsx                    <-- App shell and view switcher tabs
│   ├── main.tsx, index.html, index.css
│   ├── vite.config.ts, package.json, tsconfig.json
└── runner/                        <-- Automated headless benchmark and verification runners
    ├── a11y-responsive.mjs        <-- Multi-browser (Chromium/Firefox/WebKit) Axe & 48-point responsive audit
    ├── capture-all.mjs            <-- High-DPI 2.0x multi-viewport screenshot comparison runner
    └── collect-metrics.mjs        <-- Payload size, gzip compression, AST metrics, and build timing collector
```

---

## 4. Evaluation Viewports & Engine Matrix

### 4.1 Responsive Viewport Matrix (48 Evaluation Points)

All 6 domain applications are audited across 8 standard device viewports:

1. **1920x1080** — Desktop Full HD (1080p)
2. **1440x900** — Desktop Standard (MacBook Pro)
3. **1280x800** — Laptop Compact
4. **1024x768** — Tablet Landscape (iPad)
5. **768x1024** — Tablet Portrait (iPad)
6. **390x844** — Mobile Modern (iPhone 14/15)
7. **375x812** — Mobile Standard (iPhone X/11)
8. **320x568** — Mobile Compact (iPhone SE / minimum web boundary)

### 4.2 Browser Engines Tested

- **Chromium** (Blink / V8)
- **Firefox** (Gecko)
- **WebKit** (Safari Engine)

---

## 5. How to Run the Benchmark Suite

### Prerequisites

- Node.js 18+ or Bun 1.4+
- Playwright browsers installed: `npx playwright install chromium firefox webkit`

### Step 1: Install Dependencies & Build

```bash
# Build NUICSS Application
cd tests/benchmarks/general-purpose/nuicss-app
pnpm install
pnpm build

# Build Tailwind Application
cd ../tailwind-app
pnpm install
pnpm build
```

### Step 2: Run Multi-Browser Accessibility & Responsive Audit

```bash
node tests/benchmarks/general-purpose/runner/a11y-responsive.mjs
```

- Performs calibrated Deque Axe-Core accessibility audits waiting for full React client-side mounting (`#root > *` + network idle).
- Tests layout geometry and horizontal overflow (`scrollWidth > clientWidth`).
- Validates keyboard focus rings and interactive states (modals, tabs, theme toggles, filters).

### Step 3: Run High-DPI Screenshot Capture

```bash
node tests/benchmarks/general-purpose/runner/capture-all.mjs
```

- Captures high-DPI full-page and viewport screenshots across all 6 applications and 8 viewports.

### Step 4: Run Empirical Payload & Compiler Metrics

```bash
node tests/benchmarks/general-purpose/runner/collect-metrics.mjs
```

- Compares build times, unminified CSS sizes, gzip compressed bundles, and AST rule counts.

---

## 6. Output Quarantine Policy (Zero Git Working Tree Pollution)

Per the Nofinite Engineering Standard:

- **All disposable build artifacts and benchmark outputs** (`dist/`, `reports/`, `screenshots/`, `metrics/*.json`) are configured to write exclusively to the gitignored `temp/` directory.
- `D:\stack\.gitignore` enforces:
  ```gitignore
  /tests/benchmarks/**/reports/
  /tests/benchmarks/**/dist/
  /tests/benchmarks/**/.vite-temp/
  ```
- This guarantees that running audits never creates untracked file clutter or git status churn.
