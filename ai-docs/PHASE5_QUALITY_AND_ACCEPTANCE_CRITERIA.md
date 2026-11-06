# Phase 5: Shared Foundations — Quality, Testing & Acceptance Criteria

**Programme:** Nofinite Engineering Quality Programme  
**Phase:** Phase 5 — Shared Foundations: Locale and Utils  
**Target Repository:** `D:\stack`  
**Packages Evaluated:** `@nofinite/locale@2.0.0`, `@nofinite/utils@2.0.1`  
**Author:** Antigravity Technical Assurance & Quality Lead  
**Governing Standard:** NEAS 1.0 (Nofinite Engineering Assurance Standard) / EOR 1.0  
**Date:** November 6, 2026  
**Status:** Quality Assurance & Acceptance Specification — Pending Approval

---

## 1. Empirical Test Baselines & Current Quality State

Machine execution of both packages was performed in `D:\stack` via Vitest v4.1.2 under Node.js runtime environments:

```text
@nofinite/locale:  4 test files,  86 passed, 0 failed, 0 skipped (duration: ~713ms)
@nofinite/utils:   9 test files,  38 passed, 0 failed, 0 skipped (duration: ~2.16s)
Combined Baseline: 13 test files, 124 passed, 0 failed (100% pass rate)
```

### 1.1 Empirical Test Coverage Metrics

| Package                         | Test Files | Total Tests | Pass Rate  | Vitest Duration | Statement Cov | Branch Cov | Function Cov |  Line Cov  |
| :------------------------------ | :--------: | :---------: | :--------: | :-------------: | :-----------: | :--------: | :----------: | :--------: |
| **`@nofinite/locale` (v2.0.0)** |     4      |     86      | **100.0%** |     713 ms      |  **82.85%**   | **81.25%** |  **77.77%**  | **85.60%** |
| **`@nofinite/utils` (v2.0.1)**  |     9      |     38      | **100.0%** |    2,160 ms     |  **78.76%**   | **72.72%** |  **96.42%**  | **80.55%** |

### 1.2 Critical Coverage Gaps in Current State

- **`@nofinite/utils/src/env/`:** Branch coverage is currently **39.13%**! Missing tests for `options.required` error throwing, `defaultValue` fallbacks, `Number.isNaN` failures, and boolean parsing of falsy values (`'false'`, `'0'`, `'no'`).
- **`@nofinite/utils/src/jwt/`:** Branch coverage is **70.00%**. Missing tests for empty `JWT_SECRET` throwing, optional `issuer` / `audience` parameters, and algorithm rejection.
- **`@nofinite/locale/src/core.ts`:** Statements 83.47%, Branches 81.69%. Missing coverage on inner fallback catch blocks and script subtag loop termination.

---

## 2. Gap Analysis Across 9 NEAS 1.0 Testing Dimensions

NEAS 1.0 mandates that enterprise foundation packages be verified across nine distinct testing dimensions:

| Testing Dimension                   | NEAS 1.0 Standard                                                    | Current `@nofinite/locale` State                            | Current `@nofinite/utils` State                                                | Required Phase 5 Actions                                                                         |
| :---------------------------------- | :------------------------------------------------------------------- | :---------------------------------------------------------- | :----------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **1. Unit & Logic Coverage**        | $\ge 95.0\%$ Statement, $\ge 95.0\%$ Branch                          | 82.85% Stmt / 81.25% Branch                                 | 78.76% Stmt / 72.72% Branch                                                    | Elevate coverage to $\ge 95\%$ across all modules; add suites for all new utility domains.       |
| **2. Contract & Type Tests (TSD)**  | Explicit `.test-d.ts` asserting strict typing & inference            | Relies solely on `tsc` compilation                          | Relies solely on `tsc` compilation                                             | Author type tests for generic key inference in `t()`, currency string unions, and `pick`/`omit`. |
| **3. Security & Adversarial PoC**   | Adversarial verification against prototype pollution, timing attacks | Covers malformed BCP 47 tags; missing fuzzing               | Validates Argon2 `p=4`, OTP `timingSafeEqual`; missing prototype pollution PoC | Add automated PoC tests proving `deepMerge` neutralizes `__proto__` and `constructor.prototype`. |
| **4. Boundary & Fuzz Testing**      | 1,000+ iteration sweeps on malformed/arbitrary strings               | 42 static RTL test cases; 0 stochastic fuzz tests           | Static buffer length tests; 0 stochastic fuzz tests                            | Author fuzzing harnesses for locale tag parser, slugify, and template interpolation.             |
| **5. Performance & Latency**        | Sub-millisecond formatting budgets ($<0.05\text{ ms/op}$)            | Verified via 10,000 warm iterations ($0.0024\text{ ms/op}$) | Argon2 tests execute synchronously (~800ms)                                    | Add formal latency regression assertions for all formatters and string sanitizers.               |
| **6. SSR & Isomorphic Safety**      | Zero hydration mismatch; zero DOM crashes in Node/Edge               | Single `renderToString` test; no hydration check            | Pure Node.js environment; no Edge/browser checks                               | Validate React 19 hydration with `<LocaleProvider>` and ensure all client utils pass Node SSR.   |
| **7. Tree-Shaking Hygiene**         | Importing a single helper pulls zero unrelated modules               | Bundles 14.8 KB country dataset into root                   | Re-exports ZeptoMail & Node crypto from root                                   | Decouple country data to `./countries`; isolate server utilities to `./server`.                  |
| **8. Multi-Runtime Testing**        | Verified in Chromium, Firefox, WebKit, Node, Edge                    | Only runs in Node.js (Vitest Node)                          | Only runs in Node.js                                                           | Execute browser test passes in Playwright Chromium, Firefox, WebKit via UI Quality Lab.          |
| **9. Packaging / Consumer Sandbox** | Real tarball verification in isolated consumer                       | Clean consumer verified in Quality Lab                      | Clean consumer verified in Quality Lab                                         | Establish continuous automated npm pack verification gates on every build.                       |

