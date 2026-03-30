/**
 * Checks whether an OTP has expired based on creation time.
 *
 * This function is intentionally stateless.
 * Storage and persistence must be handled by the application layer.
 *
 * @param createdAt   - When the OTP was generated
 * @param ttlSeconds  - Time-to-live in seconds (default: 300 = 5 minutes)
 * @returns `true` if OTP is expired, otherwise `false`
 */
export function isOtpExpired(
  createdAt: Date,
  ttlSeconds = 300,
): boolean {
  const now = Date.now();
  const expiresAt = createdAt.getTime() + ttlSeconds * 1000;

  return now > expiresAt;
}
