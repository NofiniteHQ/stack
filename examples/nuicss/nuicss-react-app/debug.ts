import { generateCSS, generateVariables } from '@nofinite/nuicss/dist/engine/generator.js';
import config from './nuicss.config.js';

console.log('Variables:');
console.log(generateVariables(config.theme));

console.log('\nUtilities:');
const utilities = generateCSS(['nui-btn-brand'], { prefix: 'nui-', ...config });
console.log(utilities);
