# Password

Secure password hashing and verification utilities built on top of **Argon2id**,
the recommended modern password hashing algorithm.

These helpers are designed for **server-side environments only** and provide
strong defaults while remaining configurable for advanced use cases.

---

## Usage

### Basic usage

```ts
import { hashPassword, verifyPassword } from '@nofinite/utils/password';

const hash = await hashPassword('my-secret-password');

const isValid = await verifyPassword('my-secret-password', hash);
```

---

### Hashing a password

```ts
const hash = await hashPassword('super-secure-password');
```

- Returns a self-contained hash string
- Includes salt and parameters internally
- Safe to store directly in your database

---

### Verifying a password

```ts
const isValid = await verifyPassword('user-input-password', storedPasswordHash);
```

- Returns `true` if the password matches
- Returns `false` on mismatch or error
- Never throws during verification

---

## API

### hashPassword

Hash a plain-text password using Argon2id.

```ts
async function hashPassword(password: string): Promise<string>;
```

#### Behavior

- Uses Argon2id (hybrid variant)
- Automatically generates a random salt
- Encodes all parameters into the hash output

---

### verifyPassword

Verify a password against a stored hash.

```ts
async function verifyPassword(password: string, hash: string): Promise<boolean>;
```

#### Behavior

- Uses constant-time comparison internally
- Returns `false` if verification fails
- Safe to call with invalid or malformed hashes

---

## Default Security Parameters

The following defaults are chosen to balance security and performance:

| Parameter   | Value    | Description                               |
| ----------- | -------- | ----------------------------------------- |
| Algorithm   | Argon2id | Resistant to GPU and side-channel attacks |
| Memory Cost | 64 MB    | Defends against brute-force attacks       |
| Time Cost   | 3        | Number of hashing iterations              |
| Parallelism | 1        | Thread usage                              |

These values are suitable for most production servers.

---

## Environment Compatibility

- Node.js
- Next.js (API routes, server actions)
- Server-only runtimes

Not supported in browsers.

---

## Security Notes

- Passwords are never stored or returned in plain text
- Always hash passwords before persisting them
- Verification failures are intentionally silent
- Hash format is forward-compatible with future upgrades

---

## Performance Considerations

- Hashing is intentionally slow by design
- Avoid running password hashing in tight loops
- Consider background workers for bulk operations

---

## Best Practices

### Do

- Hash passwords immediately on receipt
- Use strong password policies upstream
- Store hashes exactly as returned
- Use HTTPS for password transmission

### Don’t

- Re-hash an already hashed password
- Log passwords or hashes
- Use fast hashing algorithms (e.g. SHA, MD5)
- Perform password hashing on the client
