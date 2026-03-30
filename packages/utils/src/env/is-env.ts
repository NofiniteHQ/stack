/**
 * Returns the current NODE_ENV value.
 */
export function getNodeEnv(): string | undefined {
  return process.env.NODE_ENV;
}

/**
 * Returns true if environment is production.
 */
export function isProd(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Returns true if environment is development.
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Returns true if environment is test.
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}
