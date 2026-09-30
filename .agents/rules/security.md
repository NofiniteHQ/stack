# Security Rules

## 1. General

Security is a first-class requirement.

Prefer secure defaults.

Never weaken security merely to make implementation easier.

---

## 2. Secrets

Never hardcode or commit:

- Passwords
- API keys
- Access tokens
- Private keys
- Session secrets
- Database credentials

Never expose secrets in logs, errors, tests, screenshots, or generated files.

---

## 3. Authentication & Authorization

Do not bypass authentication or authorization checks.

Do not weaken permissions merely to make development or testing easier.

Verify authorization at the appropriate server-side boundary.

Never rely solely on client-side authorization.

---

## 4. User Data

Minimize sensitive data collection and exposure.

Do not log sensitive personal information unnecessarily.

Follow existing data-protection and retention requirements.

---

## 5. Dependencies

Consider known security risks when introducing dependencies.

Do not introduce packages with obvious security concerns when a maintained alternative exists.

---

## 6. Security-Sensitive Changes

Changes involving:

- Authentication
- Authorization
- Sessions
- Cryptography
- Payments
- Secrets
- Personal data
- Identity
- Access control
- Network security

require explicit security consideration in the implementation plan.

If the security implications are unclear, STOP and ask.
