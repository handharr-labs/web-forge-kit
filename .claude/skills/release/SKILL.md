---
name: release
description: Release packages — commit unstaged work, bump semver, tag, push, and publish to GitHub Packages. Usage - /release [patch|minor|major] [package-name]. Auto-detects changed packages if no package specified.
user-invocable: true
---

Bump the version of one or more packages in this monorepo following semver, then commit, tag, push, and publish to GitHub Packages.

## Arguments

- `$ARGUMENTS` — expects `[patch|minor|major] [package-name]`
  - First arg: semver bump level (`patch`, `minor`, or `major`). Required.
  - Second arg: package name (e.g. `core`, `web-client`, `ui-xpnsio`). Optional — if omitted, auto-detect which packages have changes.

## Steps

### 1. Commit unstaged work first

Run `git status`. If there are any staged or unstaged changes (modified, added, or untracked files that belong to the project):

- Group related changes into logical chunks and create separate commits for each.
- Use descriptive commit messages that reflect what each chunk does.
- Do NOT bundle unrelated work into a single commit.
- If there are no changes, skip this step.

### 2. Parse arguments

Parse from `$ARGUMENTS`. If no bump level is provided, ask the user.

### 3. Identify target packages

List all directories under `packages/`.

- **If a package name was given:** match it (with or without `@handharr-labs/` prefix) and use that as the sole target.
- **If no package name was given:** auto-detect which packages have changes since the last release tag.

**Auto-detection logic:**

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

If no packages have changes, abort and report: `No packages have changes since their last release. Nothing to bump.`

### 4. Read current versions

Read `"version"` from each target's `package.json`.

### 5. Calculate new version

Apply the semver bump:
- `patch`: `0.1.0` → `0.1.1`
- `minor`: `0.1.0` → `0.2.0`
- `major`: `0.1.0` → `1.0.0`

### 6. Update package.json files

Change the `"version"` field in each target's `package.json`.

### 7. Commit the version bump

Stage only the bumped `package.json` files and commit:
- Single package: `chore: bump @handharr-labs/{name} to x.y.z`
- Multiple packages (same version): `chore: bump all packages to x.y.z`
- Multiple packages (different versions): `chore: bump packages {name1} to x.y.z, {name2} to x.y.z`

### 8. Create git tags

Tag the commit. Format:
- Single package: `@handharr-labs/{name}@x.y.z`
- All packages: one tag per package (`@handharr-labs/core@x.y.z`, `@handharr-labs/web-client@x.y.z`, etc.)

### 9. Push commits and tags

Run `git push && git push --tags` to push everything to remote.

### 10. Publish to GitHub Packages

Check if `GITHUB_TOKEN` (or `NODE_AUTH_TOKEN`) is set. If not, warn the user and skip publishing:
> Token not found. Run `export GITHUB_TOKEN=ghp_...` and then `/publish` to publish manually.

If the token is available, for each bumped package:
```bash
npm publish --workspace packages/{name}
```

### 11. Report

Print a summary:
```
Bumped:
  @handharr-labs/core: 0.1.0 → 0.2.0
  @handharr-labs/web-client: 0.1.0 → 0.2.0

Tags: @handharr-labs/core@0.2.0, @handharr-labs/web-client@0.2.0
Published to https://npm.pkg.github.com
Pushed to origin/main.
```

## Rules

- Never bump the root `package.json` version — it's private and not published.
- Never modify `package-lock.json` directly — run `npm install` after bumping if needed.
- If a package has `"private": true`, skip it unless explicitly named.
- Do NOT force-sync versions across packages — each package is bumped independently based on its own changes.
- Sync cross-references: workspace packages use `"*"` for internal deps, so do NOT update dependency versions when bumping.
