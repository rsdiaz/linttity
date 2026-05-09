const shouldUseColor = (): boolean => {
  if (process.env.NO_COLOR !== undefined) {
    return false
  }

  if (process.env.FORCE_COLOR === '0') {
    return false
  }

  if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') {
    return true
  }

  return Boolean(process.stdout.isTTY)
}

const colorEnabled = shouldUseColor()

const paint = (text: string, code: string): string => {
  if (!colorEnabled) {
    return text
  }

  return `\u001B[${code}m${text}\u001B[0m`
}

export const ui = {
  title: (text: string): string => paint(text, '1;36'),
  divider: (): string =>
    paint('--------------------------------------------------', '2'),
  info: (text: string): string => `${paint('[INFO]', '36')} ${text}`,
  success: (text: string): string => `${paint('[OK]', '32')} ${text}`,
  warn: (text: string): string => `${paint('[WARN]', '33')} ${text}`,
  error: (text: string): string => `${paint('[ERROR]', '31')} ${text}`,
  item: (text: string): string => `${paint('•', '36')} ${text}`,
  keyValue: (key: string, value: string): string =>
    `${paint(`${key}:`, '2')} ${value}`,
  status: (status: 'created' | 'updated' | 'unchanged'): string => {
    if (status === 'created') {
      return paint('created', '32')
    }

    if (status === 'updated') {
      return paint('updated', '33')
    }

    return paint('unchanged', '2')
  }
}
