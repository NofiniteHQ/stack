import fs from 'fs';
import { generateCSS } from './packages/nuicss/src/engine/generator';

const code = fs.readFileSync('./examples/nuicss/nuicss-react-app/src/App.tsx', 'utf-8');
const CLASS_REGEX = /[^<>"'`\s]+/g;
const classSet = new Set<string>();
let match;
while ((match = CLASS_REGEX.exec(code)) !== null) {
  classSet.add(match[0]);
}

const css = generateCSS(Array.from(classSet), { theme: {} });
console.log(css.includes('.pl-10 {') ? 'FOUND pl-10' : 'NOT FOUND pl-10');
console.log(css.includes('.input {') ? 'FOUND input' : 'NOT FOUND input');
