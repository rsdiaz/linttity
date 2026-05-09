# Linttity

Linttity is a CLI utility that bootstraps lint and format tooling for Node.js projects.

It installs the required development dependencies and generates a ready-to-use `eslint.config.cjs` preset.

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
- Optional GitHub Actions workflow generation
- `doctor` command for setup diagnostics
- Automated smoke tests for CLI behavior

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
2. Creates or overwrites `eslint.config.cjs` with a Node.js JavaScript preset.
3. Creates or overwrites `.prettierrc.json` and `.prettierignore`.
4. Adds scripts to `package.json` when missing.
5. Optionally generates `.github/workflows/quality.yml`.

### Node.js + TypeScript (`--nodets`)

1. Installs lint/format dependencies for TypeScript projects.
2. Creates or overwrites `eslint.config.cjs` with a Node.js TypeScript preset.
3. Creates or overwrites `.prettierrc.json` and `.prettierignore`.
4. Ensures `tsconfig.json` exists for TypeScript projects.
5. Can normalize `tsconfig.json` when using `--overwrite`.
6. Adds scripts to `package.json` when missing.
7. Optionally generates `.github/workflows/quality.yml`.

## Notes

- The tool expects to run in the root of the target project.
- If you omit preset flags, Linttity prompts you interactively.
- `--merge` keeps existing files for non-safe merges (for example `.eslintrc.cjs`).
- `--overwrite` replaces generated config files.

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
