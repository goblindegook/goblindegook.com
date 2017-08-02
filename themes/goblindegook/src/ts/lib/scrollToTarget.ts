import { getPageYOffset } from './window/getPageYOffset'
import { scrollTo } from './scrollTo'

/**
 * Scroll smoothly to target, accounting for header height.
 *
 * @param target   Link or hash target.
 * @param offset   Vertical pixel offset.
 * @param complete Completion callback.
 */
export function scrollToTarget (target: string | HTMLElement, offset: number, complete?: Function): void {
  if (target) {
    const targetEl = typeof target === 'string' ? document.querySelector(target) : target

    if (targetEl && targetEl.getBoundingClientRect) {
      const position = targetEl.getBoundingClientRect().top + getPageYOffset() - offset
      scrollTo(position, 1000, complete)
    }
  }
}
