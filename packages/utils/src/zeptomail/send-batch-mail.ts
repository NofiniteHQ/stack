import { SendMailClient } from 'zeptomail';
import { SendBatchMailOptions } from './email.types';
import { getFromDetails, getZeptoMailConfig } from './email-config';

/**
 * Sends an email to multiple recipients using ZeptoMail batch API.
 *
 * @param emails  - List of recipient email addresses
 * @param subject - Email subject
 * @param body    - HTML body content
 * @param options - Optional sender / recipient details
 */
export async function sendBatchMail(
  emails: string[],
  subject: string,
  body: string,
  options: SendBatchMailOptions = {}
): Promise<unknown | null> {
  try {
    const { url, token } = getZeptoMailConfig(true);
    const client = new SendMailClient({ url, token });

    const from = getFromDetails(options);

    const recipients = emails.map((email, index) => ({
      email_address: {
        address: email,
        name: options.toNames?.[index],
      },
    }));

    const response = await client.sendBatchMail({
      from,
      to: recipients,
      subject,
      htmlbody: `<div>${body}</div>`,
    });

    return response;
  } catch (error) {
    console.error('[sendBatchMail]', error);
    throw error;
  }
}
