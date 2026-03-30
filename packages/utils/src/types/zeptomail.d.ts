// src/types/zeptomail.d.ts
declare module 'zeptomail' {
  export interface SendMailClientOptions {
    url: string;
    token: string;
  }

  export interface EmailAddress {
    address: string;
    name?: string;
  }

  export interface Recipient {
    email_address: EmailAddress;
  }

  export interface SendMailPayload {
    from: EmailAddress;
    to: Recipient[];
    subject: string;
    htmlbody: string;
  }

  export class SendMailClient {
    constructor(options: SendMailClientOptions);
    sendMail(payload: SendMailPayload): Promise<unknown>;
    sendBatchMail(payload: SendMailPayload): Promise<unknown>;
  }
}
