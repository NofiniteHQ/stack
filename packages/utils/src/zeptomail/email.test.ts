import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.resetModules(); 
  process.env.ZEPTOMAIL_TOKEN = 'test-token';
  process.env.ZEPTOMAIL_FROM_ADDRESS = 'noreply@test.com';
  process.env.ZEPTOMAIL_FROM_NAME = 'Test Sender';
});

describe('email utils', () => {
  it('should send a single email', async () => {
    vi.doMock('zeptomail', () => ({
      __esModule: true,
      SendMailClient: class {
        sendMail() {
          return Promise.resolve({ success: true });
        }
        sendBatchMail() {
          return Promise.resolve({ success: true });
        }
      },
    }));

    const { sendMail } = await import('./index'); // import AFTER mock

    const res = await sendMail(
      'user@test.com',
      'Hello',
      '<p>Test</p>',
    );

    expect(res).toEqual({ success: true });
  });

  it('should send batch emails', async () => {
    vi.doMock('zeptomail', () => ({
      __esModule: true,
      SendMailClient: class {
        sendMail() {
          return Promise.resolve({ success: true });
        }
        sendBatchMail() {
          return Promise.resolve({ success: true });
        }
      },
    }));

    const { sendBatchMail } = await import('./index'); // import AFTER mock

    const res = await sendBatchMail(
      ['a@test.com', 'b@test.com'],
      'Batch',
      '<p>Batch Test</p>',
    );

    expect(res).toEqual({ success: true });
  });
});
