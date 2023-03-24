import snarkdown from 'snarkdown'
import smartypants from 'smartypants'
import { sanitize } from 'dompurify'

export function safeMarkdown(text: string): string {
  return sanitize(smartypants(snarkdown(text), 1)).replace(/<\/?p>/gi, '')
}
