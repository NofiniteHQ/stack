import unocssPostcssPlugin from '@unocss/postcss';

export default function postcssPlugin(options: any = {}) {
  const plugin = (unocssPostcssPlugin as any).default || unocssPostcssPlugin;
  return plugin(options);
}
