import barba from '@barba/core'
import prefetch from '@barba/prefetch'
import { setupFonts } from './scripts/fonts'
import { setupFootnotes } from './scripts/footnotes'
import { setupHash } from './scripts/hash'
import { setupHeader } from './scripts/header'
import { setupMasonry } from './scripts/masonry'
import { setupProgress } from './scripts/progress'
import { setupMainSearch, setupSidebarSearch } from './scripts/search'
import { triggerEvent } from './scripts/lib/dom/triggerEvent'
import { defaultTransition } from './scripts/transitions/default-transition'
import { articleTransition } from './scripts/transitions/article-transition'

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
  setupSidebarSearch()
  setupHeader(document)
  triggerEvent(window, 'scroll')

  barba.use(prefetch)

  barba.hooks.beforeEnter(({ next }) => {
    window.scrollTo(0, 0)
    from(parser.parseFromString(next.html, 'text/html'))
      .replace('breadcrumbs')
      .replace('navigation')

    setupHeader(document)
    triggerEvent(window, 'scroll')
  })

  barba.init({
    debug: false,
    schema: {
      prefix: 'data-transition',
    },
    prevent: ({ el, href }) =>
      Boolean(el.dataset.preventTransition) || href.endsWith('.pdf'),
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
