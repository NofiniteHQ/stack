# Authentication and Cryptography

**Nofinite Utils** provides production-hardened cryptographic primitives for authentication systems, session tokens, and one-time verification passcodes.

```ts
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  generateOTP,
  verifyOTP,
  isOtpExpired,
  hasExceededOtpAttempts,
} from '@nofinite/utils';
```

---

## 1. Password Hashing (Argon2id)

The password module uses **Argon2id**, the modern winner of the Password Hashing Competition. It provides superior resistance against GPU/ASIC brute-force cracking attacks compared to legacy bcrypt or PBKDF2:

```ts
import { hashPassword, verifyPassword } from '@nofinite/utils/password';

// 1. Hash password with auto-generated cryptographic salt
const hashedPassword = await hashPassword('user-plaintext-password', {
  memoryCost: 65536, // 64 MiB
  timeCost: 3, // 3 iterations
  parallelism: 4, // 4 threads
});

console.log(hashedPassword);
// $argon2id$v=19$m=65536,t=3,p=4$...

// 2. Constant-time verification
const isMatch = await verifyPassword(hashedPassword, 'user-plaintext-password');
console.log('Password match:', isMatch); // true
```

---

## 2. JSON Web Tokens (JWT with JOSE)

The JWT module implements strict, standards-compliant token signing and verification powered by the `jose` cryptographic suite:

```ts
import { signToken, verifyToken } from '@nofinite/utils/jwt';

// 1. Sign JWT with typed payload and claims
const token = await signToken(
  {
    sub: 'usr_849201',
    email: 'alex@nofinite.design',
    role: 'administrator',
  },
  {
    expiresIn: '24h',
    issuer: 'https://auth.nofinite.design',
    audience: 'https://api.nofinite.design',
  }
);

// 2. Verify token and decode claims
try {
  const payload = await verifyToken(token, {
    issuer: 'https://auth.nofinite.design',
    audience: 'https://api.nofinite.design',
  });
  console.log('Authenticated user:', payload.sub);
} catch (error) {
  console.error('Invalid or expired token:', error);
}
```

> [!NOTE] > `signToken` and `verifyToken` automatically read the signing secret from the `JWT_SECRET` environment variable unless an explicit secret key is provided.

---

## 3. Cryptographic One-Time Passwords (OTP)

Engineered for 2-Factor Authentication (2FA), email verification, and SMS passcodes:

```ts
import {
  generateOTP,
  verifyOTP,
  isOtpExpired,
  hasExceededOtpAttempts,
} from '@nofinite/utils/otp';

// 1. Generate secure 6-digit numeric OTP with 10-minute expiration
const { otp, expiresAt } = generateOTP(6, { ttlMinutes: 10 });
console.log(`Your verification code is: ${otp}`);

// 2. Check if OTP has expired
if (isOtpExpired(expiresAt)) {
  throw new Error('Verification code has expired. Please request a new one.');
}

// 3. Prevent brute-force spam by checking max failed attempts
const currentFailedAttempts = 3;
if (hasExceededOtpAttempts(currentFailedAttempts, 5)) {
  throw new Error('Too many failed attempts. Account temporarily locked.');
}

// 4. Verify user input using constant-time string comparison
const isValid = verifyOTP(otp, '123456');
if (isValid) {
  console.log('2FA verification successful');
}
```

---

## API Reference

### Password Functions

| Function         | Signature                                                              | Description                                      |
| :--------------- | :--------------------------------------------------------------------- | :----------------------------------------------- |
| `hashPassword`   | `(password: string, options?: PasswordHashOptions) => Promise<string>` | Hashes password string via Argon2id              |
| `verifyPassword` | `(hash: string, password: string) => Promise<boolean>`                 | Performs constant-time verification against hash |

---

### JWT Functions

| Function      | Signature                                                                   | Description                        |
| :------------ | :-------------------------------------------------------------------------- | :--------------------------------- |
| `signToken`   | `(payload: JwtPayload, options?: JwtSignOptions) => Promise<string>`        | Issues signed JWT with expiration  |
| `verifyToken` | `<T = JwtPayload>(token: string, options?: JwtVerifyOptions) => Promise<T>` | Validates signature and expiration |

---

### OTP Functions

| Function                 | Signature                                                                     | Description                                |
| :----------------------- | :---------------------------------------------------------------------------- | :----------------------------------------- |
| `generateOTP`            | `(length?: number, options?: OtpOptions) => { otp: string, expiresAt: Date }` | Generates secure numeric passcode          |
| `verifyOTP`              | `(storedOtp: string, inputOtp: string) => boolean`                            | Constant-time string matching              |
| `isOtpExpired`           | `(expiresAt: Date \| number) => boolean`                                      | Checks if current timestamp exceeds expiry |
| `hasExceededOtpAttempts` | `(attempts: number, maxAttempts?: number) => boolean`                         | Enforces rate-limiting guard               |
