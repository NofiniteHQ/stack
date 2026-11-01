#!/usr/bin/env node
/**
 * Consolidated Engineering Review Package Generator
 *
 * Generates the canonical, tamper-evident engineering review archive:
 * `ai-docs/FINAL_REVIEW.zip` (placed in `ai-docs/` root, alongside `FINAL_MISSION_RECONCILIATION.md`).
 *
 * Archive Root Hierarchy (NO wrapper directories):
 * FINAL_REVIEW.zip
 * ├── MANIFEST.json       # Cryptographic file catalog, SHA-256 hashes & multi-repo Git state
 * ├── reports/            # Reconciliations, Markdown audits, and closure summaries
 * ├── evidence/           # Raw JSON metrics, Axe reports, and runtime logs
 * ├── test-results/       # Automated execution outputs and test runner logs
 * ├── source-files/       # Key test runners, configs, and reproduction fixtures
 * └── git-history/        # Branch, commit hash, and working-tree status per repository
 *
 * In-Scope Repositories:
 * - D:\stack (Engineering core, NUICSS, CLI, benchmarks)
 * - D:\ui-quality-lab (Quality validation environment)
 * - D:\nuix (Internal documentation & HTMX architecture)
 * - D:\oss-docs (Public documentation)
 *
 * Explicit Exclusions:
 * - D:\nofinite.com (Strictly excluded from packaging)
 *
 * Zero external npm dependencies. Uses Node.js built-ins, system tar with
 * magic-byte verification (PK\x03\x04), and PowerShell Compress-Archive fallback.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security: Patterns that trigger hard abort if detected in text files
const SECRET_PATTERNS = [
  { name: 'Private Key', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'AWS Access Key ID', regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'GitHub Token', regex: /\bgh[pousr]_[A-Za-z0-9_]{36,255}\b/ },
  { name: 'OpenAI/Anthropic Secret Key', regex: /\bsk-(?:live|ant)?[a-zA-Z0-9_\-]{32,}\b/ },
  { name: 'Generic Password Assignment', regex: /["']?password["']?\s*[:=]\s*["'][^"']{8,}["']/i },
  { name: 'Hardcoded Bearer Token', regex: /bearer\s+[a-zA-Z0-9_\-\.]{32,}/i },
];

const SAFE_PLACEHOLDERS = ['placeholder', 'example', 'dummy', 'test', 'fake', 'secret_here', 'todo'];

/**
 * Calculate SHA-256 hash of a file buffer or string.
 */
function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Validate that an archive buffer matches the standard ZIP file format (PK\x03\x04).
 */
function isValidZip(buffer) {
  return buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04;
}

/**
 * Scan text file content for exposed credentials.
 */
function scanContentForSecrets(content, relPath) {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.regex.test(content)) {
      const isPlaceholder = SAFE_PLACEHOLDERS.some((p) => content.toLowerCase().includes(p));
      if (!isPlaceholder) {
        throw new Error(
          `SECURITY VIOLATION: Potential ${pattern.name} detected in ${relPath}. Packaging aborted.`
        );
      }
    }
  }
}

/**
 * Safely execute Git command and return stdout string.
 */
