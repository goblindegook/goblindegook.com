---
title: "~~Designing~~ Developing for Humans"
description: "On the invisible parts of software."
author: "Luís Rodrigues"
slug: "designing-developing-humans"
categories: [ "Design", "Software" ]
tags: [ "design", "software" ]
date: 2016-05-16T12:00:00+01:00
draft: false
---

As earlier entries on this site can attest to, I’m keenly interested in design topics, and care much about the people who use the software I work on.

For a long time, though, I’ve been meaning to write about User Experience[^1] from a point of view that was _not_ that of the interaction designer. I envisioned a compilation of stories and facts about how people’s lives can be affected when certain classes of technical issues are neglected.

I won’t tackle them in any significant depth for now, only enough to illustrate a couple of points. I will also try to keep the discussion away from the visual and visible aspects of interaction design.

## Time

I’m always curious about the technology that goes into the sites I visit, and love to find WordPress powering important properties, but it’s a little disheartening to see website performance so often neglected.

Here’s why performance matters.

As you well know, Google is among the most fervent advocates for website performance, and they’ve gone to great lengths to shave milliseconds off their homepage loading times.

A story is often told about how, back in 2010, [Google gave people the choice of showing between 10 and 30 results for a Google search](https://blog.kissmetrics.com/speed-is-a-killer/). People went with the higher number, presumably because bigger is better, but

> Pages that displayed 30 results each had traffic to them drop an astounding 20%. Google tested the loading difference between the 10 and 30 results pages and found that it was just half of a second.

In April 2016, the _Financial Times_ engineering team ran an experiment to [measure the effect of performance on reader habits](http://engineroom.ft.com/2016/04/04/a-faster-ft-com/). They introduced an artificial delay that blocked page rendering for a segment of their readership, and measured how that delay affected visitor behaviour. They reached the same conclusions as Google: the longer the delay, the less likely people would hang around to read their articles.

The effects of poor performance on website usage have been covered extensively, but researchers with access to an EEG have also been able to measure people’s unconscious responses directly. [A report published by the Ericsson ConsumerLab and Neurons, Inc. in 2016](http://www.ericsson.com/res/docs/2016/mobility-report/emr-feb-2016-the-stress-of-steaming-delays.pdf) even says ‘the level of stress caused by mobile delays was comparable to watching a horror movie.’[^2]

Tech news outlets love to remind us how important website performance is, but they’re arguing for it with no sense of irony or self-awareness. For example, there’s [a piece by Nilay Patel up on _The Verge_ criticising device makers and browser vendors for the ‘sad state’ of the mobile web](http://www.theverge.com/2015/7/20/9002721/the-mobile-web-sucks). Yet his 1500-word rant requires you to download nearly 300 files for a grand total of 3 megabytes of data. No wonder the mobile web sucks. Granted, a lot of this is due to advertisements, and we’ll get back to them in a moment.[^3]

So, what is a concerned WordPress developer to do?

First of all, and because you can’t manage what you can’t measure, a number of services exist to rate your page loading speed.

Of course nobody expects you to fix every single problem raised by these reports. For example, Google PageSpeed Insights is still going to slap your hand if your already-optimised stylesheets haven’t been partially inlined, or you failed to compress your images by 12 bytes.[^4] The PageSpeed score is as good as useless after some point, and it’s not even correlated with the time your site actually takes to load, but most of its recommendations are nevertheless valid.

You’ll be glad to know that the WordPress community already solved many of the major problems for you — you can give your website a decent speed boost just by installing a couple of plugins, such as [Autoptimize](https://wordpress.org/plugins/autoptimize/) or [Simple Cache](https://wordpress.org/plugins/simple-cache/).

## Money

Time is not the only reason why optimisation is important.

If you’re on a mobile data plan, you may be acutely aware that your web usage is constrained. For example, some Portuguese carriers will throw you a monthly 100 MB taster, or enough for you to read one _Verge_ article a day provided you do nothing else online.

By far the worst offenders here are ad networks. [According to a report on _The New York Times_](http://www.nytimes.com/interactive/2015/10/01/business/cost-of-mobile-ads.html) at the height of the mobile ad-blocking furore of 2015, more than half the data pulled from the top 50 news websites — including _The New York Times_ itself — was for ad content. Every time you opened a page on a site like _Boston.com_ while on a 4G connection in the United States, you would be waiting roughly 40 seconds and paying 30 cents just to see advertisements.

I’m not even talking about other parts of the world where devices rely on slow GPRS connections and data comes with a hefty price tag.

This is where web browsers like [Opera Mini](http://www.opera.com/mobile) come in. Unlike regular browsers which directly access the web, Opera Mini relies on a proxy server that fetches, renders and then aggressively optimises a web page before piping it into the visitor's device.

Because of this optimisation, Opera Mini is used all over the world where devices aren't as powerful, and networks aren't reliable enough or cheap enough. It's immensely popular in countries like Indonesia, Nigeria, or the Philippines. In February 2013, Opera Mini had 300 million active users, equivalent to the entire population of the United States. As of May 2016, it commands an impressive 5.74% share across all browsers.

In spite of this, not many developers consider browsers like Opera Mini when creating their sites and applications. In the mad scramble to adopt the latest browser features and create sleek web applications, those of us who neglect [graceful degradation or progressive enhancement](http://www.w3.org/wiki/Graceful_degradation_versus_progressive_enhancement) are telling a considerable number of people they’re not good enough to participate. We cannot simply tell someone from a developing country to ‘get a decent browser,’ as the option doesn’t even exist in many cases.

## Security

Text-based passwords are the most common form of authentication on the web. If you use any device regularly, there’s a good chance you have to remember a password. If you’re lazy, [there’s a good chance that password is the same for all of your sites](https://www.telesign.com/resources/research-and-reports/telesign-consumer-account-security-report/). And if you’re _really_ lazy, [there’s a good chance that password is ‘password’](http://www.passwordrandom.com/most-popular-passwords).

To mitigate the risks posed by this rampant carelessness, system administrators often enforce secure password policies. These policies require people to pick sufficiently complex passwords, with a mix of numbers and symbols, or a minimum length, and even force them to change it every few weeks.

The point is to make passwords hard to guess for an attacker, and to change them frequently in case attackers do manage to guess them. They’re a system administrator’s way of telling you to eat your vegetables — you may not like it, but it’s for your own good.

However, for a long time not much consideration was given to the relationship between these policies and actual human behaviour. In 2011, researchers at Carnegie Mellon University and NIST [rounded up 6000 people and asked them to create new passwords that satisfied each of five different password strength validation algorithms](http://cups.cs.cmu.edu/rshay/pubs/passwords_and_people2011.pdf). For the strictest algorithm, 60% of the subjects found the process annoying, and _almost a third_ admitted to having written their passwords down on paper or in a file so they could remember them later. Strict password validation does not help if people leave their passwords lying around.

Consider the following two passwords:

* `PrXyc.N7#L!eVfp9`
* `Wc16............`

Which would you say is easier to remember? Which would you say is more secure?

Note that both passwords contain the (usually required) mix of lower and uppercase letters, numerals, and non-alphanumeric characters. The difference is that one is padded by periods, and considerably easier to remember.

Now take these brute force cracking estimates, obtained through [Steve Gibson’s Haystack Calculator](https://www.grc.com/haystack.htm):

| Password           | Time to brute force<br>(100 billion guesses/s) |
| :----------------- | :------------------ |
| `PrXyc.N7#L!eVfp9` | 14.1 trillion years |
| `Wc16............` | 14.1 trillion years |

Unless ‘Wc16’ is in an attacker’s dictionary (and I’m not saying it can’t be), these passwords should take roughly the same time to crack by brute force — that is, if the attacker had to guess every single character combination.

The problem is that some password validation algorithms will reject the simpler password because of character repetition, forcing people to pick a needlessly complicated option. And as we’ve already seen, people hate having to remember complicated things.

It doesn’t help that experts are sometimes at odds about best practices, either. Some claim that size matters, but a company like Microsoft will limit your password to 16 characters. Microsoft's own research says that entropy (that is, character variety, or what you do with your tiny password) is more important. At the same time, many sites — including _banks_ — will not allow you to have a password that contains special characters.

Terrible password policies are annoying already, but these inconsistencies make them even more confusing and frustrating to people. How can those in charge of major or critical services educate us about online security when they can’t agree on a consistent set of policies? Even if password length is irrelevant after sixteen characters, why would Microsoft actively prevent me from picking a longer password?

But password policies are only part of the story.

There is a reason why we know that ‘password’ is the world's most commonly used password.

We know it because, sometimes, it’s developers themselves who neglect secure password handling on their end, either by [improperly hashing and salting them](http://krebsonsecurity.com/2012/06/how-companies-can-beef-up-password-security/) or — worst of all — [keeping them in plain text](http://www.fierceitsecurity.com/story/hacked-wordpress-security-plugin-firm-admits-storing-passwords-plaintext/2014-10-02).

[Many services may email you passwords unencrypted](http://plaintextoffenders.com), making your account vulnerable to attacks by anyone who happens to capture those messages. Until last year, this hall of shame included WordPress-based sites, which used to email people the passwords to their new accounts.

So if you think a cumbersome password recovery form is ‘bad User Experience,’ try identity theft. Nobody cares how quirky your copy is, or how delightful the website animations, if your handling of privacy and security is primed to ruin a person's life.

## Expectations

Speaking of life-ruining experiences, I love playing _Destiny_. I’m hopelessly addicted to it.

_Destiny_ is a science fiction videogame made by a company named Bungie. In it, you play a super soldier who has to fight invading aliens until the Solar System is safe or Bungie stops making money from the game, whichever happens first.

{{< figure
  alt="Destiny character selection screen showing my Warlock character."
  class="align-center"
  src="destiny-bob.jpg"
  title="This is my character. His name is Bob."
>}}

So you venture out in your spaceship and give those aliens what for, and at the end of every mission — especially the hardest, most pulse-pounding missions — there’s a chance you’ll earn a cool reward. The best rewards usually come in yellow packages, which you have to take back to base so that a blue-skinned man who lives there can convert them into random weapons or pieces of armour.

Unfortunately, not all rewards are great. One in particular — a rifle called No Land Beyond — is in fact terrible.

So when you trek back to base for your reward after another gruelling boss encounter, and you’re given your _third_ no-good No Land Beyond in a row, you begin to wonder if you're being punished for doing something wrong.

As you try to figure that out, you go on the Bungie site or the _Destiny_ subreddit, and find other players complaining about how the ‘RNG’ is completely broken.

The letters ‘RNG’ — which you could use to spell words like ANGRY or ENRAGED — stand for Random Number Generator, which governs how rewards are doled out in the game.

I’m bringing up random number generators because whenever they’re employed, they usually interfere with our expectations of how computers ought to behave.

Here’s another example: when Spotify developed their playlist shuffle feature, they got more than a few complaints from customers telling them it wasn’t working correctly. Spotify was using the [Fisher-Yates shuffle algorithm](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle), which yields unbiased results, so it took them a while to understand why people got frustrated.

You see, we humans have a peculiar way to look at randomness, and by ‘peculiar’ I mean ‘usually wrong.’

Artificial intelligence guru Peter Norvig has an article on [biases in experiment design and interpretation](http://norvig.com/experiment-design.html) where he presents the following trio of charts, one of which is random while the others’ results have been skewed:

{{< figure
  alt="Three plots, one of which contains random data."
  class="align-center"
  src="norvig-experiment.png"
  title="This is my character. His name is Bob."
>}}

Can you guess which of the three is the randomly generated plot?

Many people expect the right-most plot where dots are evenly distributed to be random, but the correct answer is actually the one to the left.

Random numbers tend to cluster a bit. It is quite likely you’ll hear the same artist two or three times in a row from a perfectly shuffled playlist, or get a post list from a `get_posts( 'orderby=rand' )` call that happens to be partially sorted. And, yes, I will continue to get disappointing rewards out of a game without it meaning I’m being deliberately punished.

Because we have a tendency to find patterns where none exist, we fool ourselves into believing that random numbers are never random enough. We attempt to find meaning in noise, and will assume coincidences never happen without a reason.

Odd as it may sound, we’re sometimes compelled to _design_ ‘randomness’ to make it conform to people’s expectations. So there is a paradox in that to make random number generators _feel_ more random, developers have had to make them less random.

## All together now

Hopefully, I have given you a different perspective on computer interaction, one that’s not constrained by the four edges of a screen. In some cases, a person doesn’t even have to be sitting in front of the keyboard to experience the consequences of your work. There are factors of time, money, security, privacy and satisfaction that are not addressed by interface widgets and pretty animations, problems that clients and managers wouldn’t normally give to an interaction designer to solve.

But I misled you about the title of this entry. It is not truly _<s>Designing</s> Developing for Humans_, rather _Designing & Developing for Humans_, and here comes the hortatory conclusion.

Victor Papanek has got to have my favourite definition of design. It’s taken from the introduction to his 1971 book _Design for the Real World:_

> Design is a conscious and intuitive effort to impose meaningful order.

Note how he doesn’t say anything about aesthetics, or ergonomics, or usability. This is design in the broadest possible sense, and the two words that sold me off on it are _conscious_ and _meaningful_. Work with purpose, but also work to provide purpose to others. In his view of ‘design as planning,’ the most important attributes concern a deliberateness of thought and empathy.

Now think back on the projects you’ve been involved in. Can you recall any problems that ended up unresolved because no one claimed responsibility over them? Because there was a disconnect between designers and developers? If issues like the ones I've described aren't owned, if no one _cares_ about them, they'll fall through the cracks.

This disconnect between design and implementation is well known and has many bothered. These days, you can't swing a browser ’round the web without hitting an article about how [designers should learn to code](https://duckduckgo.com/?q=designers+should+learn+to+code). These pieces, usually written by a developer, claim that designers have a responsibility in bridging the gap between them.

While I believe it's important for designers to be familiar with the tools and materials of their trade, I want to turn the preceding examples into an argument for something else entirely, and in the opposite direction.

I think every coder should learn about design.

Specifically, every coder ought be able to think and care about human problems in the same way a designer is expected to approach them. This is not necessarily about aesthetics, or ergonomics, or usability. It's about conscious thought and empathy.

Computer interaction is not just a designer’s job. It’s a group effort that requires effective collaboration, pulling in software engineers and business people as well, where everybody has a responsibility to provide their customers an excellent experience.

In the end, that’s what User Experience, in its myriad disciplines and approaches, should be all about: to _care_ about the people who use the products we build, and who already entrust us with their time, their money, and even their secrets for the opportunity.

It shouldn’t take a job description to be aware of something as basic as this.

_This entry was the basis for a [talk](https://goblindegook.github.io/developing-for-humans/) I delivered at [WordCamp Porto](https://2016.porto.wordcamp.org) on May 14, 2016, Landing.jobs Festival on June 4, 2016, and [Pixels Camp](https://pixels.camp) on October 8, 2016._

[^1]: I admit I have little love for industry buzzwords like ‘User Experience,’ which is a fancy way for businesses to say they care or pretend to care about people. Edward Tufte jokingly remarked that ‘only two industries refer to their customers as “users”: computer design and drug dealing.’ I would like to believe we don’t treat people with that level of contempt.

[^2]: Now imagine a horror movie, buffering forever.

[^3]: The topic is too substantive for the rapid-fire format of this piece, but advertisements _on their own_ are able to raise nearly all of the problems I’m highlighting.

[^4]: Amusingly, the Google PageSpeed Insights report flags Google Analytics scripts and those Google Fonts you’re including straight from Google’s servers because Google’s cache policies aren’t good enough for, you know, Google.
