# Nofinite Utils

> Secure, framework-agnostic utility primitives for Argon2id hashing, JOSE JWTs, and environment validation.

---

## Overview

**Nofinite Utils** is a secure, lightweight, and 100% framework-agnostic utility library designed for modern TypeScript, Node.js, and Edge runtimes.

It provides production-hardened helpers for critical backend infrastructure: Argon2id password hashing, jose-based JSON Web Token (JWT) lifecycle, high-entropy cryptographic OTPs, UUID v4 generation, strict environment variable parsing, and ZeptoMail transactional messaging.

---

## Architectural Invariants

- **Browser-Safe vs. Server Separation (`@nofinite/utils/browser` & `@nofinite/utils/server`):** Root imports automatically resolve `"browser": "./dist/browser/index.js"` in client bundlers (Vite, Next.js client builds, Webpack) so native `argon2` and server-only email clients never enter browser bundles. Import `@nofinite/utils/browser` explicitly in universal UI code, or `@nofinite/utils/server` (`password` & `email`) in Node.js backends.
- **Modular Subpath Exports:** Import only what you need via tree-shakeable subpaths:
  - **General Utilities:** `@nofinite/utils/cn`, `@nofinite/utils/dom`, `@nofinite/utils/math`, `@nofinite/utils/date`, `@nofinite/utils/async`, `@nofinite/utils/array`, `@nofinite/utils/object`, `@nofinite/utils/string`, `@nofinite/utils/validation`
  - **Auth, Crypto, Env & Mail:** `@nofinite/utils/password` (Argon2id), `@nofinite/utils/jwt` (`jose`), `@nofinite/utils/otp`, `@nofinite/utils/uuid`, `@nofinite/utils/env`, and `@nofinite/utils/email` (`@nofinite/utils/zeptomail`)

---

## Module Catalog

| Module                                      | Subpath Export                                                                 | Primary Functions                                                                                                                            |
| :------------------------------------------ | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **Browser Bundle**                          | `@nofinite/utils/browser`                                                      | Client-safe re-export (`cn`, `dom`, `math`, `date`, `async`, `array`, `object`, `string`, `validation`, `env`, `uuid`)                       |
| **Server Bundle**                           | `@nofinite/utils/server`                                                       | Node-only server barrel (`password`, `email`)                                                                                                |
| **Core Standard Utilities**                 | `@nofinite/utils/{cn,dom,math,date,async,array,object,string,validation}`      | `cn`, `isBrowser`, `trapFocus`, `clamp`, `addDays`, `debounce`, `retry`, `chunk`, `deepMerge`, `slugify`, `sanitizeUrl`, `isEmail`, `isUuid` |
| [**Auth & Crypto**](/utils/auth-and-crypto) | `@nofinite/utils/password`<br/>`@nofinite/utils/jwt`<br/>`@nofinite/utils/otp` | `hashPassword`, `verifyPassword`, `signToken`, `verifyToken`, `generateOTP`, `verifyOTP`                                                     |
| [**System & Mail**](/utils/system-and-mail) | `@nofinite/utils/env`<br/>`@nofinite/utils/uuid`<br/>`@nofinite/utils/email`   | `getEnv`, `requireEnv`, `getEnvBoolean`, `generateUUID`, `sendMail`, `sendBatchMail`                                                         |

---

## Next Steps

- Follow the [Installation Guide](/utils/installation) to install and configure the package.
- Explore [Authentication & Cryptography](/utils/auth-and-crypto) for detailed crypto signatures and security parameters.
- Explore [System & Email](/utils/system-and-mail) for environment schemas and ZeptoMail integration.
