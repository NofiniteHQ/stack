# -*- coding: utf-8 -*-
with open(".github/workflows/ci.yml", "r", encoding="utf-8") as f:
    t = f.read()

t = t.replace(
    "- name: Install dependencies\n        run: pnpm install --frozen-lockfile",
    "- name: Install dependencies\n        run: pnpm install --frozen-lockfile\n\n      - name: Set Nx SHAs\n        uses: nrwl/nx-set-shas@v4"
)

with open(".github/workflows/ci.yml", "w", encoding="utf-8") as f:
    f.write(t)
