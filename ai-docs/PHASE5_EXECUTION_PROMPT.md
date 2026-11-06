# Phase 5: Shared Foundations — Ready-to-Execute Implementation Prompt

**Programme:** Nofinite Engineering Quality Programme  
**Target Repository:** `D:\stack`  
**Packages:** `@nofinite/locale` (v3.0.0), `@nofinite/utils` (v3.0.0)  
**Execution Authority:** Project Owner Implementation Mandate  
**Governing Standard:** NEAS 1.0 (Nofinite Engineering Assurance Standard) / EOR 1.0  
**Context Reference:** [PHASE5_IMPLEMENTATION_ROADMAP.md](PHASE5_IMPLEMENTATION_ROADMAP.md) / [PHASE5_LOCALE_ARCHITECTURE.md](PHASE5_LOCALE_ARCHITECTURE.md) / [PHASE5_UTILS_ARCHITECTURE.md](PHASE5_UTILS_ARCHITECTURE.md)

---

```markdown
/goal # PHASE 5 — FULL AUTHORIZED IMPLEMENTATION & QUALITY CERTIFICATION

## 1. Mission & Authority

Execute the full Phase 5 implementation across `@nofinite/locale` and `@nofinite/utils` in `D:\stack` strictly according to the approved architecture specifications and roadmap:

- `D:\stack\ai-docs\PHASE5_SCOPE_AND_DISCOVERY_REPORT.md`
- `D:\stack\ai-docs\PHASE5_LOCALE_ARCHITECTURE.md`
- `D:\stack\ai-docs\PHASE5_UTILS_ARCHITECTURE.md`
- `D:\stack\ai-docs\PHASE5_SECURITY_AND_DEPENDENCY_AUDIT.md`
- `D:\stack\ai-docs\PHASE5_ECOSYSTEM_COMPATIBILITY.md`
- `D:\stack\ai-docs\PHASE5_QUALITY_AND_ACCEPTANCE_CRITERIA.md`
- `D:\stack\ai-docs\PHASE5_IMPLEMENTATION_ROADMAP.md`

The Main Agent is authorized to implement all approved Phase 5 milestones (M1 through M5).

---

## 2. Mandatory Scope of Work

### Milestone 1: Security Remediation & Asset Purge

1. **Remediate `UTILS-M3-01`:** Replace Zoho's `zeptomail` SDK with the zero-dependency native `fetch` REST client in `packages/utils/src/server/email/native-client.ts`. Remove `"zeptomail"` from `package.json#dependencies` and remove monorepo pnpm overrides.
2. **Remediate Secondary Security Findings:**
   - `UTILS-SEC-01`: Update OTP module to incorporate random 16-byte salt or HMAC pepper.
   - `UTILS-SEC-02`: Enforce 128-char max password length in Argon2; add dummy verification for non-existent users.
   - `UTILS-SEC-03`: Enforce RFC 7518 minimum 32-byte secret length in `getJwtSecret`; pin verification algorithms.
3. **Purge Dormant CSS Assets (`@nofinite/locale`):**
   - Delete all 542 uncompiled SVG flag files (`packages/locale/src/flags/`) and 4 SCSS files (`packages/locale/src/styles/`).
   - Retain `locale-style-shim` in `vite.config.ts` writing `@import '@nofinite/nuicss/styles.css';` for backward compatibility.
4. **Data Normalization (`packages/locale/src/data/countries.ts`):** Fix Cayman Islands dial code (`+345`), Heard Island (`+672`), and normalize Åland Islands character encoding; add `iso3` and `currency`.
5. **Build Pipeline Fixes:** Add CommonJS `"require"` mappings to `packages/utils/package.json#exports`; fix nested output path in `vite.config.ts`; delete stale `dist/package.json`.

### Milestone 2: `@nofinite/utils` Modular Expansion (v3.0.0)

