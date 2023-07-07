import { ITransitionPage, Trigger } from '@barba/core'
import { fadeIn, fadeOut, delay } from '../lib/animate'

function isArticleLink(trigger: Trigger): trigger is HTMLAnchorElement {
  return typeof trigger === 'object' && trigger.closest('article') !== null
}

export const articleTransition: ITransitionPage = {
  name: 'home-article-transition',
  from: { namespace: ['home', 'section', 'term'] },
  to: { namespace: ['page'] },
  async leave({ current, trigger }) {
    if (isArticleLink(trigger)) {
      const article = trigger.closest('article')

      document
        .querySelector('.archive-header')
        ?.classList.add('archive-header__fadeout')

      Array.from(document.querySelectorAll('.archive-entry'))
        .filter((element) => element !== article)
        .forEach(fadeOut)

      await delay(200)

      fadeOut(article.querySelector('.archive-entry-content'))

      await delay(200)

      article.style.top = window.scrollY + 'px'
      article.classList.add('archive-entry__fill')
      article
        .querySelector('.archive-entry-title')
        ?.classList.add('archive-entry-title__fill')
      article
        .querySelector('.archive-entry-thumbnail-wrapper')
        ?.classList.add('archive-entry-thumbnail-wrapper__fill')
    } else {
      fadeOut(current.container)
    }

    await delay(200)
  },
  async enter({ next, trigger }) {
    if (isArticleLink(trigger)) {
      fadeIn(
        next.container.querySelectorAll(
          '.single-entry-featured-image figcaption, .single-entry-body',
        ),
      )
    } else {
      fadeIn(next.container)
    }
  },
}
