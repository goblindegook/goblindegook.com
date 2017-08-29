import Barba from 'barba.js'
import { triggerEvent } from '../lib/dom/triggerEvent'

export function setupPageTransitions (onNewPageReady: Function[] = []) {
  Barba.Pjax.Dom.containerClass = 'transition-container'
  Barba.Pjax.Dom.wrapperId = 'transition-wrapper'
  Barba.Pjax.start()

  onNewPageReady.forEach(fn => {
    Barba.Dispatcher.on('newPageReady', fn)
  })

  Barba.Dispatcher.on('newPageReady', () => triggerEvent(window, 'scroll'))
}
