import { createGenerator } from '@unocss/core';
import { nuicssPreset } from '../../nuicss/dist/index.mjs';

const uno = createGenerator({
  presets: [nuicssPreset()]
});

async function test() {
  const { css } = await uno.generate('right-px top-px bottom-px right-[1px] top-[1px] rounded-r-md rounded-r-[4px] rounded-r-[5px] h-full');
  console.log('--- CSS GENERATED ---');
  console.log(css);
}

test();
