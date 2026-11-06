# Phase 5: Shared Foundations (Locale & Utils) — Scope & Discovery Report

**Programme:** Nofinite Engineering Quality Programme  
**Phase:** Phase 5 — Shared Foundations: Locale and Utils  
**Target Repository:** `D:\stack`  
**Packages Evaluated:** `@nofinite/locale@2.0.0`, `@nofinite/utils@2.0.1`  
**Governing Standards:** NEAS 1.0 (Nofinite Engineering Assurance Standard) / EOR 1.0  
**Execution Authority:** Project Owner Kickoff Directive (November 6, 2026)  
**Status:** Completed Engineering Discovery & Architectural Assessment

---

## 1. Executive Mission & Programme Alignment

With the completion and formal certification of **Phase 4 (NUIX UI Engine)** on November 6, 2026, the six-phase ecosystem quality roadmap advances to **Phase 5: Shared Foundations (Locale & Utils)**:

1. **Phase 1:** Ecosystem maturity baseline _(Closed)_
2. **Phase 2:** NUI / NUICSS assurance _(Closed with conditional waivers)_
3. **Phase 3:** Markon, Charts, Kanban, and Media _(Certified & Frozen)_
4. **Phase 4:** NUIX UI Engine and production readiness _(Certified & Frozen)_
5. **Phase 5:** Shared Foundations: Locale and Utils _(Active Planning & Architecture)_
6. **Phase 6:** Future programme _(Pending definition)_

This report establishes the baseline facts, source code inventory, architectural defects, security vulnerabilities, and gaps across both packages before any implementation begins.

---

## 2. Package Inventory & Empirical Baselines

### 2.1 Package: `@nofinite/locale` (v2.0.0)

- **Directory:** `D:\stack\packages\locale`
- **Manifest:** Version `2.0.0`, `type: module`, Apache-2.0 License.
- **Dependencies:** 0 runtime dependencies (`dependencies: {}`).
- **Peer Dependencies:** `react >=18.0.0`, `react-dom >=18.0.0` (optional).
- **Physical Source Inventory:**
  - `src/core.ts` (10,135 B): Formatter core (`formatDate`, `formatCurrency`, `formatRelativeTime`, `formatNumber`, `getDirection`), `LruFormatterCache` (capacity 100), and country lookups (`getCountryByCode`, `getCountryByDialCode`, `getCountryMetadata`).
  - `src/data/countries.ts` (14,818 B): 245 ISO 3166-1 country records with name, dialCode, iso2.
  - `src/react/LocaleProvider.tsx` (2,884 B): React 18/19 Context provider and `useLocale()` hook.
  - `src/react/index.ts` (640 B): Subpath entrypoint for React bindings.
  - `src/index.ts` (725 B): Root vanilla entrypoint re-exporting core and country catalog.
  - `src/flags/**` (3.93 MB, 542 raw SVGs): 271 flag SVGs in `flags/1x1/` and 271 in `flags/4x3/`.
  - `src/styles/*.scss` (6,076 B): 4 Sass source files generating `.nf-flag` and `.nf-flag-{iso}` classes.
  - `scripts/generate-styles.ts`: Generator script writing country ISO list to Sass.
- **Test Baseline:** 4 test files, 86 tests passed (100% pass rate in ~713ms). Statements: 82.85%, Branches: 81.25%, Functions: 77.77%.
- **Current Distribution Output (`npm pack --dry-run`):** 22 packaged files (35.8 kB compressed / 155 kB unpacked). Emits `dist/style.css` (172 bytes: `@import '@nofinite/nuicss/styles.css';` compatibility shim).

### 2.2 Package: `@nofinite/utils` (v2.0.1)

- **Directory:** `D:\stack\packages\utils`
- **Manifest:** Version `2.0.1`, `type: module`, Apache-2.0 License.
- **Dependencies:** 4 runtime dependencies (`argon2@^0.45.1`, `jose@^6.2.12`, `uuid@^14.0.2`, `zeptomail@^8.0.1`).
- **Physical Source Inventory:**
  - `src/env/` (6 files): `getEnv`, `getEnvNumber`, `getEnvBoolean`, `requireEnv`, `isEnv`.
  - `src/jwt/` (5 files): Jose WebCrypto HMAC token signing (`signToken`) and verification (`verifyToken`).
  - `src/otp/` (6 files): 6-digit numeric OTP generation, verification, and expiration/attempt guards.
  - `src/password/` (4 files): Argon2id password hashing and verification.
  - `src/server/` (2 files): Re-exports `../password`.
  - `src/uuid/` (4 files): RFC 4122 UUIDv4, RFC 9562 UUIDv7, and 16-byte Buffer roundtripping.
  - `src/zeptomail/` (6 files): Single email and batch email dispatch via Zoho ZeptoMail SDK.
  - `src/index.ts` (14 lines): Root barrel exporting `env`, `jwt`, `otp`, `uuid`, and `zeptomail`.
