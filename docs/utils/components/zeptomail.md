# ZeptoMail

Utility helpers for sending transactional and batch emails using **ZeptoMail**.
These helpers are designed to be simple by default, configurable when needed,
and safe for production usage.

They work in Node.js environments and are commonly used for OTPs, notifications,
and system emails.

---

## Usage

### Basic single email

```ts
import { sendMail } from '@nofinite/utils/email';

await sendMail({
  to: 'user@example.com',
  subject: 'Welcome to PrepBee',
  html: '<h1>Hello</h1><p>Thanks for joining us.</p>',
});
```

### Batch emails

```ts
import { sendBatchMail } from '@nofinite/utils/email';

await sendBatchMail({
  to: ['a@example.com', 'b@example.com'],
  subject: 'System Update',
  html: '<p>We have updated our terms.</p>',
});
```

---

## Configuration

The email utilities rely on environment variables.
All values have sensible defaults and can be overridden per call.

### Required

```
ZEPTOMAIL_TOKEN=your_zeptomail_token
```

### Optional (with defaults)

```
ZEPTOMAIL_URL=https://api.zeptomail.in/v1.1/email
ZEPTOMAIL_BATCH_URL=https://api.zeptomail.in/v1.1/email/batch
ZEPTOMAIL_FROM_EMAIL=noreply@example.com
ZEPTOMAIL_FROM_NAME=Your App Name
```

---

## API

### sendMail

Send a single transactional email.

```ts
sendMail(options: SendMailOptions): Promise<{ success: true } | null>
```

#### Options

| Option    | Type   | Default (env)        | Description               |
| --------- | ------ | -------------------- | ------------------------- |
| to        | string | —                    | Recipient email address   |
| subject   | string | —                    | Email subject             |
| html      | string | —                    | HTML body                 |
| fromEmail | string | ZEPTOMAIL_FROM_EMAIL | Sender email              |
| fromName  | string | ZEPTOMAIL_FROM_NAME  | Sender name               |
| replyTo   | string | —                    | Optional reply-to address |

---

### sendBatchMail

Send the same email to multiple recipients.

```ts
sendBatchMail(options: SendBatchMailOptions): Promise<{ success: true } | null>
```

#### Options

| Option    | Type     | Default (env) | Description              |
| --------- | -------- | ------------- | ------------------------ |
| to        | string[] | —             | List of recipient emails |
| subject   | string   | —             | Email subject            |
| html      | string   | —             | HTML body                |
| fromEmail | string   | Env default   | Sender email             |
| fromName  | string   | Env default   | Sender name              |

---

## Behavior Notes

- Returns `{ success: true }` on successful API call
- Returns `null` if sending fails
- Errors are caught internally to avoid crashing production flows
- Designed for transactional, not marketing, emails

---

## Accessibility & Deliverability

- Always include meaningful subject lines
- Prefer semantic HTML in email bodies
- Avoid large images without text alternatives
- Test emails across major clients (Gmail, Outlook, mobile)

---

## Best Practices

### Do

- Use environment variables for secrets
- Reuse templates for consistency
- Keep email content concise
- Log failures in production

### Don’t

- Hardcode API tokens
- Use this utility for bulk marketing campaigns
- Send unescaped user input directly into HTML

---

## When to use this

- OTP delivery
- Account verification emails
- Password reset links
- System notifications

For complex campaigns or analytics-heavy workflows, use a dedicated email
service layer on top of these utilities.
