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

Check current disk space in human-readable format

```
df -h
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

List all installed packages on system

```
dpkg --get-selections
```

Remove apt-get packages

```
// will remove the binaries, but not the configuration or data files of the package packagename. It will also leave dependencies installed with it on installation time untouched.
apt-get remove packagename

// will remove about everything regarding the package packagename, but not the dependencies installed with it on installation. Both commands are equivalent.
apt-get purge packagename or apt-get remove --purge packagename

// removes orphaned packages, i.e. installed packages that used to be installed as an dependency, but aren't any longer. Use this after removing a package which had installed dependencies you're no longer interested in.
apt-get autoremove

// will remove the binaries, but not the configuration or data files of the package packagename. It will also leave dependencies installed with it on installation time untouched.
apt-get remove packagename

// will remove about everything regarding the package packagename, but not the dependencies installed with it on installation. Both commands are equivalent.
apt-get purge packagename or apt-get remove --purge packagename

// removes orphaned packages, i.e. installed packages that used to be installed as an dependency, but aren't any longer. Use this after removing a package which had installed dependencies  you're no longer interested in.
apt-get autoremove

// will also attempt to remove then not used dependencies anymore in one step.
aptitude remove packagename
//or
aptitude purge packagename
```

List installed packages

```
sudo dpkg -l | more
sudo dpkg -l | less
sudo dpkg -l | grep firefox
```

