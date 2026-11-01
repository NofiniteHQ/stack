# Engineering Review Package Architecture

This directory maintains the canonical, tamper-evident engineering review handoff package for **stack**.

## Structure

```text
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
```

## Generation & Verification

Generate or refresh the review package at any time:

```bash
node scripts/generate-review-package.mjs
```

The generator:

1. Validates Git metadata and repository state.
2. Scans text content for accidental secret leaks.
3. Stages verified reports, raw evidence, and critical sources.
4. Generates a cryptographic `MANIFEST.json` with SHA-256 hashes.
5. Produces `FINAL_REVIEW.zip` with verified `PK\x03\x04` magic bytes.
6. Automatically unzips and verifies every file hash against the manifest.
