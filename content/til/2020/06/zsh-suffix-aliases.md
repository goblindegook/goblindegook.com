---
title: "About ZSH suffix aliases"
description: "Open files from the command line using predefined applications."
tags: [ "zsh", "cli" ]
date: 2020-06-05T12:00:00+01:00
draft: false
---

A recent [post by Thorsten Hans](https://thorsten-hans.com/5-types-of-zsh-aliases)
describing the multiple ways to create [ZSH](http://www.zsh.org) aliases
contains a section on suffix aliases, which I hadn't known about.

Using the `-s` flag, you can instruct ZSH to open files ending in a specific
suffix or with a specific file extension using an application of your choice.

For example, the following suffix alias will translate a call to `example.json`
into `code example.json`, and open the file in [Visual Studio Code](https://code.visualstudio.com):

```zsh
alias -s json=code
```

You can assign multiple suffixes as well:

```zsh
alias -s {js,ts}=code
```
