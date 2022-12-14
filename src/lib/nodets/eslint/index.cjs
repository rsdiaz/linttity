module.exports = `module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended'
  ],
  overrides: [],
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
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
    'unicorn/prefer-top-level-await': 'off'
  }
}`
