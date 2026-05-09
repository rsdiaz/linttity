# Release {{VERSION}} Checklist

This playbook prepares and publishes `linttity@{{VERSION}}` safely.

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
npm version {{VERSION}} --no-git-tag-version
```

2. Add a new `## [{{VERSION}}] - YYYY-MM-DD` section in `CHANGELOG.md`.

## 3. Final package validation

```bash
npm pack --dry-run
npm publish --dry-run
```

Expected: tarball includes `dist/**`, `README.md`, `package.json`, and no unexpected files.

## 4. Commit and tag

```bash
git add .
git commit -m "chore(release): {{VERSION}}"
git tag v{{VERSION}}
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

Expected: version `{{VERSION}}` on `latest` tag.

## 7. GitHub release notes template

Use this short summary:

- Improved generated project DX for lint and format setup
- Interactive flow and preset behavior refinements
- Stability fixes in config generation and diagnostics
- Internal quality validations (format, build, lint, test)
