import { access, readFile } from 'node:fs/promises'
import { detectPackageManager } from './package-manager.js'
import { ui } from './ui.js'

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

  console.log(`\n${ui.title('linttity doctor')}`)
  console.log(ui.divider())
  console.log(ui.keyValue('Detected package manager', packageManager))
  console.log(
    ui.keyValue(
      'Has eslint.config.cjs',
      String(await exists('eslint.config.cjs'))
    )
  )
  console.log(
    ui.keyValue(
      'Has .prettierrc.json',
      String(await exists('.prettierrc.json'))
    )
  )
  console.log(
    ui.keyValue('Has .prettierignore', String(await exists('.prettierignore')))
  )
  console.log(
    ui.keyValue('Has tsconfig.json', String(await exists('tsconfig.json')))
  )

  if (missingScripts.length === 0) {
    console.log(ui.success('Package scripts: OK'))
  } else {
    console.log(ui.warn(`Missing scripts: ${missingScripts.join(', ')}`))
  }

  console.log(ui.divider())
}
