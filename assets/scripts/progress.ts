import { readingProgress, type UnmountCallback } from './lib/readingProgress'
import { scrollTo } from './lib/scrollTo'

export function setupProgress(parent: ParentNode): UnmountCallback {
  const progressBar = document.getElementById('reading-progress')
  if (!progressBar) return () => {}

  const entryContent = parent.querySelector<HTMLElement>('.single-entry-body')
  if (!entryContent) return () => {}

  const scrollButton = parent.querySelector<HTMLElement>('.button-furthest-read')

  const reading = readingProgress(entryContent, (progress, furthest) => {
    const scrolledBack = progress < furthest && furthest < 100
    if (scrolledBack) {
      scrollButton?.classList.remove('invisible')
    }
    scrollButton?.classList.toggle('animate__fadeOut', !scrolledBack)
    scrollButton?.classList.toggle('animate__bounceInUp', scrolledBack)
    progressBar.setAttribute('value', `${progress}`)
  })

  scrollButton?.addEventListener('click', (): void => {
    scrollButton?.blur()
    scrollTo(reading.getFurthestRead())
  })

  return reading.start()
}
