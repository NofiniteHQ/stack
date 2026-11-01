# Nofinite Organization-Wide Repository Documentation Standard

> **Standard:** `NOF-STD-DOCS-001`  
> **Status:** Active & Mandatory  
> **Scope:** All active Nofinite engineering repositories (`stack`, `ui-quality-lab`, `nuix`, `oss-docs`, `nofinite.com`)  
> **Date:** November 1, 2026

---

## 1. Core Principle & Architecture

Every active Nofinite engineering repository maintains **two independent, sibling documentation directories at its root**:

```text
repository/
├── docs/       <-- Public and developer-facing documentation (consumed by public generators / oss-docs)
├── ai-docs/    <-- Internal engineering knowledge, architectural decisions, and AI-agent context
├── packages/   <-- Source code and library packages (monorepos)
├── apps/       <-- Application entrypoints (if applicable)
├── temp/       <-- Gitignored temporary runtime scratch files and intermediate test output
├── AGENTS.md   <-- Authoritative engineering constitution and repository rules
├── README.md   <-- Public repository entrypoint
└── package.json
```

> [!IMPORTANT] > **The Sibling Directory Invariant:**  
> `docs/` and `ai-docs/` MUST ALWAYS exist as root-level sibling directories. They must **never** be nested inside each other (e.g., nesting `docs/ai-docs/` is strictly prohibited). This ensures public documentation builders (Next.js, Astro, typedoc) can cleanly scan `docs/` without accidentally exposing internal engineering reports or AI notes.

---

## 2. Directory Ownership & Content Taxonomy

### 2.1 `docs/` — Public & Developer Documentation

The `docs/` directory contains all external, developer-facing documentation. This content is intended for end-users, downstream library consumers, and public documentation sites (`oss-docs`, npm, GitHub).

**Appropriate Content:**

- **Getting Started Guides:** Installation, quickstart, zero-config setup, environment prerequisites.
- **API References:** Component props, function signatures, CLI commands, configuration options.
- **Tutorials & Walkthroughs:** Step-by-step feature integration, building real-world flows.
- **Theming & Token Catalog:** Color scales, CSS custom properties, superclasses.
- **Migration Guides:** Upgrading from prior versions, converting from competitor frameworks (e.g., Tailwind).
- **Public Troubleshooting:** Common pitfalls, bundler FAQs, browser support matrices.
- **Contributor Documentation:** Local development setup, contributing guidelines, PR processes.

**Prohibited Content in `docs/`:**

- Internal benchmark competition raw logs or head-to-head draft notes.
- Forensic defect audits, incident reports, and internal QA execution logs.
- AI agent handoff notes, scratch task plans, and conversation retrospectives.
- Unredacted private API tokens, internal URLs, or confidential roadmap milestones.

---

### 2.2 `ai-docs/` — Internal Engineering Knowledge & AI Context

The `ai-docs/` directory is the authoritative repository of internal engineering context, architectural decisions, test methodology, and persistent knowledge for AI engineering agents and human systems architects.

**Appropriate Content:**

- **Architecture Documentation:** Deep system mechanics, layer invariants, cross-package boundary contracts.
- **Architectural Decision Records (ADRs):** Formal logs of technology choices, deprecations, and breaking changes (`decisions/`).
- **Engineering Reports:** Compiler optimizations, tree-shaking verifications, bundle size evaluations (`engineering/`).
- **Benchmark Reports:** Head-to-head empirical evaluations, latency benchmarks, AST metrics (`benchmarks/`).
- **Forensic Audits:** Accessibility audits, compliance audits, quality gate certifications (`audits/`).
- **Testing Methodology:** Multi-browser configurations, device lab setups, automated harness designs (`testing/`).
- **Task Implementation Plans:** Long-term feature roadmaps and multi-phase specifications (`plans/`).
- **Internal Status & Handoffs:** Engineering changelogs, agent ownership matrices, execution statuses.

**Internal Directory Taxonomy:**

```text
ai-docs/
├── README.md        <-- Authoritative index detailing boundaries, authoritative docs, and dependencies
├── architecture/    <-- System blueprints, invariants, and structural contracts
├── engineering/     <-- Technical optimization reports, compiler notes, changelogs
├── benchmarks/      <-- Empirical evaluations, competitor benchmarks, latency metrics
├── audits/          <-- Quality certifications, forensic reviews, accessibility audits
├── decisions/       <-- Formal Architectural Decision Records (ADRs)
└── plans/           <-- Multi-phase architecture roadmaps and specifications
```

