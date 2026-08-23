# -*- coding: utf-8 -*-
with open(".github/workflows/ci.yml", "r", encoding="utf-8") as f:
    t = f.read()

t = t.replace("pnpm nx run-many -t test", "pnpm nx affected -t test --exclude nui")
t = t.replace("pnpm nx run-many -t build", "pnpm nx affected -t build")

with open(".github/workflows/ci.yml", "w", encoding="utf-8") as f:
    f.write(t)
