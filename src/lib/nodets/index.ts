import {
  NODEJS_TYPESCRIPT_DEV_DEPENDENCIES,
  PRETTIER_CONFIG,
  PRETTIER_FILE_NAME,
  PRETTIER_IGNORE,
  PRETTIER_IGNORE_FILE_NAME
} from '../../config/index.js'
import execCommand from '../../utils/exec-command.js'
import editTSConfig from '../../utils/edit-ts-config.js'
import { ensureCiWorkflow } from '../../utils/ci.js'
import { resolveEslintConfigFileName } from '../../utils/eslint-config-file.js'
import { getInstallCommand } from '../../utils/package-manager.js'
import { ensurePackageScripts } from '../../utils/package-scripts.js'
import { writeGeneratedFile } from '../../utils/write-generated-file.js'
import {
  InstallOptions,
  InstallSummary,
  TouchedFile
} from '../../types/install-summary.js'
import { buildEslintConfig } from '../shared/eslint-config.js'
import { ui } from '../../utils/ui.js'

const install = async (options: InstallOptions): Promise<InstallSummary> => {
  console.log(`\n${ui.title('Node.js + TypeScript preset')}`)

  console.log(ui.info('Installing dev dependencies...'))
  const installCommand = getInstallCommand(
    options.packageManager,
    NODEJS_TYPESCRIPT_DEV_DEPENDENCIES
  )
  if (options.skipInstall) {
    console.log(ui.warn('Skipped dependency installation (--skip-install).'))
  } else {
    await execCommand(installCommand)
  }
  console.log(ui.success('Dev dependencies ready.'))

  const touchedFiles: TouchedFile[] = []
  const eslintFileName = await resolveEslintConfigFileName()
  const eslintModuleKind = eslintFileName.endsWith('.js') ? 'esm' : 'cjs'

  console.log(ui.info('Generating eslint config...'))
  touchedFiles.push(
    await writeGeneratedFile(
      eslintFileName,
      buildEslintConfig('nodets', options.ruleLevel, eslintModuleKind),
      options.strategy
    )
  )
  console.log(ui.success('eslint config ready.'))

  console.log(ui.info('Generating prettier config...'))
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
  console.log(ui.success('prettier config ready.'))

  console.log(ui.info('Updating tsconfig.json...'))
  const tsconfigResult = await editTSConfig(options.strategy)
  console.log(ui.success('tsconfig.json ready.'))

  touchedFiles.push(tsconfigResult)

  const scriptResult = await ensurePackageScripts()
  touchedFiles.push(scriptResult.touchedFile)

  if (options.addCi) {
    touchedFiles.push(await ensureCiWorkflow(options.strategy))
  } else {
    console.log(ui.warn('Skipped CI workflow generation (--no-ci).'))
  }

  return {
    preset: 'nodets',
    ruleLevel: options.ruleLevel,
    packageManager: options.packageManager,
    installedPackages: NODEJS_TYPESCRIPT_DEV_DEPENDENCIES,
    packageScripts: scriptResult.addedScripts,
    touchedFiles
  }
}

export default install
