import fs from 'node:fs';
import path from 'node:path';
import { bold, cyan, green, yellow, dim } from 'colorette';
import { VERSION } from '../index.js';

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  name?: string;
  assets: GitHubAsset[];
}

export interface UpgradeOptions {
  check?: boolean;
}

function parseSemVer(versionStr: string): number[] {
  const clean = versionStr.replace(/^[^\d]*/, '');
  return clean.split('.').map((p) => parseInt(p, 10) || 0);
}

function isNewer(latest: string, current: string): boolean {
  const [lMaj = 0, lMin = 0, lPat = 0] = parseSemVer(latest);
  const [cMaj = 0, cMin = 0, cPat = 0] = parseSemVer(current);

  if (lMaj !== cMaj) return lMaj > cMaj;
  if (lMin !== cMin) return lMin > cMin;
  return lPat > cPat;
}

function getTargetBinaryName(): string {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === 'win32') {
    return 'nuicss-windows-amd64.exe';
  }
  if (platform === 'darwin') {
    return arch === 'arm64' ? 'nuicss-darwin-arm64' : 'nuicss-darwin-amd64';
  }
  if (platform === 'linux') {
    return arch === 'arm64' ? 'nuicss-linux-arm64' : 'nuicss-linux-amd64';
  }
  return '';
}

export async function upgradeCommand(
  options: UpgradeOptions = {}
): Promise<void> {
  console.log(
    `\n${bold(cyan('[NUICSS]'))} Checking for latest releases on GitHub...`
  );

  let release: GitHubRelease;
  try {
    const res = await fetch(
      'https://api.github.com/repos/NofiniteHQ/stack/releases/latest',
      {
        headers: {
          'User-Agent': 'nuicss-cli',
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (res.status === 404) {
      console.log(
        `\n${yellow(
          'ℹ'
        )} No published GitHub releases found yet for NofiniteHQ/stack.`
      );
      console.log(`  Current version is: ${bold(cyan(`v${VERSION}`))}\n`);
      return;
    }

    if (!res.ok) {
      throw new Error(`GitHub API responded with status ${res.status}`);
    }

    release = (await res.json()) as GitHubRelease;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      `\n${yellow('⚠')} Could not fetch latest release info: ${msg}`
    );
    console.log(`  Current version: ${bold(cyan(`v${VERSION}`))}\n`);
    return;
  }

  const rawTag = release.tag_name || '';
  const latestVersion = rawTag.replace(/^[^\d]*/, '');

  if (!isNewer(latestVersion, VERSION)) {
    console.log(
      `\n${bold(green('✓'))} You are already on the latest version (${bold(
        cyan(`v${VERSION}`)
      )}).\n`
    );
    return;
  }

  console.log(
    `\n${bold(green('✦'))} New version available: ${dim(
      `v${VERSION}`
    )} ➔ ${bold(green(`v${latestVersion}`))}`
  );

  if (options.check) {
    console.log(
      `Run ${cyan('nuicss upgrade')} to automatically install the update.\n`
    );
    return;
  }

  // Detect whether running as a standalone binary or via Node/npm
  const execPath = process.execPath;
  const scriptPath = process.argv[1] || '';
  const isNode =
    scriptPath.endsWith('.js') ||
    scriptPath.endsWith('.ts') ||
    execPath.toLowerCase().includes('node');

  if (isNode) {
    console.log(
      `\n${yellow('ℹ')} Detected execution via Node / npm package manager.`
    );
    console.log(bold('To upgrade your globally installed package, run:'));
    console.log(`  ${cyan('npm install -g nuicss@latest')}`);
    console.log(`  ${dim('or:')} ${cyan('pnpm add -g nuicss@latest')}\n`);
    return;
  }

  // Standalone binary self-update
  const targetAssetName = getTargetBinaryName();
  if (!targetAssetName) {
    console.error(
      `\n${yellow('✖')} Unsupported operating system / architecture: ${
        process.platform
      } ${process.arch}\n`
    );
    process.exitCode = 1;
    return;
  }

  const asset = release.assets?.find((a) => a.name === targetAssetName);
  if (!asset || !asset.browser_download_url) {
    console.error(
      `\n${yellow('✖')} Could not find binary asset ${cyan(
        targetAssetName
      )} in release ${rawTag}.\n`
    );
    process.exitCode = 1;
    return;
  }

  console.log(`  Downloading ${cyan(targetAssetName)}...`);
  try {
    const downloadRes = await fetch(asset.browser_download_url, {
      headers: {
        'User-Agent': 'nuicss-cli',
      },
    });

    if (!downloadRes.ok) {
      throw new Error(`Download failed with status ${downloadRes.status}`);
    }

    const arrayBuffer = await downloadRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const currentExe = process.execPath;
    const isWindows = process.platform === 'win32';

    if (isWindows) {
      const oldExe = currentExe + '.old';
      if (fs.existsSync(oldExe)) {
        try {
          fs.unlinkSync(oldExe);
        } catch {
          // Ignore if locked
        }
      }
      fs.renameSync(currentExe, oldExe);
      fs.writeFileSync(currentExe, buffer);
    } else {
      const tempExe = path.join(
        path.dirname(currentExe),
        `.nuicss-tmp-${Date.now()}`
      );
      fs.writeFileSync(tempExe, buffer, { mode: 0o755 });
      fs.renameSync(tempExe, currentExe);
      fs.chmodSync(currentExe, 0o755);
    }

    console.log(
      `\n${bold(green('✓'))} Successfully upgraded ${bold(
        cyan('nuicss')
      )} to ${bold(green(`v${latestVersion}`))}\n`
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n${yellow('✖')} Failed to perform self-update: ${msg}\n`);
    process.exitCode = 1;
  }
}
