import type { JWTPayload } from 'jose';

/**
 * Supported HMAC JWT algorithms.
 *
 * HS256 is the recommended default.
 */
export type JwtHmacAlgorithm = 'HS256' | 'HS384' | 'HS512';

/**
 * Options for signing a JWT.
 */
export interface JwtSignOptions {
  /**
   * HMAC algorithm.
   * @default 'HS256'
   */
  algorithm?: JwtHmacAlgorithm;

  /**
   * Token expiration time.
   * Examples: '7d', '1h', '15m'
   * @default '7d'
   */
  expiresIn?: string;

  /**
   * Token issuer.
   */
  issuer?: string;

  /**
   * Token audience.
   */
  audience?: string;
}

/**
 * Options for verifying a JWT.
 */
export interface JwtVerifyOptions {
  /**
   * Expected issuer.
   */
  issuer?: string;

  /**
   * Expected audience.
   */
  audience?: string;
}

/**
 * JWT payload shape.
 * Extend this in your app via intersection if needed.
 */
export type JwtPayload = JWTPayload;
