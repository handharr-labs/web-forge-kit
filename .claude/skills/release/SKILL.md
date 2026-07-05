---
name: release
description: Release repo and packages — commit unstaged work, bump semver, tag, push, and publish to GitHub Packages. Usage - /release [patch|minor|major]. Repo bump level is required. Each changed package is asked individually for its bump level.
user-invocable: true
---

Bump the version of the repo and one or more packages in this monorepo following semver, then commit, tag, push, and publish to GitHub Packages.

## Arguments

- `$ARGUMENTS` — expects `[patch|minor|major]`
  - The semver bump level for the **repo-level tag** (e.g. `v0.3.0`). Required.
  - Each changed **package** is asked individually — the repo level is not applied to packages.

## Steps

### 1. Commit unstaged work first

Run `git status`. If there are any staged or unstaged changes (modified, added, or untracked files that belong to the project):

- Group related changes into logical chunks and create separate commits for each.
- Use descriptive commit messages that reflect what each chunk does.
- Do NOT bundle unrelated work into a single commit.
- If there are no changes, skip this step.

### 2. Parse arguments

Parse the bump level from `$ARGUMENTS`. If no bump level is provided, ask the user:
> What bump level for the repo tag? [patch/minor/major]

### 3. Identify changed packages

List all directories under `packages/`.

For each package, find its most recent git tag using:
```bash
git tag --list "@handharr-labs/{name}@*" --sort=-version:refname | head -1
```

Then check if any files under `packages/{name}/` changed since that tag:
```bash
git diff --name-only {last-tag}..HEAD -- packages/{name}/
```

- If changes are found → include the package.
- If no tag exists for the package → include it (treat as never released).
- If no changes since last tag → skip it.

If no packages have changes, skip the package release steps and proceed to the repo tag only.

### 4. Ask per-package bump level

For each changed package, present a summary and ask individually:

```
Detected changes in N package(s):

  @handharr-labs/forge-ui-base-gold   (0.2.1)
  @handharr-labs/forge-ui-base-bronze (0.1.0)
  @handharr-labs/forge-ui-base-silver (0.2.0)

For each package, what bump level should be applied? [patch/minor/major]
  @handharr-labs/forge-ui-base-gold:   _
  @handharr-labs/forge-ui-base-bronze: _
  @handharr-labs/forge-ui-base-silver: _
```

Wait for the user's answers before proceeding.

### 5. Read current versions

Read `"version"` from each target package's `package.json`.

### 6. Calculate new versions

Apply each package's chosen semver bump:
- `patch`: `0.1.0` → `0.1.1`
- `minor`: `0.1.0` → `0.2.0`
- `major`: `0.1.0` → `1.0.0`

### 7. Update package.json files

Change the `"version"` field in each target package's `package.json`.

### 8. Commit the version bumps

Stage only the bumped `package.json` files and commit:
- Single package: `chore: bump @handharr-labs/{name} to x.y.z`
- Multiple packages (same version): `chore: bump all packages to x.y.z`
- Multiple packages (different versions): `chore: bump packages — {name1} to x.y.z, {name2} to x.y.z`

### 9. Create git tags

**Package tags** — one tag per bumped package:
```
@handharr-labs/{name}@x.y.z
```

**Repo tag** — read the most recent repo-level tag (format `v*`) to get the current repo version, then apply the bump level from Step 2:
```bash
git tag --list "v*" --sort=-version:refname | head -1
```
If no repo tag exists, start from `v0.0.0` and apply the bump.

Tag format: `v{x.y.z}`

### 10. Push commits and tags

Run `git push && git push --tags` to push everything to remote.

### 11. Publish to GitHub Packages

Check if `GITHUB_TOKEN` (or `NODE_AUTH_TOKEN`) is set. If not, warn the user and skip publishing:
> Token not found. Run `export GITHUB_TOKEN=ghp_...` and then `/publish` to publish manually.

If the token is available, for each bumped package:
```bash
npm publish --workspace packages/{name}
```

### 12. Report

Print a summary:
```
Repo tag: v0.2.0 → v0.3.0

Packages bumped:
  @handharr-labs/forge-ui-base-gold:   0.2.1 → 0.3.0  (minor)
  @handharr-labs/forge-ui-base-bronze: 0.1.0 → 0.1.1  (patch)
  @handharr-labs/forge-ui-base-silver: 0.2.0 → 0.3.0  (minor)

Tags: v0.3.0, @handharr-labs/forge-ui-base-gold@0.3.0, @handharr-labs/forge-ui-base-bronze@0.1.1, @handharr-labs/forge-ui-base-silver@0.3.0
Published to https://npm.pkg.github.com
Pushed to origin/main.
```

## Rules

- Never bump the root `package.json` version — it's private and not published.
- Never modify `package-lock.json` directly — run `npm install` after bumping if needed.
- If a package has `"private": true`, skip it unless explicitly named.
- Do NOT force-sync versions across packages — each package is bumped independently.
- Sync cross-references: workspace packages use `"*"` for internal deps, so do NOT update dependency versions when bumping.
- The repo-level tag (`v*`) is independent of any package version — it tracks the overall state of the monorepo.
