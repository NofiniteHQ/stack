import { describe, it, expect } from 'vitest';
import {
  isProd,
  isDev,
  isTest,
  getEnv,
  requireEnv,
  getEnvNumber,
  getEnvBoolean,
} from './index';

describe('env helpers', () => {
  it('should detect environment correctly', () => {
    process.env.NODE_ENV = 'production';

    expect(isProd()).toBe(true);
    expect(isDev()).toBe(false);
    expect(isTest()).toBe(false);
  });

  it('should read optional env variable', () => {
    process.env.OPTIONAL_VAR = 'hello';

    expect(getEnv('OPTIONAL_VAR')).toBe('hello');
  });

  it('should throw for required env variable', () => {
    expect(() => requireEnv('MISSING_ENV')).toThrow();
  });

  it('should parse numeric env variable', () => {
    process.env.PORT = '3000';

    expect(getEnvNumber('PORT')).toBe(3000);
  });

  it('should parse boolean env variable', () => {
    process.env.FEATURE_ENABLED = 'true';

    expect(getEnvBoolean('FEATURE_ENABLED')).toBe(true);
  });
});
