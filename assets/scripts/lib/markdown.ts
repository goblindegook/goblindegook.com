import snarkdown from 'snarkdown'
import smartypants from 'smartypants'
import DOMPurify from 'dompurify'

export function safeMarkdown(text: string): string {
  return DOMPurify.sanitize(smartypants(snarkdown(text), 1)).replace(
    /<\/?p>/gi,
    ''
  )
}
