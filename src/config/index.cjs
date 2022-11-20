const VERSION = 'v1.0.0'
const ESLINT_FILE_NAME = '.eslintrc.cjs'
const END_MESSAGE =
  '🔥🔥🔥 Linter configuration completed! Happy codding! 🔥🔥🔥\n'

// Nodejs JavaScript
const NODEJS_JAVASCRIPT_COMMAND =
  'npm install -D eslint standard eslint-config-standard eslint-plugin-import eslint-plugin-n eslint-plugin-promise prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-unicorn'

// Nodejs TypeScript
const NODEJS_TYPESCRIPT_COMMAND =
  'npm install -D eslint-config-standard-with-typescript eslint-plugin-import eslint-plugin-n eslint-plugin-promise eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-unicorn'

const INTRO = `
--------------------
Linttity ${VERSION} 🔥
--------------------
`

module.exports = {
  VERSION,
  INTRO,
  END_MESSAGE,
  ESLINT_FILE_NAME,
  NODEJS_TYPESCRIPT_COMMAND,
  NODEJS_JAVASCRIPT_COMMAND
}
