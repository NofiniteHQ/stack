# Nofinite Stack Monorepo — Internal Engineering Documentation Hub

> **Repository:** `D:\stack`  
> **Type:** Central Turborepo/Nx Monorepo  
> **Status:** Active Authoritative Engineering Repository

---

## 1. Repository Ownership & Architecture

`D:\stack` is the canonical home of Nofinite's core library ecosystem, design token engine, and developer tooling:

| Package             | Package Name       | Description                                                                                               |       Status       |
| :------------------ | :----------------- | :-------------------------------------------------------------------------------------------------------- | :----------------: |
| **NUICSS**          | `@nofinite/nuicss` | Single source of truth for OKLCH design tokens, resets, component superclasses, and instant JIT compiler. | Published (v3.2.0) |
| **NUICSS CLI**      | `nuicss`           | Native standalone binary and CLI package for zero-Node CSS compilation, linting, and codemods.            |  Active (v0.1.0)   |
| **NUI**             | `@nofinite/nui`    | Core headless and styled React UI component library consuming NUICSS superclasses.                        |  Active (v0.1.0)   |
| **Nofinite Charts** | `@nofinite/charts` | High-performance SVG/Canvas charting suite consuming NUICSS theme tokens and OKLCH palettes.              |  Active (v0.1.0)   |
| **Nofinite Kanban** | `@nofinite/kanban` | Accessible drag-and-drop Kanban board suite consuming NUICSS geometry.                                    |  Active (v0.1.0)   |
| **Nofinite Markon** | `@nofinite/markon` | Rich text and Markdown editor canvas built with TipTap and NUICSS superclasses.                           |  Active (v0.1.0)   |
| **Nofinite Media**  | `@nofinite/media`  | Video/audio player UI bridge built on Vidstack and NUICSS styling.                                        |  Active (v0.1.0)   |
| **Nofinite Locale** | `@nofinite/locale` | Internationalization and localized formatting primitives.                                                 |  Active (v0.1.0)   |
| **Nofinite Utils**  | `@nofinite/utils`  | Shared zero-dependency TypeScript utilities across all packages.                                          |  Active (v0.1.0)   |

---

## 2. Directory Taxonomy

```text
D:\stack\ai-docs/
├── README.md                      <-- This document: monorepo engineering index and registry
├── architecture/                  <-- Cross-package architectural contracts and standards
│   └── REPOSITORY_DOCUMENTATION_STANDARD.md
├── nuicss/                        <-- Dedicated engineering knowledge base for NUICSS
│   ├── README.md                  <-- Index of NUICSS benchmarks, audits, and engineering reports
│   ├── audits/
│   │   ├── QUALITY_HARDENING_REPORT.md
│   │   ├── ENGINEERING_AUDIT_REPORT.md
│   │   ├── NUICSS_ACCEPTANCE_REMEDIATION_REPORT.md
│   │   └── NUICSS_FINAL_ACCEPTANCE_REPORT.md
│   ├── benchmarks/
│   │   ├── MULTI_BROWSER_AND_CALIBRATED_A11Y_REPORT.md
│   │   ├── NUICSS_FINAL_GENERAL_PURPOSE_BENCHMARK.md
│   │   ├── NUICSS_DX_BENCHMARK.md
│   │   ├── NUICSS_GENERAL_PURPOSE_BASELINE.md
│   │   ├── NUICSS_GENERAL_PURPOSE_TEST_REPORT.md
│   │   ├── NUICSS_TAILWIND_VISUAL_BENCHMARK.md
│   │   └── DX_ANALYSIS_REPORT.md
│   ├── engineering/
│   │   ├── CONSOLIDATED_ENGINEERING_EVIDENCE.md
│   │   ├── CLI_RELIABILITY_REPORT.md
│   │   ├── CONSUMER_INTEGRATION_VERIFICATION.md
│   │   ├── NATIVE_ADDON_EXTRACTION_INVESTIGATION.md
│   │   ├── COMPILER_IMPROVEMENT_REPORT.md
│   │   ├── INTEGRATION_VERIFICATION_REPORT.md
│   │   ├── NUICSS_ENGINEERING_CHANGELOG.md
│   │   ├── NUICSS_ENGINEERING_IMPROVEMENT_BACKLOG.md
│   │   └── NUICSS_TAILWIND_BENCHMARK_BACKLOG.md
│   ├── architecture/
│   └── decisions/
├── engineering/                   <-- Monorepo-wide build pipeline and compiler optimizations
├── audits/                        <-- Multi-package quality and security audits
├── benchmarks/                    <-- Monorepo-wide performance and bundle evaluations
├── decisions/                     <-- Architectural Decision Records (ADRs)
└── plans/                         <-- Multi-phase architecture roadmaps
```

---

## 3. Important Architectural Invariants

1. **The Zero Downstream CSS Invariant:**  
   `@nofinite/nuicss` is the sole and absolute styling engine for the entire ecosystem. Downstream packages (`nui`, `kanban`, `markon`, `charts`, `media`, `locale`, `utils`) MUST NEVER author, compile, or bundle independent `.css` files. All component layouts, geometry, and tokens reside strictly in `packages/nuicss`.
2. **Single Source of Truth for Design Tokens:**  
   Design tokens are authored exclusively in OKLCH color space in `packages/nuicss/src/styles/theme.css`. Never write hardcoded hex/sRGB color literals or verbose Tailwind utility clusters when a NUICSS token or superclass exists.
3. **Cross-Repo Docs Sync Contract:**  
   Central public documentation lives in `D:\stack\docs/<pkg>/`. `D:\oss-docs` consumes this canonical Markdown as its content source and enriches it with interactive Next.js client components.
4. **Mandatory Separation of `docs/` and `ai-docs/`:**  
   Public documentation belongs in `docs/`. Internal engineering logs, benchmark comparisons, and AI context belong strictly in `ai-docs/`.

---

## 5. Phase 5: Shared Foundations (Locale & Utils) Planning Hub

Authoritative architecture specifications, risk audits, and roadmaps for Phase 5:

- [PHASE5_SCOPE_AND_DISCOVERY_REPORT.md](file:///D:/stack/ai-docs/PHASE5_SCOPE_AND_DISCOVERY_REPORT.md)
- [PHASE5_LOCALE_ARCHITECTURE.md](file:///D:/stack/ai-docs/PHASE5_LOCALE_ARCHITECTURE.md)
- [PHASE5_UTILS_ARCHITECTURE.md](file:///D:/stack/ai-docs/PHASE5_UTILS_ARCHITECTURE.md)
- [PHASE5_SECURITY_AND_DEPENDENCY_AUDIT.md](file:///D:/stack/ai-docs/PHASE5_SECURITY_AND_DEPENDENCY_AUDIT.md)
- [PHASE5_ECOSYSTEM_COMPATIBILITY.md](file:///D:/stack/ai-docs/PHASE5_ECOSYSTEM_COMPATIBILITY.md)
- [PHASE5_QUALITY_AND_ACCEPTANCE_CRITERIA.md](file:///D:/stack/ai-docs/PHASE5_QUALITY_AND_ACCEPTANCE_CRITERIA.md)
- [PHASE5_IMPLEMENTATION_ROADMAP.md](file:///D:/stack/ai-docs/PHASE5_IMPLEMENTATION_ROADMAP.md)
- [PHASE5_EXECUTION_PROMPT.md](file:///D:/stack/ai-docs/PHASE5_EXECUTION_PROMPT.md)
