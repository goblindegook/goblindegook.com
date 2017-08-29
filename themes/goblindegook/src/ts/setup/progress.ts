import { readingProgress } from '../lib/readingProgress'
import { scrollTo } from '../lib/scrollTo'

export function setupProgress () {
  const progressBar = document.getElementById('reading-progress')
  
  if (progressBar) {
    const entryContent = document.querySelector('.single-entry-body') as HTMLElement
    const scrollButton = document.querySelector('.button-furthest-read') as HTMLElement
  
    const reading = readingProgress(entryContent, (progress, furthest) => {
      const scrolledBack = progress < furthest && furthest < 100
      scrollButton.classList.toggle('hidden', !scrolledBack)
      progressBar.setAttribute('value', `${progress}`)
    })
  
    scrollButton.addEventListener('click', (event: Event): void => {
      event.preventDefault()
      scrollTo(reading.getFurthestRead())
    })
  
    reading.start()
  }
}
