import marked from 'marked'
import { sanitize } from 'dompurify'

export function safeMarkdown(text: string): string {
  return sanitize(marked(text, { smartypants: true })).replace(/<\/?p>/gi, '')
}
