import { expect, test, describe, beforeAll, afterAll } from 'vitest';
import { loadConfig } from './config';
import fs from 'fs';
import path from 'path';

describe('Config Loader', () => {
  const configPath = path.resolve(process.cwd(), 'test.nuicss.config.ts');

  beforeAll(() => {
    fs.writeFileSync(configPath, `
      export default {
        theme: {
          colorsBg: {
            brand: '#ff0000'
          }
        },
        components: {
          'btn-brand': ['bg-brand', 'text-white', 'px-4', 'py-2', 'rounded']
        }
      }
    `);
  });

  afterAll(() => {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
  });

  test('loads custom config successfully via jiti', async () => {
    const config = await loadConfig('test.nuicss.config.ts');
    
    expect(config).toBeDefined();
    expect(config.theme?.colorsBg?.brand).toBe('#ff0000');
    expect(config.components?.['btn-brand']).toContain('bg-brand');
  });
});
