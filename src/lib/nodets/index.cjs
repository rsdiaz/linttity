const fs = require('node:fs/promises')
const {
  ESLINT_FILE_NAME,
  NODEJS_TYPESCRIPT_COMMAND
} = require('../../config/index.cjs')
const eslintrc = require('./eslint/index.cjs')
const execCommand = require('../../utils/exec-command.cjs')
const editTSConfig = require('../../utils/edit-ts-config.cjs')

const install = async () => {
  console.log('Nodejs whit TypeScript\n')

  console.log('🔵 Install dev dependencies')
  await execCommand(NODEJS_TYPESCRIPT_COMMAND)
  console.log('✅ Install dev dependencies\n')

  console.log('🔵 Create eslintrc config\n')
  await fs.writeFile(ESLINT_FILE_NAME, eslintrc)
  console.log('✅ Create eslintrc config\n')

  console.log('🔵 Edit tsconfig.json\n')
  await editTSConfig()
  console.log('✅ Edit tsconfig.json\n')
}

module.exports = install
