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

Test-Driven Development (abbreviated to TDD) is a software practice where you write an automated test, which should be failing, _before_ writing the code to make it pass. It flips the usual flow[^1]: test first, then code, then refactor.

It may sound counterintuitive, but here's another way to think about it: first, you set a small, clear goal for yourself. When you reach it, you pause to reflect and tidy things up before moving on to the next small goal.[^2]

One of the nicest things about the process is that the tests you write will change roles once satisfied, and go from being _guides_ to being _guardians_. Automation allows them to run periodically, even continuously, to let you know if you ever make a mistake that undoes any previous work. As long as your destination and your goals are sound, you're never in a position where you take a wrong turn that forces you to retrace your steps.
 
But a frequent claim is that this process, and especially writing tests, will double the time and effort needed to ship a feature.

Okay. Story time.

A few years ago, a developer at a company I was consulting for came to me for help. They'd been going in circles trying to implement a complex frontend component.

"Can you understand what's wrong?"

I looked at the code. It was opaque. I could see the mounting frustration --- 300 or 400 lines of tangled logic and commented-out experiments trying to make the component work in increasingly complicated ways. The length and complexity made it impossible to reason about quickly.

"Okay, where are the tests?" I asked.

"I haven't written them yet," they said. "I need to get this to work first."

"How long have you been at it?"

"A couple of days. I'm out of ideas."

Since I'd been trying to get engineers at this company to practice TDD, I had to ask:

"Have you tried TDD?"

They laughed. "You can't do TDD on the frontend."

Of course not. Silly me.

I wanted to help, but the only realistic option at this point was a rewrite. I had to make sure they were open to the idea.

"How about we do it together? But I don't understand this code. Mind if we start from scratch?"

"Sure!"

So we paired up.

I asked the engineer to take the keyboard. They'd write all the code --- I'd just watch.

We started with the simplest possible behaviour expected from the component. Wrote _one_ test. We saw it fail, which is important because it told us the test checked what we cared about, then wrote just enough code to make it pass.

The engineer reached for the browser.

"What are you doing?"

"I'm checking if it works."

"The test already proves it works. Don't you trust it?"

I explained that if we had to break our flow to manually test every change, we'd waste a lot of time.

"Go ahead and check, but we won't need the browser until it's time to style the component."

They opened the browser anyway, and were happy with what they saw.

We continued. Wrote another test --- this time for clicking the component. As before, we saw it fail, then made it pass.

Test by test, we added increasingly complex behaviour. As patterns emerged, we refactored and cleaned up. Extracted functions and subcomponents. The engineer checked the browser less and less. Their confidence grew.

About two hours later, we were nearly done. We opened the browser and styled the component. Everything worked fine, just as the tests confirmed. No surprises. No last-minute debugging marathons.

The final result: 150 lines of tight, clean logic. With tests. Written in two hours.

All by the same engineer who had spent two days producing 400 lines of messy, buggy, untested code --- code that would have cost even more to maintain if it had gone to production.

"I never worked like this before," they said at the end. "I didn't think it would work."

"So, are you going to adopt TDD from now on?"

They chuckled. "I'll consider it."

I never saw them use TDD again during my time at the company.

I guess sometimes you've just got to suffer for your art.

[^1]: Assuming you write tests at all.

[^2]: This is called the _red, green, refactor_ cycle. A failing test is red, and it goes green when it passes.
