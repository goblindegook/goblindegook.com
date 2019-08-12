import { getPageYOffset, setPageYOffset } from './window/pageYOffset'
import { requestFrame } from './window/requestFrame'
import { easeInOutCubic, EasingFunction } from './easings'

/**
 * Scroll to vertical position.
 *
 * @param  {Number}   targetPosition Scroll to vertical position.
 * @param  {Number}   duration       Animation duration, in milliseconds (optional, defaults to 1000)
 * @param  {Function} completion     Completion callback (optional).
 * @param  {Function} easing         Easing function (optional, defaults to easeInOutCubic).
 */
export function scrollTo(
  targetPosition: number,
  duration = 1000,
  completion?: Function,
  easing: EasingFunction = easeInOutCubic
) {
  const offset = getPageYOffset()
  const change = targetPosition - offset

  let start = 0

  function animateScroll(timestamp: number): void {
    if (!start) {
      start = timestamp
    }

    const progress = timestamp - start

    setPageYOffset(Math.ceil(offset + change * easing(progress / duration)))

    if (progress <= duration) {
      requestFrame(animateScroll)
    } else if (completion && typeof completion === 'function') {
      completion()
    }
  }

  requestFrame(animateScroll)
}
