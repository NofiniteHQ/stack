# Phase 5: Nofinite Utils — Target Architecture Specification (v3.0.0)

**Package:** `@nofinite/utils`  
**Current Version:** `2.0.1`  
**Target Architecture Version:** `3.0.0`  
**Target Repository:** `D:\stack\packages\utils`  
**Author:** Antigravity Main Engineering Agent (Technical Assurance Lead)  
**Governing Standard:** NEAS 1.0 (Nofinite Engineering Assurance Standard) / EOR 1.0  
**Date:** November 6, 2026  
**Status:** Architectural Specification — Pending Project Owner Approval

---

## 1. Architectural Mission & Core Principles

`@nofinite/utils` is the shared, modular utility foundation for the Nofinite ecosystem.

In version 3.0.0, the package undergoes a comprehensive architectural redesign to resolve the severe runtime isolation failures of v2.0.1, eliminate duplicate utility logic across downstream libraries, and establish a **universal, browser-safe, tree-shakeable utility engine**.

### 1.1 Architectural Principles

1. **Universal & Browser-Safe by Default:** The root export (`@nofinite/utils`) and all standard subpaths (`./string`, `./object`, `./array`, `./math`, `./async`, `./validation`, `./date`, `./dom`, `./uuid`, `./jwt`, `./otp`, `./env`) must be 100% isomorphic. They must execute seamlessly in Web Browsers, Cloudflare Workers, Vercel Edge Runtime, Deno, Bun, and Node.js without native C++ compilation dependencies.
2. **Strict Server-Only Containment:** Server-only utilities, native binaries, and network transports (`argon2` password hashing, transactional email dispatch) are strictly isolated behind `@nofinite/utils/server` and optional peer dependencies.
3. **Consolidated Ecosystem Truth:** Provide canonical, battle-tested implementations of `escapeHtml`, `sanitizeUrl`, `clamp`, `debounce`, and `cn()` to eliminate code duplication across `@nofinite/nui`, `@nofinite/charts`, `@nofinite/kanban`, `@nofinite/markon`, and `@nofinite/nuix`.
4. **Zero Dependency Bloat:** Standard Web APIs (Web Crypto API, `crypto.randomUUID`, `crypto.getRandomValues`, global `fetch`, `structuredClone`) are leveraged directly. The `uuid` package is eliminated, `argon2` and `zeptomail` are removed from unconditional dependencies, and `jose` remains the sole lightweight runtime dependency.
5. **Full CommonJS & ESM Dual Export Hygiene:** Every subpath explicitly maps both `"import"` (ESM) and `"require"` (CommonJS) conditions, eliminating the `ERR_REQUIRE_ESM` defect.

---

## 2. Directory Layout & Module Structure (v3.0.0)

