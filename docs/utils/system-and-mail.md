# System, UUID & Transactional Mail

**Nofinite Utils** provides core server utilities for environment variable hygiene, high-entropy UUID generation, and transactional email distribution via ZeptoMail.

```ts
import {
  getEnv,
  requireEnv,
  getEnvNumber,
  getEnvBoolean,
  isEnv,
  generateUUID,
  uuidToBuffer,
  bufferToUUID,
  sendMail,
  sendBatchMail,
} from '@nofinite/utils';
```

---

## 1. Environment Variable Parsing (`/env`)

Prevents silent configuration failures by enforcing strict type conversions and throwing early during server startup if required variables are missing:

```ts
import {
  requireEnv,
  getEnv,
  getEnvNumber,
  getEnvBoolean,
  isEnv,
} from '@nofinite/utils/env';

// 1. Enforce existence of critical variables (throws if not set)
const databaseUrl = requireEnv('DATABASE_URL');
const apiKey = requireEnv('STRIPE_SECRET_KEY');

// 2. Safe string getter with fallback
const port = getEnv('PORT', '3000');

// 3. Strict numeric parsing with fallback
const maxConnections = getEnvNumber('DB_MAX_POOL', 20);

// 4. Boolean conversion ('true', '1', 'yes' -> true)
const enableTelemetry = getEnvBoolean('ENABLE_TELEMETRY', false);

// 5. Environment check
if (isEnv('production')) {
  console.log('Running in production mode');
}
```

---

## 2. UUID v4 Generation & Binary Buffers (`/uuid`)

Generates RFC 4122 compliant UUID v4 strings, with built-in binary buffer converters for high-performance 16-byte database storage (`BINARY(16)`):

```ts
import { generateUUID, uuidToBuffer, bufferToUUID } from '@nofinite/utils/uuid';

// 1. Generate fresh UUID v4
const id = generateUUID();
console.log('Generated ID:', id);
// "c73bcdcc-2669-4bf6-81d3-e4ae73fb11fd"

// 2. Convert to 16-byte Buffer for optimal database storage
const buffer = uuidToBuffer(id);
console.log('Buffer length:', buffer.length); // 16 bytes

// 3. Reconstruct canonical UUID string from Buffer
const restoredId = bufferToUUID(buffer);
console.log('Restored ID:', restoredId);
```

---

## 3. Transactional Email with ZeptoMail (`/email`)

High-throughput transactional email delivery powered by Zoho ZeptoMail API:

### Environment Configuration

```bash
ZEPTOMAIL_URL="api.zeptomail.com/"
ZEPTOMAIL_TOKEN="your-zeptomail-send-mail-token"
ZEPTOMAIL_FROM_EMAIL="noreply@yourdomain.com"
ZEPTOMAIL_FROM_NAME="Your Application"
```

### Sending a Single Email

```ts
import { sendMail } from '@nofinite/utils/email';

await sendMail({
  to: [
    {
      email_address: {
        address: 'sarah.chen@example.com',
        name: 'Sarah Chen',
      },
    },
  ],
  subject: 'Welcome to Nofinite Cloud',
  htmlbody: `
    <h1>Welcome, Sarah!</h1>
    <p>Your workspace has been successfully provisioned on us-east-1.</p>
  `,
});
```

### Sending Batch Emails

```ts
import { sendBatchMail } from '@nofinite/utils/email';

await sendBatchMail({
  to: [
    {
      email_address: { address: 'user1@example.com', name: 'User 1' },
      merge_info: { discount_code: 'SAVE20' },
    },
    {
      email_address: { address: 'user2@example.com', name: 'User 2' },
      merge_info: { discount_code: 'SAVE30' },
    },
  ],
  subject: 'Exclusive Subscriber Perks',
  htmlbody: '<p>Use your personalized code: {{discount_code}}</p>',
});
```

---

## API Reference

### Env Functions

| Function        | Signature                                          | Description                                      |
| :-------------- | :------------------------------------------------- | :----------------------------------------------- |
| `requireEnv`    | `(key: string) => string`                          | Returns env value or throws if missing           |
| `getEnv`        | `(key: string, defaultValue?: string) => string`   | Returns env value or fallback                    |
| `getEnvNumber`  | `(key: string, defaultValue?: number) => number`   | Parses integer/float from env                    |
| `getEnvBoolean` | `(key: string, defaultValue?: boolean) => boolean` | Parses boolean string (`'true'`, `'1'`, `'yes'`) |
| `isEnv`         | `(envName: string) => boolean`                     | Compares `NODE_ENV` to target string             |

---

### UUID Functions

| Function       | Signature                    | Description                               |
| :------------- | :--------------------------- | :---------------------------------------- |
| `generateUUID` | `() => string`               | Generates canonical RFC 4122 UUID v4      |
| `uuidToBuffer` | `(uuid: string) => Buffer`   | Converts 36-char string to 16-byte Buffer |
| `bufferToUUID` | `(buffer: Buffer) => string` | Converts 16-byte Buffer to UUID string    |

---

### Email Functions

| Function        | Signature                                         | Description                                    |
| :-------------- | :------------------------------------------------ | :--------------------------------------------- |
| `sendMail`      | `(options: SendMailOptions) => Promise<any>`      | Dispatches single transactional email          |
| `sendBatchMail` | `(options: SendBatchMailOptions) => Promise<any>` | Dispatches bulk template email with merge tags |
