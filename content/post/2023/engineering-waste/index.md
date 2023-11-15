---
title: The Wastes of Product Engineering
description: On lean manufacturing principles applied to product engineering.
author: Luís Rodrigues
slug: engineering-waste
categories: ['Lean', 'Work']
tags: ['work', 'lean', 'agile']
date: 2023-11-15T12:00:00+01:00
image:
  src:
  caption:
  alt:
canonical: https://www.newstore.com/articles/the-wastes-of-product-engineering/
draft: false
---

Waste takes on many forms. There are obvious obstacles that waste our time and misunderstandings that result in repeatedly developing the wrong features.

Additionally, there are more nuanced risks, such as creating an environment where individuals cannot fully unleash their talents.

To address waste, we must consistently rethink our work processes and habits. But we cannot make changes at random. First, we need to seek to understand whether the waste is avoidable and unnecessary, identify the contributing factors, and explore the available tools to address it.

The main goal is to improve efficiency, but it’s not solely pursuing speed without considering the consequences. It’s about seeking production rates that are both predictable and sustainable.

Fortunately, we can draw inspiration from decades of manufacturing management as developed by Toyota. I am not alone in believing that many of these principles and philosophies translate to my work as a product engineer.

## The Toyota Production System

The Toyota Production System (TPS) is a manufacturing philosophy that took shape in the 1950s at the Toyota Motor Corporation but has its roots in the preceding decades when Toyota was still a textile manufacturer. Because of its emphasis on efficiency and waste reduction, it’s also commonly known as Lean Manufacturing.

Some of the principles prescribed by the TPS have become common outside manufacturing, like:

- Just-In-Time (JIT), where precise quantities of a product are made as necessary (and not before).

- _Jidoka_ (自働化) or “autonomation,” where automated quality controls allow the machines themselves to stop production until any detected problems are resolved.

- _Kaizen_ (改善) or “continuous improvement,” which encourages employees at all levels to seek improvement, and to extend it to suppliers and customers as well.

- _Kanban_ (看板), where a signboard makes the production flow visible to everybody so it’s easier to understand and manage work in progress.

Along with these operational principles, the TPS describes a few inefficiencies to keep in check:

- _Muri_ (無理), meaning “unreasonableness,” refers to the burden placed on people and equipment that can lead to stress, and ultimately illness or malfunction, decreasing productivity and increasing the likelihood of errors and accidents.

- _Mura_ (斑), or “inconsistency,” is about any irregularities within the production process, from uneven flows and workloads to inequalities in task distribution among people and machines.

- _Muda_ (無駄), which means waste, and is the focus of this article.

## A Deep Dive into Muda

Muda, or waste, refers to any activity that doesn’t add value to a final product or service.

The TPS describes seven types of waste that need to be identified and then reduced or eliminated:

- _Transportation_, which is the unnecessary movement of materials or products. This movement has a cost and can damage goods or equipment, either through accident or wear and tear.

- _Inventory_, referring to materials or products kept in excess. Storage has a cost, but even more importantly, the items being stored carry their own costs. By sitting in storage, their commercial value cannot be unlocked, and they might become obsolete or unusable with time.

- _Motion_, which is the unnecessary movement of people during the production process. This can lead to fatigue and increase the risk of injury.

- _Waiting_, from delays to downtime in the production process, which might propagate further down the line.

- _Overproduction_, one of the most problematic types of waste, refers to producing more than what customers demand, or before customers demand it. This, in turn, can lead to excess inventory, added transportation costs, or the loss of perishable goods.

- _Overprocessing_, characterized by the inclusion of excessive value or unnecessary complexity, ultimately raises production costs.

- _Defects_, which are any errors that force products to be remade, corrected, or even scrapped altogether, and add time and cost to the process.

More recently, an eighth waste was added by management experts to describe inefficiencies related to people:

- _Skills_, the waste of human potential, closely tied to disempowerment, lack of diversity, inadequate training, rigid hierarchies, and poor communication.

## Necessary Waste

When analyzing waste, it’s important to understand its role within the broader business context, as an activity that may appear unnecessary at first glance might, in fact, be contributing value to a product.

For example, distilleries produce excess quantities of whiskey that might not be sold for years or even decades. They do not necessarily incur the wastes of overproduction or inventory because these businesses bet on the assumption that aged whiskey will gain commercial value as the years go by.

In other cases, there are situations where overprocessing can serve as a significant distinguishing factor. This frequently occurs in markets where the showiness of a product or the apparent intricacy of the production process is what attracts customers.

## Waste in Product Engineering

I have found through experience that the work of a product engineer is just as vulnerable to the same types of waste as those in a manufacturing company, even if the work is vastly different.

