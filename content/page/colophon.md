---
title: "Colophon"
author: "Luís Rodrigues"
date: 2017-06-27T12:00:00+01:00
draft: false
menu:
  main:
    weight: 10
---

{{< small-caps >}}goblindegook{{< /small-caps >}} is written and maintained by Luís Rodrigues.

I built this site in 2015, pouring into it over 15 years of experience in web development, frontend and server optimization, interface design, and typesetting for both digital and print media.

## Typography

{{< small-caps >}}goblindegook{{< /small-caps >}} is set in [Alegreya], a typeface designed by Juan Pablo del Peral that takes inspiration from calligraphy to provide freshness and dynamism to long texts.

Post metadata and UI elements use [Fira Sans][Fira], designed by Erik Spiekermann in collaboration with Ralph Carrois. It's used as the system font on Firefox OS and aims to maximise legibility on a wide variety of screens.

Code excerpts use Nikita Prokopov's [Fira Code], a variant of [Fira Mono][Fira] by Spiekermann and Carrois with added programming ligatures for common multi-character combinations. Boasting a crisp, supremely legible light variant at lower point ranges, Fira Code is one of my favourite fonts on coding and terminal applications.

[Alegreya]: http://www.huertatipografica.com/en/fonts/alegreya-ht-pro
[Fira]: https://mozilla.github.io/Fira/
[Fira Code]: https://github.com/tonsky/FiraCode

## Illustration

The site's [favicon] was taken from [_Die Radiolarien_](http://caliban.mpiz-koeln.mpg.de/haeckel/radiolarien/) (plate 34) by Ernst Haeckel (1834-1919). Haeckel was a German naturalist responsible for discovering, naming, and documenting hundreds of new species. He published many finely detailed scientific illustrations, including one depicting the minuscule radiolarian specimen that you see.

[favicon]: https://en.wikipedia.org/wiki/Favicon

## Technology

The tools I use to create and maintain this site include the [Visual Studio Code] editor, [nvALT] for note-taking, and the [Hugo] static site generator with a build stack that relies on [PostCSS], [Rollup], and [TypeScript]. Testing and debugging are possible and made easy thanks to [Chrome DevTools].

Site content and sources are kept under version control on a [public Github repository][goblindegook/goblindegook.com] from which the site is deployed whenever updated.

[Chrome DevTools]: https://developer.chrome.com/devtools/
[Hugo]: http://gohugo.io
[nvALT]: http://brettterpstra.com/projects/nvalt/
[PostCSS]: https://twitter.com/PostCSS/
[Rollup]: https://rollupjs.org
[TypeScript]: http://www.typescriptlang.org
[Visual Studio Code]: https://code.visualstudio.com
[goblindegook/goblindegook.com]: https://github.com/goblindegook/goblindegook.com

### Server-Side

{{< small-caps >}}goblindegook{{< /small-caps >}} is hosted by [Netlify] and built using [Hugo], a static site generator written in [Go]. It uses certificates issued by the [Let's Encrypt] Certificate Authority.

[Go]: http://php.net
[Hugo]: http://gohugo.io
[Let's Encrypt]: https://letsencrypt.org
[Netlify]: https://www.netlify.com

### Client-Side

The parts of {{< small-caps >}}goblindegook{{< /small-caps >}} that run on your browser were written in TypeScript and compiled to a universally-supported version of JavaScript. [Barba.js], [DOMPurify], [LazyLoad], [littlefoot], [Lodash], [Lunr], [Marked], and [Masonry] provide additional features and optimizations.

The site's stylesheet is [generated from CSS sources][postcss-preset-env] and includes [animate.css] for high-performance animations.

[Barba.js]: http://barbajs.org/
[DOMPurify]: https://github.com/cure53/DOMPurify
[LazyLoad]: https://github.com/verlok/lazyload
[littlefoot]: https://github.com/goblindegook/littlefoot
[Lodash]: https://lodash.com
[Lunr]: https://lunrjs.com/
[Marked]: https://marked.js.org/
[Masonry]: http://masonry.desandro.com

[animate.css]: https://daneden.github.io/animate.css
[postcss-preset-env]: https://preset-env.cssdb.org/
