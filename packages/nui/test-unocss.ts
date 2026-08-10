import { createGenerator } from '@unocss/core';
import { nuiPreset } from './src/preset.ts';

const uno = createGenerator({
  presets: [nuiPreset()]
});

async function test() {
  const { css } = await uno.generate('bg-surface text-default border-default text-muted border-t border-b hover:bg-subtle group-data-[state=open]:rotate-180 ring-focus focus-visible:ring-focus');
  console.log('--- CSS GENERATED ---');
  console.log(css);
}

test();
