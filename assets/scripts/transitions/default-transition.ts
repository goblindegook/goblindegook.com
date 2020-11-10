import { ITransitionPage } from '@barba/core'
import { fadeIn, fadeOut, delay } from '../lib/animate'

export const defaultTransition: ITransitionPage = {
  name: 'default-transition',
  async leave({ current }) {
    fadeOut(current.container)
    await delay(200)
  },
  enter({ next }) {
    window.scrollTo(0, 0)
    fadeIn(next.container)
  },
}
