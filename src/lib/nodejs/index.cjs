const fs = require('node:fs/promises')
const {
  ESLINT_FILE_NAME,
  NODEJS_JAVASCRIPT_COMMAND
} = require('../../config/index.cjs')
const eslintrc = require('./eslint/index.cjs')
const execCommand = require('../../utils/exec-command.cjs')

const install = async () => {
  console.log('Nodejs whit JavaScript\n')

  console.log('🔵 Install dev dependencies')
  await execCommand(NODEJS_JAVASCRIPT_COMMAND)
  console.log('✅ Install dev dependencies\n')

  console.log('🔵 Create eslintrc config\n')
  await fs.writeFile(ESLINT_FILE_NAME, eslintrc)
  console.log('✅ Create eslintrc config\n')
}

module.exports = install
