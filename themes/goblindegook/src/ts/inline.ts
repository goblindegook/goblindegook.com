const html = document.documentElement

html.className = html.className.replace(/\bno-js\b/, 'js')

if (sessionStorage.fonts) {
  html.classList.add('body-font-active')
  html.classList.add('small-caps-font-active')
  html.classList.add('ui-font-active')
  html.classList.add('code-font-active')
}
