import { describe, it, expect } from 'vitest';
import { generateCSS } from './generator';

describe('NUICSS Generator', () => {
  it('handles arbitrary colors properly', () => {
    const css = generateCSS(['text-[#123456]', 'bg-[rgb(0,0,0)]']);
    expect(css).toContain('color: #123456;');
    expect(css).toContain('background-color: rgb(0,0,0);');
  });

  it('handles Phase 1 Logic-Driven CSS variants', () => {
    const css = generateCSS(['has-[:checked]:bg-primary', 'group-has-[.is-active]:opacity-100', 'data-[state=open]:flex', 'aria-[expanded=true]:block']);
    expect(css).toContain('.has-\\[\\:checked\\]\\:bg-primary:has(:checked) { background-color: var(--nui-color-primary');
    expect(css).toContain('.group:has(.is-active) .group-has-\\[\\.is-active\\]\\:opacity-100 { opacity: var(--nui-opacity-100, 1); }');
    expect(css).toContain('.data-\\[state\\=open\\]\\:flex[data-state="open"] { display: flex; }');
    expect(css).toContain('.aria-\\[expanded\\=true\\]\\:block[aria-expanded="true"] { display: block; }');
  });

  it('handles Container Queries and Dynamic Viewport Units', () => {
    const css = generateCSS(['@container', '@container-normal', '@sm:flex-col', 'h-dvh', 'min-h-svh']);
    expect(css).toContain('.\\@container { container-type: inline-size; }');
    expect(css).toContain('.\\@container-normal { container-type: normal; }');
    expect(css).toContain('@container (min-width: 640px) {');
    expect(css).toContain('.\\@sm\\:flex-col { flex-direction: column; }');
    expect(css).toContain('.h-dvh { height: 100dvh; }');
    expect(css).toContain('.min-h-svh { min-height: 100svh; }');
  });

  it('handles Phase 2 Typography & Modifiers', () => {
    const css = generateCSS(['text-balance', 'text-pretty', 'mix-blend-multiply', 'bg-blend-overlay']);
    expect(css).toContain('.text-balance { text-wrap: balance; }');
    expect(css).toContain('.text-pretty { text-wrap: pretty; }');
    expect(css).toContain('.mix-blend-multiply { mix-blend-mode: multiply; }');
    expect(css).toContain('.bg-blend-overlay { background-blend-mode: overlay; }');
  });

  it('handles Phase 3 Motion & Interactivity', () => {
    const css = generateCSS(['snap-x', 'snap-mandatory', 'snap-center', 'view-transition-[card-1]', 'view-transition-hero']);
    expect(css).toContain('.snap-x { scroll-snap-type: x var(--nui-scroll-snap-strictness, proximity); }');
    expect(css).toContain('.snap-mandatory { --nui-scroll-snap-strictness: mandatory; }');
    expect(css).toContain('.snap-center { scroll-snap-align: center; }');
    expect(css).toContain('.view-transition-\\[card-1\\] { view-transition-name: card-1; }');
    expect(css).toContain('.view-transition-hero { view-transition-name: hero; }');
  });

  it('handles Phase 4 Visuals & Glassmorphism', () => {
    const css = generateCSS(['backdrop-brightness-50', 'backdrop-invert', 'mask-image-[linear-gradient(to_bottom,black,transparent)]', 'text-shadow-md']);
    expect(css).toContain('.backdrop-brightness-50 { backdrop-filter: brightness(0.5); -webkit-backdrop-filter: brightness(0.5); }');
    expect(css).toContain('.backdrop-invert { backdrop-filter: invert(100%); -webkit-backdrop-filter: invert(100%); }');
    expect(css).toContain('.mask-image-\\[linear-gradient\\(to_bottom\\,black\\,transparent\\)\\] { mask-image: linear-gradient(to bottom,black,transparent); -webkit-mask-image: linear-gradient(to bottom,black,transparent); }');
    expect(css).toContain('.text-shadow-md { text-shadow: 1px 2px 4px var(--nui-shadow-color, rgba(0,0,0,0.15)); }');
  });

  it('should generate base utilities', () => {
    const css = generateCSS(['flex', 'w-4', 'bg-surface']);
    expect(css).toContain('.flex { display: flex; }');
    expect(css).toContain('.w-4 { width: var(--nui-space-4, 1rem); }');
    expect(css).toContain('.bg-surface { background-color: var(--nui-bg-surface, #ffffff); }');
  });

  // Since we updated the generator to handle pseudo classes directly,
  // we check if hover is appended to the class selector.
  it('should handle pseudo variants', () => {
    const css = generateCSS(['hover:bg-surface', 'hover:text-primary', 'focus:ring']);
    expect(css).toContain('.hover\\:bg-surface:hover { background-color: var(--nui-bg-surface, #ffffff); }');
    expect(css).toContain('.hover\\:text-primary:hover { color: var(--nui-color-primary, #2563eb); }');
    expect(css).toMatch(/\.focus\\:ring:focus \{ box-shadow: var\(--nui-ring-offset-shadow/);
  });

  it('should handle responsive prefixes', () => {
    const css = generateCSS(['md:flex', 'lg:w-8']);
    expect(css).toContain('@media (min-width: 768px)');
    expect(css).toContain('.md\\:flex { display: flex; }');
    expect(css).toContain('@media (min-width: 1024px)');
    expect(css).toContain('.lg\\:w-8 { width: var(--nui-space-8, 2rem); }');
  });

  it('should handle prefix option', () => {
    const css = generateCSS(['nui-flex', 'md:nui-w-4', 'flex'], { prefix: 'nui-' });
    // 'flex' shouldn't generate anything because it misses the prefix.
    expect(css).toContain('.nui-flex { display: flex; }');
    expect(css).toContain('.md\\:nui-w-4 { width: var(--nui-space-4, 1rem); }');
    expect(css).not.toContain('.flex { display: flex; }'); // raw flex should be ignored
  });

  it('should handle negative margins', () => {
    const css = generateCSS(['-m-4', '-mt-2']);
    expect(css).toContain('.-m-4 { margin: calc(var(--nui-space-4, 1rem) * -1); }');
    expect(css).toContain('.-mt-2 { margin-top: calc(var(--nui-space-2, 0.5rem) * -1); }');
  });

  it('should generate dark mode variants', () => {
    const css = generateCSS(['dark:bg-surface', 'md:dark:hover:text-primary']);
    expect(css).toContain('.dark .dark\\:bg-surface { background-color: var(--nui-bg-surface, #ffffff); }');
    expect(css).toContain('@media (min-width: 768px)');
    expect(css).toContain('.dark .md\\:dark\\:hover\\:text-primary:hover { color: var(--nui-color-primary, #2563eb); }');
  });

  it('should parse arbitrary values', () => {
    const resArbitrary = generateCSS(['w-[343px]', 'bg-[#ff0055]', 'mt-[calc(100%_-_20px)]', 'z-[1]', 'w-1/2', 'top-1/2', 'grid-cols-[200px_minmax(900px,_1fr)_100px]', 'basis-[25%]', 'aspect-[4/3]', 'fill-[#000000]']);
    expect(resArbitrary).toContain('.w-\\[343px\\] { width: 343px; }');
    expect(resArbitrary).toContain('.bg-\\[\\#ff0055\\] { background-color: #ff0055; }');
    expect(resArbitrary).toContain('.mt-\\[calc\\(100\\%_-_20px\\)\\] { margin-top: calc(100% - 20px); }');
    expect(resArbitrary).toContain('.z-\\[1\\] { z-index: 1; }');
    expect(resArbitrary).toContain('.w-1\\/2 { width: 50%; }');
    expect(resArbitrary).toContain('.top-1\\/2 { top: 50%; }');
    expect(resArbitrary).toContain('.grid-cols-\\[200px_minmax\\(900px\\,_1fr\\)_100px\\] { grid-template-columns: 200px minmax(900px, 1fr) 100px; }');
    expect(resArbitrary).toContain('.basis-\\[25\\%\\] { flex-basis: 25%; }');
    expect(resArbitrary).toContain('.aspect-\\[4\\/3\\] { aspect-ratio: 4/3; }');
    expect(resArbitrary).toContain('.fill-\\[\\#000000\\] { fill: #000000; }');

    // Opacity Color Modifiers
    const resOpacity = generateCSS(['bg-red-500/30', 'text-black/50', 'border-gray-300/20']);
    expect(resOpacity).toContain('.bg-red-500\\/30 { background-color: color-mix(in srgb, #ef4444 30%, transparent); }');
    expect(resOpacity).toContain('.text-black\\/50 { color: color-mix(in srgb, #000000 50%, transparent); }');
    expect(resOpacity).toContain('.border-gray-300\\/20 { border-color: color-mix(in srgb, #d1d5db 20%, transparent); }');

    // Advanced Selectors (Lobotomized Owl & Peer)
    const resAdvanced = generateCSS(['space-y-4', 'peer-focus:border-primary']);
    expect(resAdvanced).toContain('.space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: calc(var(--nui-space-4, 1rem) * calc(1 - var(--nui-space-y-reverse, 0))); margin-bottom: calc(var(--nui-space-4, 1rem) * var(--nui-space-y-reverse, 0)); }');
    expect(resAdvanced).toContain('.peer:focus ~ .peer-focus\\:border-primary { border-color: var(--nui-color-primary, #2563eb); }');
  });

  it('should expand semantic components', () => {
    const css = generateCSS(['btn-primary']);
    // 'btn-primary' expands to: 'bg-primary', 'text-inverse', 'hover:opacity-90', 'focus:ring', 'focus:ring-primary'
    expect(css).toMatch(/\.btn-primary \{.*background-color: var\(--nui-color-primary, #2563eb\);.*color: var\(--nui-color-inverse, #ffffff\);.*\}/);
    expect(css).toContain('.btn-primary:hover { opacity: var(--nui-opacity-90, 0.9); }');
    expect(css).toMatch(/\.btn-primary:focus \{.*box-shadow: var\(--nui-ring-offset-shadow/);
  });

  it('should generate animations and gradients', () => {
    const css = generateCSS(['animate-spin', 'bg-gradient-to-r', 'from-primary']);
    expect(css).toContain('animation: spin 1s linear infinite;');
    expect(css).toContain('background-image: linear-gradient(to right, var(--nui-gradient-stops));');
    expect(css).toContain('--nui-gradient-from: var(--nui-color-primary, #2563eb);');
  });

  it('should handle !important modifier', () => {
    const css = generateCSS(['!bg-surface', 'md:!flex', '!text-primary/50']);
    expect(css).toContain('.\\!bg-surface { background-color: var(--nui-bg-surface, #ffffff) !important; }');
    expect(css).toContain('.md\\:\\!flex { display: flex !important; }');
    expect(css).toContain('.\\!text-primary\\/50 { color: color-mix(in srgb, var(--nui-color-primary, #2563eb) 50%, transparent) !important; }');
  });

  it('should gracefully handle invalid and malformed classes', () => {
    const css = generateCSS([
      '[]', 
      'bg-[]', 
      'hover:', 
      ':hover', 
      '---m-4', 
      'unknown-utility',
      'w-[calc(100%-2rem_-_env(safe-area-inset-bottom))]'
    ]);
    
    // It should not crash, and it should correctly parse the complex arbitrary width.
    expect(css).toContain('.w-\\[calc\\(100\\%-2rem_-_env\\(safe-area-inset-bottom\\)\\)\\] { width: calc(100%-2rem - env(safe-area-inset-bottom)); }');
    
    // It should not generate empty or invalid selectors
    expect(css).not.toContain('.hover\\: {');
    expect(css).not.toContain('.bg-\\[\\] {');
    expect(css).not.toContain('.unknown-utility');
  });

  it('should support custom rules via options', () => {
    const customRule = {
      pattern: /^super-bold$/,
      generator: () => 'font-weight: 1000; letter-spacing: -2px;'
    };
    
    const css = generateCSS(['super-bold'], { rules: [customRule] });
    expect(css).toContain('.super-bold { font-weight: 1000; letter-spacing: -2px; }');
  });
});
