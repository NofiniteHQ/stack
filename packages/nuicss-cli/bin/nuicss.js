#!/usr/bin/env node

import('../dist/index.js')
  .then((m) => {
    return m.runCli();
  })
  .catch((err) => {
    console.error(`\n[NUICSS] ✖ Fatal Error: ${err?.message || err}\n`);
    process.exit(1);
  });
