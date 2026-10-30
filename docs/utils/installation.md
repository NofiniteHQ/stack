# Installation & Setup

Add `@nofinite/utils` to your backend service, API handler, or serverless worker.

---

## 1. Package Installation

Install `@nofinite/utils` using your package manager:

```bash
# pnpm
pnpm add @nofinite/utils

# npm
npm install @nofinite/utils

# yarn
yarn add @nofinite/utils

# bun
bun add @nofinite/utils
```

---

## 2. Environment Variables Setup

Configure the following environment variables in your `.env` or secrets manager:

```bash
# Required for @nofinite/utils/jwt
JWT_SECRET="your-ultra-secure-random-secret-key-at-least-32-chars-long"

# Required for @nofinite/utils/email (ZeptoMail Transactional Email)
ZEPTOMAIL_URL="api.zeptomail.com/"
ZEPTOMAIL_TOKEN="your-zeptomail-send-mail-token"
ZEPTOMAIL_FROM_EMAIL="noreply@yourdomain.com"
ZEPTOMAIL_FROM_NAME="Your Application"
```

---

## 3. Subpath Import Options

`@nofinite/utils` is fully tree-shakeable. You can import from the root or target specific subpaths to minimize bundle size:

```ts
// Option A: Root Import
import { hashPassword, signToken, generateOTP } from '@nofinite/utils';

// Option B: Subpath Imports (Optimized for Serverless / Edge isolates)
import { hashPassword, verifyPassword } from '@nofinite/utils/password';
import { signToken, verifyToken } from '@nofinite/utils/jwt';
import { generateOTP, verifyOTP } from '@nofinite/utils/otp';
import { generateUUID } from '@nofinite/utils/uuid';
import { requireEnv, getEnvBoolean } from '@nofinite/utils/env';
import { sendMail } from '@nofinite/utils/email';
```

---

## 4. Verification

Test the package in any TypeScript script or route handler:

```ts
import { hashPassword, verifyPassword } from '@nofinite/utils';

async function main() {
  const hash = await hashPassword('test-password');
  const valid = await verifyPassword(hash, 'test-password');
  console.log('Password verification passed:', valid);
}

main();
```

---

## Next Steps

- Explore [Authentication & Cryptography](/utils/auth-and-crypto) for Argon2id hashing, JWT signing, and OTP logic.
- Explore [System & Mail](/utils/system-and-mail) for environment parsing and ZeptoMail integration.