---

## 3. Performance Budgets, Latency & Bundle Benchmarks

### 3.1 Empirical Formatting Latency Benchmarks

A high-resolution microbenchmark was executed against the compiled `@nofinite/locale` production bundle (`dist/index.cjs`), running 10,000 warm iterations and 100 cold misses:

```text
Cold Formatter Instantiation:  0.3598 ms / op
Warm formatDate (LRU Cached):  0.0024 ms / op (2.4 microseconds)
Warm formatNumber (LRU):       0.0012 ms / op (1.2 microseconds)
Warm formatCurrency (LRU):     0.0021 ms / op (2.1 microseconds)
Warm formatRelativeTime (LRU): 0.0025 ms / op (2.5 microseconds)
```

- **Analysis:** Pre-warmed formatters retrieved from the bounded LRU cache execute in **$1.2 - 2.5\text{ microseconds}$**, delivering a **$150\times$ speedup** over cold V8 ICU instantiation.
- **Budget Compliance:** **PASSED.** All warm formatters easily satisfy the NEAS $< 0.05\text{ ms/op}$ budget threshold.

### 3.2 Bundle Size Budgets & Calibrations

#### 1. `@nofinite/locale` Bundle Budget:

- **Budget Requirement:** Core bundle $< 15.0\text{ KB}$ raw / $< 5.0\text{ KB}$ gzip (excluding external translation catalogs).
- **Current Measurement:**
  - `dist/index.js` (Root ESM): **17.36 KB raw** (17,775 B) / **4.47 KB gzip** (4,573 B).
  - _Finding:_ Raw size exceeds the 15 KB budget because `src/data/countries.ts` (14.8 KB) is statically bundled into the root index. The actual formatting engine (`core.ts`) is only 2.95 KB raw.
- **Phase 5 Target:** Decoupling country data into `@nofinite/locale/countries` brings the core root bundle down to **$< 3.5\text{ KB}$ raw / $< 1.2\text{ KB}$ gzip**, easily satisfying the NEAS budget.

#### 2. `@nofinite/utils` Bundle Budget:

- **Budget Requirement:** Individual client subpaths must be $< 3.5\text{ KB}$ raw each with zero external dependencies.
- **Phase 5 Subpath Budgets:**
  - `@nofinite/utils/string`: $\le 3.0\text{ KB}$ raw / $\le 1.2\text{ KB}$ gzip
  - `@nofinite/utils/object`: $\le 3.5\text{ KB}$ raw / $\le 1.4\text{ KB}$ gzip
  - `@nofinite/utils/array`: $\le 2.5\text{ KB}$ raw / $\le 1.0\text{ KB}$ gzip
  - `@nofinite/utils/math`: $\le 1.5\text{ KB}$ raw / $\le 0.7\text{ KB}$ gzip
  - `@nofinite/utils/async`: $\le 3.5\text{ KB}$ raw / $\le 1.4\text{ KB}$ gzip
  - `@nofinite/utils/validation`: $\le 2.0\text{ KB}$ raw / $\le 0.9\text{ KB}$ gzip
  - `@nofinite/utils/date`: $\le 3.0\text{ KB}$ raw / $\le 1.2\text{ KB}$ gzip
  - `@nofinite/utils/dom`: $\le 2.5\text{ KB}$ raw / $\le 1.0\text{ KB}$ gzip
  - `@nofinite/utils/uuid`: $\le 1.5\text{ KB}$ raw / $\le 0.8\text{ KB}$ gzip

---

## 4. Measurable Certification Gates (Phase 5 Exit Criteria)

To achieve formal Level 2 Release Assurance certification upon implementation, both packages must satisfy 14 non-negotiable gates:

