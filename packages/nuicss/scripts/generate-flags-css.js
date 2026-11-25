const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src');
const flags4x3Dir = path.join(srcDir, 'flags/4x3');
const flags1x1Dir = path.join(srcDir, 'flags/1x1');
const outputFile = path.join(srcDir, 'styles/components/flags.css');

function generateFlagsCss(options = {}) {
  const { writeSrc = false } = options;
  if (!fs.existsSync(flags4x3Dir)) {
    console.error(`Error: flags directory not found at ${flags4x3Dir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(flags4x3Dir).filter((f) => f.endsWith('.svg'));
  const codes = files.map((f) => path.basename(f, '.svg').toLowerCase()).sort();

  console.log(
    `Generating flags.css for ${codes.length} country and regional flags...`
  );

  let css = `/**
 * @license
 * Copyright (C) 2025-2026 Nofinite
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Third-Party Notice:
 * Flag vector assets in dist/flags/ are derived from lipis/flag-icons (MIT).
 * See THIRD_PARTY_LICENSES.md for full license and copyright attribution.
 */

@layer components {
  :root {
    --nf-flag-height: 1em;
    --nf-flag-ratio: calc(4 / 3);
    --nf-flag-vertical-align: -0.125em;
    --nf-flag-radius: var(--radius-xs, 2px);
    --nf-flag-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  }

  :where([data-theme='dark'], .dark) {
    --nf-flag-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  }

  /* Base flag contract: supports standalone flag-*, nui-flag-*, and legacy nf-flag-* */
  .flag,
  .nui-flag,
  .nf-flag,
  [class^="flag-"],
  [class*=" flag-"],
  [class^="nui-flag-"],
  [class*=" nui-flag-"],
  [class^="nf-flag-"],
  [class*=" nf-flag-"] {
    display: inline-block;
    width: var(--nf-flag-width, calc(var(--nf-flag-height, 1em) * var(--nf-flag-ratio, 4 / 3)));
    height: var(--nf-flag-height, 1em);
    line-height: 1em;
    vertical-align: var(--nf-flag-vertical-align, -0.125em);
    background-size: var(--nf-flag-size, cover);
    background-position: center;
    background-repeat: no-repeat;
    border-radius: var(--nf-flag-radius, var(--radius-xs, 2px));
    box-shadow: var(--nf-flag-shadow);
    box-sizing: border-box;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }

  /* Aspect Ratio Modifiers */
  .flag-4x3,
  .nui-flag-4x3,
  .nf-flag-4x3 {
    --nf-flag-ratio: calc(4 / 3);
    width: var(--nf-flag-width, calc(var(--nf-flag-height, 1em) * var(--nf-flag-ratio, 4 / 3)));
  }

  /* Square Modifiers (1:1 Aspect Ratio) */
  .flag-square,
  .flag-1x1,
  .flag.square,
  .flag.flag-square,
  .nui-flag.square,
  .nui-flag.nui-flag-square,
  .nf-flag.square,
  [class^="flag-"].square,
  [class*=" flag-"].square,
  [class^="flag-"].flag-square,
  [class*=" flag-"].flag-square,
  [class^="flag-"].flag-1x1,
  [class*=" flag-"].flag-1x1,
  [class^="nui-flag-"].square,
  [class*=" nui-flag-"].square,
  [class^="nui-flag-"].nui-flag-square,
  [class*=" nui-flag-"].nui-flag-square,
  [class^="nf-flag-"].square,
  [class*=" nf-flag-"].square {
    --nf-flag-ratio: 1;
    width: var(--nf-flag-width, var(--nf-flag-height, 1em));
  }

  /* Circular Avatar Modifiers */
  .flag-circle,
  .flag.circle,
  .flag.flag-circle,
  .nui-flag.circle,
  .nui-flag.nui-flag-circle,
  .nf-flag.circle,
  [class^="flag-"].circle,
  [class*=" flag-"].circle,
  [class^="flag-"].flag-circle,
  [class*=" flag-"].flag-circle,
  [class^="nui-flag-"].circle,
  [class*=" nui-flag-"].circle,
  [class^="nui-flag-"].nui-flag-circle,
  [class*=" nui-flag-"].nui-flag-circle,
  [class^="nf-flag-"].circle,
  [class*=" nf-flag-"].circle {
    --nf-flag-ratio: 1;
    --nf-flag-radius: var(--radius-full, 9999px);
    width: var(--nf-flag-width, var(--nf-flag-height, 1em));
    border-radius: var(--radius-full, 9999px);
  }

  /* Country Flag Vector Definitions (On-Demand) */
`;

  for (const code of codes) {
    css += `  /* ${code} */\n`;
    css += `  .flag-${code},\n  .nui-flag-${code},\n  .nf-flag-${code} {\n    background-image: url("./flags/4x3/${code}.svg");\n  }\n`;
    css += `  .flag-${code}.square,\n  .flag-${code}.flag-square,\n  .flag-${code}.flag-1x1,\n  .flag-${code}.circle,\n  .flag-${code}.flag-circle,\n  .nui-flag-${code}.square,\n  .nui-flag-${code}.nui-flag-square,\n  .nui-flag-${code}.nui-flag-1x1,\n  .nui-flag-${code}.circle,\n  .nui-flag-${code}.nui-flag-circle,\n  .nf-flag-${code}.square,\n  .nf-flag-${code}.flag-square,\n  .nf-flag-${code}.circle {\n    background-image: url("./flags/1x1/${code}.svg");\n  }\n\n`;
  }

  css += `}\n`;

  if (writeSrc) {
    fs.writeFileSync(outputFile, css, 'utf8');
    console.log(
      `Successfully generated ${outputFile} (${Buffer.byteLength(
        css,
        'utf8'
      )} bytes)`
    );
  }

  return css;
}

if (require.main === module) {
  generateFlagsCss({ writeSrc: true });
}

module.exports = { generateFlagsCss };
