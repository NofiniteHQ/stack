# Nofinite Utils

> Secure, framework-agnostic utility primitives for Argon2id hashing, JOSE JWTs, and environment validation.

---

## Overview

**Nofinite Utils** is a secure, lightweight, and 100% framework-agnostic utility library designed for modern TypeScript, Node.js, and Edge runtimes.

It provides production-hardened helpers for critical backend infrastructure: Argon2id password hashing, jose-based JSON Web Token (JWT) lifecycle, high-entropy cryptographic OTPs, UUID v4 generation, strict environment variable parsing, and ZeptoMail transactional messaging.

---

## Architectural Invariants

- **100% Framework Agnostic:** Zero dependencies on React, Vue, or any frontend DOM layer. Runs seamlessly on Node.js (`>= 18`), Cloudflare Workers, Fastify, Express, Hono, NestJS, and Next.js Route Handlers.
- **Argon2id Password Security:** Leverages the state-of-the-art Argon2id cryptographic hashing algorithm (winner of the Password Hashing Competition) with automated salt generation.
- **JOSE Standards-Compliant JWTs:** Powered by the battle-tested `jose` library with HS256/RS256 algorithm support and strict clock skew verification.
- **Modular Subpath Exports:** Import only what you need via tree-shakeable subpaths: `@nofinite/utils/password`, `@nofinite/utils/jwt`, `@nofinite/utils/otp`, `@nofinite/utils/uuid`, `@nofinite/utils/env`, and `@nofinite/utils/email`.

---

## Core Capabilities

- **Password Hashing (`/password`)**: High-entropy Argon2id password hashing and constant-time verification.
- **JWT Authentication (`/jwt`)**: Type-safe token signing, verification, and claims decoding with configurable expiration.
- **One-Time Passwords (`/otp`)**: Cryptographic numeric passcodes with expiry checks and brute-force attempt limits.
- **Environment Handling (`/env`)**: Strictly typed environment variable getters with fallback and required validation.
- **Unique Identifiers (`/uuid`)**: UUID v4 generation, binary buffer conversion, and validation.
- **Transactional Messaging (`/email`)**: High-throughput transactional email delivery via ZeptoMail SMTP/API.

---

## Quick Example

```ts
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  generateOTP,
  requireEnv,
} from '@nofinite/utils';

// 1. Password Security with Argon2id
const passwordHash = await hashPassword('super-secret-user-password');
const isValid = await verifyPassword(
  passwordHash,
  'super-secret-user-password'
);
console.log('Password valid:', isValid); // true

// 2. JWT Signing & Verification
const token = await signToken(
  { sub: 'usr_9482', role: 'admin' },
  { expiresIn: '2h' }
);
const decoded = await verifyToken(token);
console.log('User ID:', decoded.sub);

// 3. Cryptographic OTP Generation
const { otp, expiresAt } = generateOTP(6, { ttlMinutes: 10 });
console.log(`Generated OTP: ${otp}, expires at: ${expiresAt}`);

// 4. Strict Environment Variable Validation
const databaseUrl = requireEnv('DATABASE_URL');
```

---

## Module Catalog

| Module                                      | Subpath Export                                                                 | Primary Functions                                                                        |
| :------------------------------------------ | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| [**Auth & Crypto**](/utils/auth-and-crypto) | `@nofinite/utils/password`<br/>`@nofinite/utils/jwt`<br/>`@nofinite/utils/otp` | `hashPassword`, `verifyPassword`, `signToken`, `verifyToken`, `generateOTP`, `verifyOTP` |
| [**System & Mail**](/utils/system-and-mail) | `@nofinite/utils/env`<br/>`@nofinite/utils/uuid`<br/>`@nofinite/utils/email`   | `getEnv`, `requireEnv`, `getEnvBoolean`, `generateUUID`, `sendMail`, `sendBatchMail`     |

---

## Next Steps

- Follow the [Installation Guide](/utils/installation) to install and configure the package.
- Explore [Authentication & Cryptography](/utils/auth-and-crypto) for detailed crypto signatures and security parameters.
- Explore [System & Email](/utils/system-and-mail) for environment schemas and ZeptoMail integration.
