/**
 * @license
 * Copyright (C) 2026 Nofinite
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  getFromDetails,
  getZeptoMailConfig,
} from '../../zeptomail/email-config';
import type {
  SendBatchMailOptions,
  SendMailOptions,
} from '../../zeptomail/email.types';

export interface NativeMailResponse {
  data?: unknown;
  message?: string;
  [key: string]: unknown;
}

export interface SendMailClientConfig {
  url?: string;
  token?: string;
}

/**
 * Server guard to prevent accidental bundle inclusion and execution in client/browser contexts.
 */
function assertServerEnvironment(): void {
  if (typeof globalThis !== 'undefined' && 'window' in globalThis) {
    throw new Error(
      'ZeptoMail client is restricted to server-side environments. Never expose email credentials in client runtimes.'
    );
  }
}

/**
 * Lightweight, zero-dependency native fetch client for Zoho ZeptoMail REST API.
 * Replaces the abandoned third-party zeptomail SDK (which inherited 36 CVEs via axios/form-data).
 */
export class SendMailClient {
  private readonly url?: string;
  private readonly token?: string;

  constructor(options: SendMailClientConfig = {}) {
    assertServerEnvironment();
    this.url = options.url;
    this.token = options.token;
  }

  /**
   * Sends a single email via ZeptoMail REST API.
   */
  async sendMail(payload: {
    from: { address: string; name?: string };
    to: Array<{ email_address: { address: string; name?: string } }>;
    subject: string;
    htmlbody: string;
  }): Promise<NativeMailResponse> {
    assertServerEnvironment();

    const config = {
      url: this.url ?? getZeptoMailConfig(false).url,
      token: this.token ?? getZeptoMailConfig(false).token,
    };

    const res = await fetch(config.url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Zoho-enczapikey ${config.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorBody = '';
      try {
        errorBody = await res.text();
      } catch {
        errorBody = res.statusText;
      }
      // Never include raw token in error message
      throw new Error(`ZeptoMail API error (${res.status}): ${errorBody}`);
    }

    return (await res.json()) as NativeMailResponse;
  }

  /**
   * Sends batch emails via ZeptoMail batch REST API.
   */
  async sendBatchMail(payload: {
    from: { address: string; name?: string };
    to: Array<{ email_address: { address: string; name?: string } }>;
    subject: string;
    htmlbody: string;
  }): Promise<NativeMailResponse> {
    assertServerEnvironment();

    const config = {
      url: this.url ?? getZeptoMailConfig(true).url,
      token: this.token ?? getZeptoMailConfig(true).token,
    };

    const res = await fetch(config.url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Zoho-enczapikey ${config.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorBody = '';
      try {
        errorBody = await res.text();
      } catch {
        errorBody = res.statusText;
      }
      throw new Error(
        `ZeptoMail batch API error (${res.status}): ${errorBody}`
      );
    }

    return (await res.json()) as NativeMailResponse;
  }
}

/**
 * Sends a single email using the native fetch ZeptoMail client.
 */
export async function sendMail(
  to: string,
  subject: string,
  body: string,
  options: SendMailOptions = {}
): Promise<unknown | null> {
  assertServerEnvironment();
  try {
    const { url, token } = getZeptoMailConfig(false);
    const client = new SendMailClient({ url, token });
    const from = getFromDetails(options);

    return await client.sendMail({
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
  } catch (error) {
    console.error('[sendMail]', error);
    throw error;
  }
}

/**
 * Sends batch emails using the native fetch ZeptoMail client.
 */
export async function sendBatchMail(
  emails: string[],
  subject: string,
  body: string,
  options: SendBatchMailOptions = {}
): Promise<unknown | null> {
  assertServerEnvironment();
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

    return await client.sendBatchMail({
      from,
      to: recipients,
      subject,
      htmlbody: `<div>${body}</div>`,
    });
  } catch (error) {
    console.error('[sendBatchMail]', error);
    throw error;
  }
}
