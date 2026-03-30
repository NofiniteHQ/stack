/**
 * Reads a REQUIRED environment variable.
 *
 * Fails fast on startup if missing.
 *
 * @param key - Environment variable name
 * @returns Value as string
 */
export function requireEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable "${key}" is required`);
  }

  return value;
}
