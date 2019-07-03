import LazyLoad from 'vanilla-lazyload'

export function setupLazyLoad() {
  const lazyImages = Array.from(
    document.querySelectorAll('img.lazy')
  ) as HTMLElement[]

  lazyImages.forEach(item => {
    item.style.display = 'inline'
  })

  return new LazyLoad()
}
