import { getPageYOffset } from './window/getPageYOffset'

// tslint:disable:ter-indent
type HeaderTogglerOptions = {
  hiddenClass?: string
  initialClass?: string
  threshold?: number
  visibleClass?: string
}
// tslint:enable:ter-indent

/**
 * Update fixed header visibility.
 */
export function createStickinessToggler (el: Element, options?: HeaderTogglerOptions) {
  return () => {
    const hidden = options && options.hiddenClass || ''
    const initial = options && options.initialClass || ''
    const visible = options && options.visibleClass || ''
    const threshold = options && options.threshold || 0
    const shouldMakeElementStick = getPageYOffset() > threshold

    if (el && shouldMakeElementStick && el.classList.contains(initial)) {
      el.classList.remove(initial)
      el.classList.add(visible)
    }

    if (el && !shouldMakeElementStick && el.classList.contains(visible)) {
      el.classList.remove(visible)
      el.classList.add(hidden)
    }

    if (el && shouldMakeElementStick && el.classList.contains(hidden)) {
      el.classList.remove(hidden)
      el.classList.add(visible)
    }
  }
}
