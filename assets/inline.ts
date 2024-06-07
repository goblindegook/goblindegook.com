const html = document.documentElement

html.className = html.className.replace(/\bno-js\b/, 'js')

if (window.sessionStorage.fonts) {
  html.classList.add(
    'body-font-active',
    'small-caps-font-active',
    'ui-font-active',
    'code-font-active',
  )
}

if (navigator?.serviceWorker) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error)
  })
}
