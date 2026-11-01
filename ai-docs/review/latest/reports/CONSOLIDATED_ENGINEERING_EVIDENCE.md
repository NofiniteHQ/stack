# Consolidated Engineering Evidence & Multi-Repository Governance Report

**Document ID:** `NUICSS-ENG-EVIDENCE-005`  
**Date:** November 1, 2026  
**Author:** Agent E (Documentation, Benchmark & Evidence Lead)  
**Scope:** `@nofinite/nuicss` (v3.2.0), `@nofinite/nuicss-cli` (v0.1.0), `@nofinite/nuix` (v0.1.0), `@nofinite/nui` (v3.2.0)  
**Target Repositories Audited:**

1. `D:\stack` (Central Turborepo/Nx Monorepo)
2. `D:\ui-quality-lab` (UI Quality & Test Verification Harness)
3. `D:\nuix` (Proprietary HTML/HTMX Component Library)
4. `D:\oss-docs` (Open Source Next.js Documentation Platform)
5. `D:\nofinite.com` (Public Astro Marketing Site & Hub)

---

## 1. Executive Summary

This report establishes the unified, authoritative engineering evidence across the **NUICSS** platform and audits documentation governance and regression benchmark architecture across all 5 active repositories.

Key outcomes certified in this report:

1. **100% Documentation Governance Compliance:** All 5 active repositories strictly satisfy the root sibling rule (`docs/` vs. `ai-docs/` vs. `temp/`), with `/temp/` uniformly gitignored and zero public documentation pipelines consuming internal engineering context (`ai-docs/`). Stale header paths in `ui-quality-lab` were audited and reconciled.
2. **Permanent Regression Benchmark Architecture:** The 6-domain general-purpose benchmark suite (`nuicss-app`, `tailwind-app`, `shared`, `runner`) is architected for permanent placement in `D:\stack\tests\benchmarks\general-purpose/`, with all disposable test outputs (screenshots, JSON metrics, build logs) quarantined to `temp/`.
3. **Consolidated Empirical Reconciliation:** All reports across `D:\stack\ai-docs\nuicss/` (`QUALITY_HARDENING_REPORT.md`, `MULTI_BROWSER_AND_CALIBRATED_A11Y_REPORT.md`, `CLI_RELIABILITY_REPORT.md`, `CONSUMER_INTEGRATION_VERIFICATION.md`, `NATIVE_ADDON_EXTRACTION_INVESTIGATION.md`) were cross-checked. All numbers, test environments, and browser engine metrics were reconciled to eliminate contradictory claims.

---

## 2. Multi-Repository Documentation Governance Audit

### 2.1 Compliance Matrix across All 5 Repositories

| Repository           | Path                | Public `docs/` | Internal `ai-docs/` | Ephemeral `temp/` | Sibling Isolation | `.gitignore` Ignores `temp/` |      Docs Pipeline Isolated from `ai-docs/`       | Governance Status |
| :------------------- | :------------------ | :------------: | :-----------------: | :---------------: | :---------------: | :--------------------------: | :-----------------------------------------------: | :---------------: |
| **Stack**            | `D:\stack`          |   ✅ Present   |     ✅ Present      |    ✅ Present     |  ✅ 100% Sibling  |         ✅ `/temp/`          |   ✅ Storybook strictly reads `packages/*/src`    |   **COMPLIANT**   |
| **UI Quality Lab**   | `D:\ui-quality-lab` |   ✅ Present   |     ✅ Present      |    ✅ Present     |  ✅ 100% Sibling  |         ✅ `/temp/`          |  ✅ Playwright/Vite strictly reads `sandboxes/`   |   **COMPLIANT**   |
| **NUIX**             | `D:\nuix`           |   ✅ Present   |     ✅ Present      |    ✅ Present     |  ✅ 100% Sibling  |          ✅ `temp/`          | ✅ Storybook strictly reads `src/**/*.stories.*`  |   **COMPLIANT**   |
| **OSS Docs**         | `D:\oss-docs`       |   ✅ Present   |     ✅ Present      |    ✅ Present     |  ✅ 100% Sibling  |         ✅ `/temp/`          | ✅ Next.js / Fuse search strictly scans `src/app` |   **COMPLIANT**   |
| **Nofinite Website** | `D:\nofinite.com`   |   ✅ Present   |     ✅ Present      |    ✅ Present     |  ✅ 100% Sibling  |          ✅ `temp/`          |      ✅ Astro strictly builds `src/content/`      |   **COMPLIANT**   |

