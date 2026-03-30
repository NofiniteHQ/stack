/**
 * Checks whether the maximum allowed OTP attempts have been exceeded.
 *
 * This prevents brute-force attacks on OTP verification.
 *
 * @param attempts     - Number of failed attempts so far
 * @param maxAttempts - Maximum allowed attempts (default: 3)
 * @returns `true` if attempts exceeded, otherwise `false`
 */
export function hasExceededOtpAttempts(
  attempts: number,
  maxAttempts = 3,
): boolean {
  return attempts >= maxAttempts;
}
