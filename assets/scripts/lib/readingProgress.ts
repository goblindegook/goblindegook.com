import { element } from 'estimate'

export type Progress = {
  start: () => UnmountCallback
  getFurthestRead: () => number
}

export type UpdateCallback = (progress: number, furthest: number) => void
export type UnmountCallback = () => void

/**
 * Reading progress.
 *
 * @param  content  Content element.
 * @param  onUpdate Update callback.
 * @return          Reading progress indicator object.
 */
export function readingProgress(content: HTMLElement, onUpdate: UpdateCallback): Progress {
  const reading = element(content)
  const normalize = normalizeRelativeTo(content, reading.progress)
  let furthest = 0

  function update() {
    reading.update()

    const normalizedProgress = normalize(reading.progress)
    const normalizedFurthest = normalize(furthest)

    if (normalizedProgress > normalizedFurthest) {
      onUpdate(normalizedProgress, normalizedProgress)
      furthest = reading.progress
    } else {
      onUpdate(normalizedProgress, normalizedFurthest)
    }
  }

  function throttledUpdate() {
    window.requestAnimationFrame(update)
  }

  return {
    start() {
      const controller = new AbortController()
      window.addEventListener('scroll', throttledUpdate, { signal: controller.signal })
      window.addEventListener('resize', throttledUpdate, { signal: controller.signal })
      window.addEventListener('orientationchange', throttledUpdate, { signal: controller.signal })
      return () => controller.abort()
    },

    getFurthestRead() {
      const rect = content.getBoundingClientRect()
      const offset = content.offsetTop - window.innerHeight / 2
      return (rect.height * furthest) / 100 + offset
    },
  }
}

function normalizeRelativeTo(content: HTMLElement, baseline: number) {
  return (progress: number) => {
    if (content.offsetHeight <= 0) return 100
    const normalized = ((progress - baseline) / maxReachable(content, baseline)) * 100
    return clamp(normalized, 0, 100)
  }
}

function clamp(value: number, lowest: number, highest: number): number {
  return Math.max(lowest, Math.min(highest, value))
}

function maxReachable(content: HTMLElement, baseline: number): number {
  const scrollingElement = document.scrollingElement ?? document.documentElement
  const maxScroll = Math.max(0, scrollingElement.scrollHeight - window.innerHeight)
  const maxDiffTop = maxScroll - content.offsetTop + window.innerHeight / 2
  const scaledMax = (maxDiffTop / content.offsetHeight) * 100
  return clamp(scaledMax, baseline + Number.EPSILON, 100) - baseline
}
