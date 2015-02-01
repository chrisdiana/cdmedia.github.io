---
layout: post
title: Managing Projects in VIM
comments: true
tags: []
---

Heres a quick tip for managing projects in VIM, similar to
how you can have 'projects' in Sublime.

Theres a cool little feature that comes with VIM called
VIM Sessions. These are basically saved workspaces with
all your tabs and what-not.

To create a session:

```
:mksession ~/mysession.vim
```

Then, to restore your old session from inside vim:

```
:source ~/mysession.vim
```

If you want to restore the session outside of vim:

```
$ vim -S ~/mysession.vim
```

