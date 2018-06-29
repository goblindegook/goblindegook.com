import insane from 'insane'
import marked from 'marked'

export function safeMarkdown (text: string): string {
  return marked(text, {
    sanitize: true,
    sanitizer: insane,
    smartypants: true
  }).replace(/<\/?p>/ig, '')
}
