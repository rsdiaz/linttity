import { readFile, writeFile } from 'node:fs/promises'
import { FileStrategy, TouchedFile } from '../types/install-summary.js'

type TSConfig = {
  [key: string]: unknown
}

const parseTSConfig = (raw: string): TSConfig => {
  const withoutBlockComments = raw.replace(/\/\*[\s\S]*?\*\//g, '')
  const withoutLineComments = withoutBlockComments.replace(/^\s*\/\/.*$/gm, '')
  const withoutTrailingCommas = withoutLineComments.replace(
    /,\s*([}\]])/g,
    '$1'
  )

  return JSON.parse(withoutTrailingCommas) as TSConfig
}

const editTSConfig = async (strategy: FileStrategy): Promise<TouchedFile> => {
  try {
    const data = await readFile('./tsconfig.json', 'utf-8')
    const tsconfig = parseTSConfig(data)

    if (strategy === 'overwrite') {
      const normalized = {
        compilerOptions: {
          ...(typeof tsconfig.compilerOptions === 'object'
            ? (tsconfig.compilerOptions as Record<string, unknown>)
            : {}),
          target: 'ES2021',
          module: 'CommonJS'
        }
      }

      await writeFile('./tsconfig.json', JSON.stringify(normalized, null, 2))
      return { path: 'tsconfig.json', status: 'updated' }
    }

    return { path: 'tsconfig.json', status: 'unchanged' }
  } catch (error: unknown) {
    const normalizedError = error as NodeJS.ErrnoException

    if (normalizedError.code === 'ENOENT') {
      const defaultConfig: TSConfig = {
        compilerOptions: {
          target: 'ES2021',
          module: 'CommonJS'
        }
      }

      await writeFile('./tsconfig.json', JSON.stringify(defaultConfig, null, 2))
      return { path: 'tsconfig.json', status: 'created' }
    }

    throw new Error(
      `Unable to read or update tsconfig.json: ${String(normalizedError.message ?? normalizedError)}`
    )
  }
}

export default editTSConfig