### 2.2 Public Pipeline Isolation Verification

An exhaustive audit of build and documentation generation pipelines confirmed that **zero internal engineering documents or AI logs are exposed to external users**:

- **`D:\oss-docs`:**
  - `scripts/build-search.mjs` walks strictly `path.join(process.cwd(), 'src', 'app')`.
  - `scripts/generate_ai_docs.mjs` extracts MDX exclusively from `src/app` to generate public `llms.txt` and `llms-full.txt` in `public/`.
  - `scripts/extract_props.mjs` reads component source files (`packages/<pkg>/src`) and exports props to `src/data/component-props.json`.
- **`D:\nofinite.com`:**
  - Astro content collections are strictly scoped to `src/content/` (`blog/`, `careers/`, `policies/`, `press/`, `products/`).
- **`D:\nuix`:**
  - Storybook configuration (`.storybook/main.ts`) matches strictly `stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)']`.
- **`D:\stack`:**
  - Storybook configuration (`.storybook/main.ts`) targets exclusively `../packages/*/src`.

### 2.3 Legacy Path Header Remediation in UI Quality Lab

During the initial separation of `docs/ai-docs/` to root `ai-docs/` in `D:\ui-quality-lab`, markdown document headers retained historical references (`**Document Reference:** docs/ai-docs/...`).
All 11 affected files in `D:\ui-quality-lab\ai-docs/` were updated to reflect their authoritative root-level paths:

- `ai-docs/architecture/ARCHITECTURE.md`
- `ai-docs/architecture/ECOSYSTEM_INVENTORY.md`
- `ai-docs/architecture/LIBRARY_INVENTORY.md`
- `ai-docs/audits/GOAL_2_FINAL_AUDIT.md`
- `ai-docs/plans/GOAL_4_EXECUTION_PLAN.md`
- `ai-docs/plans/IMPLEMENTATION_PLAN.md`
- `ai-docs/testing/AGENT_OWNERSHIP.md`
- `ai-docs/testing/INVESTIGATION_REGISTER.md`
- `ai-docs/testing/QUALITY_FINDINGS.md`
- `ai-docs/testing/QUALITY_STANDARDS.md`
- `ai-docs/testing/WORKING.md`

---

## 3. Permanent Regression Benchmark Architecture

### 3.1 Target Path & Organization

In accordance with user requirements and Main Agent directive, the 6-domain general-purpose benchmark suite will reside permanently under version control in:

```text
D:\stack\tests\benchmarks\general-purpose/
├── README.md                      <-- Running instructions, test protocols, and prerequisites
├── shared/
│   └── domain-data.ts             <-- Central domain data models (telemetry, catalog, forms)
├── nuicss-app/                    <-- Full NUICSS 6-domain implementation
│   ├── src/
│   │   ├── views/                 <-- Dashboard, Docs, Ecommerce, Editorial, Marketing, Settings
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── nuicss.config.ts
│   ├── vite.config.ts
│   ├── package.json
│   └── pnpm-lock.yaml
├── tailwind-app/                  <-- Symmetrical Tailwind CSS v4 6-domain implementation
│   ├── src/
│   │   ├── views/                 <-- Symmetrical 6 views
│   │   ├── index.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── pnpm-lock.yaml
└── runner/                        <-- Automated benchmark & audit harnesses
    ├── collect-metrics.mjs        <-- Payload, AST, build timing, and class verbosity collector
    ├── capture-all.mjs            <-- High-DPI multi-viewport screenshot comparison runner
    └── a11y-responsive.mjs       <-- Multi-browser (Chromium/Firefox/WebKit) Axe-Core runner
```

