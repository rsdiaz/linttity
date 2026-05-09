import { readFile, writeFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'

const rawVersion = process.argv[2]?.trim()
const force = process.argv.includes('--force')

const fileExists = async (filePath) => {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const parseVersion = (value) => {
  const match = value.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) {
    return null
  }

  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10)
  }
}

const getNextPatchVersion = async () => {
  const packageJsonPath = resolve('package.json')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
  const parsed = parseVersion(packageJson.version)

  if (!parsed) {
    throw new Error(
      `Current package.json version is not a plain semver (x.y.z): ${String(packageJson.version)}`
    )
  }

  let nextPatch = parsed.patch + 1

  // If a checklist file already exists for the immediate patch, find the next free one.
  while (
    await fileExists(
      resolve(
        `.github/release-${parsed.major}.${parsed.minor}.${nextPatch}-checklist.md`
      )
    )
  ) {
    nextPatch += 1
  }

  return `${parsed.major}.${parsed.minor}.${nextPatch}`
}

const version = rawVersion || (await getNextPatchVersion())

if (rawVersion && !parseVersion(rawVersion)) {
  console.error('Usage: npm run release:checklist -- [x.y.z] [--force]')
  process.exit(1)
}

const templatePath = resolve('.github/release-checklist-template.md')
const outputPath = resolve(`.github/release-${version}-checklist.md`)

if (!force && (await fileExists(outputPath))) {
  console.error(
    `Checklist already exists: .github/release-${version}-checklist.md (use --force to overwrite)`
  )
  process.exit(1)
}

const template = await readFile(templatePath, 'utf-8')
const content = template.replaceAll('{{VERSION}}', version)

await writeFile(outputPath, content)
console.log(`Created .github/release-${version}-checklist.md`)
