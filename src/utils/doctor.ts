import { access, readFile } from 'node:fs/promises'
import { detectPackageManager } from './package-manager.js'

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const checkPackageJsonScripts = async (): Promise<string[]> => {
  if (!(await exists('package.json'))) {
    return ['missing package.json']
  }

  const packageJson = JSON.parse(await readFile('package.json', 'utf-8')) as {
    scripts?: Record<string, string>
  }

  const scripts = packageJson.scripts ?? {}
  const required = ['lint', 'lint:fix', 'format', 'format:check']

  return required.filter((script) => !scripts[script])
}

export const runDoctor = async (): Promise<void> => {
  const packageManager = await detectPackageManager()
  const missingScripts = await checkPackageJsonScripts()

  console.log('--- linttity doctor ---')
  console.log(`Detected package manager: ${packageManager}`)
  console.log(`Has eslint.config.cjs: ${await exists('eslint.config.cjs')}`)
  console.log(`Has .prettierrc.json: ${await exists('.prettierrc.json')}`)
  console.log(`Has .prettierignore: ${await exists('.prettierignore')}`)
  console.log(`Has tsconfig.json: ${await exists('tsconfig.json')}`)

  if (missingScripts.length === 0) {
    console.log('Package scripts: OK')
  } else {
    console.log(`Missing scripts: ${missingScripts.join(', ')}`)
  }

  console.log('-----------------------')
}
