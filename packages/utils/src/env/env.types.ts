/**
 * Supported environment names.
 */
export type NodeEnv = 'development' | 'production' | 'test';

/**
 * Options for environment variable access.
 */
export interface EnvOptions<T> {
  /**
   * Default value if env variable is not set.
   */
  defaultValue?: T;

  /**
   * Whether the variable is required.
   * If true and missing, an error is thrown.
   */
  required?: boolean;
}
