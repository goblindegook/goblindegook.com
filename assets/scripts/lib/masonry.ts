import imagesLoaded from 'imagesloaded'
import Masonry from 'masonry-layout'

const defaultOptions = {
  columnWidth: '.masonry-column',
  gutter: '.masonry-gutter',
  percentPosition: true,
}

/**
 * Add an element holding style definitions for retrieval by Masonry.
 *
 * See: http://masonry.desandro.com/options.html#element-sizing
 *
 * @param container Parent element for the new element.
 * @param classes   Element classes.
 */
function createStyleHolder(container: Element, classes: string): void {
  container.insertAdjacentHTML('beforebegin', `<div class="${classes}"></div>`)
}

/**
 * Apply Masonry to a container.
 *
 * TODO: Reapply masonry layout on window resize or device orientation.
 *
 * @param container Container element.
 * @param options   Masonry options.
 */
export function masonry(container: Element, options = {}): void {
  if (container?.firstElementChild) {
    createStyleHolder(container.firstElementChild, 'masonry-column')
    createStyleHolder(container.firstElementChild, 'masonry-gutter')

    const instance = new Masonry(container, {
      ...defaultOptions,
      ...options,
    })

    imagesLoaded(container).on('progress', () => instance.layout?.())
  }
}
