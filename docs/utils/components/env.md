# Environment Helpers

Small utilities to safely detect runtime environment and feature flags.  
Useful across backend, frontend, and shared packages.

---

## Usage

```ts
import { isProd, isDev, isTest } from '@nofinite/utils/env';

if (isProd) {
  enableAnalytics();
}
```

---

## Available Helpers

### isProd

**Type:** `boolean`

Returns `true` when:

- `NODE_ENV=production`

---

### isDev

**Type:** `boolean`

Returns `true` when:

- `NODE_ENV=development`

---

### isTest

**Type:** `boolean`

Returns `true` when:

- `NODE_ENV=test`

---

### getEnv

Safely read environment variables with defaults.

```ts
import { getEnv } from '@nofinite/utils/env';

const apiUrl = getEnv('API_URL', 'http://localhost:3000');
```

**Signature**

```ts
getEnv(key: string, defaultValue?: string): string
```

---

## Server Safety

- Works in Node.js and edge runtimes
- Never throws if an environment variable is missing
- Safe to use during build-time and runtime

---

## Best Practices

### Do

- Use helpers instead of raw `process.env`
- Provide defaults where possible
- Gate expensive logic using `isProd`

### Don’t

- Assume environment variables always exist
- Use in browser-only code unless bundled correctly
