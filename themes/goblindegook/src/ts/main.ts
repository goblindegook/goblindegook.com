import barba, { ITransitionData, Trigger } from '@barba/core'
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

function isArticleLink(trigger: Trigger): trigger is HTMLAnchorElement {
  return typeof trigger === 'object' && !!trigger.closest('article')
}

function fadeOut<T extends Element>(elements: T | T[]): void {
  Array<T>()
    .concat(elements)
    .forEach((element) => {
      element.classList.add('animate__animated')
      element.classList.remove('animate__fadeIn')
      element.classList.add('animate__fadeOut')
    })
}

function fadeIn<T extends Element>(elements: T | T[]): void {
  Array<T>()
    .concat(elements)
    .forEach((element) => {
      element.classList.add('animate__animated')
      element.classList.add('animate__fadeIn')
    })
}

function transitionToPage(
  container: Element | null | undefined,
  classNames: string[],
  suffix: string
): void {
  classNames.forEach((className) => {
    if (container?.classList.contains(className)) {
      container?.classList.add(className + '__' + suffix)
    }
    container
      ?.querySelector('.' + className)
      ?.classList.add(className + '__' + suffix)
  })
}

window.addEventListener('load', () => {
  setupHash()
  setupFonts()
  setupSidebarSearch(document)
  setupHeader(document)
  setupLazyLoad(document)
  triggerEvent(window, 'scroll')

  barba.use(prefetch)

  barba.hooks.beforeEnter(({ next }: ITransitionData) => {
    from(parser.parseFromString(next.html, 'text/html'))
      .replace('breadcrumbs')
      .replace('navigation')

    setupHeader(document)
    setupLazyLoad(next.container)
    triggerEvent(window, 'scroll')
  })

  barba.init({
    debug: true,
    schema: {
      prefix: 'data-transition',
    },
    transitions: [
      {
        name: 'default-transition',
        leave({ current }) {
          fadeOut(current.container)
          return new Promise((resolve) => setTimeout(resolve, 200))
        },
        enter({ next }) {
          window.scrollTo(0, 0)
          fadeIn(next.container)
        },
      },
      {
        name: 'home-article',
        from: { namespace: ['home'] },
        to: { namespace: ['page'] },
        leave({ current, trigger }) {
          if (isArticleLink(trigger)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const article = trigger.closest('article')!
            article.style.top = window.scrollY + 'px'
            transitionToPage(
              article,
              [
                'archive-entry',
                'archive-entry-title',
                'archive-entry-thumbnail-wrapper',
                'archive-entry-content',
              ],
              'leave'
            )
          } else {
            fadeOut(current.container)
          }

          return new Promise((resolve) => setTimeout(resolve, 200))
        },
        enter({ next, trigger }) {
          window.scrollTo(0, 0)

          if (isArticleLink(trigger)) {
            fadeIn(
              Array.from(
                next.container.querySelectorAll(
                  '.single-entry-featured-image figcaption, .single-entry-body'
                )
              )
            )
          } else {
            fadeIn(next.container)
          }
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
