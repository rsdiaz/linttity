# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [1.1.0] - 2026-05-09

### Added

- Interactive mode when no preset is provided.
- Project type auto-detection (JavaScript/TypeScript suggestion).
- Merge and overwrite strategies for generated files.
- Rule levels for generated lint configs: strict, balanced, relaxed.
- Package manager support for generated dependency installation:
  - npm
  - pnpm
  - yarn
  - bun
- Automatic package script bootstrap in target projects:
  - lint
  - lint:fix
  - format
  - format:check
- Optional GitHub Actions workflow generation for quality checks.
- `doctor` command to inspect and report setup health.
- Smoke tests for CLI generation behavior.

### Changed

- Migrated generated ESLint output to flat config (`eslint.config.cjs`) for ESLint 9 compatibility.
- Improved CLI summary output with:
  - selected preset
  - rule level
  - package manager
  - added scripts
  - touched files and status
- Extended generated assets to include Prettier files in target projects:
  - `.prettierrc.json`
  - `.prettierignore`
- Upgraded core toolchain and lint ecosystem dependencies.

### Fixed

- Commander long option syntax compatibility with latest major version.
- Dependency compatibility and installation flow after stack upgrades.
- Safer handling for `tsconfig.json` generation and normalization paths.

## [1.0.6] - 2026-05-09

### Added

- Full TypeScript migration for source code and build output.
- Prettier setup for this repository:
  - `.prettierrc.json`
  - `.prettierignore`
  - `format` and `format:check` scripts.

### Changed

- Package entrypoints and artifacts aligned to `dist` output.
- CLI option syntax updated to valid long flags:
  - `--nodejs`
  - `--nodets`

### Fixed

- Improved command execution error reporting.
- Improved generated TypeScript preset consistency between config and installed dependencies.
- Improved `tsconfig.json` edit behavior and duplicate include prevention.

## [1.0.5] - 2026-05-09

### Initial

- Initial CLI publishing baseline for lint and format bootstrap.
