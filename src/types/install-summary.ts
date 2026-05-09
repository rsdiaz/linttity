export interface TouchedFile {
  path: string
  status: 'created' | 'updated' | 'unchanged'
}

export type Preset = 'nodejs' | 'nodets'

export type RuleLevel = 'strict' | 'balanced' | 'relaxed'

export type FileStrategy = 'overwrite' | 'merge'

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export interface InstallOptions {
  strategy: FileStrategy
  ruleLevel: RuleLevel
  packageManager: PackageManager
  addCi: boolean
  skipInstall: boolean
}

export interface InstallSummary {
  preset: Preset
  ruleLevel: RuleLevel
  packageManager: PackageManager
  installedPackages: string[]
  packageScripts: string[]
  touchedFiles: TouchedFile[]
}
