import { ITransitionPage, Trigger } from '@barba/core'
import { fadeIn, fadeOut } from '../lib/animate'

function isArticleLink(trigger: Trigger): trigger is HTMLAnchorElement {
  return typeof trigger === 'object' && !!trigger.closest('article')
}

function leaveTransition(
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

export const articleTransition: ITransitionPage = {
  name: 'home-article-transition',
  from: { namespace: ['home'] },
  to: { namespace: ['page'] },
  leave({ current, trigger }) {
    if (isArticleLink(trigger)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const article = trigger.closest('article')!
      article.style.top = window.scrollY + 'px'
      leaveTransition(
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
}
