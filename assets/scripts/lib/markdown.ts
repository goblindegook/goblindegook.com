import marked from 'marked'
import DOMPurify from 'dompurify'

export function safeMarkdown(text: string): string {
  return DOMPurify.sanitize(marked(text, { smartypants: true })).replace(
    /<\/?p>/gi,
    ''
  )
}
