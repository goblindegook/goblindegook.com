import { ITransitionPage } from '@barba/core'
import { fadeIn, fadeOut } from '../lib/animate'

export const defaultTransition: ITransitionPage = {
  name: 'default-transition',
  leave({ current }) {
    fadeOut(current.container)
    return new Promise((resolve) => setTimeout(resolve, 200))
  },
  enter({ next }) {
    window.scrollTo(0, 0)
    fadeIn(next.container)
  },
}
