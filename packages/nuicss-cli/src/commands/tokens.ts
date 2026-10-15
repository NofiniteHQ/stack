import { bold, cyan, dim } from 'colorette';

interface TokenItem {
  role: string;
  variable: string;
  colorCode: string;
  symbol: string;
  desc: string;
}

const TOKENS: TokenItem[] = [
  {
    role: 'Primary',
    variable: '--color-primary',
    colorCode: '38;2;59;130;246',
    symbol: '●',
    desc: 'Brand core / active actions',
  },
  {
    role: 'Secondary',
    variable: '--color-secondary',
    colorCode: '38;2;100;116;139',
    symbol: '●',
    desc: 'Subtle / secondary elements',
  },
  {
    role: 'Success',
    variable: '--color-success',
    colorCode: '38;2;34;197;94',
    symbol: '●',
    desc: 'Positive states, confirmations',
  },
  {
    role: 'Warning',
    variable: '--color-warning',
    colorCode: '38;2;234;179;8',
    symbol: '●',
    desc: 'Alerts, non-blocking notices',
  },
  {
    role: 'Danger',
    variable: '--color-danger',
    colorCode: '38;2;239;68;68',
    symbol: '●',
    desc: 'Destructive, errors, critical',
  },
  {
    role: 'Surface',
    variable: '--bg-surface',
    colorCode: '38;2;255;255;255',
    symbol: '○',
    desc: 'Default card and container background',
  },
  {
    role: 'Overlay',
    variable: '--bg-overlay',
    colorCode: '38;2;15;23;42',
    symbol: '●',
    desc: 'Modal backdrop with backdrop-blur-sm',
  },
  {
    role: 'Border',
    variable: '--border-default',
    colorCode: '38;2;226;232;240',
    symbol: '─',
    desc: 'Semantic container and input boundary',
  },
];

export async function tokensCommand(): Promise<void> {
  const supportsColor = Boolean(process.stdout.isTTY && !process.env.NO_COLOR);

  console.log(
    `\n${bold(
      cyan('🎨 NUICSS Design System Tokens (OKLCH + Dual sRGB Fallback)')
    )}`
  );
  console.log('===========================================================');

  for (const t of TOKENS) {
    const glyph = supportsColor
      ? `\x1b[${t.colorCode}m${t.symbol}\x1b[0m`
      : t.symbol;
    const roleStr = t.role.padEnd(12);
    const varStr = t.variable.padEnd(20);
    console.log(`  ${glyph} ${bold(roleStr)} ${cyan(varStr)} ${dim(t.desc)}`);
  }

  console.log(`\n${bold('Superclasses (Anti-Utility Soup):')}`);
  console.log('  .btn, .btn-primary, .btn-secondary, .btn-ghost, .btn-outline');
  console.log('  .card, .card-responsive, .metric-card');
  console.log('  .badge, .badge-primary, .badge-success, .badge-danger');
  console.log(
    '  .input, .table-container, .skeleton-shimmer, .press-scale, .hover-lift'
  );
  console.log(
    `\n${dim('💡 Learn more at')} ${cyan(
      'https://opensource.nofinite.com/nuicss'
    )}\n`
  );
}
