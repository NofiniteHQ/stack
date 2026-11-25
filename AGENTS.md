# NOFINITE PRIVATE LIMITED — UNIFIED ENGINEERING & SECURITY STANDARD (`AGENTS.md`)

This document is the authoritative engineering, architecture, security, and compliance contract for AI agents and engineers working across `NofiniteHQ` repositories.

## 1. Execution Workflow & Git Governance (GOV-GIT-1.0)

1. **Mandatory 9-Stage Workflow:**
   `UNDERSTAND → PLAN → STOP → APPROVAL → IMPLEMENT → VERIFY → DOCUMENT & VERSION → REVIEW → COMMIT`
   - Never start multi-file implementation without an approved plan.
   - Store all scratch notes and implementation plans strictly inside gitignored `temp/<project>_implementation_plan.md`. Never create root-level `implementation_plan.md` files.
2. **Repository Boundaries:**
   - Workspace parent directories (such as umbrella folders containing multiple services) are NOT Git repositories. Always verify `git rev-parse --show-toplevel` before running Git commands.
   - Default integration branch is `dev`; feature branches use `feat/`, `fix/`, `chore/`, or `sec/` prefixes with Conventional Commits (`commitlint`).
   - Only the primary orchestrator or human engineer performs mutating Git commits (Sole Git Committer Rule).
3. **Two-Tier Release Protocol (Public Packages):**
   - Local commits are safety savepoints, never npm releases.
   - Unpublished launch packages (`404` on npm) MUST NOT receive Changeset version bumps; their `package.json` version is the ground-truth launch version.
   - Every public npm package requires `publishConfig: { "access": "public", "provenance": true }`, an explicit `files` whitelist, clean `pnpm pack` verification (zero `workspace:*`, zero test files, zero `.map` bloat), and `types`-first conditional `exports`.
4. **Documentation Layout & Flat Review Output Invariant:**
   - Maintain sibling `docs/` (public developer docs) and `ai-docs/` (internal architecture/decisions/reviews), plus gitignored `temp/`.
   - When generating architect review packets, ALWAYS clear/remove all previous files from the designated local review output directory first so the folder stays 100% fresh with only the current gate's outputs. Write all outputs flat directly inside the designated local review output directory (no nested subfolders, no `.zip` archives) as `.md` files plus a verified `.sha256` manifest.

## 2. Public vs. Private Isolation & Brand Taxonomy

1. **Strict Repository Privacy Lock:**
   - Strictly private repositories MUST enforce `"private": true` and `"license": "UNLICENSED"` in every `package.json`, with zero `publishConfig` and zero publish/pack release jobs in CI.
   - Public repositories MUST NEVER reference private internal repository names, internal control-plane names, private endpoints, or OS-specific absolute drive or user home paths in source code, `.d.ts` comments, `AGENTS.md`, `docs/`, or scripts.
2. **Official Brand Taxonomy:**
   - In prose and documentation, always use **NUICSS**, **NUI**, **Nofinite Charts**, **Nofinite Kanban**, **Nofinite Markon**, **Nofinite Media**, **Nofinite Locale**, and **Nofinite Utils**.
   - Reserve `@nofinite/*` strictly for code imports, `package.json`, and CLI commands.
3. **Zero Downstream CSS Invariant:**
   - `@nofinite/nuicss` (OKLCH semantic tokens, superclasses, ARIA state selectors) is the sole styling engine across the entire ecosystem.
   - Downstream packages and Go Templ/HTML services MUST NEVER author independent CSS bundles or load external Tailwind CSS / Alpine.js CDNs. Fix styling gaps upstream in `NUICSS` rather than monkey-patching downstream.

## 3. Unified Toolchains & Code Architecture (No Arbitrary File-Length Cap)

_Write clean, cohesive modules organized by domain responsibility — do NOT enforce an arbitrary 250-line file limit._

