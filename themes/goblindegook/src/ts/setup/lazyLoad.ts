import LazyLoad from 'vanilla-lazyload'

export function setupLazyLoad() {
  const lazyImages = Array.from(
    document.querySelectorAll<HTMLElement>('img.lazy')
  )

  lazyImages.forEach((item) => {
    item.style.display = 'inline'
  })

  return new LazyLoad({
    // eslint-disable-next-line @typescript-eslint/camelcase
    elements_selector: '.lazy',
  }).update
}
