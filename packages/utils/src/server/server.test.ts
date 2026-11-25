import { describe, it, expect, vi } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  SendMailClient,
  sendMail,
  sendBatchMail,
} from './index';

describe('Server Entry Point (@nofinite/utils/server)', () => {
  it('exports password and email functions and classes', () => {
    expect(typeof hashPassword).toBe('function');
    expect(typeof verifyPassword).toBe('function');
    expect(typeof SendMailClient).toBe('function');
    expect(typeof sendMail).toBe('function');
    expect(typeof sendBatchMail).toBe('function');
  });

  it('hashes and verifies a password via server entry export', async () => {
    const password = 'ServerSecretPassword123!';
    const hash = await hashPassword(password);
    expect(hash).toContain('$argon2id$');
    const matches = await verifyPassword(password, hash);
    expect(matches).toBe(true);
  });

  it('instantiates SendMailClient and invokes sendMail via server export', async () => {
    process.env.ZEPTOMAIL_TOKEN = 'test-token-server';
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ message: 'ok' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const client = new SendMailClient({ token: 'test-token-server' });
    const res = await client.sendMail({
      from: { address: 'admin@nofinite.com', name: 'Nofinite' },
      to: [{ email_address: { address: 'dev@nofinite.com' } }],
      subject: 'Security Notice',
      htmlbody: '<p>Updated</p>',
    });

    expect(res).toEqual({ message: 'ok' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
