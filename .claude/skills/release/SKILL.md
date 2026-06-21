---
name: release
description: Release packages — commit unstaged work, bump semver, tag, and push. Usage - /release [patch|minor|major] [package-name]. Releases all packages if no package specified.
user-invocable: true
---

Bump the version of one or more packages in this monorepo following semver, then commit, tag, and push.

## Arguments

- `$ARGUMENTS` — expects `[patch|minor|major] [package-name]`
  - First arg: semver bump level (`patch`, `minor`, or `major`). Required.
  - Second arg: package name (e.g. `core`, `web-client`, `ui-xpnsio`). Optional — if omitted, bump ALL publishable packages.

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

List all directories under `packages/`. If a package name was given, match it (with or without `@handharr-labs/` prefix). If not, target all packages.

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
- All packages: `chore: bump all packages to x.y.z`

### 8. Create git tags

Tag the commit. Format:
- Single package: `@handharr-labs/{name}@x.y.z`
- All packages: one tag per package (`@handharr-labs/core@x.y.z`, `@handharr-labs/web-client@x.y.z`, etc.)

### 9. Push commits and tags

Run `git push && git push --tags` to push everything to remote.

### 10. Report

Print a summary:
```
Bumped:
  @handharr-labs/core: 0.1.0 → 0.2.0
  @handharr-labs/web-client: 0.1.0 → 0.2.0

Tags: @handharr-labs/core@0.2.0, @handharr-labs/web-client@0.2.0
Pushed to origin/main.
```

## Rules

- Never bump the root `package.json` version — it's private and not published.
- Never modify `package-lock.json` directly — run `npm install` after bumping if needed.
- If a package has `"private": true`, skip it unless explicitly named.
- Keep versions in sync across all publishable packages (when bumping all).
- Sync cross-references: workspace packages use `"*"` for internal deps, so do NOT update dependency versions when bumping.
