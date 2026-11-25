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

## 3. Subpath Import Options (`v2.1.0`)

`@nofinite/utils` is fully tree-shakeable (`sideEffects: false`) and ships both browser-safe and server subpaths:

```ts
// Browser / React Client Safe (excludes native argon2)
import { cn, isBrowser, debounce, slugify } from '@nofinite/utils/browser';

// Granular Core Utility Subpaths
import { cn } from '@nofinite/utils/cn';
import { isBrowser, copyToClipboard, trapFocus } from '@nofinite/utils/dom';
import { clamp, round } from '@nofinite/utils/math';
import { addDays, diffInDays, formatDateIso } from '@nofinite/utils/date';
import { debounce, throttle, retry } from '@nofinite/utils/async';
import { chunk, unique, groupBy } from '@nofinite/utils/array';
import { deepMerge, pick, omit } from '@nofinite/utils/object';
import { slugify, escapeHtml, sanitizeUrl } from '@nofinite/utils/string';
import { isEmail, isUrl, isUuid } from '@nofinite/utils/validation';

// Server / Node.js Subpaths
import { hashPassword, verifyPassword, sendMail } from '@nofinite/utils/server';
import { hashPassword, verifyPassword } from '@nofinite/utils/password';
import { signToken, verifyToken } from '@nofinite/utils/jwt';
import { generateOTP, verifyOTP } from '@nofinite/utils/otp';
import { generateUUID } from '@nofinite/utils/uuid';
import { requireEnv, getEnvBoolean } from '@nofinite/utils/env';
import { sendMail } from '@nofinite/utils/email'; // alias: @nofinite/utils/zeptomail
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
