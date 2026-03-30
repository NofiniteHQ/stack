import { EnvOptions } from './env.types';

/**
 * Reads an environment variable and parses it as a boolean.
 *
 * Accepted truthy values:
 * - "true", "1", "yes"
 *
 * Accepted falsy values:
 * - "false", "0", "no"
 */
export function getEnvBoolean(
  key: string,
  options: EnvOptions<boolean> = {},
): boolean | undefined {
  const value = process.env[key];

  if (!value) {
    if (options.required) {
      throw new Error(`Environment variable "${key}" is required`);
    }
    return options.defaultValue;
  }

  const normalized = value.toLowerCase();

  if (['true', '1', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'no'].includes(normalized)) return false;

  throw new Error(
    `Environment variable "${key}" must be a boolean (true/false)`,
  );
}