1. Implement universal, browser-safe utility subpaths:
   - `./string`: `escapeHtml`, `unescapeHtml`, `sanitizeUrl`, `slugify`, `truncate`, `case`, `template`.
   - `./object`: `deepClone`, `deepMerge` (prototype pollution hardened), `pick`, `omit`, `isEqual`.
   - `./array`: `chunk`, `groupBy`, `unique`, `shuffle`, `partition`, `range`.
   - `./math`: `clamp`, `round`, `formatBytes`, `percentage`, `randomRange`.
   - `./async`: `debounce`, `throttle`, `sleep`, `retry`, `timeout`, `pLimit`, `Deferred`.
   - `./validation`: `isEmail`, `isUrl`, `isNumeric`, `isPlainObject`, `isEmpty`, `isNil`.
   - `./date`: `date-math`, `month-grid`, `format-duration`.
   - `./dom`: `isBrowser`, `copyToClipboard`, `media-query`, `safeStorage`.
   - `./cn`: Canonical `cn` (`clsx` + `tailwind-merge`).
2. Universalize `./uuid` (zero-dependency RFC 9562 UUIDv7 and native `crypto.randomUUID()` UUIDv4; remove `uuid` package).
3. Isolate `argon2` behind dynamic optional import in `./server/password/`.
4. Ensure root `@nofinite/utils` exports strictly isomorphic utilities.

### Milestone 3: `@nofinite/locale` Enterprise Localization Engine (v3.0.0)

1. Decouple country dataset to `@nofinite/locale/countries` with O(1) indexed Map lookup; retain backward-compatible root re-exports.
2. Implement BCP 47 parser and RFC 4647 language negotiation (`parseLocale`, `matchLocale`, optimized `getDirection`).
3. Implement `formatRelative(date, baseDate)`, `formatDateRange()`, and `formatList()`.
4. Implement zero-dependency translation dictionary catalog, micro-template interpolation, and ICU message plural rules (`Intl.PluralRules`).
5. Expand React bindings (`<LocaleProvider>`, `useLocale()`, `useTranslation()`, dynamic `setLocale()`, DOM `lang`/`dir` sync).
6. Implement server/edge `parseAcceptLanguage()` header parser.

### Milestone 4: Downstream Monorepo Integration & Deduplication

1. Update NUI to consume `@nofinite/utils/cn` and `@nofinite/utils/math` (`clamp`).
2. Update Charts to consume `@nofinite/locale` formatters and `@nofinite/utils` (`debounce`, `escapeHtml`).
3. Update Kanban to consume `@nofinite/utils/uuid` (`generateUuidV7`) and `@nofinite/locale` (`formatRelative`).
4. Update Markon to consume `@nofinite/utils/string` (`escapeHtml`, `sanitizeUrl`, `slugify`) and `debounce`.
5. Update NUIX to replace `@formkit/tempo` with `@nofinite/utils/date` and align `escapeHtml`.
6. Harmonize `oss-docs` and `nofinite.com` with `@nofinite/utils` `cn()`.

### Milestone 5: Quality Certification & Rolling Archive Rebuild

1. Verify all 14 Certification Gates (`GATE-P5-01` through `GATE-P5-14`).
2. Ensure $\ge 180$ passed tests in Locale and $\ge 140$ passed tests in Utils ($\ge 95.0\%$ coverage).
3. Rebuild and checksum-verify the canonical rolling review archive `report.zip` at `D:\ui-quality-lab\ai-docs\report.zip` per EOR 1.0 Section 8.

---

## 3. Strict Operating Invariants

1. **Sole Git Committer Rule:** Main Agent is the sole Git committer across repositories. Subagents must never stage or commit code.
2. **Compulsory Local Commits:** Make local git commits after every milestone checkpoint. Do not push to remote.
3. **No Breaking Changes:** Existing consumer imports in `ConsumerApp.tsx` and legacy subpaths must remain 100% operational.
4. **Preserve Phase 3 and Phase 4 Records:** Do not mutate or overwrite frozen Phase 3 or Phase 4 quality certifications or findings registers.
```
