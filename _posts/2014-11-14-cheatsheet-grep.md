---
layout: post
title: Grep Cheatsheet
comments: true
tags: [cheatsheet, grep]
---

### Simple Grep
```
grep "boot" a_file
```

### Fast Grep
```
fgrep "broken$" a_file
```

### Find in subdirectory
```
grep -rl "string" /path
```

### Exclude certain file extensions
```
grep -r --exclude='*.sql' pattern dir/
```
