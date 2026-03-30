/**
 * Common options for sending emails.
 */
export interface SendMailOptions {
  /**
   * Sender email address.
   * Defaults to process.env.MAIL_FROM_ADDRESS
   */
  fromEmail?: string;

  /**
   * Sender display name.
   * Defaults to process.env.MAIL_FROM_NAME
   */
  fromName?: string;

  /**
   * Optional recipient name.
   */
  toName?: string;
}

/**
 * Batch email options.
 */
export interface SendBatchMailOptions extends SendMailOptions {
  /**
   * List of recipient names (optional, index-matched with emails)
   */
  toNames?: string[];
}
