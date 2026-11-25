/**
 * Configuration options for password hashing.
 *
 * These defaults are tuned for server environments (RFC 9106 recommended profile).
 * Increase costs only if you fully understand the impact.
 */
export interface PasswordHashOptions {
  /**
   * Memory cost in kibibytes.
   * Default: 64 MB (2^16 KiB)
   */
  memoryCost?: number;

  /**
   * Number of iterations.
   * Default: 3
   */
  timeCost?: number;

  /**
   * Degree of parallelism.
   * Default: 4 (RFC 9106 multi-core recommended profile)
   */
  parallelism?: number;
}
