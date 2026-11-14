import DOMPurify from 'dompurify'
import smartypants from 'smartypants'
import snarkdown from 'snarkdown'

export function markdown(text: string): HTMLElement {
  const span = document.createElement('span')
  const html = smartypants(snarkdown(text), 1)
    .replace(/<\/?p>/gi, '')
    .trim()
  if ('setHTML' in span && typeof span.setHTML === 'function') {
    span.setHTML(html)
  } else {
    span.innerHTML = DOMPurify.sanitize(html)
  }
  return span
}
