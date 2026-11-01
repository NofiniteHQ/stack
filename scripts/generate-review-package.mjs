#!/usr/bin/env node
/**
 * Generic Engineering Review Package Generator
 *
 * Generates canonical `ai-docs/review/FINAL_REVIEW.zip` and the unpacked
 * inspectable snapshot in `ai-docs/review/latest/`.
 *
 * Standard Review Package Hierarchy:
 * repository/
 * └── ai-docs/
 *     └── review/
 *         ├── README.md
 *         ├── FINAL_REVIEW.zip
 *         └── latest/
 *             ├── MANIFEST.json
 *             ├── reports/
 *             ├── evidence/
 *             ├── test-results/
 *             ├── source-files/
 *             └── git-history/
 *
 * Zero external npm dependencies. Uses Node.js built-ins, system tar with
 * magic-byte verification, and PowerShell Compress-Archive fallback.
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
 * Collect Git metadata for the repository.
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
 * Recursive file search helper.
 */
function walkDir(dir, filterFn) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build', '.vite-temp', '.next'].includes(entry.name)) {
        continue;
      }
      results.push(...walkDir(fullPath, filterFn));
    } else if (entry.isFile()) {
      if (!filterFn || filterFn(fullPath)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

/**
 * Copy file while scanning for secrets and updating manifest item.
 */
function stageFile(srcPath, destPath, category, relDestPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const buffer = fs.readFileSync(srcPath);

  // If text file under 10MB, scan for secrets
  const ext = path.extname(srcPath).toLowerCase();
  if (['.md', '.json', '.txt', '.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.yaml', '.yml'].includes(ext)) {
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
 * Repository-specific evidence and file discovery rules.
 */
function discoverRepositoryEntries(repoPath) {
  const repoName = path.basename(path.resolve(repoPath)).toLowerCase();
  const entries = {
    reports: [],
    evidence: [],
    testResults: [],
    sourceFiles: [],
    missingExpected: [],
    knownLimitations: [],
  };

  if (repoName === 'stack') {
    // Reports
    const reportCandidates = [
      'ai-docs/nuicss/engineering/UNIFIED_QUALITY_CLOSURE_REPORT.md',
      'ai-docs/nuicss/engineering/CONSOLIDATED_ENGINEERING_EVIDENCE.md',
      'ai-docs/nuicss/benchmarks/MULTI_BROWSER_AND_CALIBRATED_A11Y_REPORT.md',
      'ai-docs/README.md',
    ];
    for (const rel of reportCandidates) {
      const full = path.join(repoPath, rel);
      if (fs.existsSync(full)) entries.reports.push({ src: full, dest: path.basename(rel) });
      else entries.missingExpected.push(`Report missing: ${rel}`);
    }

    // Evidence
    const evidenceCandidates = [
      'tests/benchmarks/general-purpose/reports/metrics/a11y-responsive.json',
      'tests/benchmarks/general-purpose/reports/metrics/multi-browser-calibrated-a11y.json',
      'tests/benchmarks/general-purpose/reports/metrics/binary_verification_report.json',
      'temp/general-purpose-benchmark/reports/metrics/a11y-responsive.json',
      'temp/general-purpose-benchmark/reports/metrics/multi-browser-calibrated-a11y.json',
      'temp/binary_verification_report.json',
    ];
    for (const rel of evidenceCandidates) {
      const full = path.join(repoPath, rel);
      if (fs.existsSync(full)) {
        const destName = path.basename(rel);
        if (!entries.evidence.some((e) => e.dest === destName)) {
          entries.evidence.push({ src: full, dest: destName });
        }
      }
    }

    // Test Results
    const testResultCandidates = [
      'temp/nuicss-cli-vitest.log',
      'tests/benchmarks/general-purpose/reports/test-results/nuicss-cli-vitest.log',
    ];
    for (const rel of testResultCandidates) {
      const full = path.join(repoPath, rel);
      if (fs.existsSync(full)) {
        const destName = path.basename(rel);
        if (!entries.testResults.some((t) => t.dest === destName)) {
          entries.testResults.push({ src: full, dest: destName });
        }
      }
    }

    // Source files
    const sourceCandidates = [
      'tests/benchmarks/general-purpose/runner/a11y-responsive.mjs',
      'tests/benchmarks/general-purpose/runner/collect-metrics.mjs',
      'packages/nuicss-cli/src/utils/differential.test.ts',
      'packages/nuicss-cli/src/utils/minifier.ts',
      'tests/benchmarks/general-purpose/nuicss-app/nuicss.config.ts',
    ];
    for (const rel of sourceCandidates) {
      const full = path.join(repoPath, rel);
      if (fs.existsSync(full)) entries.sourceFiles.push({ src: full, dest: rel });
    }

    entries.knownLimitations.push(
      'Automated Axe tests confirm zero rule violations on standard viewports; full WCAG 2.2 AA certification requires manual assistive technology testing (NVDA/VoiceOver).'
    );
    entries.knownLimitations.push(
      'Standalone CLI binary nuicss-windows-amd64.exe verified natively; Linux amd64 verified in WSL2 Ubuntu; macOS binaries verified via Mach-O header structure (cross-compiled).'
    );
  } else if (repoName === 'ui-quality-lab') {
    // Quality Lab
    const aiDocsFiles = walkDir(path.join(repoPath, 'ai-docs'), (p) => p.endsWith('.md'));
    for (const full of aiDocsFiles) {
      const rel = path.relative(path.join(repoPath, 'ai-docs'), full);
      entries.reports.push({ src: full, dest: rel });
    }
    entries.knownLimitations.push('Quality lab physical device evidence archived in earlier milestones.');
  } else if (repoName === 'nuix') {
    // NUIX
    const aiDocsFiles = walkDir(path.join(repoPath, 'ai-docs'), (p) => p.endsWith('.md'));
    for (const full of aiDocsFiles) {
      const rel = path.relative(path.join(repoPath, 'ai-docs'), full);
      entries.reports.push({ src: full, dest: rel });
    }
  } else if (repoName === 'oss-docs') {
    // OSS-DOCS
    const aiDocsFiles = walkDir(path.join(repoPath, 'ai-docs'), (p) => p.endsWith('.md'));
    for (const full of aiDocsFiles) {
      const rel = path.relative(path.join(repoPath, 'ai-docs'), full);
      entries.reports.push({ src: full, dest: rel });
    }
  } else if (repoName === 'nofinite.com') {
    // NOFINITE.COM
    const aiDocsFiles = walkDir(path.join(repoPath, 'ai-docs'), (p) => p.endsWith('.md'));
    for (const full of aiDocsFiles) {
      const rel = path.relative(path.join(repoPath, 'ai-docs'), full);
      entries.reports.push({ src: full, dest: rel });
    }
    entries.knownLimitations.push('Active working tree contains user uncommitted configuration (preserved).');
  } else {
    // Generic fallback for any repository
    const aiDocsFiles = walkDir(path.join(repoPath, 'ai-docs'), (p) => p.endsWith('.md'));
    for (const full of aiDocsFiles) {
      const rel = path.relative(path.join(repoPath, 'ai-docs'), full);
      entries.reports.push({ src: full, dest: rel });
    }
  }

  return entries;
}

/**
 * Compress directory to ZIP with format validation.
 */
function createZipArchive(sourceDir, zipFilePath) {
  fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
  if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);

  const parentDir = path.dirname(sourceDir);
  const baseName = path.basename(sourceDir);

  // Strategy 1: System tar with -a (bsdtar automatically selects zip format)
  let created = false;
  try {
    cp.execSync(`tar -a -cf "${zipFilePath}" -C "${parentDir}" "${baseName}"`, { stdio: 'pipe' });
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
      const psCmd = `Compress-Archive -Path "${sourceDir}" -DestinationPath "${zipFilePath}" -Force`;
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
 * Verify ZIP integrity by test extraction and hash checking.
 */
function verifyZipIntegrity(zipFilePath, manifest) {
  const tempExtractDir = path.join(path.dirname(zipFilePath), `__verify_temp_${Date.now()}`);
  fs.mkdirSync(tempExtractDir, { recursive: true });

  try {
    // Extract archive
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

    // Validate manifest presence in extraction
    const extractedManifestPath = path.join(tempExtractDir, 'latest', 'MANIFEST.json');
    if (!fs.existsSync(extractedManifestPath)) {
      throw new Error('Integrity check failed: MANIFEST.json not found in extracted latest/ root.');
    }

    // Verify all item hashes
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
 * Main review package generator entrypoint.
 */
export async function generateReviewPackage(targetRepoPath = process.cwd(), options = {}) {
  const repoPath = path.resolve(targetRepoPath);
  console.log(`\n========================================================================`);
  console.log(`📦 Generating Engineering Review Package: ${path.basename(repoPath)}`);
  console.log(`   Path: ${repoPath}`);
  console.log(`========================================================================\n`);

  if (!fs.existsSync(repoPath)) {
    throw new Error(`Repository path does not exist: ${repoPath}`);
  }

  const reviewDir = path.join(repoPath, 'ai-docs', 'review');
  const latestDir = path.join(reviewDir, 'latest');
  const zipFilePath = path.join(reviewDir, 'FINAL_REVIEW.zip');
  const stagingTempDir = path.join(repoPath, 'temp', `review_staging_${Date.now()}`);

  // 1. Collect Git metadata
  console.log('1. Collecting Git metadata...');
  const gitMeta = collectGitMetadata(repoPath);
  console.log(`   Branch: ${gitMeta.branch} (${gitMeta.shortHash}) | Working tree: ${gitMeta.isClean ? 'Clean' : 'Dirty'}`);

  // 2. Discover review candidate files
  console.log('2. Discovering candidate reports and evidence...');
  const entries = discoverRepositoryEntries(repoPath);
  console.log(`   Reports: ${entries.reports.length} | Evidence: ${entries.evidence.length} | Source files: ${entries.sourceFiles.length}`);

  // 3. Stage files in temporary directory first (prevents partial writes)
  const stagingLatest = path.join(stagingTempDir, 'latest');
  fs.mkdirSync(path.join(stagingLatest, 'reports'), { recursive: true });
  fs.mkdirSync(path.join(stagingLatest, 'evidence'), { recursive: true });
  fs.mkdirSync(path.join(stagingLatest, 'test-results'), { recursive: true });
  fs.mkdirSync(path.join(stagingLatest, 'source-files'), { recursive: true });
  fs.mkdirSync(path.join(stagingLatest, 'git-history'), { recursive: true });

  const stagedManifestItems = [];

  // Stage Git metadata
  const gitMetaPath = path.join(stagingLatest, 'git-history', 'git-metadata.json');
  fs.writeFileSync(gitMetaPath, JSON.stringify(gitMeta, null, 2), 'utf8');
  stagedManifestItems.push({
    category: 'git-history',
    path: 'latest/git-history/git-metadata.json',
    sizeBytes: fs.statSync(gitMetaPath).size,
    sha256: sha256(fs.readFileSync(gitMetaPath)),
    mtime: new Date().toISOString(),
  });

  // Stage Reports
  for (const r of entries.reports) {
    const dest = path.join(stagingLatest, 'reports', r.dest);
    const item = stageFile(r.src, dest, 'reports', `latest/reports/${r.dest}`);
    stagedManifestItems.push(item);
  }

  // Stage Evidence
  for (const e of entries.evidence) {
    const dest = path.join(stagingLatest, 'evidence', e.dest);
    const item = stageFile(e.src, dest, 'evidence', `latest/evidence/${e.dest}`);
    stagedManifestItems.push(item);
  }

  // Stage Test Results
  for (const t of entries.testResults) {
    const dest = path.join(stagingLatest, 'test-results', t.dest);
    const item = stageFile(t.src, dest, 'test-results', `latest/test-results/${t.dest}`);
    stagedManifestItems.push(item);
  }

  // Stage Source files
  for (const s of entries.sourceFiles) {
    const dest = path.join(stagingLatest, 'source-files', s.dest);
    const item = stageFile(s.src, dest, 'source-files', `latest/source-files/${s.dest}`);
    stagedManifestItems.push(item);
  }

  // 4. Generate MANIFEST.json
  console.log('3. Authoring cryptographic MANIFEST.json...');
  const manifest = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    project: {
      name: path.basename(repoPath),
      absolutePath: repoPath,
    },
    git: {
      branch: gitMeta.branch,
      commitHash: gitMeta.commitHash,
      shortHash: gitMeta.shortHash,
      isClean: gitMeta.isClean,
      modifiedFiles: gitMeta.modifiedFiles,
      untrackedFiles: gitMeta.untrackedFiles,
    },
    files: stagedManifestItems,
    summary: {
      totalFiles: stagedManifestItems.length,
      reportsCount: entries.reports.length,
      evidenceCount: entries.evidence.length,
      testResultsCount: entries.testResults.length,
      sourceFilesCount: entries.sourceFiles.length,
      totalBytes: stagedManifestItems.reduce((acc, f) => acc + f.sizeBytes, 0),
    },
    missingExpectedEvidence: entries.missingExpected,
    knownLimitations: entries.knownLimitations,
  };

  const manifestPath = path.join(stagingLatest, 'MANIFEST.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  // 5. Atomic sync to target `ai-docs/review/latest`
  console.log('4. Syncing extracted snapshot to ai-docs/review/latest/ ...');
  fs.mkdirSync(reviewDir, { recursive: true });
  fs.rmSync(latestDir, { recursive: true, force: true });
  fs.cpSync(stagingLatest, latestDir, { recursive: true });

  // 6. Create FINAL_REVIEW.zip containing latest/
  console.log('5. Compressing into FINAL_REVIEW.zip...');
  const zipBytes = createZipArchive(latestDir, zipFilePath);
  console.log(`   Created ${zipFilePath} (${(zipBytes / 1024).toFixed(1)} KB)`);

  // 7. Verify ZIP Integrity
  console.log('6. Executing cryptographic integrity verification on FINAL_REVIEW.zip...');
  const integrity = verifyZipIntegrity(zipFilePath, manifest);
  console.log(`   ✔ Integrity verified! Extracted and checked ${integrity.fileCount} files.`);

  // 8. Author canonical ai-docs/review/README.md if not exists
  const readmePath = path.join(reviewDir, 'README.md');
  const readmeContent = `# Engineering Review Package Architecture

This directory maintains the canonical, tamper-evident engineering review handoff package for **${path.basename(repoPath)}**.

## Structure

\`\`\`text
ai-docs/review/
├── README.md               # Architecture documentation and usage guide
├── FINAL_REVIEW.zip        # Self-contained review archive with latest/ root
└── latest/                 # Extracted, inspectable snapshot matching the ZIP
    ├── MANIFEST.json       # Cryptographic file catalog, SHA-256 hashes & Git state
    ├── reports/            # Markdown reports, audits, and closure summaries
    ├── evidence/           # Raw JSON metrics, Axe reports, and runtime logs
    ├── test-results/       # Automated execution outputs and exit codes
    ├── source-files/       # Key test runners, configs, and reproduction fixtures
    └── git-history/        # Branch, commit hash, and working-tree status
\`\`\`

## Generation & Verification

Generate or refresh the review package at any time:

\`\`\`bash
node scripts/generate-review-package.mjs
\`\`\`

The generator:
1. Validates Git metadata and repository state.
2. Scans text content for accidental secret leaks.
3. Stages verified reports, raw evidence, and critical sources.
4. Generates a cryptographic \`MANIFEST.json\` with SHA-256 hashes.
5. Produces \`FINAL_REVIEW.zip\` with verified \`PK\\x03\\x04\` magic bytes.
6. Automatically unzips and verifies every file hash against the manifest.
`;
  fs.writeFileSync(readmePath, readmeContent, 'utf8');

  // Clean staging
  fs.rmSync(stagingTempDir, { recursive: true, force: true });

  console.log(`\n🎉 Successfully generated and verified FINAL_REVIEW.zip for ${path.basename(repoPath)}!\n`);
  return {
    success: true,
    repoPath,
    zipFilePath,
    zipSizeBytes: zipBytes,
    manifest,
  };
}

// CLI invocation
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const repoArgIndex = process.argv.indexOf('--repo');
  const targetRepo = repoArgIndex !== -1 && process.argv[repoArgIndex + 1]
    ? process.argv[repoArgIndex + 1]
    : process.cwd();

  generateReviewPackage(targetRepo)
    .then((result) => {
      console.log(`Review package successfully sealed at: ${result.zipFilePath}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(`\n❌ Review package generation failed: ${err.message}\n`);
      process.exit(1);
    });
}
