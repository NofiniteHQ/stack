import { SendMailClient } from 'zeptomail';
import { SendMailOptions } from './email.types';
import { getFromDetails, getZeptoMailConfig } from './email-config';

/**
 * Sends a single email using ZeptoMail.
 *
 * @param to      - Recipient email address
 * @param subject - Email subject
 * @param body    - HTML body content
 * @param options - Optional sender / recipient details
 */
export async function sendMail(
  to: string,
  subject: string,
  body: string,
  options: SendMailOptions = {}
): Promise<unknown | null> {
  try {
    const { url, token } = getZeptoMailConfig(false);
    const client = new SendMailClient({ url, token });

    const from = getFromDetails(options);

    const response = await client.sendMail({
      from,
      to: [
        {
          email_address: {
            address: to,
            name: options.toName,
          },
        },
      ],
      subject,
      htmlbody: `<div>${body}</div>`,
    });

    return response;
  } catch (error) {
    console.error('[sendMail]', error);
    throw error;
  }
}