```text
packages/utils/
├── src/
│   ├── index.ts                  # Root universal barrel (browser-safe utilities only)
│   ├── string/                   # String manipulation & XSS sanitization (Subpath: ./string)
│   │   ├── escape-html.ts        # Fast XSS HTML escaping
│   │   ├── sanitize-url.ts       # Protocol filtering (http, https, mailto, tel)
│   │   ├── slugify.ts            # Unicode-aware URL slug generator
│   │   ├── truncate.ts           # Word-boundary aware truncation
│   │   ├── case.ts               # camelCase, snakeCase, kebabCase, pascalCase, capitalize
│   │   ├── template.ts           # Micro-template parameter substitution
│   │   ├── escape-regex.ts       # Regex special character escaping
│   │   └── index.ts
│   ├── object/                   # Object manipulation & prototype security (Subpath: ./object)
│   │   ├── deep-clone.ts         # structuredClone with recursive fallback
│   │   ├── deep-merge.ts         # Prototype-pollution hardened recursive merge
│   │   ├── pick.ts               # Type-safe key projection
│   │   ├── omit.ts               # Type-safe key omission
│   │   ├── is-equal.ts           # Deep value equality
│   │   └── index.ts
│   ├── array/                    # Array transformation & partitioning (Subpath: ./array)
│   │   ├── chunk.ts              # Equal chunk partitioning
│   │   ├── group-by.ts           # Object grouping by key/iteratee
│   │   ├── unique.ts             # High-performance deduplication (unique, uniqueBy)
│   │   ├── shuffle.ts            # CSPRNG Fisher-Yates array shuffling
│   │   ├── partition.ts          # Predicate array splitting
│   │   ├── range.ts              # Numeric array generator
│   │   └── index.ts
│   ├── math/                     # Numbers, clamping & byte formatting (Subpath: ./math)
│   │   ├── clamp.ts              # Boundary containment
│   │   ├── round.ts              # Precision-safe decimal rounding
│   │   ├── format-bytes.ts       # Human-readable byte formatter (KB, MB, GB)
│   │   ├── percentage.ts         # Percentage calculation with precision
│   │   ├── random-range.ts       # Bounded CSPRNG number generator
│   │   └── index.ts
│   ├── async/                    # Concurrency, timers & rate-limiting (Subpath: ./async)
│   │   ├── debounce.ts           # Leading/trailing timer debouncing
│   │   ├── throttle.ts           # Rate-limiting execution throttling
│   │   ├── sleep.ts              # Abortable promise timer
│   │   ├── retry.ts              # Exponential backoff with jitter
│   │   ├── timeout.ts            # Promise deadline enforcement
│   │   ├── p-limit.ts            # Concurrency-bounded queue
│   │   ├── deferred.ts           # Deferred promise controller
│   │   └── index.ts
│   ├── validation/               # Type guards & validators (Subpath: ./validation)
│   │   ├── is-email.ts           # RFC 5322 email syntax validator
│   │   ├── is-url.ts             # URL constructor validation
│   │   ├── is-numeric.ts         # Numeric string & number validation
│   │   ├── is-plain-object.ts    # Object prototype guard
│   │   ├── is-empty.ts           # Empty string/array/object/map guard
│   │   ├── is-nil.ts             # Null or undefined guard
│   │   └── index.ts
│   ├── date/                     # Lightweight zero-dependency date math (Subpath: ./date)
│   │   ├── date-math.ts          # addDays, subDays, diffDays, isSameDay, startOfDay
│   │   ├── month-grid.ts         # Calendar month matrix generator
│   │   ├── format-duration.ts    # Duration formatter (hh:mm:ss)
│   │   └── index.ts
│   ├── dom/                      # Client-side DOM & environment helpers (Subpath: ./dom)
│   │   ├── is-browser.ts         # SSR-safe environment guard
│   │   ├── clipboard.ts          # Modern clipboard writer with fallback
│   │   ├── media-query.ts        # prefersReducedMotion, prefersDarkMode
│   │   ├── safe-storage.ts       # safeLocalStorage, safeSessionStorage with memory fallback
│   │   └── index.ts
│   ├── cn/                       # Class name merging utility (Subpath: ./cn)
│   │   ├── cn.ts                 # Canonical clsx + tailwind-merge wrapper
│   │   └── index.ts
│   ├── uuid/                     # Zero-dependency RFC 9562 identifiers (Subpath: ./uuid)
│   │   ├── uuid-v4.ts            # crypto.randomUUID wrapper
│   │   ├── uuid-v7.ts            # 25-line zero-dependency time-ordered UUIDv7
│   │   ├── uuid-bytes.ts         # Uint8Array <-> UUID canonical conversion
│   │   └── index.ts
│   ├── jwt/                      # WebCrypto JWT token management (Subpath: ./jwt)
│   │   ├── jwt-secret.ts         # RFC 7518 256-bit minimum key validator
│   │   ├── sign-token.ts         # Supports explicit secret & options
│   │   ├── verify-token.ts       # Detailed verification with error codes
│   │   └── index.ts
│   ├── otp/                      # Universal WebCrypto OTP (Subpath: ./otp)
│   │   ├── generate-otp.ts       # WebCrypto CSPRNG & salted/HMAC hashing
│   │   ├── verify-otp.ts         # Constant-time comparison
│   │   ├── otp-guards.ts         # isOtpExpired, hasExceededOtpAttempts
│   │   └── index.ts
│   ├── env/                      # Safe environment parsing (Subpath: ./env)
│   │   ├── get-env.ts            # Empty string bug fix & globalThis fallback
│   │   ├── is-env.ts             # isProd, isDev, isTest
│   │   └── index.ts
│   └── server/                   # STRICTLY SERVER-ONLY (Node.js runtime) (Subpath: ./server)
│       ├── password/             # Argon2id password hashing (dynamic optional import)
│       ├── email/                # Zero-dependency native fetch ZeptoMail REST client
│       └── index.ts
├── tests/                        # Comprehensive unit, contract, and adversarial PoC tests
├── vite.config.ts                # Multi-entry library build with ESM and CJS outputs
└── package.json                  # Clean modular package exports
```

