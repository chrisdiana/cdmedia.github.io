---
layout: post
title: Install a font on Linux
comments: true
tags: [linux]
---

Here's a quick tip on how to install a font on linux systems.

```
sudo mkdir /usr/share/fonts/truetype/custom
sudo mv Monaco_Linux.ttf /usr/share/fonts/truetype/custom/
sudo fc-cache -f -v
```

You can get [Monaco font here](https://github.com/cstrap/monaco-font)
