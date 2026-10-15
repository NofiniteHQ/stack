# JWT

Lightweight JSON Web Token (JWT) helpers built on top of `jose` for secure token
generation and verification with sensible defaults.

These utilities are designed for server-side usage in Node.js, Next.js, and other
backend or edge environments.

---

## Usage

### Basic usage

```ts
import { getToken, verifyToken } from '@nofinite/utils/jwt';

const token = await getToken({ userId: '123' });

const payload = await verifyToken(token);
```

### With custom options

```ts
const token = await getToken(
  { userId: '123', role: 'admin' },
  {
    algorithm: 'HS512',
    expiresIn: '1h',
    issuer: 'nofinite',
    audience: 'web',
  }
);
```

---

## Configuration

JWT utilities rely on a shared secret.

### Environment variable

```
JWT_SECRET=super-secret-key
```

If `JWT_SECRET` is missing, token generation and verification will fail.

---

## API

### getToken

Create a signed JWT.

```ts
async function getToken<T extends object>(
  payload: T,
  options?: JwtSignOptions
): Promise<string>;
```

#### Options

| Option    | Type    | Default  | Description  |
| --------- | ------- | -------- | ------------ | --------------------- | ----------------- |
| algorithm | 'HS256' | 'HS384'  | 'HS512'      | HS256                 | Signing algorithm |
| expiresIn | string  | number   | '7d'         | Token expiration time |
| issuer    | string  | —        | Token issuer |
| audience  | string  | string[] | —            | Intended audience     |
| notBefore | string  | number   | —            | Delay token validity  |

---

### verifyToken

Verify and decode a JWT.

```ts
async function verifyToken<T = unknown>(
  token: string,
  options?: JwtVerifyOptions
): Promise<T | null>;
```

#### Behavior

- Returns the decoded payload if valid
- Returns `null` if verification fails

#### Options

| Option         | Type   | Description                  |
| -------------- | ------ | ---------------------------- | ----------------- |
| issuer         | string | Expected issuer              |
| audience       | string | string[]                     | Expected audience |
| clockTolerance | number | Allowed clock skew (seconds) |

---

## Behavior Notes

- Tokens are signed using symmetric HMAC algorithms
- Defaults are safe for most applications
- Verification failures are swallowed and return `null`
- Payload is not mutated during signing

---

## Security Notes

- Never expose `JWT_SECRET` to the client
- Rotate secrets periodically
- Use short expiration times for sensitive tokens
- Prefer HTTPS-only cookies when storing tokens

---

## Environment Compatibility

- Node.js
- Next.js (API routes, server actions)
- Edge runtimes that support Web Crypto

---

## Best Practices

### Do

- Use minimal payloads
- Set expiration times
- Validate issuer and audience in production
- Rotate secrets on compromise

### Don’t

- Store sensitive data inside JWT payloads
- Use long-lived tokens for authentication
- Share secrets across environments
- Disable expiration checks
