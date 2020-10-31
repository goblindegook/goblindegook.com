import barba, { ITransitionData } from '@barba/core'
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

const parser = new DOMParser()

const from = (source: Document) => ({
  replace(name: string) {
    const element = source.querySelector(`[data-transition="${name}"]`)
    if (element) {
      const target = document.querySelector(`[data-transition="${name}"]`)
      target?.parentNode?.replaceChild(element, target)
    }
    return this
  },
})

window.addEventListener('load', () => {
  setupHash()
  setupFonts()
  setupHeader(document)
  setupSidebarSearch(document)
  setupLazyLoad(document)
  triggerEvent(window, 'scroll')

  barba.use(prefetch)

  barba.hooks.beforeEnter(({ next }: ITransitionData) => {
    from(parser.parseFromString(next.html, 'text/html'))
      .replace('breadcrumbs')
      .replace('navigation')

    setupLazyLoad(next.container)
    triggerEvent(window, 'scroll')
  })

  barba.init({
    schema: {
      prefix: 'data-transition',
    },
    transitions: [
      {
        name: 'default-transition',
        leave({ current }) {
          current.container.classList.add('animate__animated')
          current.container.classList.remove('animate__fadeIn')
          current.container.classList.add('animate__fadeOut')
          return new Promise((resolve) => setTimeout(resolve, 200))
        },
        enter({ next }) {
          window.scrollTo(0, 0)
          next.container.classList.add('animate__animated')
          next.container.classList.add('animate__fadeIn')
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
      {
        namespace: 'search',
        beforeEnter({ next }) {
          setupMainSearch(next.container)
        },
      },
    ],
  })
})
