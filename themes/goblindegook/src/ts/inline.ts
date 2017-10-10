const html = document.documentElement

html.className = html.className.replace(/\bno-js\b/, 'js')

if (sessionStorage.fonts) {
  html.classList.add('body-font-active')
  html.classList.add('small-caps-font-active')
  html.classList.add('ui-font-active')
  html.classList.add('code-font-active')
}

if (navigator && navigator.serviceWorker) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      reg.onupdatefound = () => {
        const installingWorker = reg.installing!

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                console.log('New or updated content is available. Please refresh.')
              } else {
                console.log('Content is now available offline!')
              }
              break

            case 'redundant':
              console.error('The installing service worker became redundant.')
              break
          }
        }
      }
    })
    .catch(e => {
      console.error('Error during service worker registration:', e)
    })
  })
}