---

### 2.3 `temp/` — Gitignored Temporary Scratch Storage

The `temp/` directory is strictly for ephemeral, non-persistent, AI-generated scratch files and intermediate runtime test outputs.

**Appropriate Content:**

- Feature/task-specific implementation plans during execution (`temp/<project>_implementation_plan.md`).
- AI-generated temporary Node.js/PowerShell debugging scripts.
- Intermediate test output files, raw JSON dumps, and temporary performance profiles.
- Playwright screenshot captures taken for visual validation.
- Temporary sandbox applications created for live ad-hoc verification.

**Rules for `temp/`:**

- Must always be included in `.gitignore`.
- Root directories must remain clean; never write scratch scripts to repository root or source folders.
- Must never be used as a permanent archive for authoritative engineering reports. Once a report is finalized, it must be moved into `ai-docs/` or deleted.

---

## 3. Authoritative Documentation Indexes (`ai-docs/README.md`)

Every active repository maintaining an `ai-docs/` directory MUST author an authoritative `ai-docs/README.md`. This file serves as the definitive onboarding point for AI agents and engineers before starting non-trivial work.

The index must document:

1. **Repository Ownership:** Exactly which libraries, tools, or websites this repository owns.
2. **Architectural Boundaries:** Permitted imports, forbidden dependencies, and invariants.
3. **Document Inventory:** Curated list of all documents in `ai-docs/` with short descriptions and provenance.
4. **Authoritative Documents:** Explicit identification of which documents are active sources of truth versus historical logs.
5. **Cross-Repository Dependencies:** Downstream consumers and upstream dependencies across Nofinite.
6. **Agent Entrypoints:** Recommended order of reading for AI agents starting work in the repository.

---

## 4. Cross-Repository Documentation Contracts

### 4.1 Canonical Documentation Source

- **Central Markdown Ground Truth:** Canonical Markdown documentation for all published packages lives in `D:\stack\docs/` (`docs/nuicss/`, `docs/nui/`, `docs/kanban/`, `docs/charts/`, etc.).
- **Lean Package READMEs:** Inside `packages/<pkg>/README.md`, keep documentation focused on npm quickstart, installation, and direct links to full documentation.
- **Consumption by `oss-docs`:** `D:\oss-docs` consumes this canonical Markdown as its content source, enhancing it with interactive client components (`<ComponentPreview />`), live sandboxes, and Theme Studio pickers.
- **Zero Downstream Duplication:** Downstream repositories (`nuix`, `oss-docs`, `ui-quality-lab`, `nofinite.com`) must never author divergent copies of public API documentation.

### 4.2 Single Source of Truth Invariant

- Never create parallel or duplicate copies of the same authoritative document.
- When an architecture document applies ecosystem-wide, it belongs in `D:\stack\ai-docs\architecture/`. Repository-specific operational guides belong in their respective repository's `ai-docs/`.

---

## 5. Repository Documentation Audit Matrix

| Repository           | Path                |  Public `docs/`  | Internal `ai-docs/` | `AGENTS.md` Synced |            Status            |
| :------------------- | :------------------ | :--------------: | :-----------------: | :----------------: | :--------------------------: |
| **Stack**            | `D:\stack`          |  Yes (`docs/`)   |  Yes (`ai-docs/`)   |      Verified      |       Fully Compliant        |
| **UI Quality Lab**   | `D:\ui-quality-lab` |  Yes (`docs/`)   |  Yes (`ai-docs/`)   |      Verified      | Sibling Separation Completed |
| **NUIX**             | `D:\nuix`           |  Yes (`docs/`)   |  Yes (`ai-docs/`)   |      Verified      |         Established          |
| **OSS Docs**         | `D:\oss-docs`       | N/A (App routes) |  Yes (`ai-docs/`)   |      Verified      |         Established          |
| **Nofinite Website** | `D:\nofinite.com`   | N/A (Web pages)  |  Yes (`ai-docs/`)   |      Verified      |         Established          |
