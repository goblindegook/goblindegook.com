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

const onTransition = [
  setupFootnotes,
  setupHeader,
  setupLazyLoad,
  setupMasonry,
  setupProgress,
  setupMainSearch,
  setupSidebarSearch,
  triggerScroll,
]

const onFirstLoad = [
  ...onTransition,
  setupHash,
  setupFonts,
  () => setupPageTransitions(onTransition),
]

onFirstLoad.forEach((fn) => {
  window.addEventListener('load', fn)
})