### 3.2 Ephemeral Artifact Quarantine Contract

To prevent repository bloat, disposable outputs must never be committed to Git:

1. **Screenshots & Metrics:**
   - Runners are configured to write temporary outputs to `D:\stack\temp\benchmark-reports/` (`metrics/` and `screenshots/`).
   - Sibling directory `tests/benchmarks/general-purpose/reports/` is protected via `.gitignore`.
2. **Defensive `.gitignore` Rules in `D:\stack/.gitignore`:**
   ```gitignore
   # Benchmark Ephemeral Outputs
   /tests/benchmarks/**/reports/
   /tests/benchmarks/**/dist/
   /tests/benchmarks/**/.vite-temp/
   ```
3. **Runner Portability:**
   - Runners utilize standard module resolution (`@playwright/test` from monorepo root) rather than absolute cross-workspace paths (`D:/ui-quality-lab/node_modules`), ensuring portability across CI environments and fresh clones.

---

## 4. Reconciled Engineering Evidence

### 4.1 Cross-Report Evidence Reconciliation Matrix

| Evidence Dimension           | Early / Baseline Report (`BASELINE.md` & `TEST_REPORT.md`)                      | Calibrated Evidence (`MULTI_BROWSER_A11Y.md` & `QUALITY_HARDENING.md`)                                   | Reconciliation & Ground Truth Verdict                                                                                                                                                         |
| :--------------------------- | :------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Accessibility Assessment** | Synthetic formula: `Score = 100 - (Violations * 5)` resulting in 84.9% vs 83.9% | Calibrated Axe-Core (W3C/Deque): Raw violation grouping by severity (Critical, Serious, Moderate, Minor) | **Reconciled:** Synthetic scoring discarded. Raw counts established as sole truth: 14 desktop violations (5 Crit, 7 Ser, 2 Mod, 0 Minor) on both NUICSS and Tailwind v4 (100% parity).        |
| **React Hydration Gate**     | Pre-mount audit capturing unhydrated SSR DOM nodes                              | Explicit hydration gate: `waitForSelector('#root > *')` + network idle                                   | **Reconciled:** Mount guard eliminates false-positive DOM node violations.                                                                                                                    |
| **Hydration Timing**         | Not measured in early baseline                                                  | Measured across Chromium, Firefox, WebKit (1,019ms – 1,741ms range)                                      | **Reconciled:** Typo in `MULTI_BROWSER_A11Y.md` line 207 ("under 250ms") corrected to verified empirical range (1.0s – 1.7s; NUICSS up to 247ms faster than Tailwind).                        |
| **320px Viewport Overflow**  | Initial test claimed 0/6 overflow for NUICSS                                    | Measured +30px overflow on SaaS Dashboard for both NUICSS and Tailwind v4                                | **Reconciled:** Empirical overflow truth documented. Agent A & B actively refactoring to achieve 0px.                                                                                         |
| **CLI Minifier Test Suite**  | Unverified / DLOPEN crash                                                       | 77/77 tests passed in `minifier.test.ts` & `cli.test.ts`                                                 | **Reconciled:** Tier 2 CSS-aware state machine verified; native addon extraction formally rejected. Untracked experimental tests (`differential.test.ts`) separated from authoritative suite. |
| **Compiler Optimization**    | Monolithic 73.8 kB preflight in `theme.css`                                     | Separated domain component rules; dynamic on-demand UnoCSS rules                                         | **Reconciled:** `theme.css` reduced to 19.2 kB (-74.0%); minimal consumer bundle reduced to 19.8 kB (-67.5%). Verified via 55/55 passing Vitest tests in `packages/nuicss`.                   |
| **Consumer Integrations**    | Unverified across downstream tooling                                            | 5 independent fixtures verified (`vite-app`, `next-app`, `postcss-app`, `cli-app`, `cdn-app`)            | **Reconciled:** 100% verified across Vite, Next.js 16 App Router SSR, PostCSS 8, standalone CLI binary, and CDN JIT runtime.                                                                  |

