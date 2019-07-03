import { readingProgress } from '../lib/readingProgress'
import { scrollTo } from '../lib/scrollTo'

export function setupProgress() {
  const progressBar = document.getElementById('reading-progress')

  if (progressBar) {
    const entryContent = document.querySelector(
      '.single-entry-body'
    ) as HTMLElement
    const scrollButton = document.querySelector(
      '.button-furthest-read'
    ) as HTMLElement

    const reading = readingProgress(entryContent, (progress, furthest) => {
      const scrolledBack = progress < furthest && furthest < 100
      if (scrolledBack) {
        scrollButton.classList.remove('invisible')
      }
      scrollButton.classList.toggle('fadeOut', !scrolledBack)
      scrollButton.classList.toggle('bounceInUp', scrolledBack)
      progressBar.setAttribute('value', `${progress}`)
    })

    scrollButton.addEventListener('click', (): void => {
      scrollButton.blur()
      scrollTo(reading.getFurthestRead())
    })

    reading.start()
  }
}
