# Architecture Decision Records (ADRs) — Stack Monorepo

This directory records all significant architectural, cross-package, and infrastructure decisions for the **Nofinite Stack Monorepo** (`D:\stack`).

## ADR Standard Format

All decision records should be named `ADR-XXXX-<title>.md` and include:

1. **Title & Status**: Proposed, Accepted, Superceded, Deprecated
2. **Context**: What problem or requirement triggered this decision?
3. **Decision Drivers**: Performance, bundle size, developer experience, cross-repo consistency
4. **Options Evaluated**: Trade-offs between competing approaches
5. **Decision**: The selected architecture and rationale
6. **Consequences**: Positive, neutral, and negative outcomes

## Monorepo Invariants

- **ADR-0001**: Single Styling Engine Invariant — All CSS layout, tokens, and classes are authored exclusively in `packages/nuicss`. Downstream packages author zero independent CSS.
