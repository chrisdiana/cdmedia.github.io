---
layout: post
title: Terminal/Linux Cheatsheet
comments: true
tags: [terminal, linux, command-line]
---

Move all contents of a folder to another folder

```
mv /path/sourcefolder/* /path/destinationfolder/
```

Log out all users

```
pkill -KILL -u username
```

Latest files written in system

```
#!/bin/bash
find $1 -type f -exec stat --format '%Y :%y %n' {} \; | sort -nr | cut -d: -f2- | head
```

