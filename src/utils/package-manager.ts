import { access } from 'node:fs/promises'
import { PackageManager } from '../types/install-summary.js'

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export const detectPackageManager = async (): Promise<PackageManager> => {
  if (await exists('pnpm-lock.yaml')) {
    return 'pnpm'
  }

  if (await exists('yarn.lock')) {
    return 'yarn'
  }

  if ((await exists('bun.lockb')) || (await exists('bun.lock'))) {
    return 'bun'
  }

  return 'npm'
}

export const getInstallCommand = (
  packageManager: PackageManager,
  dependencies: string[]
): string => {
  const depArgs = dependencies.join(' ')

  switch (packageManager) {
    case 'pnpm':
      return `pnpm add -D ${depArgs}`
    case 'yarn':
      return `yarn add -D ${depArgs}`
    case 'bun':
      return `bun add -d ${depArgs}`
    default:
      return `npm install -D ${depArgs}`
  }
}
