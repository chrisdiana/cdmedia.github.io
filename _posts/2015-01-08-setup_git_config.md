---
layout: post
title: Setup GIT Config
comments: true
tags: [git]
---

Here are some tips for setting up efficient git configuration.

Use these simple commands to set you git global config

```
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```


Or create or edit your global configuration file here `~/.gitconfig` and add these:

```
[user]
    email = your_email@example.com
    name = YourName
[push]
    default = simple
[color]
    ui = auto
[core]
    excludesfile = /Users/username/.gitignore_global
    cmd = opendiff \"$LOCAL\" \"$REMOTE\"
[alias]
    lg = log --pretty=oneline --all --graph --abbrev-commit --decorate
```

You can check your current config using:

```
git config --list
```

