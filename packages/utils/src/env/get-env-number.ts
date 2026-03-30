import { EnvOptions } from './env.types';

/**
 * Reads an environment variable and parses it as a number.
 *
 * @param key     - Environment variable name
 * @param options - Parsing options
 * @returns Parsed number or undefined/default
 */
export function getEnvNumber(
  key: string,
  options: EnvOptions<number> = {},
): number | undefined {
  const value = process.env[key];

  if (!value) {
    if (options.required) {
      throw new Error(`Environment variable "${key}" is required`);
    }
    return options.defaultValue;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable "${key}" must be a number`);
  }

  return parsed;
}
