import { mkdir } from 'node:fs/promises'
import { CI_WORKFLOW_CONTENT, CI_WORKFLOW_FILE_NAME } from '../config/index.js'
import { FileStrategy, TouchedFile } from '../types/install-summary.js'
import { writeGeneratedFile } from './write-generated-file.js'

export const ensureCiWorkflow = async (
  strategy: FileStrategy
): Promise<TouchedFile> => {
  await mkdir('.github/workflows', { recursive: true })
  return writeGeneratedFile(
    CI_WORKFLOW_FILE_NAME,
    CI_WORKFLOW_CONTENT,
    strategy
  )
}