---

## 3. Detailed Architectural Breakdown by Domain

### 3.1 String Utilities (`./string`)

- **`escapeHtml(str)`:** Replaces `&`, `<`, `>`, `"`, `'` with standard XML entities. Replaces duplicated copies across Charts, Kanban, Markon, and NUIX with one centralized, hyper-performant regex lookup.
- **`sanitizeUrl(url)`:** Rejects `javascript:`, `data:`, `vbscript:`, and control characters. Strictly permits `http:`, `https:`, `mailto:`, `tel:`, and relative paths (`/`, `./`, `#`).
- **`slugify(text, options)`:** Strips diacritics using Unicode normalization (`str.normalize('NFD')`), removes non-word characters, and converts to lowercase hyphenated strings.
- **`truncate(text, length, options)`:** Truncates strings respecting full word boundaries and multi-byte UTF-16 surrogate pairs.
- **Casing Conversions:** High-performance converters for `camelCase`, `snakeCase`, `kebabCase`, `pascalCase`, and `capitalize`.

### 3.2 Object & Security Utilities (`./object`)

- **`deepClone(value)`:** Leverages native `structuredClone` when available, falling back to a recursive cloner handling circular references, `Date`, `RegExp`, `Map`, `Set`, and `TypedArray`.
- **`deepMerge(target, ...sources)` — Prototype Pollution Hardened:**
  - **Adversarial Security Gate:** Strictly ignores and strips `__proto__`, `constructor`, and `prototype` keys during traversal, preventing prototype poisoning vulnerabilities.
- **`pick(obj, keys)` & `omit(obj, keys)`:** Type-safe object projections.
- **`isEqual(a, b)`:** Fast deep equality assertion without third-party dependencies.

### 3.3 Array Utilities (`./array`)

- **`chunk(items, size)`:** Splits an array into sub-arrays of specified length.
- **`groupBy(items, fn)`:** Groups array elements by string or numeric key.
- **`unique(items)` & `uniqueBy(items, fn)`:** High-speed deduplication using Set and Map.
- **`shuffle(items)`:** Cryptographically sound Fisher-Yates shuffle utilizing `crypto.getRandomValues`.
- **`partition(items, predicate)`:** Splits array into a tuple of `[truthyElements, falsyElements]`.

### 3.4 Math & Numeric Helpers (`./math`)

- **`clamp(value, min, max)`:** Ensures numbers stay within bounded limits.
- **`round(value, decimals)`:** Solves floating point rounding anomalies (`round(0.1 + 0.2, 2)` -> `0.3`).
- **`formatBytes(bytes, decimals)`:** Formats raw byte counts into human-readable strings (`1024` -> `"1.00 KB"`, `1048576` -> `"1.00 MB"`).
- **`percentage(value, total, decimals)`:** Safe percentage calculation handling 0 totals gracefully.

### 3.5 Async Primitives (`./async`)

- **`debounce(fn, waitMs, options)`:** Bounded event debouncing supporting both `leading` and `trailing` execution flags.
- **`throttle(fn, waitMs, options)`:** Rate-limits frequent event invocations.
- **`sleep(ms, signal?)`:** Promise-based timer supporting standard `AbortSignal` cancellation.
- **`retry(fn, options)`:** Asynchronous retry with exponential backoff and randomized jitter.
- **`timeout(promise, ms, error?)`:** Enforces execution deadlines, rejecting if the promise does not settle within `ms`.
- **`pLimit(concurrency)`:** Lightweight concurrency-limited task runner.

### 3.6 Validation & Type Guards (`./validation`)

- **`isEmail(str)`:** RFC 5322 regex validation with length bounds.
- **`isUrl(str)`:** URL constructor validation against allowable protocols.
- **`isPlainObject(val)`:** Verifies objects created via `{}` or `Object.create(null)`.
- **`isEmpty(val)`:** Checks whether string, array, object, set, or map has 0 elements.

### 3.7 Date Math (`./date`)

