import barba from '@barba/core'
import prefetch from '@barba/prefetch'
import { setupOffline } from 'scripts/offline'
import { setupSidebarSearch } from 'scripts/search-sidebar'
import { setupFonts } from './scripts/fonts'
import { setupFootnotes } from './scripts/footnotes'
import { setupHash } from './scripts/hash'
import { setupHeader } from './scripts/header'
import { setupMasonry } from './scripts/masonry'
import { setupProgress } from './scripts/progress'
import { setupMainSearch } from './scripts/search-main'
import { articleTransition } from './scripts/transitions/article-transition'
import { defaultTransition } from './scripts/transitions/default-transition'

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

window.addEventListener('load', async () => {
  setupHash()
  setupFonts()
  await setupSidebarSearch()
  setupHeader(document)
  window.dispatchEvent(new Event('scroll'))

  if (document.querySelector('main.offline')) {
    await setupOffline('goblindegook-offline-v3')
  }

  barba.use(prefetch)

  barba.hooks.beforeEnter(({ next }) => {
    window.scrollTo(0, 0)
    from(parser.parseFromString(next.html, 'text/html'))
      .replace('breadcrumbs')
      .replace('navigation')

    setupHeader(document)
    window.dispatchEvent(new Event('scroll'))
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
        async beforeEnter() {
          await setupMainSearch(document)
        },
      },
    ],
  })
})