- **TypeScript / JavaScript:** Node.js `22 LTS` (`engines.node: ">=22"` for apps; aligned library engines), `pnpm@10.24.0` via Corepack, TypeScript `5.9.x` (`strict: true`, `isolatedModules: true`, `noUnusedLocals: true`, `noFallthroughCasesInSwitch: true`). Standardize apps on React `19` with matching `@types/react`; public libraries keep `peerDependencies` compatible with `react >=18.0.0`. Never alias `"lint"` to `tsc --noEmit` alone.
- **Go Backend Services:** Go `1.26.3`, standard layout (`cmd/<service>/main.go`, `internal/{app,config,middleware,...}`, `migrations/`, `proto/`), strict `Repository → Service → Handler` DI, `r.Context()` propagation everywhere, idempotent `DELETE` (`204 No Content`), ConnectRPC/Protobuf for internal service calls (zero hardcoded `localhost:50051` addresses), versioned REST/JSON (`/api/v1/...`) externally, and unified `.golangci.yml` (`govet`, `errcheck`, `staticcheck`, `ineffassign`, `unused`, `gosec`, `bodyclose`, `gocritic`, `revive`) + `govulncheck` + `go test -race ./...` in CI.

## 4. Four-Plane Architectural Invariants

1. **Plane 1 — Foundation (`Auth`, `Account`, `Cloud`, `Checkout`, `Notify`, `Stack`):** `Nofinite Auth` is the single identity authority (OAuth 2.1 + mandatory PKCE `S256`; Implicit/ROPC grants permanently disabled; JWT includes home region claim `reg`). Identity (`Auth`) is strictly separate from product entitlements/licensing (`Cloud`/product billing). External developers register OAuth apps via `Nofinite Cloud`; first-party Nofinite products provision idempotently via restricted machine-authenticated `Auth` management APIs.
2. **Plane 2 — Nofinite Core (Multi-Tenant Business OS):** Dogfood real Core modules internally as an isolated tenant ("dogfood the products, not the privileges"). Every tenant-scoped table MUST enforce PostgreSQL Row-Level Security (`ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY`) tested via Testcontainers. `Markon` remains the underlying content engine (never rebuilt inside Core). PDF invoices/certificates render via `Gotenberg 9` directly to `Cloudflare R2` presigned URLs (`$0` egress); public credential verification uses opaque, non-enumerable cryptographic tokens with rate limiting.
3. **Plane 3 — Nofinite Applications (`Nofinite Learn / Xternships`, `nofinite.com`, verticals):** Each product owns its isolated business database and consumes Foundation APIs (`@nofinite/nid`, `Checkout`, `Notify`). Nofinite Learn issues training completion credentials; actual internship hosts issue internship offer letters and experience certificates.
4. **Plane 4 — Private Internal Control Plane:** Deployed privately behind Zero Trust / WireGuard; normal admin login uses `Nofinite Auth` SSO + MFA; break-glass emergency access MUST use hardware-backed FIDO2/WebAuthn stored and verified independently of `Nofinite Auth`, `Auth`'s database, and ordinary secrets vaults, with mandatory alerts and append-only audit logging.

## 5. Non-Negotiable Security & Statutory Compliance Guardrails

1. **Zero Secrets in Code or Fallbacks:** Never commit `.env`, `.pem`, `.key`, private keys, or credentials to Git. Never ship hardcoded fallback strings for encryption keys, HMAC keys, CSRF keys, OAuth secrets, `state`, or PKCE verifiers. Missing required secrets MUST fail fast at startup. Session cookies MUST be cryptographically signed/authenticated or server-side Valkey backed (`HttpOnly`, `Secure`, `SameSite=Lax`).
2. **India DPDP Act (Enforceable May 13, 2027):** Maintain an unbundled, purpose-specific consent ledger; enforce an explicit 18+ age-gate at registration/enrolment; support Data Principal Rights (Access, Correction, Erasure, Grievance Redressal); strip/mask PII from telemetry and staging clones.
3. **CERT-In Directions (Active Now):** NIC/NPL NTP time sync on production nodes; tamper-evident HMAC-chained/WORM security and operator audit logs retained for at least 1 year inside India (`ap-south-1`); dual breach clock (6-hour CERT-In + 72-hour DPDP).
4. **PCI-DSS v4.0.1 SAQ A (Checkout & Billing):** Raw card data never touches Nofinite DOM or Go servers (cross-origin hosted iframes only); strict CSP headers and zero third-party analytics scripts on checkout; cryptographic webhook verification + Valkey event-ID idempotency lock + atomic PostgreSQL transactional outbox (River worker) + compensating refund/reconciliation logic.