- **Zero-Dependency Calendar Primitives:** Lightweight functions (`addDays`, `subDays`, `diffDays`, `isSameDay`, `isDateInRange`) operating on standard `Date` objects.
- **`generateMonthGrid(year, month)`:** Returns a 6x7 matrix of calendar day dates, eliminating the need for `@formkit/tempo` in calendar/datepicker controls.

### 3.8 DOM & Browser Helpers (`./dom`)

- **`isBrowser()`:** Safe boolean checking `typeof window !== 'undefined' && typeof document !== 'undefined'`.
- **`copyToClipboard(text)`:** Writes to `navigator.clipboard.writeText` with textarea fallback.
- **`safeLocalStorage` & `safeSessionStorage`:** Storage proxies that transparently fall back to an in-memory map in private browsing mode, SSR, or iframe restricted environments.

### 3.9 Class Name Merger (`./cn`)

- Centralizes `cn(...inputs)` combining `clsx` and `tailwind-merge`. Fulfills the `oss-docs` and `nofinite.com` contract, removing duplicate installs across repositories.

### 3.10 Universal Identifiers (`./uuid`)

- **Eliminate `uuid` Package:**
  - `generateUuidV4()` implemented via native `crypto.randomUUID()`.
  - `generateUuidV7()` implemented via zero-dependency RFC 9562 timestamp concatenation and `crypto.getRandomValues()`.
- **Uint8Array Conversion:** `uuidToBytes(uuid)` and `bytesToUuid(bytes)` accept and return universal `Uint8Array`, retaining a Node.js `Buffer` interop wrapper for backward compatibility.

### 3.11 Universal WebCrypto JWT (`./jwt`)

- **Explicit Secret Override:** `signToken(payload, options)` and `verifyToken(token, options)` accept an explicit `secret?: string | Uint8Array`.
- **RFC 7518 Minimum Key Length:** Enforces minimum 32 bytes (256 bits) for HMAC secrets.
- **Detailed Verification Result:** Exposes `safeVerifyToken(token, options)` returning `{ valid: true, payload }` or `{ valid: false, code: 'EXPIRED' | 'INVALID_SIGNATURE' | 'MALFORMED' }`.

### 3.12 Universal WebCrypto OTP (`./otp`)

- **Isomorphic CSPRNG:** Replaces Node `crypto.randomInt` with `crypto.getRandomValues()`.
- **Salted Hash Protection (`UTILS-SEC-01` Remediation):** Incorporates a 16-byte random salt or server HMAC pepper, defeating precomputed rainbow tables.
- **Constant-Time Verification:** Employs constant-time XOR comparison to prevent timing side-channel attacks.

### 3.13 Safe Environment Variables (`./env`)

- **Global Fallback:** Evaluates `(globalThis as any).process?.env || {}`.
- **Empty String Fix:** Distinguishes between undefined environment variables and configured empty strings (`""`).

### 3.14 Server-Only Engine (`./server`)

- **Strict Server Guard:** Throws immediately if executed in an environment with `window` or `document`.
- **Argon2id Password Hashing (`./server/password`):** Dynamic optional import of `argon2`. Preserves RFC 9106 security defaults while eliminating C++ binary compilation requirements from client applications.
- **Zero-Dependency Native Fetch Email Client (`./server/email` — `UTILS-M3-01` Remediation):** Replaces `zeptomail` SDK and its vulnerable transitive dependencies with a lightweight global `fetch` REST client for Zoho ZeptoMail API.

---

## 4. Packaging, Exports & Build Configuration

### 4.1 Target `package.json`

