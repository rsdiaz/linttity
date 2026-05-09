import { access, readFile } from 'node:fs/promises'
import { ESLINT_FILE_NAME } from '../config/index.js'

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export const resolveEslintConfigFileName = async (): Promise<string> => {
  if (!(await exists('package.json'))) {
    return ESLINT_FILE_NAME
  }

  const packageJson = JSON.parse(await readFile('package.json', 'utf-8')) as {
    type?: string
  }

  if (packageJson.type === 'module') {
    return 'eslint.config.js'
  }

  return ESLINT_FILE_NAME
}
