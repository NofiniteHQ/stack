/**
 * Supported hashing algorithms for OTP hashing.
 *
 * ⚠️ SHA-256 is the recommended default.
 * Other algorithms are provided for compatibility needs.
 */
export type OtpHashAlgorithm = 'sha256' | 'sha512' | 'sha384' | 'sha1';

/**
 * Configuration options for OTP generation & verification.
 */
export interface OtpOptions {
  /**
   * Hashing algorithm to use.
   * @default 'sha256'
   */
  hashAlgorithm?: OtpHashAlgorithm;

  /**
   * Cryptographic salt (hex string).
   * For generation: defaults to a cryptographically secure 16-byte random salt.
   * For verification: provide the salt generated with the OTP.
   */
  salt?: string;
}

/**
 * Result returned when generating an OTP.
 */
export interface GeneratedOtp {
  /**
   * Plain OTP (send to user, NEVER store)
   */
  otp: string;

  /**
   * Cryptographic salt used during hashing (store alongside otpHash)
   */
  salt: string;

  /**
   * Hashed OTP (store in database)
   */
  otpHash: string;
}
