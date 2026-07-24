import type { NuicssConfig } from '@nofinite/nuicss';

export default {
  content: ['./src/**/*.{tsx,jsx,html}'],
  rules: [
    {
      // Custom parser rule testing the Plugin API
      pattern: /^nui-hero-text$/,
      generator: () => 'font-size: clamp(3rem, 8vw, 6rem); font-weight: 900; letter-spacing: -0.05em; line-height: 1.1;'
    },
    {
      // Custom arbitrary value parser testing the Plugin API
      pattern: /^popout-\[(.+)\]$/,
      generator: ({ match }) => {
        const val = match[1].replace(/_/g, ' ');
        return `box-shadow: ${val} 10px 10px 0px 0px; transform: translate(-5px, -5px);`;
      }
    }
  ]
} satisfies NuicssConfig;
