module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended',
    'standard'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier'],
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
}