- **Test Baseline:** 9 test files, 38 tests passed (100% pass rate in ~2.16s). Statements: 78.76%, Branches: 72.72%, Functions: 96.42%.
- **Current Distribution Output:** Emits dual ESM (`.js`) and CJS (`.cjs`) builds via `preserveModules: true`.

---

## 3. Key Findings & Architectural Gaps

### 3.1 `@nofinite/locale` Findings

1. **Dead Weight Assets & The Zero Downstream CSS Invariant Violation:**
   - The package contains 542 uncompiled SVG flag files (~3.9 MB) and 4 SCSS files in `src/`.
   - **Critical Fact:** The build pipeline (`vite.config.ts`) ignores these files completely. Vite emits a 172-byte dummy shim `dist/style.css` containing `@import '@nofinite/nuicss/styles.css';`.
   - Because `@nofinite/nuicss` has never authored `.nf-flag` classes, any downstream user importing `@nofinite/locale/style` renders completely blank, invisible elements.
   - Shipping CSS and raw vector icons in a downstream locale package violates Rule 14 (Zero Downstream CSS Invariant). Flag icons belong in `@nofinite/media` or a dedicated sprite CDN, while flag sizing belongs in `@nofinite/nuicss`.
2. **Missing Core i18n Capabilities (0% Implemented):**
   - The package provides **zero** translation dictionaries or catalog management.
   - **Zero** parameter interpolation or message templating (`t('welcome', { name })`).
   - **Zero** pluralization support (native `Intl.PluralRules` is never used).
   - **Zero** asynchronous or lazy-loading catalog infrastructure.
   - **No `useTranslation` hook**.
   - It is currently an `Intl` formatting wrapper + country telephone code catalog, not a complete localization engine.
3. **Data Integrity Defects in Country Catalog (`src/data/countries.ts`):**
   - **Defect 1 (Illegal Whitespace):** Cayman Islands specifies `dialCode: "+ 345"` (with an internal space).
   - **Defect 2 (Invalid Dial Code):** Heard Island & McDonald Islands specifies `dialCode: "+0"`, which is an invalid ITU-T calling code for an uninhabited territory.
   - **Defect 3 (Collation & Character Anomaly):** `Åland Islands` contains the sole non-ASCII character in the entire dataset (`Å`), while all other accented international names (`Côte d'Ivoire`, `Réunion`, `São Tomé`) were flattened to ASCII. Furthermore, it is sorted between `Afghanistan` and `Albania`, violating Swedish/Finnish alphabetical collation.
4. **Core Bundle Bloat:**
   - Bundling the static 245-country array (14.8 KB raw) directly into `src/index.ts` bloats the core ESM bundle to **17.36 KB raw**, exceeding the NEAS $< 15.0\text{ KB}$ raw budget. The actual formatting logic (`core.ts`) is only 2.95 KB raw.

---

### 3.2 `@nofinite/utils` Findings

1. **Domain Imbalance & Misleading Brand Promise:**
   - Despite being positioned as `@nofinite/utils`, it provides **no string helpers**, **no object/array utilities**, **no async primitives**, **no math helpers**, and **no DOM utilities**.
   - As a result, ecosystem packages (`charts`, `kanban`, `markon`, `nui`, `nuix`) duplicate `escapeHtml`, `sanitizeUrl`, `clamp`, and `debounce` across 5 separate locations.
2. **Severe Runtime Isolation & Browser Bundling Leakage:**
   - `argon2` is a C++ native addon (`node-gyp`) in top-level `dependencies`. Client applications installing `@nofinite/utils` are forced to compile or download native C++ binaries.
   - `src/index.ts` re-exports `./zeptomail`, which pulls `zeptomail`, `axios`, and Node stream/HTTP modules into the root module graph. Any frontend application importing from `@nofinite/utils` root fails at build time.
3. **Packaging & CommonJS Export Bugs:**
   - In `packages/utils/package.json`, the `"require"` condition is **completely missing** from all export subpaths (`.`, `./otp`, `./server`, `./password`, `./jwt`, `./uuid`, `./env`, `./email`, `./zeptomail`). CJS consumers on Node.js (<22) fall through to `"default": "./dist/index.js"` and crash with `ERR_REQUIRE_ESM`.
   - `vite.config.ts` hardcodes `dir: './packages/utils/dist'`, creating an unintended nested directory `packages/utils/packages/utils/dist`.
   - `packages/utils/dist/package.json` contains a stale artifact from Feb 2026.