```json
{
  "name": "@nofinite/utils",
  "version": "3.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"
    },
    "./string": {
      "types": "./dist/string/index.d.ts",
      "import": "./dist/string/index.js",
      "require": "./dist/string/index.cjs",
      "default": "./dist/string/index.js"
    },
    "./object": {
      "types": "./dist/object/index.d.ts",
      "import": "./dist/object/index.js",
      "require": "./dist/object/index.cjs",
      "default": "./dist/object/index.js"
    },
    "./array": {
      "types": "./dist/array/index.d.ts",
      "import": "./dist/array/index.js",
      "require": "./dist/array/index.cjs",
      "default": "./dist/array/index.js"
    },
    "./math": {
      "types": "./dist/math/index.d.ts",
      "import": "./dist/math/index.js",
      "require": "./dist/math/index.cjs",
      "default": "./dist/math/index.js"
    },
    "./async": {
      "types": "./dist/async/index.d.ts",
      "import": "./dist/async/index.js",
      "require": "./dist/async/index.cjs",
      "default": "./dist/async/index.js"
    },
    "./validation": {
      "types": "./dist/validation/index.d.ts",
      "import": "./dist/validation/index.js",
      "require": "./dist/validation/index.cjs",
      "default": "./dist/validation/index.js"
    },
    "./date": {
      "types": "./dist/date/index.d.ts",
      "import": "./dist/date/index.js",
      "require": "./dist/date/index.cjs",
      "default": "./dist/date/index.js"
    },
    "./dom": {
      "types": "./dist/dom/index.d.ts",
      "import": "./dist/dom/index.js",
      "require": "./dist/dom/index.cjs",
      "default": "./dist/dom/index.js"
    },
    "./cn": {
      "types": "./dist/cn/index.d.ts",
      "import": "./dist/cn/index.js",
      "require": "./dist/cn/index.cjs",
      "default": "./dist/cn/index.js"
    },
    "./uuid": {
      "types": "./dist/uuid/index.d.ts",
      "import": "./dist/uuid/index.js",
      "require": "./dist/uuid/index.cjs",
      "default": "./dist/uuid/index.js"
    },
    "./jwt": {
      "types": "./dist/jwt/index.d.ts",
      "import": "./dist/jwt/index.js",
      "require": "./dist/jwt/index.cjs",
      "default": "./dist/jwt/index.js"
    },
    "./otp": {
      "types": "./dist/otp/index.d.ts",
      "import": "./dist/otp/index.js",
      "require": "./dist/otp/index.cjs",
      "default": "./dist/otp/index.js"
    },
    "./env": {
      "types": "./dist/env/index.d.ts",
      "import": "./dist/env/index.js",
      "require": "./dist/env/index.cjs",
      "default": "./dist/env/index.js"
    },
    "./server": {
      "types": "./dist/server/index.d.ts",
      "import": "./dist/server/index.js",
      "require": "./dist/server/index.cjs",
      "default": "./dist/server/index.js"
    },
    "./password": {
      "types": "./dist/server/password/index.d.ts",
      "import": "./dist/server/password/index.js",
      "require": "./dist/server/password/index.cjs",
      "default": "./dist/server/password/index.js"
    },
    "./email": {
      "types": "./dist/server/email/index.d.ts",
      "import": "./dist/server/email/index.js",
      "require": "./dist/server/email/index.cjs",
      "default": "./dist/server/email/index.js"
    },
    "./zeptomail": {
      "types": "./dist/server/email/index.d.ts",
      "import": "./dist/server/email/index.js",
      "require": "./dist/server/email/index.cjs",
      "default": "./dist/server/email/index.js"
    }
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "jose": "^6.2.12",
    "tailwind-merge": "^3.6.0"
  },
  "peerDependencies": {
    "argon2": "^0.45.1"
  },
  "peerDependenciesMeta": {
    "argon2": {
      "optional": true
    }
  }
}
```

---

## 5. Compatibility Decisions & Migration Invariants

1. **100% Backward Compatibility for Existing Consumers:**
   - Existing code importing from `@nofinite/utils` root:
     `import { generateUuid, generateOtp, verifyOtp, signToken, verifyToken } from '@nofinite/utils'`
     continues to function without code modifications, with the critical improvement that all 5 functions are now 100% browser-safe.
2. **Subpath Aliases Preserved:**
   - Legacy subpaths (`@nofinite/utils/password`, `@nofinite/utils/email`, `@nofinite/utils/zeptomail`) are retained in `exports` as backward-compatible bridges pointing to `./server/password` and `./server/email`.
3. **Build Pipeline Correction:**
   - In `vite.config.ts`, `dir: './packages/utils/dist'` is corrected to `dir: './dist'`, eliminating the duplicate nested folder artifact.
   - Stale `dist/package.json` is permanently removed.
4. **Performance & Bundle Budgets:**
   - Individual client subpaths must not exceed **$< 3.5\text{ KB}$ raw each**.
   - Tree-shaking verification: importing `slugify` from `@nofinite/utils/string` must bundle 0 lines of Jose or crypto logic.

This target architecture establishes `@nofinite/utils` as an indispensable, high-performance, universal utility toolkit across the entire Nofinite ecosystem.
