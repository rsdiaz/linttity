#!/usr/bin/env node
/// <reference types="node" />
import { Command } from 'commander'
import { VERSION, INTRO, END_MESSAGE } from './config/index.js'
import nodejs from './lib/nodejs/index.js'
import nodets from './lib/nodets/index.js'
import {
  FileStrategy,
  InstallOptions,
  InstallSummary,
  PackageManager,
  Preset,
  RuleLevel
} from './types/install-summary.js'
import { detectPackageManager } from './utils/package-manager.js'
import { detectSuggestedPreset } from './utils/project-detection.js'
import {
  promptAddCi,
  promptPreset,
  promptRuleLevel,
  promptStrategy
} from './utils/prompts.js'
import { runDoctor } from './utils/doctor.js'

const program = new Command()

console.log(INTRO)

program
  .version(VERSION, '-v, --version', 'output the current version')
  .description(
    'Automate eslint configuration and install the necessary packages for Nodejs projects'
  )
  .option(
    '--nodejs, --njs',
    'create a preset eslint configuration and install the necessary packages for Nodejs whit JavaScript projects'
  )
  .option(
    '--nodets, --nts',
    'create a preset eslint configuration and install the necessary packages for Nodejs whit TypeScript projects'
  )
  .option('--merge', 'merge existing configuration files when possible')
  .option('--overwrite', 'overwrite existing configuration files')
  .option('--strict', 'enable strict lint rules')
  .option('--balanced', 'enable balanced lint rules')
  .option('--relaxed', 'enable relaxed lint rules')
  .option('--doctor', 'inspect current project lint/format setup')
  .option(
    '--package-manager <pm>',
    'package manager to use (npm|pnpm|yarn|bun)'
  )
  .option('--no-ci', 'skip generating GitHub Actions workflow')
  .option('--skip-install', 'skip dependency installation step')
  .parse(process.argv)

const options = program.opts<{
  njs?: boolean
  nts?: boolean
  merge?: boolean
  overwrite?: boolean
  strict?: boolean
  balanced?: boolean
  relaxed?: boolean
  doctor?: boolean
  packageManager?: string
  ci?: boolean
  skipInstall?: boolean
}>()

const printSummary = (summary: InstallSummary): void => {
  console.log('--- Summary ---')
  console.log(`Preset: ${summary.preset}`)
  console.log(`Rule level: ${summary.ruleLevel}`)
  console.log(`Package manager: ${summary.packageManager}`)

  console.log('Installed packages:')
  for (const dependency of summary.installedPackages) {
    console.log(`- ${dependency}`)
  }

  console.log('Touched files:')
  for (const touchedFile of summary.touchedFiles) {
    console.log(`- ${touchedFile.path} (${touchedFile.status})`)
  }

  if (summary.packageScripts.length > 0) {
    console.log('Added package scripts:')
    for (const scriptName of summary.packageScripts) {
      console.log(`- ${scriptName}`)
    }
  }

  console.log('---------------\n')
}

const resolveRuleLevel = async (): Promise<RuleLevel> => {
  const selected = [options.strict, options.balanced, options.relaxed].filter(
    Boolean
  )
  if (selected.length > 1) {
    throw new Error(
      'Select only one rule level: --strict, --balanced, or --relaxed'
    )
  }

  if (options.strict) {
    return 'strict'
  }

  if (options.relaxed) {
    return 'relaxed'
  }

  if (options.balanced) {
    return 'balanced'
  }

  if (!options.njs && !options.nts) {
    return promptRuleLevel()
  }

  return 'balanced'
}

const resolveStrategy = async (): Promise<FileStrategy> => {
  if (options.merge && options.overwrite) {
    throw new Error('Select only one strategy: --merge or --overwrite')
  }

  if (options.merge) {
    return 'merge'
  }

  if (options.overwrite) {
    return 'overwrite'
  }

  if (!options.njs && !options.nts) {
    return promptStrategy()
  }

  return 'overwrite'
}

const resolvePreset = async (): Promise<Preset> => {
  if (options.njs && options.nts) {
    throw new Error('Please select only one preset at a time: --njs or --nts')
  }

  if (options.njs) {
    return 'nodejs'
  }

  if (options.nts) {
    return 'nodets'
  }

  const suggested = await detectSuggestedPreset()
  return promptPreset(suggested)
}

const resolvePackageManager = async (): Promise<PackageManager> => {
  if (options.packageManager) {
    const packageManager = options.packageManager.toLowerCase()
    if (
      packageManager === 'npm' ||
      packageManager === 'pnpm' ||
      packageManager === 'yarn' ||
      packageManager === 'bun'
    ) {
      return packageManager
    }

    throw new Error('Invalid package manager. Use npm, pnpm, yarn, or bun')
  }

  return detectPackageManager()
}

const resolveCi = async (): Promise<boolean> => {
  if (options.ci === false) {
    return false
  }

  if (!options.njs && !options.nts) {
    return promptAddCi()
  }

  return true
}

const run = async (): Promise<void> => {
  if (options.doctor) {
    await runDoctor()
    return
  }

  const preset = await resolvePreset()
  const ruleLevel = await resolveRuleLevel()
  const strategy = await resolveStrategy()
  const packageManager = await resolvePackageManager()
  const addCi = await resolveCi()

  const installOptions: InstallOptions = {
    strategy,
    ruleLevel,
    packageManager,
    addCi,
    skipInstall: options.skipInstall ?? false
  }

  let summary: InstallSummary | null = null

  if (preset === 'nodejs') {
    summary = await nodejs(installOptions)
  } else {
    summary = await nodets(installOptions)
  }

  if (summary) {
    printSummary(summary)
  }

  console.log(END_MESSAGE)
}

void run().catch((error: unknown) => {
  console.error(`Error: ${String(error)}`)
  process.exitCode = 1
})
