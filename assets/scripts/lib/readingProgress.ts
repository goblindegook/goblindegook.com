import { requestFrame } from './window/requestFrame'
import { element } from 'estimate'

interface Progress {
  getFurthestRead: () => number
  start: () => void
}

type UpdateCallback = (progress: number, furthest: number) => void

/**
 * Reading progress factory.
 *
 * @param  content  Content element.
 * @param  onUpdate Update callback.
 * @return          Reading progress indicator object.
 */
export function readingProgress(
  content: HTMLElement,
  onUpdate: UpdateCallback,
): Progress {
  const reading = element(content)
  let furthest = 0

  /**
   * Handles scroll and resize events.
   */
  function update() {
    reading.update()

    if (onUpdate) {
      onUpdate(reading.progress, furthest)
    }

    if (reading.progress > furthest) {
      furthest = reading.progress
    }
  }

  function throttledUpdate() {
    requestFrame(update)
  }

  /**
   * Initialize reading progress updates.
   */
  function start() {
    window.addEventListener('scroll', throttledUpdate)
    window.addEventListener('resize', throttledUpdate)
    window.addEventListener('orientationchange', throttledUpdate)
  }

  /**
   * Get the furthest Y point read in the document.
   */
  function getFurthestRead() {
    const rect = content.getBoundingClientRect()
    const offset = content.offsetTop - window.innerHeight / 2
    return (rect.height * furthest) / 100 + offset
  }

  return {
    getFurthestRead,
    start,
  }
}
