import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  process.env.ZEPTOMAIL_TOKEN = 'test-token';
  process.env.ZEPTOMAIL_FROM_ADDRESS = 'noreply@test.com';
  process.env.ZEPTOMAIL_FROM_NAME = 'Test Sender';
});

describe('email utils (native fetch client)', () => {
  it('should send a single email via native fetch', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: [{ message: 'Email sent successfully' }],
        message: 'success',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { sendMail } = await import('./index');

    const res = await sendMail('user@test.com', 'Hello', '<p>Test</p>');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, requestOptions] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.zeptomail.in/v1.1/email');
    expect(requestOptions.method).toBe('POST');
    expect(requestOptions.headers.Authorization).toBe(
      'Zoho-enczapikey test-token'
    );
    expect(JSON.parse(requestOptions.body)).toEqual({
      from: { address: 'noreply@test.com', name: 'Test Sender' },
      to: [{ email_address: { address: 'user@test.com', name: undefined } }],
      subject: 'Hello',
      htmlbody: '<div><p>Test</p></div>',
    });
    expect(res).toEqual({
      data: [{ message: 'Email sent successfully' }],
      message: 'success',
    });

    vi.unstubAllGlobals();
  });

  it('should send batch emails via native fetch batch endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: [{ message: 'Batch dispatched' }],
        message: 'success',
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { sendBatchMail } = await import('./index');

    const res = await sendBatchMail(
      ['a@test.com', 'b@test.com'],
      'Batch',
      '<p>Batch Test</p>',
      { toNames: ['User A', 'User B'] }
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, requestOptions] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.zeptomail.in/v1.1/email/batch');
    expect(requestOptions.headers.Authorization).toBe(
      'Zoho-enczapikey test-token'
    );
    expect(JSON.parse(requestOptions.body)).toEqual({
      from: { address: 'noreply@test.com', name: 'Test Sender' },
      to: [
        { email_address: { address: 'a@test.com', name: 'User A' } },
        { email_address: { address: 'b@test.com', name: 'User B' } },
      ],
      subject: 'Batch',
      htmlbody: '<div><p>Batch Test</p></div>',
    });
    expect(res).toEqual({
      data: [{ message: 'Batch dispatched' }],
      message: 'success',
    });

    vi.unstubAllGlobals();
  });

  it('should handle API errors without token leakage', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Invalid Authorization Header',
    });
    vi.stubGlobal('fetch', mockFetch);

    const { sendMail } = await import('./index');

    await expect(sendMail('fail@test.com', 'Fail', 'Body')).rejects.toThrow(
      'ZeptoMail API error (401): Invalid Authorization Header'
    );

    vi.unstubAllGlobals();
  });
});
