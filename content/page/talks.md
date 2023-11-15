---
title: Talks
noToc: true
menu:
  main:
    weight: 30
---

A list of the talks I have delivered over the years.

## Five Questions About Automated Testing

So you have thought about writing automated tests for your product, but simple questions with not-so-simple answers assail you: _Why should we bother? Who writes these tests? And when? What parts are worth testing?_ And most difficult of all: _How?_ I help teams starting on their testing journey find their own answers to these questions, and point them to Kent Beck's [Test Desiderata](https://kentbeck.github.io/TestDesiderata/) to recognise what a good test looks like.

- Private event (October 25, 2023 · Online)

## The Wastes of Product Engineering

Product engineering is wasteful, and teams often fail to realise it. Recognising how the traditional 8 wastes of Lean Manufacturing manifest themselves in software development is a key first step towards addressing them through continuous improvement, cross-functional team ownership, and agile practices.

- [NewStore Tech Talks](https://www.meetup.com/newstore/events/293465281/) (May 31, 2023 · Online) ([video](https://www.youtube.com/watch?v=wSo4QQW-KhI), [slides](/talks/product-engineering-waste-slides.pdf), [article](https://www.newstore.com/articles/the-wastes-of-product-engineering/))
- Private event (May 24, 2023 · Online)

## Backwards Compatible API Design

Despite the benefits of agile, iterative software development, public <abbr title="Application Programming Interface">API</abbr>s are not amenable to trial-and-error approaches. Only incremental changes are safe — and this is assuming they don't change the semantics of the API. In this presentation I enumerate the pitfalls of evolving public interfaces and present a number of strategies to deal with growth and ensure robustness.

- Private event (November 16, 2022 · Online)

## Sharing Is Not Caring

Too many software developers are obsessed with keeping their code free from repetition. Too many lift poorly-abstracted, tightly-coupled code into shared libraries used across microservices. In the process, the goal of maintainability is lost, sometimes spectacularly.

- Private event (June 16, 2021 · Online)

## Searching with Bloom Filters

I built a search engine for my sites — it's small, fast, private, and doesn't require a backend. Using Bloom filters at its core, it's presented as an alternative to more sophisticated options using inverted indices that come with a bigger memory footprint. Check the [`@pacote/bloom-search` module on NPM](https://www.npmjs.com/package/@pacote/bloom-search), and a [comparison with popular alternatives](https://goblindegook.github.io/bloom-search-poc/).

- [RomaJS](https://www.meetup.com/romajs/events/293861331/) (June 21, 2023 · Rome, Italy) ([video](https://www.youtube.com/watch?v=d0p4WWYthfA), <a href="/talks/searching-with-bloom-filters/" data-prevent-transition="true">slides</a>)
- Private event (June 14, 2023 · Online)
- BOLT Talks (March 18, 2021 · Online) ([slides](https://goblindegook.github.io/talks/bloom-search.html))

## @testing-library

Frontend test automation seems hard but it's only as hard as you make it. Are you bogged down by endless component tests and still not sure your application won't break? I talk about the advantages of testing your frontend from the perspective of the people using it, and bust some myths about unit testing and the supposed convenience of shallow component rendering. [View the _@testing-library_ talk slides.](https://goblindegook.github.io/talks/testing-library.html)

- HackYourFuture Copenhagen (November 20, 2020 · Online)
- [LuxembourgJS](https://www.meetup.com/luxembourgjs/events/272682228/) (November 4, 2020 · Online)
- [Landing Festival](https://landingfestival.com) (June 29, 2019 · Lisbon, Portugal)
- [Expert Talks](https://www.meetup.com/expert-talks-portugal/events/261679249/) (June 5, 2019 · Lisbon, Portugal)
- [WordCamp Lisboa 2019](https://2019.lisboa.wordcamp.org) (May 18, 2019 · Lisbon, Portugal) ([video](https://wordpress.tv/2019/06/10/luis-rodrigues-testing-components-with-react-testing-library/))
- [require('lx')](https://www.meetup.com/require-lx/events/260341405/) (April 17, 2019 · Lisbon, Portugal)

## When Engineers Pair with Product Managers

How do you get engineers more involved in business decisions? How do you make product managers more aware of delivery opportunities and difficulties? How can they meaningfully challenge each other? A conversation with Neha Datt, Ali Asad Lotia and Luís Rodrigues around the benefits of stepping outside our comfort zone for a closer collaboration between engineering and product management roles.

- [Expert Talks](https://www.meetup.com/expert-talks-portugal/events/260173064/) (April 10, 2019 · Lisbon, Portugal) ([video](https://www.youtube.com/watch?v=JJsH6DefxEQ))

## More Tests, Less Work

Writing tests can be tricky. How do you ensure appropriate coverage yet keep things straightforward and maintainable? Generative (or property-based) testing frameworks exist to reinforce your tests with hundreds of randomised checks, but they require changing your test design mentality. This talk introduces [fast-check](https://github.com/dubzzz/fast-check) and its underpinnings, and suggests strategies to help you make the most of it immediately.

- [Expert Talks](https://www.meetup.com/ExpertTalks-Porto/events/268172805/) (February 6, 2020 · Porto, Portugal)
- Pixels Camp (March 22, 2019 · Lisbon, Portugal) ([video](https://www.youtube.com/watch?v=-GOHtsxZNJw))
- Tech Mate (May 22, 2018 · Lisbon, Portugal)
- require('lx') (April 18, 2018 · Lisbon, Portugal) ([video](https://www.youtube.com/watch?v=PZskhUemFlc))
- Expert Talks (April 10, 2018 · Lisbon, Portugal)

## More My Type: React Applications in TypeScript

An overview of the benefits of using typed languages when working with React and React Native, with examples in TypeScript, building using Webpack, Babel and the TypeScript compiler, a comparison with standard PropTypes and Flow, common caveats, and strategies for migrating your existing applications.

- [Tech Along](https://www.eventbrite.com/e/tech-along-evident-tickets-90144720285) (January 30, 2020 · Lisbon, Portugal)
- Pixels Camp (September 30, 2017 · Lisbon, Portugal)
- change.log (July 26, 2017 · Lisbon, Portugal)
- require('lx') (June 29, 2017 · Lisbon, Portugal) ([video](https://www.youtube.com/watch?v=H2hMHgx-OUA))
- Private event (April 25, 2021 · Amsterdam, Netherlands)
- Expert Talks (April 18, 2017 · Lisbon, Portugal) ([video](https://www.youtube.com/watch?v=G7LU_4-NQlQ))
- Microsoft OSCAMP (April 5, 2017 · Lisbon, Portugal) ([video](https://channel9.msdn.com/Events/DXPortugal/OSCAMP-Open-Source-Software-powered-by-Bright-Pixel/More-My-Type-Developing-React-Applications-in-TypeScript))

## [Inverting the Universe](/2017/inverting-universe/)

WordPress, business, and bears.

- WordPress Porto Meetup (March 3, 2017 · Porto, Portugal)

## [<del>Designing</del> Developing for Humans](/2016/designing-developing-humans)

Think UX is a designer's job? Think again. Everybody has a responsibility to provide their visitors with an excellent experience, and sometimes a pretty interface and smooth animations aren't enough to save your site, your app, or your business. UX goes beyond your device's screen---CPUs, slow networks, random number generators and the economy may well conspire to ruin your day.

- Pixels Camp (October 8, 2016 · Lisbon, Portugal) ([video](https://www.youtube.com/watch?v=eBJd5TfIXrY), [slides](https://goblindegook.github.io/developing-for-humans/))
- Landing.Festival 2016 (June 4, 2016 · Lisbon, Portugal)
- WordCamp Porto 2016 (May 14, 2016 · Porto, Portugal)

## React + Redux + WP REST API

- WordPress Lisboa Meetup (June 6, 2016 · Lisbon, Portugal)

## Introducing B3

- WordCamp Lisboa 2015 (May 4, 2015 · Lisbon, Portugal)
