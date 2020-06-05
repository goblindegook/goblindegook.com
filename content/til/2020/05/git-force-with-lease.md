---
title: "How to safely push rebased Git branches"
description: "'Use the `--force-with-lease`, Luke.'"
tags: [ "git", "cli" ]
date: 2020-06-04T12:00:00+01:00
draft: false
---

During a pair programming session today, my excellent colleague Rafael J.
introduced me to a safer way to push a rebased [Git](https://git-scm.com) branch
to a repository.

Normally, rebasing a working branch from trunk rewrites this branch's history.
But because there's a risk of rewrites affecting other people's work, Git
prevents you from pushing them to the repository --- unless you use the
well-known `--force` option.

Unfortunately, `--force` is destructive and will overwrite any subsequent
changes made by other people on that branch, obliterating their hard work.

The option `--force-with-lease` ([documentation](https://git-scm.com/docs/git-push#Documentation/git-push.txt---no-force-with-lease)) exists to address this problem, and will abort
the push if your local copy of the branch is stale and missing changes not made
by you.

```shell
> git push --force-with-lease
```

It's not a foolproof method, but still an improvement over what I had been doing
before.
