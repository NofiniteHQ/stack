const { execSync } = require('child_process');
const fs = require('fs');

console.log('Building CDN config...');
execSync('npx esbuild src/cdn.ts --bundle --minify --format=iife --outfile=dist/cdn-config.js --external:@unocss/* --external:unocss', { stdio: 'inherit' });

console.log('Concatenating with UnoCSS runtime...');
const config = fs.readFileSync('dist/cdn-config.js', 'utf8');
// Use the full runtime to ensure presetWind/presetUno are available if the user explicitly needs them,
// but actually uno.global.js is the standard drop-in for Tailwind/Uno equivalence.
const runtime = fs.readFileSync('node_modules/@unocss/runtime/uno.global.js', 'utf8');

fs.writeFileSync('dist/index.global.js', config + '\n' + runtime, 'utf8');
fs.unlinkSync('dist/cdn-config.js');

console.log('Built dist/index.global.js successfully!');
