import { hashChangeHandler, hashClickHandler } from '../lib/hash'

export function setupHash() {
  document.body.addEventListener('click', hashClickHandler)
  window.addEventListener('hashchange', hashChangeHandler)
  hashChangeHandler()
}
