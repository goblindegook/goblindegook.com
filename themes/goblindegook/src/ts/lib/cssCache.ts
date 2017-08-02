/**
 * Fetch CSS from localStorage.
 *
 * @param  {String} key Cache key.
 *
 * @return {String}     Cached CSS contents.
 */
function getCache (key: string): string {
  return window.localStorage && window.localStorage[`cssCache_${key}`]
}

/**
 * Cache CSS in localStorage.
 *
 * @param {String} key  Cache key.
 * @param {String} url  Cached URL.
 * @param {String} text Cached URL contents.
 */
function putCache (key: string, url: string, text: string): void {
  window.localStorage[`cssCache_${key}`] = text
  window.localStorage[`cssCacheUrl_${key}`] = url
}

/**
 * Check whether the URL is in cache.
 *
 * @param  {String}  key Cache key.
 * @param  {String}  url URL to check.
 *
 * @return {Boolean}     Whether the URL is in cache.
 */
function isCached (key: string, url: string): boolean {
  return window.localStorage && window.localStorage[`cssCacheUrl_${key}`] === url
}

/**
 * Inject raw styles inline.
 *
 * @param {String} text Inline style block.
 */
function injectStyleText (text: string): void {
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')

  if ((style as any).styleSheet) {
    (style as any).styleSheet.cssText = text
  } else {
    style.innerHTML = text
  }

  document.getElementsByTagName('head')[0].appendChild(style)
}

/**
 * Inject stylesheet URL in document `<head>`.
 *
 * The URL must be in the same domain as the loading application.
 *
 * @param {String} url Stylesheet URL.
 */
export function injectStyle (key: string, url: string): void {
  if (!window.localStorage || !XMLHttpRequest) {
    const stylesheet = document.createElement('link')

    stylesheet.href = url
    stylesheet.rel = 'stylesheet'
    stylesheet.type = 'text/css'

    document.getElementsByTagName('head')[0].appendChild(stylesheet)
    document.cookie = `cssCache_${key}`
    return
  }

  if (isCached(key, url)) {
    injectStyleText(getCache(key))
    return
  }

  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      injectStyleText(xhr.responseText)
      putCache(key, url, xhr.responseText)
    }
  }

  xhr.send()
}

/**
 * Require a (possibly cached) CSS URL for injection.
 *
 * @param {String} key Cache key.
 * @param {String} url URL for the required CSS.
 */
export function cssRequire (key: string, url: string): void {
  if (isCached(key, url) || document.cookie.indexOf(`cssCache_${key}`) > -1) {
    // Fonts in cache, load them now:
    injectStyle(key, url)
  } else {
    // Defer loading of fonts:
    window.addEventListener('load', () => injectStyle(key, url))
  }
}
