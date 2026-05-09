import { exec as execCallback } from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(execCallback)

const execCommand = async (command: string): Promise<void> => {
  try {
    const { stdout, stderr } = await exec(command, {
      maxBuffer: 10 * 1024 * 1024
    })

    if (stdout.trim().length > 0) {
      console.log(stdout)
    }

    if (stderr.trim().length > 0) {
      console.error(stderr)
    }
  } catch (error: unknown) {
    throw new Error(`Command failed: ${command}\n${String(error)}`)
  }
}

export default execCommand
