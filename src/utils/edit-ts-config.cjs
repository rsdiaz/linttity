const { readFile, writeFile } = require('node:fs/promises')
const { ESLINT_FILE_NAME } = require('../config/index.cjs')

const editTSConfig = async () => {
  try {
    const data = await readFile('./tsconfig.json')
    const tsconfig = JSON.parse(data.toString())
    tsconfig.include = !tsconfig.include
      ? [ESLINT_FILE_NAME]
      : [...tsconfig.include, ESLINT_FILE_NAME]

    await writeFile('./tsconfig.json', JSON.stringify(tsconfig))
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

module.exports = editTSConfig
