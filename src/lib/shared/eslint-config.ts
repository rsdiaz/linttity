import { Preset, RuleLevel } from '../../types/install-summary.js'

type EslintModuleKind = 'cjs' | 'esm'

const buildLevelRules = (level: RuleLevel): string[] => {
  if (level === 'strict') {
    return [
      "'no-console': 'warn'",
      "'import/order': ['error', { 'newlines-between': 'always' }]",
      "'unicorn/filename-case': ['error', { case: 'kebabCase' }]"
    ]
  }

  if (level === 'relaxed') {
    return [
      "'no-console': 'off'",
      "'import/order': ['warn', { 'newlines-between': 'always' }]",
      "'unicorn/filename-case': 'off'"
    ]
  }

  return [
    "'no-console': 'off'",
    "'import/order': ['error', { 'newlines-between': 'always' }]",
    "'unicorn/filename-case': 'off'"
  ]
}

export const buildEslintConfig = (
  preset: Preset,
  level: RuleLevel,
  moduleKind: EslintModuleKind = 'cjs'
): string => {
  const useEsm = moduleKind === 'esm'

  const baseImports = useEsm
    ? `import globals from 'globals'
import importPluginRaw from 'eslint-plugin-import'
import nPluginRaw from 'eslint-plugin-n'
import promisePluginRaw from 'eslint-plugin-promise'
import prettierPluginRaw from 'eslint-plugin-prettier'
import unicornPluginRaw from 'eslint-plugin-unicorn'`
    : `const globals = require('globals')
const importPluginRaw = require('eslint-plugin-import')
const nPluginRaw = require('eslint-plugin-n')
const promisePluginRaw = require('eslint-plugin-promise')
const prettierPluginRaw = require('eslint-plugin-prettier')
const unicornPluginRaw = require('eslint-plugin-unicorn')`

  let tsImports = ''
  if (preset === 'nodets') {
    tsImports = useEsm
      ? "import tsParserRaw from '@typescript-eslint/parser'\nimport tsPluginRaw from '@typescript-eslint/eslint-plugin'\nconst tsParser = tsParserRaw.default ?? tsParserRaw\nconst tsPlugin = tsPluginRaw.default ?? tsPluginRaw\n"
      : "const tsParserRaw = require('@typescript-eslint/parser')\nconst tsPluginRaw = require('@typescript-eslint/eslint-plugin')\nconst tsParser = tsParserRaw.default ?? tsParserRaw\nconst tsPlugin = tsPluginRaw.default ?? tsPluginRaw\n"
  }

  const tsLanguageOptions =
    preset === 'nodets'
      ? `
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
`
      : `
      ecmaVersion: 'latest',
      sourceType: 'module',
`

  const tsPluginObject =
    preset === 'nodets' ? "'@typescript-eslint': tsPlugin,\n      " : ''

  const tsRules =
    preset === 'nodets'
      ? "'@typescript-eslint/no-unused-vars': 'warn',\n      "
      : ''

  const filePattern =
    preset === 'nodets' ? "['**/*.{ts,tsx,mts,cts}']" : "['**/*.{js,cjs,mjs}']"

  const levelRules = buildLevelRules(level).join(',\n      ')

  const exportLine = useEsm
    ? 'export default config'
    : 'module.exports = config'

  return `${baseImports}
const importPlugin = importPluginRaw.default ?? importPluginRaw
const nPlugin = nPluginRaw.default ?? nPluginRaw
const promisePlugin = promisePluginRaw.default ?? promisePluginRaw
const prettierPlugin = prettierPluginRaw.default ?? prettierPluginRaw
const unicornPlugin = unicornPluginRaw.default ?? unicornPluginRaw
${tsImports}
const config = [
  {
    files: ${filePattern},
    languageOptions: {
${tsLanguageOptions}      globals: globals.node
    },
    plugins: {
      ${tsPluginObject}import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
      prettier: prettierPlugin,
      unicorn: unicornPlugin
    },
    settings: {
      'import/resolver': {
        node: true
      }
    },
    rules: {
      ...(importPlugin.configs?.recommended?.rules ?? {}),
      ...(nPlugin.configs?.['flat/recommended']?.rules ?? {}),
      ...(promisePlugin.configs?.recommended?.rules ?? {}),
      ...(unicornPlugin.configs?.recommended?.rules ?? {}),
      ${tsRules}'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          jsxSingleQuote: true,
          semi: false,
          trailingComma: 'none'
        }
      ],
      'unicorn/prefer-top-level-await': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      ${levelRules}
    }
  }
]

${exportLine}
`
}
