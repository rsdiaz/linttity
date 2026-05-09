import { access, readdir } from 'node:fs/promises'
import { Preset } from '../types/install-summary.js'

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export const detectSuggestedPreset = async (): Promise<Preset> => {
  if (await exists('tsconfig.json')) {
    return 'nodets'
  }

  const entries = await readdir('.', { withFileTypes: true })
  const hasTsFile = entries.some(
    (entry) => entry.isFile() && entry.name.endsWith('.ts')
  )

  return hasTsFile ? 'nodets' : 'nodejs'
}
