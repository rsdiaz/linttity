import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { FileStrategy, Preset, RuleLevel } from '../types/install-summary.js'

const ask = async (question: string): Promise<string> => {
  const rl = readline.createInterface({ input, output })
  try {
    const answer = await rl.question(question)
    return answer.trim().toLowerCase()
  } finally {
    rl.close()
  }
}

const pickFromMenu = async <T extends string>(
  label: string,
  choices: Array<{ key: string; value: T; description: string }>,
  fallback: T
): Promise<T> => {
  const prompt = `${label}\n${choices
    .map((choice) => `  ${choice.key}) ${choice.description}`)
    .join('\n')}\nChoose: `

  const response = await ask(prompt)
  const choice = choices.find((item) => item.key === response)
  return choice?.value ?? fallback
}

export const promptPreset = async (suggested: Preset): Promise<Preset> => {
  return pickFromMenu<Preset>(
    `No preset flag provided. Suggested preset: ${suggested}.`,
    [
      { key: '1', value: 'nodejs', description: 'Node.js + JavaScript' },
      { key: '2', value: 'nodets', description: 'Node.js + TypeScript' }
    ],
    suggested
  )
}

export const promptRuleLevel = async (): Promise<RuleLevel> => {
  return pickFromMenu<RuleLevel>(
    'Choose lint strictness level:',
    [
      { key: '1', value: 'strict', description: 'Strict (more opinionated)' },
      {
        key: '2',
        value: 'balanced',
        description: 'Balanced (recommended default)'
      },
      { key: '3', value: 'relaxed', description: 'Relaxed (fewer blockers)' }
    ],
    'balanced'
  )
}

export const promptStrategy = async (): Promise<FileStrategy> => {
  return pickFromMenu<FileStrategy>(
    'If config files already exist, what should happen?',
    [
      { key: '1', value: 'overwrite', description: 'Overwrite files' },
      { key: '2', value: 'merge', description: 'Merge safely when possible' }
    ],
    'overwrite'
  )
}

export const promptAddCi = async (): Promise<boolean> => {
  const response = await ask('Generate GitHub Actions workflow? (Y/n): ')
  return response !== 'n'
}
