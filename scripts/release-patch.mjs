import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const npmExecPath = process.env.npm_execpath

if (!npmExecPath) {
  console.error(
    'npm_execpath is not available. Run this command via npm scripts.'
  )
  process.exit(1)
}

const run = (args, errorMessage) => {
  const result = spawnSync(process.execPath, [npmExecPath, ...args], {
    stdio: 'inherit'
  })
  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    throw new Error(errorMessage)
  }
}

const getPackageVersion = async () => {
  const packageJsonPath = resolve('package.json')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
  return packageJson.version
}

try {
  run(
    ['version', 'patch', '--no-git-tag-version'],
    'Failed to bump package version'
  )

  const version = await getPackageVersion()
  if (typeof version !== 'string' || !version.trim()) {
    throw new Error('Could not read updated package version')
  }

  run(
    ['run', 'release:checklist', '--', version, '--force'],
    'Failed to generate release checklist'
  )
  run(['run', 'release:check'], 'Failed running release checks')

  console.log(`Release patch workflow completed for v${version}`)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
