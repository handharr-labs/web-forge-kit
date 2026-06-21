# Scaffold `web-forge-kit` shared-packages repo

**Date:** 2026-06-21
**Status:** In Progress

## Context

This repo is currently `nextjs-clean-arch`: a Next.js host app in `src/` (with an empty `src/features/`) plus an embedded `packages/core` (`@app/core`) that holds every shared primitive. The goal is to turn it into **`handharr-labs/web-forge-kit`** — a standalone repo of shared packages that downstream app repos install from GitHub Packages. The principle docs in `docs/principles/` already define the target package map; this plan makes the code match the docs.

**Decisions locked in:**
- Host app in `src/` → moved into a non-published **`playground/`** workspace (live test harness for the packages).
- Distribution → **GitHub Packages now**, scope `@handharr-labs`.
- Build only the packages with real content now: **`core` + `web-client`**. `web-server` / `ui-*` deferred until first needed.

**The split is verified safe:** `network/`, `storage/`, `file/` only import within their own folders (no imports from `primitives/utils/validation/...`), and the platform-agnostic folders never import the browser folders. No circular dependencies.

## Target structure

```
web-forge-kit/
  package.json                      # private root; workspaces: packages/*, playground
  tsconfig.base.json                # shared compiler options
  .npmrc                            # @handharr-labs:registry = GitHub Packages
  docs/
    initiatives/
    principles/
  packages/
    core/
      package.json                  # @handharr-labs/core  (no internal deps)
      tsconfig.json
      src/
        index.ts
        primitives/ utils/ validation/ events/ logger/ analytics/ env/ i18n/
    web-client/
      package.json                  # @handharr-labs/web-client  (deps: @handharr-labs/core)
      tsconfig.json
      src/
        index.ts
        network/ storage/ file/
  playground/
    package.json                    # private; Next.js host app for testing packages
    next.config.ts tsconfig.json
    src/app/ ...
```

## Folder → package mapping

| Current `packages/core/src/` folder | Destination |
|---|---|
| `primitives/ utils/ validation/ events/ logger/ analytics/ env/ i18n/` | `packages/core/src/` |
| `network/ storage/ file/` | `packages/web-client/src/` |

## Steps

1. **Write initiative doc** — this file.
2. **Create `web-client` package** — `packages/web-client/`, move `network/`, `storage/`, `file/` into its `src/`.
3. **Rescope `core`** — rename `@app/core` → `@handharr-labs/core`.
4. **Split `index.ts`** — partition the barrel into core-only and web-client-only exports.
5. **Publish config** — `publishConfig.registry = https://npm.pkg.github.com`, `files: ["src"]`.
6. **Root config** — update root `package.json`, extract `tsconfig.base.json`, create `.npmrc`.
7. **Move host app → `playground/`** — relocate `src/`, `next.config.ts` into `playground/`.
8. **Git + GitHub** — `git init`, initial commit. Repo rename and `gh repo create` left for user confirmation.

## Verification

- `npm install` resolves the workspace graph with no errors.
- `npm run type-check` passes in all workspaces.
- `npm run dev` from `playground/` boots and can import from both packages.
- `npm publish --dry-run` shows correct name, version, and `src/` included.

## Out of scope

`web-server` and `ui-*` packages, tsup/dist build pipeline, downstream app repos, and pushing to GitHub.
