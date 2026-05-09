export const VERSION = 'v1.1.3'
export const ESLINT_FILE_NAME = 'eslint.config.cjs'
export const EDITORCONFIG_FILE_NAME = '.editorconfig'
export const PRETTIER_FILE_NAME = '.prettierrc.json'
export const PRETTIER_IGNORE_FILE_NAME = '.prettierignore'
export const PACKAGE_JSON_FILE_NAME = 'package.json'
export const CI_WORKFLOW_FILE_NAME = '.github/workflows/quality.yml'
export const END_MESSAGE = 'Linter configuration completed! Happy coding!\n'

export const PRETTIER_CONFIG = `{
  "endOfLine": "auto",
  "singleQuote": true,
  "jsxSingleQuote": true,
  "semi": false,
  "trailingComma": "none"
}
`

export const PRETTIER_IGNORE = `node_modules
dist
package-lock.json
`

export const EDITORCONFIG_CONTENT = `root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
`

export const GENERATED_PACKAGE_SCRIPTS = {
  lint: 'eslint .',
  'lint:fix': 'eslint . --fix',
  format: 'prettier --write .',
  'format:check': 'prettier --check .'
}

export const CI_WORKFLOW_CONTENT = `name: Quality Checks

on:
  push:
    branches: [main, master]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Lint
        run: npm run lint

      - name: Check format
        run: npm run format:check
`

// Nodejs JavaScript
export const NODEJS_JAVASCRIPT_DEV_DEPENDENCIES = [
  'eslint',
  'globals',
  'eslint-plugin-import',
  'eslint-plugin-n',
  'eslint-plugin-promise',
  'prettier',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
  'eslint-plugin-unicorn'
]

// Nodejs TypeScript
export const NODEJS_TYPESCRIPT_DEV_DEPENDENCIES = [
  'eslint',
  'globals',
  'eslint-plugin-import',
  'eslint-plugin-n',
  'eslint-plugin-promise',
  '@typescript-eslint/parser',
  '@typescript-eslint/eslint-plugin',
  'prettier',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
  'eslint-plugin-unicorn'
]

export const INTRO = `
--------------------
Linttity ${VERSION}
--------------------
  usage:
        linttity
        --nodejs     ESLint and Prettier config for Nodejs & Javascript
        --nodets     ESLint and Prettier config for Nodejs & Typescript
  --doctor     Analyze current setup and show recommendations
`
