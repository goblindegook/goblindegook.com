---
title: 'Colophon'
author: 'Luís Rodrigues'
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

Post metadata and UI elements use [Fira Sans][fira], designed by Erik Spiekermann in collaboration with Ralph Carrois. It's used as the system font on Firefox OS and aims to maximise legibility on a wide variety of screens.

Code excerpts use [Fira Mono][fira] by Spiekermann and Carrois. Boasting a crisp, supremely legible light variant at lower point ranges, Fira Mono is one of my favourite fonts on coding and terminal applications.

[alegreya]: http://www.huertatipografica.com/en/fonts/alegreya-ht-pro
[fira]: https://mozilla.github.io/Fira/

## Illustration

The site's [favicon] was taken from [_Die Radiolarien_](http://caliban.mpiz-koeln.mpg.de/haeckel/radiolarien/) (plate 34) by Ernst Haeckel (1834-1919). Haeckel was a German naturalist responsible for discovering, naming, and documenting hundreds of new species. He published many finely detailed scientific illustrations, including one depicting the minuscule radiolarian specimen that you see.

[favicon]: https://en.wikipedia.org/wiki/Favicon

## Technology

The tools I use to create and maintain this site include the [Visual Studio Code] editor, [nvALT] for note-taking, and the [Hugo] static site generator. Testing and debugging are possible and made easy thanks to [Chrome DevTools].

Site content and sources are kept under version control on a [public Github repository][goblindegook/goblindegook.com] from which the site is deployed whenever updated.

[chrome devtools]: https://developer.chrome.com/devtools/
[hugo]: http://gohugo.io
[nvalt]: http://brettterpstra.com/projects/nvalt/
[visual studio code]: https://code.visualstudio.com
[goblindegook/goblindegook.com]: https://github.com/goblindegook/goblindegook.com

### Server-Side

{{< small-caps >}}goblindegook{{< /small-caps >}} is hosted by [Netlify] and built using [Hugo], a static site generator written in [Go]. It uses certificates issued by the [Let's Encrypt] Certificate Authority.

[go]: http://php.net
[hugo]: http://gohugo.io
[let's encrypt]: https://letsencrypt.org
[netlify]: https://www.netlify.com

### Client-Side

The parts of {{< small-caps >}}goblindegook{{< /small-caps >}} that run on your browser were written in [TypeScript]. [Barba.js], [DOMPurify], [LazyLoad], [littlefoot], [Masonry], [smartypants], [snarkdown] and [stemmer] provide additional features and optimizations.

The site's stylesheet is [generated from CSS sources][postcss-preset-env] and includes [animate.css] for high-performance animations.

[typescript]: http://www.typescriptlang.org
[barba.js]: https://barba.js.org/
[dompurify]: https://github.com/cure53/DOMPurify
[lazyload]: https://github.com/verlok/lazyload
[littlefoot]: https://github.com/goblindegook/littlefoot
[smartypants]: https://www.npmjs.com/package/smartypants
[snarkdown]: https://www.npmjs.com/package/snarkdown
[masonry]: https://github.com/desandro/masonry
[stemmer]: https://github.com/words/stemmer
[postcss-preset-env]: https://preset-env.cssdb.org/
[animate.css]: https://daneden.github.io/animate.css
