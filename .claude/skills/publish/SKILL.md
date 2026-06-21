---
name: publish
description: Publish packages to GitHub Packages. Usage - /publish [package-name]. Publishes all publishable packages if no package specified.
user-invocable: true
---

Publish one or more packages to GitHub Packages (`npm.pkg.github.com`).

## Arguments

- `$ARGUMENTS` — optional package name (e.g. `core`, `web-client`, `ui-xpnsio`). If omitted, publish ALL publishable packages.

## Prerequisites

Publishing requires a `GITHUB_TOKEN` (or `NODE_AUTH_TOKEN`) with `write:packages` scope. Check if it's available:

```bash
echo $GITHUB_TOKEN
```

If not set, tell the user:
> Set your token before publishing:
> ```
> export GITHUB_TOKEN=ghp_your_token_here
> ```
> Or add `//npm.pkg.github.com/:_authToken=ghp_...` to `~/.npmrc`.

## Steps

### 1. Parse arguments

If a package name was given, match it under `packages/`. Otherwise, target all packages.

### 2. Verify publishable

For each target, check:
- `package.json` does NOT have `"private": true`.
- `publishConfig.registry` is set to `https://npm.pkg.github.com`.

Skip any package that fails these checks and warn the user.

### 3. Dry run first

Run `npm publish --dry-run` in each target package directory. Show the output so the user can verify the package name, version, and included files.

### 4. Confirm with the user

Ask: "Publish these packages? [list with versions]"

### 5. Publish

For each target, run:
```bash
npm publish --workspace packages/{name}
```

### 6. Report

Print a summary:
```
Published:
  @handharr-labs/core@0.1.1
  @handharr-labs/ui-xpnsio@0.1.1
  @handharr-labs/web-client@0.1.1

Registry: https://npm.pkg.github.com
```

## Rules

- Never publish the root `package.json` — it's private.
- Never publish a package with `"private": true` unless explicitly named and confirmed.
- Always dry-run before actual publish.
- Always confirm with the user before publishing.
- If a version is already published, `npm publish` will fail — tell the user to bump the version first (use `/release`).
