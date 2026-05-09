import test from 'node:test'
import assert from 'node:assert/strict'
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const runCli = (cwd, args) => {
  const cliPath = resolve(process.cwd(), 'dist/index.js')
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: 'utf-8'
  })
}

test('nodejs preset generates expected files with skip-install', async () => {
  const projectDir = await mkdtemp(join(tmpdir(), 'linttity-nodejs-'))

  try {
    const result = runCli(projectDir, [
      '--nodejs',
      '--skip-install',
      '--merge',
      '--balanced',
      '--no-ci'
    ])

    assert.equal(result.status, 0, result.stderr)

    const eslint = await readFile(
      join(projectDir, 'eslint.config.cjs'),
      'utf-8'
    )
    const prettier = await readFile(
      join(projectDir, '.prettierrc.json'),
      'utf-8'
    )
    const packageJson = JSON.parse(
      await readFile(join(projectDir, 'package.json'), 'utf-8')
    )

    assert.match(eslint, /importPlugin\.configs\?\.recommended\?\.rules/)
    assert.match(prettier, /singleQuote/)
    assert.equal(typeof packageJson.scripts.lint, 'string')
  } finally {
    await rm(projectDir, { recursive: true, force: true })
  }
})

test('nodets preset creates tsconfig when missing', async () => {
  const projectDir = await mkdtemp(join(tmpdir(), 'linttity-nodets-'))

  try {
    const result = runCli(projectDir, [
      '--nodets',
      '--skip-install',
      '--overwrite',
      '--strict',
      '--no-ci'
    ])

    assert.equal(result.status, 0, result.stderr)

    const tsconfig = await readFile(join(projectDir, 'tsconfig.json'), 'utf-8')
    assert.match(tsconfig, /compilerOptions/)
  } finally {
    await rm(projectDir, { recursive: true, force: true })
  }
})

test('nodejs preset uses eslint.config.js for ESM projects', async () => {
  const projectDir = await mkdtemp(join(tmpdir(), 'linttity-nodejs-esm-'))

  try {
    await writeFile(
      join(projectDir, 'package.json'),
      JSON.stringify({ name: 'esm-test', version: '1.0.0', type: 'module' })
    )

    const result = runCli(projectDir, [
      '--nodejs',
      '--skip-install',
      '--overwrite',
      '--balanced',
      '--no-ci'
    ])

    assert.equal(result.status, 0, result.stderr)

    const eslint = await readFile(join(projectDir, 'eslint.config.js'), 'utf-8')
    assert.match(eslint, /export default/)

    await assert.rejects(access(join(projectDir, 'eslint.config.cjs')))
  } finally {
    await rm(projectDir, { recursive: true, force: true })
  }
})
