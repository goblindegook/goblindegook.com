import WebFont from 'webfontloader'

export function setupFonts() {
  const fontClasses: { [key: string]: string } = {
    Alegreya: 'body-font-active',
    'Alegreya SC': 'small-caps-font-active',
    'Fira Sans': 'ui-font-active',
    'Fira Mono': 'code-font-active',
  }

  WebFont.load({
    custom: {
      families: [
        'Alegreya:n4,i4,n7,i7',
        'Alegreya SC:n4,n7',
        'Fira Sans:n4,i4',
        'Fira Mono:n4',
      ],
    },
    active: () => {
      window.sessionStorage.fonts = true
    },
    fontactive: (familyName) => {
      if (fontClasses[familyName]) {
        document.documentElement.classList.add(fontClasses[familyName])
      }
    },
  })
}
