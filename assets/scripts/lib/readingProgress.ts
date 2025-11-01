import { element } from 'estimate'

interface Progress {
  getFurthestRead: () => number
  start: () => void
}

type UpdateCallback = (progress: number, furthest: number) => void

/**
 * Reading progress.
 *
 * @param  content  Content element.
 * @param  onUpdate Update callback.
 * @return          Reading progress indicator object.
 */
export function readingProgress(content: HTMLElement, onUpdate: UpdateCallback): Progress {
  const reading = element(content)
  const baseline = reading.progress
  let furthest = 0

  function normalize(progress: number) {
    const range = Math.max(100 - baseline, Number.EPSILON)
    const normalized = ((progress - baseline) / range) * 100
    return Math.min(100, Math.max(0, normalized))
  }

  function update() {
    reading.update()

    const normalizedProgress = normalize(reading.progress)
    let normalizedFurthest = normalize(furthest)

    if (reading.progress > furthest) {
      normalizedFurthest = normalizedProgress
      furthest = reading.progress
    }

    console.log(normalizedProgress, normalizedFurthest)

    onUpdate(normalizedProgress, normalizedFurthest)
  }

  function throttledUpdate() {
    window.requestAnimationFrame(update)
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
