import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readFileSafe(fileName: string): string {
  // Check local embedded directory first
  const localPath = path.join(__dirname, fileName);
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath, 'utf8');
  }

  // Fallback to parent package distribution if running from compiled dist/
  const parentDistPath = path.resolve(__dirname, '..', fileName);
  if (fs.existsSync(parentDistPath)) {
    return fs.readFileSync(parentDistPath, 'utf8');
  }

  return '';
}

export function getHtmlData(): string {
  return readFileSafe('nuicss.html-data.json');
}

export function getCssData(): string {
  return readFileSafe('nuicss.css-data.json');
}

export function getBaseStyles(): string {
  return readFileSafe('styles.css');
}
