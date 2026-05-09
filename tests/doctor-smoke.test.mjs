import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
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

const stripAnsi = (value) => value.replace(/\u001B\[[0-9;]*m/g, '')

test('doctor reports multiple detected ESLint config files', async () => {
  const projectDir = await mkdtemp(join(tmpdir(), 'linttity-doctor-'))

  try {
    await writeFile(
      join(projectDir, 'package.json'),
      JSON.stringify(
        {
          name: 'doctor-test',
          version: '1.0.0',
          scripts: {
            lint: 'echo lint',
            'lint:fix': 'echo lint:fix',
            format: 'echo format',
            'format:check': 'echo format:check'
          }
        },
        null,
        2
      )
    )

    await Promise.all([
      writeFile(join(projectDir, 'eslint.config.cjs'), 'module.exports = []\n'),
      writeFile(join(projectDir, '.eslintrc.cjs'), 'module.exports = {}\n')
    ])

    const result = runCli(projectDir, ['--doctor'])
    const output = stripAnsi(result.stdout)

    assert.equal(result.status, 0, result.stderr)
    assert.match(output, /Has ESLint config: true/)
    assert.match(output, /ESLint config file: eslint\.config\.cjs, \.eslintrc\.cjs/)
    assert.match(output, /Package scripts: OK/)
  } finally {
    await rm(projectDir, { recursive: true, force: true })
  }
})
