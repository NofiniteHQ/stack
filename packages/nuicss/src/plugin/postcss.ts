import unocssPostcssPlugin from '@unocss/postcss';

export default function postcssPlugin(options: any = {}) {
  const finalOptions = {
    configOrPath: 'nuicss.config.ts',
    directiveMap: {
      unocss: 'nuicss'
    },
    ...options
  };
  const plugin = (unocssPostcssPlugin as any).default || unocssPostcssPlugin;
  return plugin(finalOptions);
}