What follows is not an exhaustive list of examples. However, below are some of the ways in which product teams I have worked with dealt with waste.

### Transportation

Because product teams dealing with software rarely need to move raw materials or finished products around, “transportation” here refers to knowledge transfer between people.

With this understanding, any form of handoff between engineers, product managers, designers, or testers is considered wasteful. Handoffs are precarious as they create an ideal environment for misunderstandings to arise among team members.

Imagine a designer dropping off a mockup for developers to implement before moving to work on the next thing. People often presume this optimizes their time and productivity, ensuring that a designer is never “idle.” But there is a world of assumptions that are left unverified, and intentions that will not be understood. What happens next is that the designer will need to shift focus from whatever they are doing to revisit previous work, or to explain or make changes, while developers wait around.

To minimize this waste, I strive to have individuals from different disciplines work _together_ on the same task. Maintaining a constant dialogue among team members is preferable to simply passing work over the fence.

This applies to the work of software engineers as well. The most common form of handoff comes from pull requests with code changes. While pull requests have their place in the company, [pair programming](https://martinfowler.com/articles/on-pair-programming.html) is vastly preferred since a pair (or a mob) of engineers is able to provide more focused and timely critique of what people are doing.

Finally, it is every team’s responsibility to establish a direct line of communication to the customers, and not receive problem reports or requirements through intermediaries, no matter how trusted. While customers are acutely aware of their own needs and difficulties, the solutions often must be worked out through discovery and close, careful analysis of the problem. The involvement of intermediaries can compromise the quality of communication between teams and customers, as they may inadvertently introduce unwelcome assumptions.

### Inventory

Unfortunately, it’s all too common for product teams to amass a collection of unreleased features while they wait for the elusive “perfect” moment for them to be finished and unveiled to customers.

But most products are never truly “finished” as they go through changes to match evolving customer needs and market realities. Because of this, high-functioning teams make it a habit to release updates or new features regularly. If a feature is rough, we hide it behind a feature flag, and partner with select customers to trial it together — not before explaining the risks and setting the right expectations about polish. Teams greatly benefit from direct feedback about ongoing development, and customers often feel excited to be part of the process because they understand that their feedback will shape the product according to their specific needs.

Overprovisioning infrastructure is another problem related to inventory waste. Engineers frequently establish generous infrastructure limits, anticipating unrealistically high loads “just in case.” While the practice is often based on intuition, it’s more effective to gather usage metrics and scale hardware based on real needs.

### Motion

The waste of motion refers to unnecessary manual work, and nowhere is this more evident than in software testing and releasing. Manual tests and deployments can lead to substantial inefficiency. However, because people are actively engaged in it, because it seems like useful work, because doing things manually reinforces the feeling of being in control, many don’t realize it. Effectively automating these processes instills a remarkable level of confidence to teams and it’s a shame more companies aren’t adopting them.

Engineers also tend to fall prey to what’s known as the “not invented here” syndrome, a bias against products or standards from third parties. When the reason is a false perception of cost, security, or control, it leads engineers to waste effort building and maintaining components in-house that could be more reasonably sourced from external providers.

The desire to stay occupied or seem busy, particularly when forced to wait, drives many individuals to take on multiple tasks simultaneously. This practice is wasteful and counterproductive. Switching between different tasks disrupts a worker’s ability to focus effectively on any one task, potentially leading to burnout. Instead, I strongly advocate for the principle of completing tasks before taking on new work.

### Waiting

To always finish what we start, it is helpful to steer clear of work that may become blocked in the future. However, in cases where foresight falls short, and an external factor obstructs a team’s progress, it becomes the team’s responsibility to proactively remove the obstacle and roll up their sleeves, if necessary. For example, when one team’s capacity is stretched thin, but another team urgently needs something from them, I advocate for the latter team to collaborate in removing the blocker rather than waiting for it to go away. This might mean working on the busy team’s components or helping them reorganize their work.

“We can’t work on it because we’re waiting for the requirements,” is a statement we’ve all heard at some point in our careers. I discourage teams from waiting to be told what to do. Teams should be made up of people who are not only problem-solvers but also critical thinkers and proactive doers. It is a collective responsibility to discover and refine requirements. In pursuit of this goal, organisations need to place their trust in teams and actively promote direct interactions with customers. This enables teams to better understand a customer's challenges and the opportunities they present.

Additionally, as mentioned above in the transportation section, handoffs are to be avoided as much as possible. Not only do they introduce potential misunderstandings into a team's discussions, they also result in members having to either wait or switch their focus, depending on their position in the handoff process. Real-time collaboration, whether in person or through the numerous remote collaboration tools at our disposal, is significantly more favourable.

### Overproduction

As mentioned, overproduction is considered one of the most detrimental forms of waste. Producing more than the current demand not only results in wasted efforts but also puts excess inventory at risk of loss.

In software development, the equivalent is the accrual of unused and potentially unnecessary features. It’s common for teams to postpone a release because they consider the feature to be “incomplete,” even if it could already benefit a subset of customers. Not releasing a feature prevents the team from gathering important feedback that could guide their next steps.

This habit of releasing early and as often as possible aligns perfectly with agile delivery practices.

Is the feature addressing the problem correctly? Is the feature addressing the correct problem at all? How 'complete' does it need to be to satisfy all of a customer’s needs? Teams should always be able to answer questions like these.

### Overprocessing

Because software engineering typically doesn’t focus on mass production, waste often materializes when a product is refined excessively beyond any practical utility.

Frequently, this results in the overengineering of systems, leading to unnecessary complexity, unforeseen problems, and eventually, an increased maintenance burden that slows teams down. Overengineering can also be seen when infrastructure is configured to handle far more capacity than required, often remaining mostly idle.

Processes themselves are vulnerable to this kind of waste. Many teams incorporate blocking activities into the product development process, such as crafting high-fidelity prototypes, conducting manual testing, or reviewing code, with the misinformed belief that these steps will improve quality, reliability, or security. While these practices do help, they also introduce friction to change, thereby impeding the swift implementation of improvements or corrections.

Rather than fostering predictability, additional obstacles often tempt teams to batch work into fewer, larger releases to minimize waiting. Consequently, this transforms what could be small, straightforward, low-risk releases into convoluted, high-risk gambles.

Quality is not a step that can be affixed to any process; rather, it is best achieved through continuous collaboration without artificial barriers.

### Defects

Defects fall into two broad categories: building things incorrectly and building incorrect things.

Building things incorrectly includes product defects and bugs, as well as issues like downtime and data loss from unstable or insecure infrastructure. Support requests seeking clarification indicate defects as well, meaning user interfaces or documentation can be improved. These situations are wasteful as they necessitate the allocation of effort to address and prevent these problems from happening again. The Toyota Production System advocates a zero-tolerance stance towards these types of defects. It involves both automating quality control checks and empowering even the least significant worker with the authority to halt production immediately upon finding a problem.

Building the incorrect thing is a result of not validating assumptions and going at it blindly. If assumptions can’t be confirmed before the product is built, teams should try to do so in the earliest possible stages. Talking with customers and end-users is essential, as is launching minimum viable product versions that people can test and give feedback on.

### Skills

The waste of skills is a relatively recent category and deals with the loss of human potential.

Low-trust environments, where people are left out of the decision-making process, are especially prone to overlooking important ideas and insights. Restricting the involvement of designers or engineers in the initial product decisions can lead teams to scrap their strategies when they prove unworkable. In other instances, serviceable but suboptimal approaches are adopted, resulting in a sacrifice of innovation, and missed opportunities.

A team must be responsible for all decisions related to the product it builds, and every member within the team should be given the chance to participate.

The absence of diversity within a team also results in the squandering of valuable perspectives. Monocultural teams, even well-meaning and empathetic ones, tend to possess unconscious biases and are often ignorant about perspectives beyond their own. Because of this, they may struggle to release a product that fully caters to different realities, potentially neglecting critical aspects of user safety, privacy, and accessibility.

To address these challenges, fostering a culture of trust, inclusivity, and empowerment is imperative. Every team member should feel safe and motivated to actively contribute. It’s a tremendous waste to hire bright, passionate people and then push them to set aside their critical judgment or adopt a “just following orders” mentality.

## Conclusion

In my efforts to combat waste, I've come to realize that the strategies my teams adopted align with several popular agile practices. These practices include delivering a working product that is constantly evolving, fostering customer collaboration, employing Kanban boards, practicing test-driven development, engaging in pair programming, and other techniques that allow achieving fast feedback loops and attain predictable, sustainable delivery workflows.

Beyond being mere complements, agile and lean methodologies reinforce each other. Together, they create a virtuous circle that empowers teams to move faster, while also providing the insight and authority to continuously adapt and adopt even more effective practices.

_This article was originally written for the [NewStore company blog](https://www.newstore.com/articles/the-wastes-of-product-engineering/) and is based on a [talk I delivered in May 2023](https://www.youtube.com/watch?v=wSo4QQW-KhI). Thanks to Amanda McLaughlin, Nuno Silva Pereira, and Carlos Rosão for edits and feedback._
