const globals = require('globals')
const tsParserRaw = require('@typescript-eslint/parser')
const tsPluginRaw = require('@typescript-eslint/eslint-plugin')
const importPluginRaw = require('eslint-plugin-import')
const nPluginRaw = require('eslint-plugin-n')
const promisePluginRaw = require('eslint-plugin-promise')
const prettierPluginRaw = require('eslint-plugin-prettier')
const unicornPluginRaw = require('eslint-plugin-unicorn')

const tsParser = tsParserRaw.default ?? tsParserRaw
const tsPlugin = tsPluginRaw.default ?? tsPluginRaw
const importPlugin = importPluginRaw.default ?? importPluginRaw
const nPlugin = nPluginRaw.default ?? nPluginRaw
const promisePlugin = promisePluginRaw.default ?? promisePluginRaw
const prettierPlugin = prettierPluginRaw.default ?? prettierPluginRaw
const unicornPlugin = unicornPluginRaw.default ?? unicornPluginRaw

module.exports = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: globals.node
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      n: nPlugin,
      promise: promisePlugin,
      prettier: prettierPlugin,
      unicorn: unicornPlugin
    },
    rules: {
      ...(importPlugin.configs?.recommended?.rules ?? {}),
      ...(nPlugin.configs?.['flat/recommended']?.rules ?? {}),
      ...(promisePlugin.configs?.recommended?.rules ?? {}),
      ...(unicornPlugin.configs?.recommended?.rules ?? {}),
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': [
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
      'n/no-unsupported-features/node-builtins': 'off',
      'n/hashbang': 'off',
      'import/no-unresolved': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/text-encoding-identifier-case': 'off',
      'unicorn/prefer-string-replace-all': 'off',
      'unicorn/prefer-spread': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/switch-case-braces': 'off'
    }
  }
]