4. **Test Coverage Deficits:**
   - `src/env/` branch coverage is only **39.13%** (fails NEAS Level 2 $\ge 95\%$ gate). Untested fallback logic, missing key error throwing, and boolean conversions pose regression risks.
5. **Truth Gap with Documentation:**
   - `oss-docs` explicitly informs AI agents and developers: _"You are using @nofinite/utils. Use `cn(...classes)` for conditional class joining."_ In reality, `cn()` is trapped inside `@nofinite/nui/src/utils/cn`.

---

## 4. Comprehensive Risk Register

| Risk ID             | Package            |  Severity  |     Category      | Risk Description & Impact                                                                                                                                                |
| :------------------ | :----------------- | :--------: | :---------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`UTILS-M3-01`**   | `@nofinite/utils`  |  **High**  |   Supply-Chain    | Direct dependency on dormant `zeptomail@8.0.1` exposes downstream consumers with frozen lockfiles to 36 transitive CVEs in `axios`, `follow-redirects`, and `form-data`. |
| **`UTILS-SEC-01`**  | `@nofinite/utils`  |  **High**  |   Cryptography    | 6-digit numeric OTPs are hashed via plain unsalted `SHA-256`, allowing instantaneous ($<15\text{ ms}$) precomputation and rainbow table reversals.                       |
| **`UTILS-SEC-02`**  | `@nofinite/utils`  |  **High**  | Denial-of-Service | `argon2` default parameters (64 MB memory, 4 parallelism) allow unauthenticated OOM / CPU starvation under light load; malformed hash returns leak timing.               |
| **`UTILS-SEC-03`**  | `@nofinite/utils`  | **Medium** |   Cryptography    | `getJwtSecret()` permits weak secrets ($<32$ bytes), violating RFC 7518 minimum 256-bit key constraints.                                                                 |
| **`UTILS-SEC-04`**  | `@nofinite/utils`  |  **Low**   |   Architecture    | UUIDv7 leaks creation timestamps in sensitive tokens; reliance on Node `Buffer` breaks browser and Edge worker isomorphism.                                              |
| **`LOCALE-SEC-01`** | `@nofinite/locale` | **Medium** |     Resource      | Bounded LRU cache (100 entries) is vulnerable to cache thrashing and heavy V8 ICU instantiation spikes under dynamic locale tag injection.                               |
| **`LOCALE-SEC-02`** | `@nofinite/locale` |  **Low**   |       Logic       | $O(N)$ regex cleaning in `getCountryByDialCode`, data whitespace flaw (`"+ 345"`), and ambiguous `+1` multi-country resolution.                                          |
| **`LOCALE-SEC-03`** | `@nofinite/locale` |  **Low**   |       Data        | Non-ASCII `Å` in Åland Islands requires automated NFC normalization verification.                                                                                        |

---

## 5. Strategic Architectural Directions

1. **Transform `@nofinite/locale` into a True Enterprise Localization Engine (v3.0.0):**
   - Retain zero-dependency native `Intl` architecture.
   - Purge 542 dead SVG flags and SCSS stylesheets (Zero Downstream CSS compliance).
   - Decouple country metadata into `@nofinite/locale/countries` to shrink core bundle to $< 3.5\text{ KB}$ raw.
   - Implement zero-dependency dictionary catalog, interpolation (`t()`), pluralization (`Intl.PluralRules`), list formatting (`Intl.ListFormat`), and `useTranslation()` React hook.
2. **Re-architect `@nofinite/utils` as a Modular Universal Utility Engine (v3.0.0):**
   - Establish isomorphic browser-safe root entry (`.`) and subpaths (`./string`, `./object`, `./array`, `./math`, `./async`, `./validation`, `./date`, `./dom`, `./uuid`, `./jwt`, `./otp`, `./env`).
   - Isolate native `argon2` and email dispatch behind `@nofinite/utils/server` with optional peer dependencies.
   - Resolve `UTILS-M3-01` by replacing `zeptomail` with a zero-dependency native `fetch` REST client for Zoho ZeptoMail API.
   - Adopt `cn()` into `@nofinite/utils` to fulfill the ecosystem contract and eliminate duplicate `clsx`/`tailwind-merge` dependencies.
   - Correct `package.json` export mappings to provide full CommonJS (`"require"`) and ESM (`"import"`) dual support.

This scope and discovery report forms the authoritative empirical foundation for the Phase 5 architecture specifications and implementation roadmap.