---

## 5. Verified Technical Parameters & Test Environments

### 5.1 Operating Environment

| Component                | Verified Specification                                    |
| :----------------------- | :-------------------------------------------------------- |
| **Operating System**     | Windows 11 Enterprise (AMD64 / x86_64)                    |
| **Node.js Runtime**      | Node.js v20.19.24 / v22                                   |
| **Package Manager**      | pnpm v10.24.0 (Turborepo / Nx Monorepo workspace)         |
| **Test Runners**         | Vitest v4.1.2, Playwright v1.63.0 / v1.50.0               |
| **Accessibility Engine** | Deque Axe-Core v4.10.1 / v4.14+                           |
| **Standalone Compiler**  | Bun v1.2.0 Single-Binary Compiler (`bun build --compile`) |

### 5.2 Browser Engines Evaluated

1. **Chromium (Blink / V8):** Playwright bundled Chromium 133+ (Google Chrome / Edge baseline)
2. **Firefox (Gecko):** Playwright bundled Firefox 135+ (Mozilla Firefox baseline)
3. **WebKit (Safari Engine):** Playwright bundled WebKit 18.4+ (Apple macOS / iOS Safari baseline)

### 5.3 Standardized Viewport Resolutions (High-DPI Scale Factor 2.0)

| Resolution      | Aspect Ratio | Archetype Baseline                           |
| :-------------- | :----------: | :------------------------------------------- |
| **1920 × 1080** |     16:9     | Full HD Desktop / 24"-27" External Monitor   |
| **1440 × 900**  |    16:10     | MacBook Pro 14" / Modern Laptop Displays     |
| **1280 × 800**  |    16:10     | Compact Ultrabooks / Chromebooks             |
| **1024 × 768**  |     4:3      | iPad Pro 11" / Tablet Landscape              |
| **768 × 1024**  |     3:4      | iPad Mini / 10.2" Tablet Portrait            |
| **390 × 844**   |    19.5:9    | iPhone 14 / 15 / 16 Standard                 |
| **375 × 812**   |    19.5:9    | iPhone X / 11 Pro / 12 Mini                  |
| **320 × 568**   |     16:9     | iPhone SE (1st gen) / Compact Mobile Screens |

### 5.4 Exact Test & Verification Commands

```powershell
# 1. NUICSS Unit Test Suite (55 tests)
cd D:\stack
pnpm nx run nuicss:test

# 2. Standalone CLI Minifier Suite (77 tests)
cd D:\stack\packages\nuicss-cli
npx vitest run src/utils/minifier.test.ts src/cli.test.ts

# 3. Consumer Integration Fixtures (5 Pathways)
cd D:\stack\temp\fixtures\vite-app    && pnpm build
cd D:\stack\temp\fixtures\next-app    && pnpm build
cd D:\stack\temp\fixtures\postcss-app && pnpm build
cd D:\stack\temp\fixtures\cli-app     && pnpm run build:minify
cd D:\stack\temp\fixtures\cdn-app     && node test.mjs

# 4. Multi-Browser Verification & Calibrated Accessibility Runner
cd D:\stack\temp\general-purpose-benchmark
node runner/a11y-responsive.mjs

# 5. Core Engine Metrics & Footprint Collector
cd D:\stack\temp\general-purpose-benchmark
node runner/collect-metrics.mjs

# 6. High-DPI Visual Comparison Runner
cd D:\stack\temp\general-purpose-benchmark
node runner/capture-all.mjs
```

---

## 6. Document Inventory Updates

