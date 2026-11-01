# NUICSS Internal Engineering Documentation Hub

> Authoritative repository of internal engineering benchmarks, compiler optimization reports, integration certifications, quality audits, and architecture decisions for `@nofinite/nuicss`.

---

## Directory Taxonomy

### 1. `benchmarks/` — Empirical Head-to-Head Evaluations

Rigorous performance, developer experience, and multi-viewport tests comparing NUICSS to Tailwind CSS v4:

- [**Multi-Browser Verification & Calibrated Accessibility Report**](./benchmarks/MULTI_BROWSER_AND_CALIBRATED_A11Y_REPORT.md) — Cross-engine evaluation across Chromium, Firefox, WebKit, 6 domains, and calibrated Deque Axe-Core.
- [**Final Head-to-Head General-Purpose Benchmark**](./benchmarks/NUICSS_FINAL_GENERAL_PURPOSE_BENCHMARK.md) — 6-domain application comparison across payload, AST metrics, build times, and aesthetics.
- [**Developer Experience (DX) & Ergonomics Benchmark**](./benchmarks/NUICSS_DX_BENCHMARK.md) — Comparative study of cognitive load, class token counts, and authoring velocity.
- [**General-Purpose Web Engineering Baseline**](./benchmarks/NUICSS_GENERAL_PURPOSE_BASELINE.md) — Baseline requirements, methodology, and domain selection.
- [**Multi-Viewport & Accessibility Test Audit**](./benchmarks/NUICSS_GENERAL_PURPOSE_TEST_REPORT.md) — Playwright test runs, Axe-core audit analysis, and responsive layout verification.
- [**Visual Quality & DX Benchmark (PulseMetrics Admin)**](./benchmarks/NUICSS_TAILWIND_VISUAL_BENCHMARK.md) — Hands-on real-world application benchmark.
- [**DX & Superclass Ergonomics Deep Analysis**](./benchmarks/DX_ANALYSIS_REPORT.md) — Qualitative and quantitative assessment of superclasses vs utility soup.

### 2. `engineering/` — Technical Reports & Roadmaps

Underlying compiler architecture, bundle size analyses, multi-framework certifications, and changelogs:

- [**Consolidated Engineering Evidence & Governance Report**](./engineering/CONSOLIDATED_ENGINEERING_EVIDENCE.md) — Comprehensive evidence reconciliation, 5-repo governance audit, and benchmark architecture.
- [**CLI Reliability & Minification Report**](./engineering/CLI_RELIABILITY_REPORT.md) — Two-tier minifier architecture, 77-test verification suite, and native addon constraint resolution.
- [**Consumer Integration Verification Report**](./engineering/CONSUMER_INTEGRATION_VERIFICATION.md) — 5-pathway verification across Vite, Next.js 16 App Router, PostCSS, CLI, and CDN.
- [**Native Addon Runtime Extraction Investigation**](./engineering/NATIVE_ADDON_EXTRACTION_INVESTIGATION.md) — Formal investigation rejecting runtime addon extraction into temp folders.
- [**Compiler & Bundle Size Optimization Report**](./engineering/COMPILER_IMPROVEMENT_REPORT.md) — Modular stylesheet separation and zero-overhead distribution.
- [**Multi-Integration Ecosystem Certification Report**](./engineering/INTEGRATION_VERIFICATION_REPORT.md) — Multi-environment testing across Vite, Next.js, PostCSS, CLI, and CDN.
- [**NUICSS Engineering Changelog**](./engineering/NUICSS_ENGINEERING_CHANGELOG.md) — Internal engineering changelog and evolution milestones.
- [**General-Purpose Engineering Improvement Backlog**](./engineering/NUICSS_ENGINEERING_IMPROVEMENT_BACKLOG.md) — Technical roadmap and future enhancements.
- [**Post-Tailwind Benchmark Improvement Backlog**](./engineering/NUICSS_TAILWIND_BENCHMARK_BACKLOG.md) — Action items derived from visual benchmark feedback.

### 3. `audits/` — Quality Lab Remediation, Forensic Audits & Acceptance

Authoritative closure audits verifying zero regressions and compliance across the Nofinite ecosystem:

- [**Quality Hardening Report**](./audits/QUALITY_HARDENING_REPORT.md) — Consolidated quality certification, calibrated a11y, cross-browser results, and production approval.
- [**Forensic Engineering Audit Report**](./audits/ENGINEERING_AUDIT_REPORT.md) — Forensic verification of benchmark findings, test count breakdown, touch-target analysis, and native CLI addon constraints.
- [**Acceptance Remediation & Quality Lab Closure Report**](./audits/NUICSS_ACCEPTANCE_REMEDIATION_REPORT.md) — Phase 1 acceptance remediation closure report.
- [**Final Acceptance & Ecosystem Verification Report**](./audits/NUICSS_FINAL_ACCEPTANCE_REPORT.md) — Authoritative final acceptance verification report.

### 4. `architecture/` — System Invariants & Contracts

- Single source of truth invariants, zero downstream CSS contracts, cascade layer semantics, and OKLCH token math.

### 5. `decisions/` — Architectural Decision Records (ADRs)

- Formal decision log documenting engine choices, layer directive strategies, and breaking changes.
