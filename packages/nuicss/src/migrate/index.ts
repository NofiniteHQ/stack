/**
 * @nofinite/nuicss/migrate
 * Automated migration engine and codemod for transitioning from verbose Tailwind /
 * Bootstrap utility clusters to clean, semantic NUICSS superclasses.
 */

export interface MigrationRule {
  name: string;
  pattern: RegExp;
  replacement: string;
  description: string;
}

export const DEFAULT_MIGRATION_RULES: MigrationRule[] = [
  // Primary Buttons
  {
    name: 'btn-primary',
    pattern:
      /\b(?:inline-flex\s+)?items-center(?:\s+justify-center)?\s+(?:px-[34]\s+py-[12]|h-9\s+px-4)\s+bg-(?:blue|indigo|violet|brand|primary)-[56]00\s+text-white\s+rounded-(?:md|lg)\s+hover:bg-(?:blue|indigo|violet|brand|primary)-[67]00(?:\s+font-medium)?(?:\s+transition-all)?\b/g,
    replacement: 'btn btn-primary',
    description:
      'Converts verbose primary button utility clusters to `btn btn-primary`',
  },
  // Secondary Buttons
  {
    name: 'btn-secondary',
    pattern:
      /\b(?:inline-flex\s+)?items-center(?:\s+justify-center)?\s+(?:px-[34]\s+py-[12]|h-9\s+px-4)\s+bg-(?:gray|slate|zinc)-100\s+text-(?:gray|slate|zinc)-900\s+rounded-(?:md|lg)\s+hover:bg-(?:gray|slate|zinc)-200(?:\s+font-medium)?\b/g,
    replacement: 'btn btn-secondary',
    description:
      'Converts secondary button utility clusters to `btn btn-secondary`',
  },
  // Ghost Buttons
  {
    name: 'btn-ghost',
    pattern:
      /\b(?:inline-flex\s+)?items-center(?:\s+justify-center)?\s+(?:px-[34]\s+py-[12]|h-9\s+px-4)\s+bg-transparent\s+text-(?:gray|slate|zinc)-[789]00\s+hover:bg-(?:gray|slate|zinc)-100\s+rounded-(?:md|lg)\b/g,
    replacement: 'btn btn-ghost',
    description: 'Converts ghost button utility clusters to `btn btn-ghost`',
  },
  // Outline Buttons
  {
    name: 'btn-outline',
    pattern:
      /\b(?:inline-flex\s+)?items-center(?:\s+justify-center)?\s+(?:px-[34]\s+py-[12]|h-9\s+px-4)\s+border\s+border-(?:gray|slate|zinc)-[34]00\s+bg-transparent\s+text-(?:gray|slate|zinc)-900\s+hover:bg-(?:gray|slate|zinc)-100\s+rounded-(?:md|lg)\b/g,
    replacement: 'btn btn-outline',
    description:
      'Converts outline button utility clusters to `btn btn-outline`',
  },
  // Badges
  {
    name: 'badge-primary',
    pattern:
      /\b(?:inline-flex\s+)?items-center\s+px-2\.5\s+py-0\.5\s+rounded-full\s+text-xs\s+font-semibold\s+bg-(?:blue|indigo|violet|brand)-100\s+text-(?:blue|indigo|violet|brand)-[78]00\b/g,
    replacement: 'badge badge-primary',
    description:
      'Converts primary badge utility clusters to `badge badge-primary`',
  },
  {
    name: 'badge-success',
    pattern:
      /\b(?:inline-flex\s+)?items-center\s+px-2\.5\s+py-0\.5\s+rounded-full\s+text-xs\s+font-semibold\s+bg-green-100\s+text-green-[78]00\b/g,
    replacement: 'badge badge-success',
    description:
      'Converts success badge utility clusters to `badge badge-success`',
  },
  {
    name: 'badge-danger',
    pattern:
      /\b(?:inline-flex\s+)?items-center\s+px-2\.5\s+py-0\.5\s+rounded-full\s+text-xs\s+font-semibold\s+bg-red-100\s+text-red-[78]00\b/g,
    replacement: 'badge badge-danger',
    description:
      'Converts danger badge utility clusters to `badge badge-danger`',
  },
  // Inputs
  {
    name: 'input',
    pattern:
      /\bh-9\s+w-full\s+rounded-md\s+border\s+border-(?:gray|slate|zinc)-300\s+bg-white\s+px-3\s+py-1\s+text-sm(?:\s+shadow-sm)?(?:\s+outline-none)?\b/g,
    replacement: 'input',
    description: 'Converts text input utility clusters to `input`',
  },
  // Metric Cards
  {
    name: 'metric-card',
    pattern:
      /\b(?:flex\s+flex-col\s+)?p-5\s+rounded-xl\s+border\s+border-(?:gray|slate|zinc)-200\s+bg-white\s+shadow-sm\b/g,
    replacement: 'metric-card',
    description: 'Converts metric card container clusters to `metric-card`',
  },
  // Card Container
  {
    name: 'card',
    pattern:
      /\brounded-xl\s+border\s+border-(?:gray|slate|zinc)-200\s+bg-white\s+shadow-sm\s+overflow-hidden\b/g,
    replacement: 'card',
    description: 'Converts card wrapper utility clusters to `card`',
  },
  // Responsive Container Card
  {
    name: 'card-responsive',
    pattern:
      /(?<=^|\s|["'])@container\s+flex\s+flex-col\s+(?:@sm:|sm:)flex-row\s+(?:@sm:|sm:)items-center\b/g,
    replacement: 'card-responsive',
    description:
      'Converts responsive container flex layout clusters to `card-responsive`',
  },
  // Press Scale Micro-interaction
  {
    name: 'press-scale',
    pattern:
      /\bactive:scale-(?:\[0\.97\]|\[0\.98\]|95)\s+(?:transition-transform\s+)?(?:duration-150\s+)?(?:ease-spring|ease-out)\b/g,
    replacement: 'press-scale',
    description:
      'Converts interactive press scale micro-interaction clusters to `press-scale`',
  },
  // Hover Lift Micro-interaction
  {
    name: 'hover-lift',
    pattern:
      /\bhover:-translate-y-(?:0\.5|1)\s+hover:shadow-(?:md|lg)(?:\s+transition-all)?\b/g,
    replacement: 'hover-lift',
    description:
      'Converts interactive hover lift micro-interaction clusters to `hover-lift`',
  },
  // Skeleton Shimmer Loading
  {
    name: 'skeleton-shimmer',
    pattern: /\banimate-pulse\s+bg-(?:gray|slate|zinc)-200\s+rounded\b/g,
    replacement: 'skeleton-shimmer rounded',
    description:
      'Converts pulse skeleton placeholders to `skeleton-shimmer rounded`',
  },
  // Table Container
  {
    name: 'table-container',
    pattern:
      /\bw-full\s+overflow-x-auto\s+rounded-xl\s+border\s+border-(?:gray|slate|zinc)-200\s+bg-white\s+shadow-sm\b/g,
    replacement: 'table-container',
    description:
      'Converts overflow table wrapper clusters to `table-container`',
  },
];

/**
 * Transforms markup content (HTML, JSX, Vue, Svelte, etc.) by replacing
 * verbose utility clusters with NUICSS superclasses.
 */
export function migrateMarkupToNuicss(
  content: string,
  rules: MigrationRule[] = DEFAULT_MIGRATION_RULES
): { result: string; replacementsCount: number } {
  let transformed = content;
  let totalReplacements = 0;

  for (const rule of rules) {
    const matches = transformed.match(rule.pattern);
    if (matches) {
      totalReplacements += matches.length;
      transformed = transformed.replace(rule.pattern, rule.replacement);
    }
  }

  return {
    result: transformed,
    replacementsCount: totalReplacements,
  };
}
