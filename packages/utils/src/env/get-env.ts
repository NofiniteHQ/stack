import { EnvOptions } from './env.types';

/**
 * Safely reads an environment variable.
 *
 * @param key     - Environment variable name
 * @param options - Access options
 * @returns Value or undefined/default
 */
export function getEnv(
  key: string,
  options: EnvOptions<string> = {},
): string | undefined {
  const value = process.env[key];

  if (!value) {
    if (options.required) {
      throw new Error(`Environment variable "${key}" is required`);
    }
    return options.defaultValue;
  }

  return value;
}
