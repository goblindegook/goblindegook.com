---
title: Projects
author: Luís Rodrigues
date: 2017-06-27T12:00:00+01:00
draft: false
menu:
  main:
    weight: 20
---

Most of my open source endeavours revolve around the web, using TypeScript or just plain old JavaScript. The list below is only a selection of projects that I started --- you are welcome to visit [my profile page on Github](https://github.com/goblindegook/) for a fuller picture of my work and interests.

[littlefoot](https://littlefoot.js.org/)
: A jQuery-free rewrite of Chris Sauvé's [Bigfoot.js](https://github.com/lemonmade/bigfoot) for delightful footnotes, as used on this site.[^littlefoot]

[`@pacote/*`](https://github.com/PacoteJS/pacote)
: A collection of utilities written in TypeScript and distributed under the [`@pacote` organisation on NPM](https://www.npmjs.com/org/pacote).

[`@pacote/bloom-search`](https://www.npmjs.com/package/@pacote/bloom-search)
: The centerpiece of my `@pacote` project, this module uses Bloom filters to implement the lightweight full-text, client-side, offline-first search engine that I use on this site. Try out the [demo](https://goblindegook.github.io/bloom-search-poc/) to explore the concept and compare with the alternatives.

[Muṣarrif](https://goblindegook.github.io/musarrif/)
: An Arabic language verb conjugator, or مُصَرِّف. Arabic is an extraordinarily logical language, with precise rules determining how verb forms are derived from their root letters, and this is an exploration of how full conjugation tables can be constructed from a minimal set of data.

[Scopa](https://scopa.netlify.app/)
: The Italian card game of [Scopa](https://en.wikipedia.org/wiki/Scopa) in TypeScript and React.

## WordPress

I've moved on from WordPress development, and the following are no longer actively maintained.

[Cassava CAS Server](https://wordpress.org/plugins/wp-cas-server/)
: Cassava turns WordPress into a single sign-on authenticator for the [Central Authentication Service (CAS)](https://www.apereo.org/projects/cas) protocol. The plugin authenticates site members at the request of different CAS-enabled applications with just one password that never leaves the server.

[Network Restricted Members](https://wordpress.org/plugins/network-restricted-members/)
: This WordPress plugin restricts members on a multisite install to the sites they belong to. I made it for log's private [P2](http://p2theme.com) network, which is open to all employees but allows only limited access for clients and contractors.

[Post Glue](https://wordpress.org/plugins/post-glue/)
: WordPress sticky posts are great, but sometimes they stick to the bottom of your shoe. This plugin takes care of several issues found with the core implementation.

[Syllables](https://packagist.org/packages/goblindegook/syllables)
: A collection of minimalistic classes and functions to aid WordPress development. Frequently-used code from my WordPress projects is thoroughly groomed and receives 100% test coverage before it ends up here.

[^littlefoot]: Hello, world!
