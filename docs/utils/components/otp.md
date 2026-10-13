# OTP (One-Time Password)

Secure helpers for generating and verifying one-time passwords (OTPs) using
cryptographically safe defaults.

These utilities are designed for authentication flows such as email verification,
password resets, and multi-factor authentication.

---

## Usage

### Basic usage

```ts
import { generateOtp, verifyOtp } from '@nofinite/utils/otp';

const { otp, otpHash } = generateOtp();

// send `otp` to user (email / SMS)
// store only `otpHash`
```

### Verify OTP

```ts
import { verifyOtp } from '@nofinite/utils/otp';

const isValid = verifyOtp(userInputOtp, storedOtpHash);

if (isValid) {
  // OTP verified successfully
}
```

---

## Hash Algorithms

OTP hashing supports multiple algorithms.

### Default (recommended)

```ts
const { otp, otpHash } = generateOtp();
```

- Default algorithm: `sha256`
- Secure and widely supported
- No configuration required

### Custom hash algorithm

```ts
const { otp, otpHash } = generateOtp({
  hashAlgorithm: 'sha512',
});
```

> Supported algorithms depend on `Node.js crypto.createHash`.

### Verification with algorithm option

```ts
verifyOtp(userInputOtp, storedOtpHash, {
  hashAlgorithm: 'sha512',
});
```

⚠️ If the hash algorithm does not match the stored hash,
verification safely returns `false`.

---

## API

### generateOtp

```ts
function generateOtp(options?: { hashAlgorithm?: string }): {
  otp: string;
  otpHash: string;
};
```

| Option        | Type   | Default | Description                      |
| ------------- | ------ | ------- | -------------------------------- |
| hashAlgorithm | string | sha256  | Hash algorithm used for OTP hash |

---

### verifyOtp

```ts
function verifyOtp(
  inputOtp: string,
  storedHash: string,
  options?: {
    hashAlgorithm?: string;
  }
): boolean;
```

| Parameter     | Type   | Description                           |
| ------------- | ------ | ------------------------------------- |
| inputOtp      | string | OTP entered by the user               |
| storedHash    | string | Previously stored OTP hash            |
| hashAlgorithm | string | Hash algorithm used during generation |

---

## Behavior Notes

- OTPs are **6-digit numeric strings**
- Uses **cryptographically secure** random generation
- Plain OTPs should **never** be stored
- Hash comparison uses **constant-time comparison**
- Mismatched hash lengths return `false` (no runtime errors)

---

## Security Notes

- Always store **only the hash**, never the OTP
- OTPs should be **short-lived** (enforced by your app logic)
- Prefer `sha256` unless you have specific requirements
- Rate-limit OTP verification attempts at the application level

---

## Best Practices

### Do

- Expire OTPs after a short duration
- Limit verification attempts
- Use OTPs for single-purpose flows
- Combine with user-specific context (email, userId)

### Don’t

- Reuse OTPs
- Log OTP values
- Store OTPs in plaintext
- Use OTPs as long-term credentials
