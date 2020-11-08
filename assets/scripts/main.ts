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
import { defaultTransition } from './transitions/default-transition'
import { articleTransition } from './transitions/article-transition'

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
  setupSidebarSearch(document)
  setupHeader(document)
  setupLazyLoad(document)
  triggerEvent(window, 'scroll')

  barba.use(prefetch)

  barba.hooks.beforeEnter(({ next }: ITransitionData) => {
    window.scrollTo(0, 0)
    from(parser.parseFromString(next.html, 'text/html'))
      .replace('breadcrumbs')
      .replace('navigation')

    setupHeader(document)
    setupLazyLoad(next.container)
    triggerEvent(window, 'scroll')
  })

  barba.init({
    debug: false,
    schema: {
      prefix: 'data-transition',
    },
    transitions: [defaultTransition, articleTransition],
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
        beforeEnter() {
          setupProgress(document)
          setupFootnotes()
        },
      },
      {
        namespace: 'search',
        beforeEnter() {
          setupMainSearch(document)
        },
      },
    ],
  })
})
