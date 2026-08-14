import { createGenerator } from 'unocss'
import { presetUno } from 'unocss'
import { nuiPreset } from './packages/nui/src/preset'

const unocss = createGenerator({
  presets: [nuiPreset()]
})

async function test() {
  const { css } = await unocss.generate('<div class="border-default"></div>')
  console.log('CSS generated:', css)
}
test()
