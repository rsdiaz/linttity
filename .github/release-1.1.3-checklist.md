# Release 1.1.3 Checklist

This playbook prepares and publishes `linttity@1.1.3` safely.

## 1. Preflight

Run from repository root:

```bash
npm run format:check
npm run build
npm run lint
npm test
```

Expected: all commands exit with code `0`.

Or run everything with one command:

```bash
npm run release:check
```

## 2. Update version and changelog

1. Bump patch version:

```bash
npm version 1.1.3 --no-git-tag-version
```

2. Add a new `## [1.1.3] - YYYY-MM-DD` section in `CHANGELOG.md`.

## 3. Final package validation

```bash
npm pack --dry-run
npm publish --dry-run
```

Expected: tarball includes `dist/**`, `README.md`, `package.json`, and no unexpected files.

## 4. Commit and tag

```bash
git add .
git commit -m "chore(release): 1.1.3"
git tag v1.1.3
git push origin main --tags
```

## 5. Publish to npm

1. Ensure npm auth:

```bash
npm whoami
```

2. Publish:

```bash
npm publish
```

## 6. Post-publish verification

```bash
npm view linttity version
npm view linttity dist-tags
```

Expected: version `1.1.3` on `latest` tag.

## 7. GitHub release notes template

Use this short summary:

- Improved generated project DX for lint and format setup
- Interactive flow and preset behavior refinements
- Stability fixes in config generation and diagnostics
- Internal quality validations (format, build, lint, test)