function git(repoPath, args) {
  try {
    return cp.execFileSync('git', ['-C', repoPath, ...args], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    return null;
  }
}

/**
 * Collect Git metadata for a repository.
 */
function collectGitMetadata(repoPath) {
  const branch = git(repoPath, ['rev-parse', '--abbrev-ref', 'HEAD']) || 'unknown';
  const commitHash = git(repoPath, ['rev-parse', 'HEAD']) || 'unknown';
  const shortHash = git(repoPath, ['rev-parse', '--short', 'HEAD']) || 'unknown';
  const statusOutput = git(repoPath, ['status', '--porcelain']) || '';
  const isClean = statusOutput.trim().length === 0;
  const recentLog = git(repoPath, ['log', '-5', '--oneline']) || '';

  const modifiedFiles = [];
  const untrackedFiles = [];
  if (!isClean) {
    for (const rawLine of statusOutput.split('\n')) {
      if (!rawLine || rawLine.length < 4) continue;
      const code = rawLine.slice(0, 2);
      const file = rawLine.slice(3).trim();
      if (code.includes('?')) {
        untrackedFiles.push(file);
      } else {
        modifiedFiles.push(file);
      }
    }
  }

  return {
    repoName: path.basename(path.resolve(repoPath)),
    repoPath: path.resolve(repoPath),
    branch,
    commitHash,
    shortHash,
    isClean,
    modifiedFiles,
    untrackedFiles,
    recentLog: recentLog.split('\n').filter(Boolean),
  };
}

/**
 * Copy file while scanning for secrets and updating manifest item.
 */
function stageFile(srcPath, destPath, category, relDestPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const buffer = fs.readFileSync(srcPath);

  // If text file under 10MB, scan for secrets
  const ext = path.extname(srcPath).toLowerCase();
  if (['.md', '.json', '.txt', '.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.yaml', '.yml', '.log'].includes(ext)) {
    if (buffer.length < 10 * 1024 * 1024) {
      scanContentForSecrets(buffer.toString('utf8'), relDestPath);
    }
  }

  fs.writeFileSync(destPath, buffer);
  const stat = fs.statSync(destPath);
  return {
    category,
    path: relDestPath.replace(/\\/g, '/'),
    sizeBytes: stat.size,
    sha256: sha256(buffer),
    mtime: stat.mtime.toISOString(),
  };
}

/**
 * Compress the contents of a directory into a root-level ZIP archive.
 * Direct contents of sourceDir become root entries in the archive.
 */
function createRootZipArchive(sourceDir, zipFilePath) {
  fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
  if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);

  let created = false;

  // Strategy 1: System tar with -a -C sourceDir . (bsdtar automatically writes zip format without top-level dir)
  try {
    cp.execSync(`tar -a -cf "${zipFilePath}" -C "${sourceDir}" .`, { stdio: 'pipe' });
    if (fs.existsSync(zipFilePath)) {
      const buf = fs.readFileSync(zipFilePath);
      if (isValidZip(buf)) {
        created = true;
      }
    }
  } catch (err) {
    // Fallback to strategy 2
  }

  // Strategy 2: PowerShell Compress-Archive on Windows
  if (!created && process.platform === 'win32') {
    try {
      const psCmd = `Compress-Archive -Path '${sourceDir}/*' -DestinationPath '${zipFilePath}' -Force`;
      cp.execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'pipe' });
      if (fs.existsSync(zipFilePath)) {
        const buf = fs.readFileSync(zipFilePath);
        if (isValidZip(buf)) {
          created = true;
        }
      }
    } catch (err) {
      // Failed strategy 2
    }
  }

  if (!created || !fs.existsSync(zipFilePath)) {
    throw new Error('ZIP generation failed: neither tar nor PowerShell created a valid ZIP archive (magic bytes PK\\x03\\x04 missing).');
  }

  const finalBuf = fs.readFileSync(zipFilePath);
  if (!isValidZip(finalBuf)) {
    throw new Error('ZIP format validation failed: archive does not begin with standard ZIP magic bytes PK\\x03\\x04.');
  }

  return finalBuf.length;
}

/**
 * Verify ZIP integrity by test extraction into a temporary folder and verifying all SHA-256 hashes.
 */
function verifyZipIntegrity(zipFilePath, manifest) {
  const tempExtractDir = path.join(path.dirname(zipFilePath), `__verify_temp_${Date.now()}`);
  fs.mkdirSync(tempExtractDir, { recursive: true });

  try {
    let extracted = false;
    try {
      cp.execSync(`tar -xf "${zipFilePath}" -C "${tempExtractDir}"`, { stdio: 'pipe' });
      extracted = true;
    } catch {
      if (process.platform === 'win32') {
        const psCmd = `Expand-Archive -Path "${zipFilePath}" -DestinationPath "${tempExtractDir}" -Force`;
        cp.execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'pipe' });
        extracted = true;
      }
    }

    if (!extracted) {
      throw new Error('Failed to extract ZIP archive for integrity verification.');
    }

    // Verify MANIFEST.json presence at archive root
    const extractedManifestPath = path.join(tempExtractDir, 'MANIFEST.json');
    if (!fs.existsSync(extractedManifestPath)) {
      throw new Error('Integrity check failed: MANIFEST.json not found directly at root of extracted archive.');
    }

    // Verify all staged items
    for (const item of manifest.files) {
      const extractedItemPath = path.join(tempExtractDir, item.path);
      if (!fs.existsSync(extractedItemPath)) {
        throw new Error(`Integrity check failed: missing file ${item.path} in extracted archive.`);
      }
      const itemBuffer = fs.readFileSync(extractedItemPath);
      const computedHash = sha256(itemBuffer);
      if (computedHash !== item.sha256) {
        throw new Error(
          `Integrity check failed: SHA-256 mismatch for ${item.path}. Expected ${item.sha256}, got ${computedHash}`
        );
      }
    }

    return { verified: true, fileCount: manifest.files.length };
  } finally {
    fs.rmSync(tempExtractDir, { recursive: true, force: true });
  }
}

