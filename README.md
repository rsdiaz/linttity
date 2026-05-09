# Linttity

[![npm version](https://img.shields.io/npm/v/linttity.svg)](https://www.npmjs.com/package/linttity)
[![npm downloads](https://img.shields.io/npm/dm/linttity.svg)](https://www.npmjs.com/package/linttity)
[![CI](https://github.com/rsdiaz/linttity/actions/workflows/quality.yml/badge.svg)](https://github.com/rsdiaz/linttity/actions/workflows/quality.yml)
[![license](https://img.shields.io/npm/l/linttity.svg)](https://www.npmjs.com/package/linttity)
[![node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

Node.js 18+, ESLint 9, Prettier 3.

Linttity is a CLI utility that bootstraps lint and format tooling for Node.js projects.

It installs required dependencies and generates a production-ready quality baseline for JavaScript and TypeScript projects.

Repository: https://github.com/rsdiaz/linttity
Issues: https://github.com/rsdiaz/linttity/issues

## Why Linttity

- Fast setup for ESLint + Prettier with one command
- Consistent project quality defaults for JavaScript and TypeScript
- Safe file handling with merge and overwrite strategies
- Release-ready workflow support for maintainers

## Features

- Preset for Node.js + JavaScript
- Preset for Node.js + TypeScript
- Interactive mode when no preset flag is passed
- Automatic JavaScript/TypeScript project detection
- Merge or overwrite strategy for generated files
- Package manager detection (`npm`, `pnpm`, `yarn`, `bun`)
- Rule levels: `strict`, `balanced`, `relaxed`
- Import ordering rules included in generated ESLint configs
- Package script bootstrap (`lint`, `lint:fix`, `format`, `format:check`)
- `.editorconfig` generation for editor consistency
- Optional GitHub Actions workflow generation
- `doctor` command for setup diagnostics
- Automated smoke tests for CLI behavior

## Requirements

- Node.js 18+

## Installation

Global installation:

```bash
npm install -g linttity
```

Local usage without global install:

```bash
npx linttity --nodejs
```

## Usage

```bash
linttity [options]
```

Options:

- `--nodejs` or `--njs`: ESLint and Prettier config for Node.js + JavaScript
- `--nodets` or `--nts`: ESLint and Prettier config for Node.js + TypeScript
- `--merge`: merge existing files safely when possible
- `--overwrite`: force overwrite generated files
- `--strict` | `--balanced` | `--relaxed`: choose lint rule strictness
- `--package-manager <pm>`: force package manager (`npm|pnpm|yarn|bun`)
- `--no-ci`: skip generating `.github/workflows/quality.yml`
- `--skip-install`: skip dependency installation (useful for tests)
- `--doctor`: inspect the current project lint/format setup

Use only one option at a time.

## Generated files

Depending on project type and strategy, Linttity can create/update:

- `eslint.config.cjs` (default) or `eslint.config.js` for ESM projects
- `.prettierrc.json`
- `.prettierignore`
- `.editorconfig`
- `tsconfig.json` (TypeScript preset)
- `.github/workflows/quality.yml` (unless `--no-ci`)
- `package.json` scripts (if missing)

## Examples

Setup JavaScript preset:

```bash
linttity --nodejs --balanced --merge
```

Setup TypeScript preset:

```bash
linttity --nodets --strict --overwrite
```

Check installed version:

```bash
linttity --version
```

Run setup diagnostics:

```bash
linttity --doctor
```

Run interactive mode (no preset flag):

```bash
linttity
```

## What each preset does

### Node.js + JavaScript (`--nodejs`)

1. Installs lint/format dependencies for JavaScript projects.
2. Creates or overwrites ESLint flat config (`eslint.config.cjs` by default, `eslint.config.js` for ESM projects).
3. Creates or overwrites `.prettierrc.json` and `.prettierignore`.
4. Creates or overwrites `.editorconfig`.
5. Adds scripts to `package.json` when missing.
6. Optionally generates `.github/workflows/quality.yml`.

### Node.js + TypeScript (`--nodets`)

1. Installs lint/format dependencies for TypeScript projects.
2. Creates or overwrites ESLint flat config (`eslint.config.cjs` by default, `eslint.config.js` for ESM projects).
3. Creates or overwrites `.prettierrc.json` and `.prettierignore`.
4. Creates or overwrites `.editorconfig`.
5. Ensures `tsconfig.json` exists for TypeScript projects.
6. Can normalize `tsconfig.json` when using `--overwrite`.
7. Adds scripts to `package.json` when missing.
8. Optionally generates `.github/workflows/quality.yml`.

## Notes

- The tool expects to run in the root of the target project.
- If you omit preset flags, Linttity prompts you interactively.
- `--merge` keeps existing files for non-safe merges (for example `.eslintrc.cjs`).
- `--overwrite` replaces generated config files.

## Contributing

1. Create a feature branch.
2. Keep quality checks green before opening a pull request.
3. Run this local validation set:
   - `npm run format:check`
   - `npm run build`
   - `npm run lint`
   - `npm test`

## Local development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Lint source files:

```bash
npm run lint
```

Format all files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Run automated tests:

```bash
npm test
```

Generate a release checklist (auto-next patch by default):

```bash
npm run release:checklist
```

Generate or overwrite a checklist for a specific version:

```bash
npm run release:checklist -- 1.1.3 --force
```

Run patch release workflow (bump patch + checklist + release dry-runs):

```bash
npm run release:patch
```

Note: `release:checklist` without version picks the next available patch checklist file.
Note: `release:patch` updates `package.json` version as part of the workflow.

## Quick smoke test

From the repository root:

```bash
node dist/index.js --version
node dist/index.js --doctor
node dist/index.js --nodejs --skip-install --no-ci
node dist/index.js --nodets --skip-install --no-ci
```

## License

ISC
