import insane from 'insane'
import marked from 'marked'

export function safeMarkdown (text: string): string {
  return insane(marked(text)).replace(/<\/?p>/ig, '')
}
