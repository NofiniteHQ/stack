# Nofinite Utils

> Shared isomorphic utilities, client-safe browser exports, and hardened backend crypto/messaging helpers (`v2.1.0`).

---

## Overview

**Nofinite Utils** (`@nofinite/utils`) provides tree-shakeable TypeScript helpers for both frontend/React applications and Node.js backend services:

- **Client-Safe Browser Bundle (`@nofinite/utils/browser`):** Automatically selected by `"browser"` export condition in Vite and Next.js client builds, omitting native `argon2` and server-only email drivers.
- **Server & Security Helpers (`@nofinite/utils/server`):** Argon2id password hashing, JOSE JWT signing/verification, OTPs, UUID generation, env validation, and ZeptoMail transactional delivery.
- **Standard Library Subpaths:** `@nofinite/utils/cn`, `@nofinite/utils/dom`, `@nofinite/utils/math`, `@nofinite/utils/date`, `@nofinite/utils/async`, `@nofinite/utils/array`, `@nofinite/utils/object`, `@nofinite/utils/string`, and `@nofinite/utils/validation`.

---

## Quickstart

```ts
import { cn, isBrowser, clamp, debounce } from '@nofinite/utils/browser';
```

---

## Core Utilities Catalog

- **`/cn`**: `cn(...inputs)` — conditional class merging.
- **`/dom`**: `isBrowser()`, `copyToClipboard(text)`, `scrollIntoView(...)`, `trapFocus(...)`.
- **`/math`**: `clamp`, `round`, `lerp`, `inRange`, `randomInt`, `randomFloat`.
- **`/date`**: `toDate`, `addDays`, `subDays`, `startOfDay`, `diffInDays`, `formatDateIso`.
- **`/async`**: `sleep`, `debounce`, `throttle`, `retry`, `timeout`, `concurrencyLimit`.
- **`/array` & `/object`**: `chunk`, `unique`, `groupBy`, `keyBy`, `deepClone`, `deepMerge`, `pick`, `omit`.
- **`/string` & `/validation`**: `slugify`, `escapeHtml`, `sanitizeUrl`, `isEmail`, `isUrl`, `isUuid`.
- **`/password`, `/jwt`, `/otp`, `/uuid`, `/env`, `/email`**: Server authentication, identifiers, env, and mail helpers.