---

## Repository-Specific Rules

### 1. Nx Monorepo & Package Publishing Architecture

- **Published Workspace Packages (`packages/*`):**
  - **NUICSS** (`@nofinite/nuicss`) and standalone CLI (`nuicss` in `packages/nuicss-cli`, sole owner of `"bin": { "nuicss": "./bin/nuicss.js" }`)
  - **NUI** (`@nofinite/nui`)
  - **Nofinite Charts** (`@nofinite/charts`)
  - **Nofinite Kanban** (`@nofinite/kanban`)
  - **Nofinite Markon** (`@nofinite/markon`)
  - **Nofinite Media** (`@nofinite/media`)
  - **Nofinite Locale** (`@nofinite/locale`)
  - **Nofinite Utils** (`@nofinite/utils`)
- **Nx TypeScript Sync & Module Boundaries:** Keep `pnpm nx sync --check` green cleanly via TypeScript project references and maintain explicit `"tags"` in `packages/*/project.json` matching `eslint.config.mjs` (`@nx/enforce-module-boundaries` constraints — never weaken lint boundary rules).
- **Changesets & Two-Tier Release Hygiene:** Do not run Changesets version bumps on unpublished `404` launch packages. Verify every packed tarball for zero `workspace:*` specifiers, zero `.test.*` files, zero `.map` bloat, matching `publishConfig`, `homepage`, `bugs`, and `engines`.
- **Single-Side-Effect-Free Build:** Running `pnpm build` / `nx run nuicss:build` MUST leave tracked source files (such as `packages/nuicss/src/styles/components/flags.css`) clean in `git status`.

### 2. NUICSS Styling Discipline, Compound Contracts & Accessibility

- **Zero Downstream CSS Invariant:** **NUICSS** (`packages/nuicss`) owns all OKLCH tokens, superclasses, geometry, drag-and-drop indicators, and ARIA state selectors. Downstream packages (`NUI`, `Nofinite Kanban`, `Nofinite Markon`, `Nofinite Charts`, `Nofinite Media`, `Nofinite Locale`, `Nofinite Utils`) contain headless or React/TypeScript logic consuming semantic superclasses (`btn`, `card`, `input`, `badge`, `kanban-board`, `markon-editor`, `chart-container`). Any downstream stylesheet is at most a backward-compatibility CSS bridge importing `@nofinite/nuicss`.
- **Binary Confirmation & Overlay Contracts:** Binary/destructive confirmation dialogs enforce `hideCloseButton={true}` (no ambiguous corner close button paired with explicit Cancel/Confirm buttons); overlays combine `bg-overlay` with `backdrop-blur-sm`.
- **Storybook & Visual Verification ("Green Test" Fallacy):** Every interactive **NUI** or domain component change requires accessibility testing (WCAG AA keyboard/ARIA/contrast, `vitest-axe`) and browser/Storybook visual verification (artifacts stored in gitignored `temp/`).
- **Package-Level Guidance:** Also follow styling architecture conventions in `packages/nuicss/AGENTS.md`.

### 3. Documentation Sync & Workspace Hygiene

- **Central Docs Ground Truth (`docs/`):** Canonical public Markdown docs live in `docs/<pkg>/` (`docs/nuicss/`, `docs/nui/`, `docs/charts/`, `docs/kanban/`, `docs/markon/`, `docs/media/`, `docs/locale/`, `docs/utils/`) for consumption by the public `oss-docs` portal. Keep `packages/<pkg>/README.md` lean (installation, quickstart, link to full docs).
- **Sibling Layout & Project Plans:** Maintain sibling `docs/` (public), `ai-docs/` (internal architecture, benchmarks, decisions), and gitignored `temp/`. Put task plans in `temp/<project>_implementation_plan.md` (e.g., `temp/markon_implementation_plan.md`, `temp/nuicss_implementation_plan.md`). Never leave scratch files or unrelated repos inside the monorepo root.
- **Scoped Rule Extensions:** Consult `.agents/rules/` and `.agents/workflows/` when present (subordinate to Layer 1 invariants), preserve any pre-existing unrelated user changes, and compare alternatives before adding dependencies.
