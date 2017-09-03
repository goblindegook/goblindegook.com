import { setupFonts } from './setup/fonts'
import { setupFootnotes } from './setup/footnotes'
import { setupHash } from './setup/hash'
import { setupHeader } from './setup/header'
import { setupLazyLoad } from './setup/lazyLoad'
import { setupMasonry } from './setup/masonry'
import { setupPageTransitions } from './setup/pageTransitions'
import { setupProgress } from './setup/progress'
import { setupMainSearch, setupSidebarSearch } from './setup/search'
import { triggerEvent } from './lib/dom/triggerEvent'

const triggerScroll = () => triggerEvent(window, 'scroll')

const updateFn = [
  setupFootnotes,
  setupHeader,
  setupLazyLoad,
  setupMasonry,
  setupProgress,
  setupMainSearch,
  setupSidebarSearch,
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
