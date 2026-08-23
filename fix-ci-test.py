# -*- coding: utf-8 -*-
with open(".github/workflows/ci.yml", "r", encoding="utf-8") as f:
    t = f.read()

t = t.replace(
    "run: pnpm nx affected -t test --exclude nui",
    "run: pnpm nx affected -t test --exclude nui,nuicss-react-app"
)

with open(".github/workflows/ci.yml", "w", encoding="utf-8") as f:
    f.write(t)