| Gate ID          | Gate Name                         |    Target Scope    | Non-Negotiable Acceptance Threshold                                                     | Verification Command                                        |
| :--------------- | :-------------------------------- | :----------------: | :-------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| **`GATE-P5-01`** | **Locale Unit Completeness**      | `@nofinite/locale` | $\ge 180\text{ passed tests}$; 0 failed; 0 skipped.                                     | `pnpm --filter @nofinite/locale test`                       |
| **`GATE-P5-02`** | **Utils Unit Completeness**       | `@nofinite/utils`  | $\ge 140\text{ passed tests}$; 0 failed; 0 skipped.                                     | `pnpm --filter @nofinite/utils test`                        |
| **`GATE-P5-03`** | **Locale Coverage Gate**          | `@nofinite/locale` | $\ge 95.0\%$ Statement, $\ge 95.0\%$ Branch coverage.                                   | `pnpm --filter @nofinite/locale exec vitest run --coverage` |
| **`GATE-P5-04`** | **Utils Coverage Gate**           | `@nofinite/utils`  | $\ge 95.0\%$ Statement, $\ge 95.0\%$ Branch coverage (`env` $\ge 95\%$).                | `pnpm --filter @nofinite/utils exec vitest run --coverage`  |
| **`GATE-P5-05`** | **TypeScript Typecheck**          |   Both packages    | `tsconfig.lib.json` and `tsconfig.spec.json` compile with Exit Code 0.                  | `npx tsc -p <tsconfig> --noEmit`                            |
| **`GATE-P5-06`** | **Prototype Pollution PoC**       | `@nofinite/utils`  | 100% pass on adversarial `deepMerge` / `set` tests asserting `Object.prototype` purity. | `pnpm --filter @nofinite/utils test`                        |
| **`GATE-P5-07`** | **Zero-CVE Email Client**         | `@nofinite/utils`  | `zeptomail` purged; native fetch client deployed; 0 transitive CVEs in fresh installs.  | `npm audit --omit=dev --json`                               |
| **`GATE-P5-08`** | **Locale Bundle Budget**          | `@nofinite/locale` | Core ESM bundle $< 15.0\text{ KB}$ raw / $< 5.0\text{ KB}$ gzip (countries decoupled).  | `node scripts/audit-bundle-size.mjs`                        |
| **`GATE-P5-09`** | **Utils Subpaths Budget**         | `@nofinite/utils`  | Every client subpath $< 3.5\text{ KB}$ raw each; zero external dependencies.            | `node scripts/audit-bundle-size.mjs`                        |
| **`GATE-P5-10`** | **Formatting Latency**            | `@nofinite/locale` | Warm `formatDate` / `formatNumber` latency $< 0.05\text{ ms/op}$.                       | `node scripts/benchmark-formatting.mjs`                     |
| **`GATE-P5-11`** | **Packaging & Tarball Hygiene**   |   Both packages    | `npm pack` tarballs contain 0 `.tsbuildinfo`, 0 tests, 0 duplicate folders.             | `npm pack --dry-run`                                        |
| **`GATE-P5-12`** | **Consumer Sandbox Verification** |   Both packages    | Clean installation and execution in `fixtures/consumer-sandbox/` without peer warnings. | `pnpm --dir D:\ui-quality-lab test:consumer`                |
| **`GATE-P5-13`** | **Zero Downstream CSS**           |   Both packages    | Exactly 0 `.css` files authored or packaged (except backward-compat shim).              | `find . -name "*.css"`                                      |
| **`GATE-P5-14`** | **Single-ZIP Deliverable**        |   ui-quality-lab   | Regenerated, checksum-verified `D:\ui-quality-lab\ai-docs\report.zip`.                  | EOR 1.0 Section 8 validation                                |

---

## 5. Verification Commands Playbook

When Phase 5 implementation is authorized by the Project Owner, the engineering team must execute and provide unadulterated execution logs for:

```powershell
# 1. Typecheck production and spec configurations
Set-Location D:\stack
npx tsc -p packages/locale/tsconfig.lib.json --noEmit
npx tsc -p packages/locale/tsconfig.spec.json --noEmit
npx tsc -p packages/utils/tsconfig.lib.json --noEmit
npx tsc -p packages/utils/tsconfig.spec.json --noEmit

# 2. Execute full unit test suites with v8 coverage
pnpm --filter @nofinite/locale exec vitest run --coverage
pnpm --filter @nofinite/utils exec vitest run --coverage

# 3. Production build
pnpm --filter @nofinite/locale build
pnpm --filter @nofinite/utils build

# 4. Packaging inspection (NPM pack gate)
cd D:\stack\packages\locale && npm pack --dry-run
cd D:\stack\packages\utils && npm pack --dry-run

# 5. Isolated consumer sandbox verification in Quality Lab
Set-Location D:\ui-quality-lab
pnpm test:consumer
```

This quality assurance framework defines clear, measurable, non-negotiable gates ensuring `@nofinite/locale` and `@nofinite/utils` attain highest-tier engineering certification.