/**
 * Main consolidated review package generator.
 */
export async function generateConsolidatedReviewPackage() {
  const stackRoot = path.resolve('D:/stack');
  const qualityLabRoot = path.resolve('D:/ui-quality-lab');
  const nuixRoot = path.resolve('D:/nuix');
  const ossDocsRoot = path.resolve('D:/oss-docs');

  console.log(`\n========================================================================`);
  console.log(`📦 Generating Consolidated Engineering Review Package`);
  console.log(`   Destination: ${path.join(stackRoot, 'ai-docs', 'FINAL_REVIEW.zip')}`);
  console.log(`========================================================================\n`);

  const outputZipPath = path.join(stackRoot, 'ai-docs', 'FINAL_REVIEW.zip');
  const stagingDir = path.join(stackRoot, 'temp', `review_staging_${Date.now()}`);

  fs.mkdirSync(path.join(stagingDir, 'reports'), { recursive: true });
  fs.mkdirSync(path.join(stagingDir, 'evidence'), { recursive: true });
  fs.mkdirSync(path.join(stagingDir, 'test-results'), { recursive: true });
  fs.mkdirSync(path.join(stagingDir, 'source-files'), { recursive: true });
  fs.mkdirSync(path.join(stagingDir, 'git-history'), { recursive: true });

  const stagedManifestItems = [];

  // 1. Collect Multi-Repo Git Metadata
  console.log('1. Collecting multi-repo Git metadata...');
  const multiRepoMeta = {
    collectedAt: new Date().toISOString(),
    inScope: {
      stack: collectGitMetadata(stackRoot),
      uiQualityLab: collectGitMetadata(qualityLabRoot),
      nuix: collectGitMetadata(nuixRoot),
      ossDocs: collectGitMetadata(ossDocsRoot),
    },
    excluded: {
      'nofinite.com': {
        status: 'EXCLUDED_FROM_SCOPE',
        reason: 'Explicitly instructed by user to omit nofinite.com from inspection and review package.',
      },
    },
  };

  const gitMetaPath = path.join(stagingDir, 'git-history', 'git-metadata.json');
  fs.writeFileSync(gitMetaPath, JSON.stringify(multiRepoMeta, null, 2), 'utf8');
  stagedManifestItems.push({
    category: 'git-history',
    path: 'git-history/git-metadata.json',
    sizeBytes: fs.statSync(gitMetaPath).size,
    sha256: sha256(fs.readFileSync(gitMetaPath)),
    mtime: new Date().toISOString(),
  });

  // 2. Discover and stage Reports
  console.log('2. Staging reports...');
  const reportCandidates = [
    { src: path.join(stackRoot, 'ai-docs/FINAL_MISSION_RECONCILIATION.md'), dest: 'FINAL_MISSION_RECONCILIATION.md' },
    { src: path.join(stackRoot, 'ai-docs/nuicss/engineering/UNIFIED_QUALITY_CLOSURE_REPORT.md'), dest: 'UNIFIED_QUALITY_CLOSURE_REPORT.md' },
    { src: path.join(stackRoot, 'ai-docs/nuicss/engineering/CONSOLIDATED_ENGINEERING_EVIDENCE.md'), dest: 'CONSOLIDATED_ENGINEERING_EVIDENCE.md' },
    { src: path.join(stackRoot, 'ai-docs/nuicss/benchmarks/MULTI_BROWSER_AND_CALIBRATED_A11Y_REPORT.md'), dest: 'MULTI_BROWSER_AND_CALIBRATED_A11Y_REPORT.md' },
    { src: path.join(stackRoot, 'ai-docs/README.md'), dest: 'stack-ai-docs-README.md' },
    { src: path.join(qualityLabRoot, 'ai-docs/FINAL_AUDIT_REPORT.md'), dest: 'quality-lab-FINAL_AUDIT_REPORT.md' },
    { src: path.join(qualityLabRoot, 'ai-docs/REMEDIATION_EVIDENCE_MAP.md'), dest: 'quality-lab-REMEDIATION_EVIDENCE_MAP.md' },
    { src: path.join(qualityLabRoot, 'ai-docs/MISSION_QUALITY_AUDIT.md'), dest: 'quality-lab-MISSION_QUALITY_AUDIT.md' },
    { src: path.join(nuixRoot, 'ai-docs/NUICONS_MIGRATION_AUDIT.md'), dest: 'nuix-NUICONS_MIGRATION_AUDIT.md' },
    { src: path.join(ossDocsRoot, 'ai-docs/DOCS_STANDARDIZATION_AUDIT.md'), dest: 'oss-docs-DOCS_STANDARDIZATION_AUDIT.md' },
  ];

  for (const r of reportCandidates) {
    if (fs.existsSync(r.src)) {
      const dest = path.join(stagingDir, 'reports', r.dest);
      stagedManifestItems.push(stageFile(r.src, dest, 'reports', `reports/${r.dest}`));
    }
  }

  // 3. Discover and stage Evidence
  console.log('3. Staging raw evidence...');
  const evidenceCandidates = [
    { src: path.join(stackRoot, 'tests/benchmarks/general-purpose/reports/metrics/a11y-responsive.json'), dest: 'a11y-responsive.json' },
    { src: path.join(stackRoot, 'tests/benchmarks/general-purpose/reports/metrics/multi-browser-calibrated-a11y.json'), dest: 'multi-browser-calibrated-a11y.json' },
    { src: path.join(stackRoot, 'tests/benchmarks/general-purpose/reports/metrics/binary_verification_report.json'), dest: 'binary_verification_report.json' },
    { src: path.join(qualityLabRoot, 'fixtures/consumer-sandbox/cross-package-report.json'), dest: 'consumer-cross-package-report.json' },
    { src: path.join(qualityLabRoot, 'fixtures/consumer-sandbox/verification-report.json'), dest: 'consumer-verification-report.json' },
  ];

  for (const e of evidenceCandidates) {
    if (fs.existsSync(e.src)) {
      const dest = path.join(stagingDir, 'evidence', e.dest);
      stagedManifestItems.push(stageFile(e.src, dest, 'evidence', `evidence/${e.dest}`));
    }
  }

  // 4. Discover and stage Test Results
  console.log('4. Staging test results...');
  const testResultCandidates = [
    { src: path.join(stackRoot, 'temp/nuicss-cli-vitest.log'), dest: 'nuicss-cli-vitest.log' },
    { src: path.join(stackRoot, 'tests/benchmarks/general-purpose/reports/test-results/nuicss-cli-vitest.log'), dest: 'nuicss-cli-vitest.log' },
    { src: path.join(stackRoot, 'temp/quality-lab-unit-tests.log'), dest: 'quality-lab-unit-tests.log' },
    { src: path.join(stackRoot, 'temp/quality-lab-consumer.log'), dest: 'quality-lab-consumer.log' },
    { src: path.join(stackRoot, 'temp/quality-lab-build.log'), dest: 'quality-lab-build.log' },
  ];

  for (const t of testResultCandidates) {
    if (fs.existsSync(t.src)) {
      const dest = path.join(stagingDir, 'test-results', t.dest);
      if (!stagedManifestItems.some((item) => item.path === `test-results/${t.dest}`)) {
        stagedManifestItems.push(stageFile(t.src, dest, 'test-results', `test-results/${t.dest}`));
      }
    }
  }

  // 5. Discover and stage Source Files
  console.log('5. Staging source and test harness files...');
  const sourceCandidates = [
    { src: path.join(stackRoot, 'tests/benchmarks/general-purpose/runner/a11y-responsive.mjs'), dest: 'a11y-responsive.mjs' },
    { src: path.join(stackRoot, 'tests/benchmarks/general-purpose/runner/collect-metrics.mjs'), dest: 'collect-metrics.mjs' },
    { src: path.join(stackRoot, 'packages/nuicss-cli/src/utils/differential.test.ts'), dest: 'differential.test.ts' },
    { src: path.join(stackRoot, 'packages/nuicss-cli/src/utils/minifier.ts'), dest: 'minifier.ts' },
    { src: path.join(stackRoot, 'tests/benchmarks/general-purpose/nuicss-app/nuicss.config.ts'), dest: 'nuicss.config.ts' },
    { src: path.join(stackRoot, 'packages/nuicss/src/styles/theme.css'), dest: 'nuicss-theme.css' },
    { src: path.join(qualityLabRoot, 'tests/visual/token-harmony.test.ts'), dest: 'token-harmony.test.ts' },
  ];

  for (const s of sourceCandidates) {
    if (fs.existsSync(s.src)) {
      const dest = path.join(stagingDir, 'source-files', s.dest);
      stagedManifestItems.push(stageFile(s.src, dest, 'source-files', `source-files/${s.dest}`));
    }
  }

  // 6. Generate cryptographic MANIFEST.json at root
  console.log('6. Authoring cryptographic MANIFEST.json...');
  const manifest = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    scope: {
      inScopeRepositories: ['stack', 'ui-quality-lab', 'nuix', 'oss-docs'],
      excludedRepositories: ['nofinite.com'],
    },
    git: multiRepoMeta,
    files: stagedManifestItems,
    summary: {
      totalFiles: stagedManifestItems.length,
      reportsCount: stagedManifestItems.filter((f) => f.category === 'reports').length,
      evidenceCount: stagedManifestItems.filter((f) => f.category === 'evidence').length,
      testResultsCount: stagedManifestItems.filter((f) => f.category === 'test-results').length,
      sourceFilesCount: stagedManifestItems.filter((f) => f.category === 'source-files').length,
      gitHistoryCount: stagedManifestItems.filter((f) => f.category === 'git-history').length,
      totalBytes: stagedManifestItems.reduce((acc, f) => acc + f.sizeBytes, 0),
    },
    knownLimitations: [
      'Automated Axe tests confirm zero rule violations on standard viewports; full WCAG 2.2 AA certification requires manual assistive technology testing (NVDA/VoiceOver).',
      'Standalone CLI binary nuicss-windows-amd64.exe verified natively; Linux amd64 verified in WSL2 Ubuntu; macOS binaries verified via Mach-O header structure (cross-compiled).',
      'D:\\nofinite.com was explicitly excluded from the mission scope per user instructions.',
    ],
  };

  const manifestPath = path.join(stagingDir, 'MANIFEST.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  // 7. Compress into FINAL_REVIEW.zip directly in ai-docs/
  console.log(`7. Compressing directly into ${outputZipPath} (without wrapper directories)...`);
  const zipBytes = createRootZipArchive(stagingDir, outputZipPath);
  console.log(`   Created ${outputZipPath} (${(zipBytes / 1024).toFixed(1)} KB)`);

  // 8. Verify ZIP Integrity
  console.log('8. Executing cryptographic integrity verification on FINAL_REVIEW.zip...');
  const integrity = verifyZipIntegrity(outputZipPath, manifest);
  console.log(`   ✔ Integrity verified! Extracted and verified ${integrity.fileCount} files.`);

  // Clean staging
  fs.rmSync(stagingDir, { recursive: true, force: true });

  console.log(`\n🎉 Successfully sealed FINAL_REVIEW.zip!\n`);
  return {
    success: true,
    outputZipPath,
    zipSizeBytes: zipBytes,
    manifest,
  };
}

// CLI invocation
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  generateConsolidatedReviewPackage()
    .then((result) => {
      console.log(`Review package successfully sealed at: ${result.outputZipPath}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(`\n❌ Review package generation failed: ${err.message}\n`);
      process.exit(1);
    });
}
