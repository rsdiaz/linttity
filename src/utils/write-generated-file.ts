import { readFile, writeFile } from 'node:fs/promises'
import { FileStrategy, TouchedFile } from '../types/install-summary.js'

const tryRead = async (path: string): Promise<string | null> => {
  try {
    return await readFile(path, 'utf-8')
  } catch {
    return null
  }
}

const mergeLineFile = (existing: string, incoming: string): string => {
  const merged = new Set<string>()

  for (const line of `${existing}\n${incoming}`.split(/\r?\n/g)) {
    const normalized = line.trim()
    if (normalized.length > 0) {
      merged.add(normalized)
    }
  }

  return `${Array.from(merged).join('\n')}\n`
}

const mergeJsonFile = (existing: string, incoming: string): string => {
  const existingJson = JSON.parse(existing) as Record<string, unknown>
  const incomingJson = JSON.parse(incoming) as Record<string, unknown>

  for (const [key, value] of Object.entries(incomingJson)) {
    if (existingJson[key] === undefined) {
      existingJson[key] = value
    }
  }

  return `${JSON.stringify(existingJson, null, 2)}\n`
}

export const writeGeneratedFile = async (
  path: string,
  content: string,
  strategy: FileStrategy
): Promise<TouchedFile> => {
  const existing = await tryRead(path)

  if (existing === null) {
    await writeFile(path, content)
    return { path, status: 'created' }
  }

  if (strategy === 'overwrite') {
    await writeFile(path, content)
    return { path, status: 'updated' }
  }

  if (path.endsWith('.prettierignore')) {
    const merged = mergeLineFile(existing, content)
    if (merged === existing) {
      return { path, status: 'unchanged' }
    }

    await writeFile(path, merged)
    return { path, status: 'updated' }
  }

  if (path.endsWith('.json')) {
    const merged = mergeJsonFile(existing, content)
    if (merged.trim() === existing.trim()) {
      return { path, status: 'unchanged' }
    }

    await writeFile(path, merged)
    return { path, status: 'updated' }
  }

  // Keep existing file untouched for merge mode when no safe merge strategy exists.
  return { path, status: 'unchanged' }
}
