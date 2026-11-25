---
title: Releases
sidebar_position: 999
---

# @nofinite/utils — v2.1.0

**Latest release:** `2.1.0` (Apache-2.0)

---

## Overview

`@nofinite/utils` `v2.1.0` pairs Nofinite's server-side cryptographic/messaging helpers with a full tree-shakeable standard utility suite (`cn`, `dom`, `math`, `date`, `async`, `array`, `object`, `string`, `validation`) and a client-safe **`@nofinite/utils/browser`** entrypoint.

---

## Included in `v2.1.0`

- **Browser-Safe Entrypoint (`@nofinite/utils/browser` & `"browser"` export condition):** Safe for React, Vite, Next.js client components, and Edge bundles—automatically excludes native Node add-ons such as `argon2` and server-only email clients.
- **Server Bundle (`@nofinite/utils/server`):** Dedicated Node.js server barrel re-exporting Argon2id password helpers and email primitives.
- **General-Purpose Utility Subpaths:** `@nofinite/utils/cn`, `@nofinite/utils/dom`, `@nofinite/utils/math`, `@nofinite/utils/date`, `@nofinite/utils/async`, `@nofinite/utils/array`, `@nofinite/utils/object`, `@nofinite/utils/string`, and `@nofinite/utils/validation`.
- **Auth, Crypto, Env & Mail Subpaths:** `@nofinite/utils/password` (Argon2id), `@nofinite/utils/jwt` (`jose`), `@nofinite/utils/otp`, `@nofinite/utils/uuid`, `@nofinite/utils/env`, and `@nofinite/utils/email` (`@nofinite/utils/zeptomail`).

---

## Notes

- Node.js `>= 18`, dual ESM + CJS outputs, `sideEffects: false`, and strict TypeScript declarations for every subpath.
- Client applications importing `@nofinite/utils` resolve `"browser": "./dist/browser/index.js"` automatically in modern bundlers, or can import `@nofinite/utils/browser` explicitly.
