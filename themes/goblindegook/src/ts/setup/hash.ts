import { hashChangeHandler, hashClickHandler } from '../lib/hash'

export function setupHash (event: Event) {
  document.body.addEventListener('click', hashClickHandler)
  window.addEventListener('hashchange', hashChangeHandler)
  hashChangeHandler(event)
}
