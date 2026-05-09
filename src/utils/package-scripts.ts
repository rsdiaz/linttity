import { readFile, writeFile } from 'node:fs/promises'
import {
  GENERATED_PACKAGE_SCRIPTS,
  PACKAGE_JSON_FILE_NAME
} from '../config/index.js'
import { TouchedFile } from '../types/install-summary.js'

type PackageJson = {
  scripts?: Record<string, string>
  [key: string]: unknown
}

export const ensurePackageScripts = async (): Promise<{
  touchedFile: TouchedFile
  addedScripts: string[]
}> => {
  let packageJson: PackageJson
  let wasCreated = false

  try {
    const raw = await readFile(PACKAGE_JSON_FILE_NAME, 'utf-8')
    packageJson = JSON.parse(raw) as PackageJson
  } catch {
    wasCreated = true
    packageJson = {
      name: 'my-project',
      version: '1.0.0'
    }
  }
  const scripts = packageJson.scripts ?? {}
  const addedScripts: string[] = []

  for (const [name, command] of Object.entries(GENERATED_PACKAGE_SCRIPTS)) {
    if (!scripts[name]) {
      scripts[name] = command
      addedScripts.push(name)
    }
  }

  packageJson.scripts = scripts

  if (addedScripts.length === 0) {
    return {
      touchedFile: { path: PACKAGE_JSON_FILE_NAME, status: 'unchanged' },
      addedScripts
    }
  }

  await writeFile(
    PACKAGE_JSON_FILE_NAME,
    `${JSON.stringify(packageJson, null, 2)}\n`
  )
  return {
    touchedFile: {
      path: PACKAGE_JSON_FILE_NAME,
      status: wasCreated ? 'created' : 'updated'
    },
    addedScripts
  }
}