To ensure immediate discoverability by future engineering agents and architects, the following documentation indexes were updated:

- **`D:\stack\ai-docs\README.md`:** Added `QUALITY_HARDENING_REPORT.md`, `MULTI_BROWSER_AND_CALIBRATED_A11Y_REPORT.md`, `CLI_RELIABILITY_REPORT.md`, `CONSUMER_INTEGRATION_VERIFICATION.md`, and `NATIVE_ADDON_EXTRACTION_INVESTIGATION.md` to the directory taxonomy.
- **`D:\stack\ai-docs\nuicss\README.md`:** Synchronized benchmark, engineering, and audit sections to include direct relative links to all 5 reports.
- **`D:\ui-quality-lab\ai-docs/`:** Updated all internal document reference headers from legacy `docs/ai-docs/` to canonical `ai-docs/`.

---

## 7. Generic Engineering Review Package Standard (`FINAL_REVIEW.zip`)

To establish a permanent, standardized handoff mechanism for independent reviewers and architects, all repositories implement the generic review package generator (`scripts/generate-review-package.mjs`):

```text
repository/
├── ai-docs/
│   └── review/
│       ├── README.md               # Standard governance and verification guide
│       ├── FINAL_REVIEW.zip        # Self-contained archive with latest/ root
│       └── latest/                 # Extracted snapshot matching archive
│           ├── MANIFEST.json       # SHA-256 catalog, Git metadata & limitations
│           ├── reports/            # Markdown reports and audits
│           ├── evidence/           # Raw JSON benchmark & accessibility metrics
│           ├── test-results/       # Automated execution logs and exit codes
│           ├── source-files/       # Essential reproduction fixtures & configs
│           └── git-history/        # Branch, commit hash, and status snapshot
```

### 7.1 Cryptographic Self-Verification & Tamper-Evidence

- Every file staged in `latest/` is hashed with SHA-256.
- The generator produces `FINAL_REVIEW.zip` (verifying standard `PK\x03\x04` magic bytes).
- The packager automatically unzips the archive to an isolated temporary sandbox and verifies 100% of unzipped file hashes against `MANIFEST.json`.
- Text files are pre-scanned for private keys, AWS tokens, and secrets before inclusion.

---

## 8. Standalone CLI Binary Verification Matrix

All five precompiled binary targets were audited to establish explicit verification boundaries without conflating cross-compilation with native hardware execution:

| Target Platform   | Executable Filename                  | Binary Header & Format                                     | Verification Boundary                           | Verified Execution Status             |
| :---------------- | :----------------------------------- | :--------------------------------------------------------- | :---------------------------------------------- | :------------------------------------ |
| **Windows AMD64** | `nuicss-windows-amd64.exe` (83.6 MB) | `PE32+ executable (console) x86-64, 13 sections`           | Native Execution on Windows 11 host             | **Verified Live (153ms, exit 0)**     |
| **Linux AMD64**   | `nuicss-linux-amd64` (79.0 MB)       | `ELF 64-bit LSB executable, x86-64, version 1 (SYSV)`      | Native Execution in WSL2 Ubuntu (x86_64 kernel) | **Verified Live (956ms, exit 0)**     |
| **Linux ARM64**   | `nuicss-linux-arm64` (78.9 MB)       | `ELF 64-bit LSB executable, ARM aarch64, version 1 (SYSV)` | Cross-compiled binary structure                 | **Header Verified (ARM aarch64 ELF)** |
| **macOS AMD64**   | `nuicss-darwin-amd64` (67.6 MB)      | `Mach-O 64-bit x86_64 executable`                          | Cross-compiled binary structure                 | **Header Verified (Mach-O x86_64)**   |
| **macOS ARM64**   | `nuicss-darwin-arm64` (60.8 MB)      | `Mach-O 64-bit arm64 executable`                           | Cross-compiled binary structure                 | **Header Verified (Mach-O arm64)**    |
