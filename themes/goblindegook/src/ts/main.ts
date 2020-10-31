import barba from '@barba/core'
import prefetch from '@barba/prefetch'
import { setupFonts } from './setup/fonts'
import { setupFootnotes } from './setup/footnotes'
import { setupHash } from './setup/hash'
import { setupHeader } from './setup/header'
import { setupLazyLoad } from './setup/lazyLoad'
import { setupMasonry } from './setup/masonry'
import { setupProgress } from './setup/progress'
import { setupMainSearch, setupSidebarSearch } from './setup/search'
import { triggerEvent } from './lib/dom/triggerEvent'

window.addEventListener('load', () => {
  barba.use(prefetch)
  barba.init({
    schema: {
      prefix: 'data-transition',
    },
    transitions: [
      {
        name: 'default-transition',
        once({ next }) {
          setupHash()
          setupFonts()
          setupHeader(next.container)
          setupLazyLoad(next.container)
          setupSidebarSearch(next.container)
          setupMainSearch(next.container)
          triggerEvent(window, 'scroll')
        },
        enter({ next }) {
          window.scrollTo(0, 0)
          next.container.classList.add('animate__animated')
          next.container.classList.add('animate__fadeIn')
        },
        after({ next }) {
          setupHeader(next.container)
          setupLazyLoad(next.container)
          setupSidebarSearch(next.container)
          setupMainSearch(next.container)
          triggerEvent(window, 'scroll')
        },
        leave({ current }) {
          current.container.classList.add('animate__animated')
          current.container.classList.add('animate__fadeIn')
          current.container.classList.add('animate__fadeOut')
          return new Promise((resolve) => setTimeout(resolve, 200))
        },
      },
    ],
    views: [
      {
        namespace: 'home',
        beforeEnter({ next }) {
          setupMasonry(next.container)
        },
      },
      {
        namespace: 'section',
        beforeEnter({ next }) {
          setupMasonry(next.container)
        },
      },
      {
        namespace: 'taxonomy',
        beforeEnter({ next }) {
          setupMasonry(next.container)
        },
      },
      {
        namespace: 'term',
        beforeEnter({ next }) {
          setupMasonry(next.container)
        },
      },
      {
        namespace: 'page',
        beforeEnter({ next }) {
          setupProgress(next.container)
          setupFootnotes()
        },
      },
    ],
  })
})
