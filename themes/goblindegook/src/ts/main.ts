import { triggerEvent } from './lib/dom/triggerEvent'
import { setupFonts } from './setup/fonts'
import { setupFootnotes } from './setup/footnotes'
import { setupHash } from './setup/hash'
import { setupHeader } from './setup/header'
import { setupLazyLoad } from './setup/lazyLoad'
import { setupMasonry } from './setup/masonry'
import { setupPageTransitions } from './setup/pageTransitions'
import { setupProgress } from './setup/progress'
import { setupSearch } from './setup/search'

const triggerScroll = () => triggerEvent(window, 'scroll')

const updateFn = [
  setupFootnotes,
  setupHeader,
  setupLazyLoad,
  setupMasonry,
  setupProgress,
  setupSearch,
  triggerScroll
]

const setupFn = [
  ...updateFn,
  setupHash,
  setupFonts,
  () => setupPageTransitions(updateFn)
]

setupFn.forEach(fn => {
  window.addEventListener('load', fn)
})
