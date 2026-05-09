import { Preset, RuleLevel } from '../../types/install-summary.js'

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

export const buildEslintConfig = (preset: Preset, level: RuleLevel): string => {
  const tsImports =
    preset === 'nodets'
      ? "const tsParserRaw = require('@typescript-eslint/parser')\nconst tsPluginRaw = require('@typescript-eslint/eslint-plugin')\nconst tsParser = tsParserRaw.default ?? tsParserRaw\nconst tsPlugin = tsPluginRaw.default ?? tsPluginRaw\n"
      : ''

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

  return `const globals = require('globals')
const importPluginRaw = require('eslint-plugin-import')
const nPluginRaw = require('eslint-plugin-n')
const promisePluginRaw = require('eslint-plugin-promise')
const prettierPluginRaw = require('eslint-plugin-prettier')
const unicornPluginRaw = require('eslint-plugin-unicorn')
const importPlugin = importPluginRaw.default ?? importPluginRaw
const nPlugin = nPluginRaw.default ?? nPluginRaw
const promisePlugin = promisePluginRaw.default ?? promisePluginRaw
const prettierPlugin = prettierPluginRaw.default ?? prettierPluginRaw
const unicornPlugin = unicornPluginRaw.default ?? unicornPluginRaw
${tsImports}
module.exports = [
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
`
}
