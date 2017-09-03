import insane from 'insane'
import showdown from 'showdown'

const md = new showdown.Converter({
  strikethrough: true
})

export function safeMarkdown (text: string): string {
  return insane(md.makeHtml(text)).replace(/<\/?p>/ig, '')
}
