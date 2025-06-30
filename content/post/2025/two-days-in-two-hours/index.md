---
title: Two Days in Two Hours
description: On moving fast and not breaking anything.
author: Luís Rodrigues
slug: two-days-two-hours-test-driven-development
categories: ['Software']
tags: ['work', 'extreme programming', 'agile', 'test-driven development']
date: 2025-06-30T12:00:00+01:00
draft: false
---

Every now and then I see people argue that Test-Driven Development slows you down.

Test-Driven Development (often abbreviated to TDD) is a software practice where you write a failing test _before_ writing the code to make it pass. It flips the usual flow[^1]: test first, then code, then refactor.

It may sound counterintuitive, but here's another way to look at it: first you set a small goal for yourself and, when you reach it, you take some time to reflect and tidy up before moving on to the next.

A frequent claim is that working in this way, and especially writing these tests will double the time and effort to implement a feature.

Okay. Story time.

A few years ago, a developer at a company I was consulting for came to me for help. They’d been going in circles trying to implement a fairly complex frontend component.

"Can you understand what's wrong?"

I looked at the code. It was completely opaque. You could see the mounting frustration --- 300 or 400 lines of tangled logic and commented-out experiments to make the component work in increasingly complicated ways. The length and complexity made it impossible to understand quickly.

"Okay, where are the tests?" I asked.

"I haven't written them yet," they said. "I need to get this to work first."

"How long have you been at it?"

"A couple of days. I'm out of ideas."

I’d been trying to get engineers at this company to practice TDD effectively, so I had to ask:

"Have you tried TDD?"

They laughed. "You can't do TDD on the frontend."

Of course not. Silly me.

I wanted to help, but at this point, the only realistic option was a rewrite. I had to make sure the engineer would be fine with it.

"How about we do it together? But I don’t understand this code. Mind if we start from scratch?"

"Sure!"

And so we began pairing on the feature.

I asked the engineer to take the keyboard. They’d write all the code --- I’d just watch.

We started with the simplest possible behaviour expected from the component. Wrote _one_ test. We saw it fail, which is important because it told us the test was verifying what mattered, then wrote just enough code to make it pass.

Then the engineer reached for the browser.

"What are you doing?"

"I'm checking if it works."

"The test already proves it works. Don't you trust it?"

I explained that if we had to break our flow to manually test every change, we’d waste a lot of time.

"Go ahead and check, but we don’t really need the browser until we style the component."

They opened the browser anyway, and were happy with the result.

We continued. Wrote another test --- this time for clicking the component. As before, we saw it fail, then made it pass.

One test at a time, we added increasingly complex behaviour. As patterns emerged, we refactored and cleaned up. Extracted functions and subcomponents. The engineer checked the browser less and less. Their confidence grew.

About two hours later, we were nearly done. We opened the browser and styled the component. Everything worked fine, just as the tests had confirmed. No surprises. No last-minute debugging marathons.

The final result: 150 lines of tight, clean logic. Written in two hours. With tests.

All by the same engineer who had spent two days producing 400 lines of messy, buggy, untested code --- code that would have cost even more to maintain if it had gone to production.

"I never worked like this before," they said at the end. "I didn't think it would work."

"So, are you going to adopt TDD from now on?"

They chuckled. "I'll consider it."

I never saw them use TDD again during my time at the company. I guess sometimes you've just got to suffer for your art.

[^1]: Assuming you write tests at all.
