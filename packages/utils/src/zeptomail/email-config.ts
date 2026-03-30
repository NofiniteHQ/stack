/**
 * Default ZeptoMail API endpoints.
 * These are official ZeptoMail URLs.
 */
const DEFAULT_ZEPTOMAIL_URL =
  'https://api.zeptomail.in/v1.1/email';

const DEFAULT_ZEPTOMAIL_BATCH_URL =
  'https://api.zeptomail.in/v1.1/email/batch';

/**
 * Resolves ZeptoMail client configuration from environment variables
 * with safe defaults.
 */
export function getZeptoMailConfig(batch = false): {
  url: string;
  token: string;
} {
  const url = batch
    ? process.env.ZEPTOMAIL_BATCH_URL ?? DEFAULT_ZEPTOMAIL_BATCH_URL
    : process.env.ZEPTOMAIL_URL ?? DEFAULT_ZEPTOMAIL_URL;

  const token = process.env.ZEPTOMAIL_TOKEN;

  if (!token) {
    throw new Error('ZEPTOMAIL_TOKEN is not defined');
  }

  return { url, token };
}

/**
 * Resolves sender details from env with fallback defaults.
 */
export function getFromDetails(options?: {
  fromEmail?: string;
  fromName?: string;
}) {
  return {
    address:
      options?.fromEmail ??
      process.env.ZEPTOMAIL_FROM_ADDRESS ??
      'noreply@example.com',

    name:
      options?.fromName ??
      process.env.ZEPTOMAIL_FROM_NAME ??
      'No Reply',
  };
}
