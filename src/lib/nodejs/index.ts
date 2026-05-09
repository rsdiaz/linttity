import {
  ESLINT_FILE_NAME,
  NODEJS_JAVASCRIPT_DEV_DEPENDENCIES,
  PRETTIER_CONFIG,
  PRETTIER_FILE_NAME,
  PRETTIER_IGNORE,
  PRETTIER_IGNORE_FILE_NAME
} from '../../config/index.js'
import execCommand from '../../utils/exec-command.js'
import { ensureCiWorkflow } from '../../utils/ci.js'
import { getInstallCommand } from '../../utils/package-manager.js'
import { ensurePackageScripts } from '../../utils/package-scripts.js'
import { writeGeneratedFile } from '../../utils/write-generated-file.js'
import {
  InstallOptions,
  InstallSummary,
  TouchedFile
} from '../../types/install-summary.js'
import { buildEslintConfig } from '../shared/eslint-config.js'

const install = async (options: InstallOptions): Promise<InstallSummary> => {
  console.log('Nodejs whit JavaScript\n')

  console.log('Install dev dependencies')
  const installCommand = getInstallCommand(
    options.packageManager,
    NODEJS_JAVASCRIPT_DEV_DEPENDENCIES
  )
  if (!options.skipInstall) {
    await execCommand(installCommand)
  }
  console.log('Install dev dependencies done\n')

  const touchedFiles: TouchedFile[] = []

  console.log('Create eslint config\n')
  touchedFiles.push(
    await writeGeneratedFile(
      ESLINT_FILE_NAME,
      buildEslintConfig('nodejs', options.ruleLevel),
      options.strategy
    )
  )
  console.log('Create eslint config done\n')

  console.log('Create prettier config\n')
  touchedFiles.push(
    ...(await Promise.all([
      writeGeneratedFile(PRETTIER_FILE_NAME, PRETTIER_CONFIG, options.strategy),
      writeGeneratedFile(
        PRETTIER_IGNORE_FILE_NAME,
        PRETTIER_IGNORE,
        options.strategy
      )
    ]))
  )
  console.log('Create prettier config done\n')

  const scriptResult = await ensurePackageScripts()
  touchedFiles.push(scriptResult.touchedFile)

  if (options.addCi) {
    touchedFiles.push(await ensureCiWorkflow(options.strategy))
  }

  return {
    preset: 'nodejs',
    ruleLevel: options.ruleLevel,
    packageManager: options.packageManager,
    installedPackages: NODEJS_JAVASCRIPT_DEV_DEPENDENCIES,
    packageScripts: scriptResult.addedScripts,
    touchedFiles
  }
}

export default install
